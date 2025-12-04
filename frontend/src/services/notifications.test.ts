import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notificationService } from './notifications';

describe('NotificationService', () => {
  beforeEach(() => {
    // Mock Notification API
    (globalThis as any).Notification = {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    } as any;

    // Reset service permission state
    (notificationService as any).permission = 'default';

    // Mock window.setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('requestPermission', () => {
    it('should request notification permission', async () => {
      const result = await notificationService.requestPermission();

      expect((globalThis as any).Notification.requestPermission).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if permission is denied', async () => {
      // Reset permission state
      ((globalThis as any).Notification as any).permission = 'denied';
      ((globalThis as any).Notification.requestPermission as any).mockResolvedValueOnce(
        'denied',
      );

      const result = await notificationService.requestPermission();

      expect(result).toBe(false);
    });
  });

  describe('scheduleTaskReminder', () => {
    it('should schedule a reminder for future time', () => {
      const taskId = 1;
      const taskTitle = 'Test Task';
      const reminderTime = new Date(Date.now() + 60000); // 1 minute from now

      notificationService.scheduleTaskReminder(taskId, taskTitle, reminderTime);

      expect(vi.getTimerCount()).toBe(1);
    });

    it('should not schedule reminder for past time', () => {
      const taskId = 1;
      const taskTitle = 'Test Task';
      const reminderTime = new Date(Date.now() - 60000); // 1 minute ago

      notificationService.scheduleTaskReminder(taskId, taskTitle, reminderTime);

      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe('cancelReminder', () => {
    it('should cancel a scheduled reminder', () => {
      const taskId = 1;
      const taskTitle = 'Test Task';
      const reminderTime = new Date(Date.now() + 60000);

      notificationService.scheduleTaskReminder(taskId, taskTitle, reminderTime);
      expect(vi.getTimerCount()).toBe(1);

      notificationService.cancelReminder(taskId);
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe('cancelAllReminders', () => {
    it('should cancel all scheduled reminders', () => {
      const reminderTime = new Date(Date.now() + 60000);

      notificationService.scheduleTaskReminder(1, 'Task 1', reminderTime);
      notificationService.scheduleTaskReminder(2, 'Task 2', reminderTime);
      expect(vi.getTimerCount()).toBe(2);

      notificationService.cancelAllReminders();
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});

