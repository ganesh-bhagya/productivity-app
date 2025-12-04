class NotificationService {
  private permission: NotificationPermission = 'default';
  private scheduledNotifications: Map<number, number> = new Map();

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    // Check current permission status
    const currentPermission = Notification.permission;
    
    if (currentPermission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (currentPermission === 'denied') {
      this.permission = 'denied';
      return false;
    }

    if (currentPermission === 'default') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  scheduleTaskReminder(taskId: number, taskTitle: string, reminderTime: Date) {
    // Clear existing notification for this task
    this.cancelReminder(taskId);

    const now = new Date().getTime();
    const reminder = reminderTime.getTime();
    const delay = reminder - now;

    if (delay <= 0) {
      // Time has already passed
      return;
    }

    const timeoutId = window.setTimeout(() => {
      this.showNotification(taskTitle);
      this.scheduledNotifications.delete(taskId);
    }, delay);

    this.scheduledNotifications.set(taskId, timeoutId);
  }

  cancelReminder(taskId: number) {
    const timeoutId = this.scheduledNotifications.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(taskId);
    }
  }

  cancelAllReminders() {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
  }

  private async showNotification(title: string) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    try {
      const notification = new Notification('Task Reminder', {
        body: `Don't forget: ${title}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'task-reminder',
        requireInteraction: false,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  getPermissionStatus(): NotificationPermission {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }
}

export const notificationService = new NotificationService();

