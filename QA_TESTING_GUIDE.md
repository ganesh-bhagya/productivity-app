# QA Testing Guide - Productivity App

## Table of Contents
1. [Overview](#overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Test Credentials](#test-credentials)
4. [Test Cases by Feature](#test-cases-by-feature)
5. [Regression Testing](#regression-testing)
6. [Browser Compatibility](#browser-compatibility)
7. [Mobile Testing](#mobile-testing)
8. [Bug Reporting](#bug-reporting)

---

## Overview

The Productivity App is a task and habit management application with the following key features:
- User authentication (login/register)
- Task management (create, update, delete, prioritize)
- Habit tracking with check-ins
- Weekly and daily views
- Analytics and statistics
- Theme customization (dark/light mode)
- Task reminders and notifications
- Recurring tasks
- Subtasks
- Data export

---

## Test Environment Setup

### Prerequisites
- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- MySQL database running with credentials:
  - Database: `productivity_app`
  - User: `root`
  - Password: `root`

### Setup Steps
1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Seed Database (Optional):**
   ```bash
   cd backend
   npm run seed
   ```

4. **Access Application:**
   - Open browser: `http://localhost:5173`
   - Default test user: `demo@example.com` / `demo123`

---

## Test Credentials

### Pre-seeded User
- **Email:** `demo@example.com`
- **Password:** `demo123`

### New User Registration
- Create a new account during registration testing

---

## Test Cases by Feature

### 1. Authentication

#### TC-AUTH-001: User Registration
**Priority:** High  
**Steps:**
1. Navigate to `/register`
2. Fill in registration form:
   - Email: `testuser@example.com`
   - Password: `testpass123`
   - Name: `Test User`
   - Timezone: Select from dropdown
3. Click "Register" button

**Expected Result:**
- User is registered successfully
- Redirected to login page or dashboard
- Success message displayed

**Test Data:**
- Valid email format
- Password minimum 6 characters
- All fields required

---

#### TC-AUTH-002: User Login
**Priority:** High  
**Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: `demo@example.com`
   - Password: `demo123`
3. Click "Login" button

**Expected Result:**
- User is authenticated
- Redirected to Today page (`/`)
- User name displayed in header
- Access token stored in localStorage

---

#### TC-AUTH-003: Invalid Login Credentials
**Priority:** High  
**Steps:**
1. Navigate to `/login`
2. Enter invalid credentials:
   - Email: `wrong@example.com`
   - Password: `wrongpass`
3. Click "Login" button

**Expected Result:**
- Error message displayed: "Invalid credentials"
- User remains on login page
- No redirect occurs

---

#### TC-AUTH-004: Logout
**Priority:** Medium  
**Steps:**
1. Login as valid user
2. Click "Logout" button in header

**Expected Result:**
- User is logged out
- Redirected to login page
- Access token removed from localStorage
- Cannot access protected routes

---

### 2. Task Management

#### TC-TASK-001: Create New Task
**Priority:** High  
**Steps:**
1. Login to application
2. Click "+ Add Task" button
3. Fill in task form:
   - Title: "Complete project documentation"
   - Description: "Write API documentation"
   - Category: Select "Work"
   - Date: Select today's date
   - Start Time: 09:00
   - End Time: 11:00
   - Time Block: Select "Work Hours"
   - Priority: Select "High"
   - Effort: 120 minutes
   - Notes: "Important deadline"
4. Click "Create Task" button

**Expected Result:**
- Task is created successfully
- Task appears in Today's task list
- Task form modal closes
- Success feedback (visual confirmation)

---

#### TC-TASK-002: Quick Task Creation
**Priority:** High  
**Steps:**
1. Login to application
2. Click "Quick Add" button
3. Enter task title: "Quick task test"
4. Select category and priority
5. Click "Add Task"

**Expected Result:**
- Task created with default values
- Date set to today
- Time block set to default
- Effort set to 30 minutes
- Modal closes immediately

---

#### TC-TASK-003: Edit Task
**Priority:** High  
**Steps:**
1. Login to application
2. Click on an existing task card
3. Modify task details:
   - Change title
   - Update priority
   - Change status
4. Click "Update Task" button

**Expected Result:**
- Task is updated successfully
- Changes reflected immediately in task list
- Modal closes
- Updated task shows new values

---

#### TC-TASK-004: Complete Task
**Priority:** High  
**Steps:**
1. Login to application
2. Find a pending task
3. Click the checkbox on the task card

**Expected Result:**
- Task status changes to "Done"
- Task appears with strikethrough
- Checkbox shows checkmark
- Progress bar updates
- Task opacity reduced

---

#### TC-TASK-005: Delete Task
**Priority:** High  
**Steps:**
1. Login to application
2. Hover over a task card
3. Click the "×" delete button
4. Confirm deletion in dialog

**Expected Result:**
- Task is deleted
- Task removed from list
- Confirmation dialog appears before deletion
- Progress bar updates

---

#### TC-TASK-006: Task Priorities
**Priority:** Medium  
**Steps:**
1. Create tasks with different priorities:
   - High priority task
   - Medium priority task
   - Low priority task
2. View tasks in Today page

**Expected Result:**
- Priority indicators visible (⬆️ High, ➡️ Medium, ⬇️ Low)
- High priority tasks highlighted in red
- Medium priority in cyan
- Low priority in gray
- Tasks sortable by priority

---

#### TC-TASK-007: Recurring Tasks
**Priority:** Medium  
**Steps:**
1. Create a new task
2. Select recurrence pattern: "Daily"
3. Set recurrence end date: 7 days from today
4. Save task

**Expected Result:**
- Original task created
- Recurring instances generated automatically
- Tasks appear for each day in the date range
- Recurring badge (🔁) shown on task cards

---

#### TC-TASK-008: Subtasks
**Priority:** Medium  
**Steps:**
1. Create or edit a task
2. Scroll to "Subtasks" section
3. Click "+ Add subtask"
4. Enter subtask title: "Subtask 1"
5. Click "Add"

**Expected Result:**
- Subtask created and displayed
- Checkbox available for each subtask
- Can mark subtasks as complete
- Subtask count shown on task card (X / Y subtasks)
- Can delete subtasks

---

### 3. Search and Filters

#### TC-FILTER-001: Search Tasks
**Priority:** High  
**Steps:**
1. Login to application
2. Navigate to Today page
3. Type in search box: "meeting"
4. Observe results

**Expected Result:**
- Tasks filtered by search term
- Search works on title and description
- Real-time filtering as you type
- "No tasks match your filters" if no results

---

#### TC-FILTER-002: Filter by Category
**Priority:** Medium  
**Steps:**
1. Login to application
2. Select category filter: "Work"
3. Observe filtered results

**Expected Result:**
- Only tasks with "Work" category displayed
- Filter indicator shows active filter
- Can combine with other filters

---

#### TC-FILTER-003: Filter by Status
**Priority:** Medium  
**Steps:**
1. Login to application
2. Select status filter: "Pending"
3. Observe filtered results

**Expected Result:**
- Only pending tasks displayed
- Completed tasks hidden
- Filter works correctly

---

#### TC-FILTER-004: Filter by Priority
**Priority:** Medium  
**Steps:**
1. Login to application
2. Select priority filter: "High"
3. Observe filtered results

**Expected Result:**
- Only high priority tasks displayed
- Filter indicator visible
- Can clear filter

---

#### TC-FILTER-005: Sort Tasks
**Priority:** Medium  
**Steps:**
1. Login to application
2. Change sort option:
   - Priority
   - Time
   - Title
3. Observe task order

**Expected Result:**
- Tasks sorted according to selected option
   - Priority: High → Medium → Low
   - Time: Earliest → Latest
   - Title: Alphabetical
- Sort persists during session

---

#### TC-FILTER-006: Clear All Filters
**Priority:** Low  
**Steps:**
1. Apply multiple filters (category, status, priority)
2. Enter search query
3. Click "Clear all" button

**Expected Result:**
- All filters reset to "All"
- Search box cleared
- All tasks displayed again

---

### 4. Habit Tracking

#### TC-HABIT-001: Create Habit
**Priority:** High  
**Steps:**
1. Navigate to Habits page (`/habits`)
2. Click "+ New Habit" button
3. Fill in form:
   - Name: "Daily Exercise"
   - Description: "30 minutes of exercise"
   - Target Type: "Daily"
   - Target Value: 1
   - Category: "Gym"
4. Click "Create Habit"

**Expected Result:**
- Habit created successfully
- Habit appears in habits list
- Active by default
- Streak counter shows 0

---

#### TC-HABIT-002: Check In Habit
**Priority:** High  
**Steps:**
1. Navigate to Habits page
2. Find an active habit
3. Click "Check In" button
4. Optionally add notes and value
5. Click "Save"

**Expected Result:**
- Check-in recorded for today
- Streak counter updates
- Visual feedback (checkmark, animation)
- Calendar shows check-in date

---

#### TC-HABIT-003: View Habit Streak
**Priority:** Medium  
**Steps:**
1. Check in a habit for multiple consecutive days
2. View habit card

**Expected Result:**
- Streak counter shows correct number
- Streak displayed prominently
- Visual indicator (fire emoji or similar)
- Streak breaks if day is missed

---

#### TC-HABIT-004: Edit Habit
**Priority:** Medium  
**Steps:**
1. Navigate to Habits page
2. Click on a habit card
3. Modify habit details
4. Save changes

**Expected Result:**
- Habit updated successfully
- Changes reflected immediately
- Streak preserved

---

#### TC-HABIT-005: Deactivate Habit
**Priority:** Medium  
**Steps:**
1. Navigate to Habits page
2. Edit a habit
3. Toggle "Active" to off
4. Save

**Expected Result:**
- Habit marked as inactive
- Habit hidden from active habits list (if filter applied)
- Can reactivate later

---

### 5. Views and Navigation

#### TC-VIEW-001: Today Page
**Priority:** High  
**Steps:**
1. Login to application
2. Navigate to Today page (`/`)

**Expected Result:**
- Today's date displayed
- All tasks for today shown
- Progress bar visible
- Task count displayed
- "Today's Focus" guide shown at top

---

#### TC-VIEW-002: Week View
**Priority:** High  
**Steps:**
1. Navigate to Week page (`/week`)
2. Observe week calendar
3. Click on different days

**Expected Result:**
- Week calendar displays 7 days
- Today highlighted
- Selected day highlighted
- Tasks for selected day shown
- Navigation buttons work (Prev/Next/Today)

---

#### TC-VIEW-003: Habits Page
**Priority:** High  
**Steps:**
1. Navigate to Habits page (`/habits`)

**Expected Result:**
- All habits displayed
- Active habits shown
- Streak counters visible
- Check-in buttons functional
- Calendar view for each habit

---

#### TC-VIEW-004: Analytics Page
**Priority:** Medium  
**Steps:**
1. Navigate to Analytics page (`/analytics`)

**Expected Result:**
- Charts and graphs displayed
- Task completion statistics
- Habit streak statistics
- Time period filters work
- Data accurate and up-to-date

---

#### TC-VIEW-005: Settings Page
**Priority:** Medium  
**Steps:**
1. Navigate to Settings page (`/settings`)

**Expected Result:**
- User profile information displayed
- Theme toggle visible
- Export options available
- Templates section shown
- Logout button functional

---

### 6. Today's Focus Guide

#### TC-FOCUS-001: Morning Guide Display
**Priority:** High  
**Steps:**
1. Login to application
2. Navigate to Today page
3. Observe "Today's Focus" section

**Expected Result:**
- Personalized greeting shown (Good morning/afternoon/evening)
- Progress bar displayed
- High priority tasks highlighted
- Upcoming tasks shown with countdown
- Habits to check in listed
- Quick action buttons visible

---

#### TC-FOCUS-002: High Priority Tasks Highlight
**Priority:** Medium  
**Steps:**
1. Create tasks with high priority
2. View Today's Focus section

**Expected Result:**
- High priority tasks shown in red highlight
- Tasks listed with time if available
- "View all" link works
- Maximum 3 tasks shown

---

#### TC-FOCUS-003: Upcoming Tasks
**Priority:** Medium  
**Steps:**
1. Create tasks with start times within next 2 hours
2. View Today's Focus section

**Expected Result:**
- Upcoming tasks shown
- Countdown timer displayed ("in Xh Ym")
- Tasks highlighted in blue
- Links to full task list work

---

### 7. Theme and UI

#### TC-UI-001: Dark Theme
**Priority:** Medium  
**Steps:**
1. Login to application
2. Observe default theme

**Expected Result:**
- Dark theme applied by default
- Dark background colors
- Light text colors
- Glassmorphism effects visible
- Gradient accents visible

---

#### TC-UI-002: Light Theme Toggle
**Priority:** Medium  
**Steps:**
1. Click theme toggle button (☀️/🌙) in header
2. Observe theme change

**Expected Result:**
- Theme switches to light mode
- Light background colors
- Dark text colors
- All components adapt to theme
- Theme preference saved (persists on refresh)

---

#### TC-UI-003: Theme Toggle in Settings
**Priority:** Low  
**Steps:**
1. Navigate to Settings page
2. Use theme toggle in Appearance section

**Expected Result:**
- Theme changes immediately
- Same behavior as header toggle
- Visual feedback on button

---

#### TC-UI-004: Responsive Design - Mobile
**Priority:** High  
**Steps:**
1. Open application on mobile device or resize browser to mobile width
2. Navigate through all pages

**Expected Result:**
- Layout adapts to mobile screen
- Bottom navigation bar visible
- Buttons appropriately sized
- Text readable
- Cards stack vertically
- No horizontal scrolling

---

#### TC-UI-005: Responsive Design - Tablet
**Priority:** Medium  
**Steps:**
1. Resize browser to tablet width (768px - 1024px)
2. Navigate through application

**Expected Result:**
- Layout optimized for tablet
- Navigation accessible
- Cards display in grid
- Good use of screen space

---

### 8. Task Reminders and Notifications

#### TC-NOTIF-001: Request Notification Permission
**Priority:** High  
**Steps:**
1. Login to application
2. Create a task with start time
3. Observe browser notification prompt

**Expected Result:**
- Browser asks for notification permission
- Permission can be granted or denied
- Permission status remembered

---

#### TC-NOTIF-002: Task Reminder Notification
**Priority:** High  
**Steps:**
1. Grant notification permission
2. Create a task with start time 5 minutes from now
3. Wait for reminder time

**Expected Result:**
- Notification appears 5 minutes before task start time
- Notification shows task title
- Notification body: "Don't forget: [Task Title]"
- Notification auto-closes after 5 seconds

---

#### TC-NOTIF-003: Multiple Task Reminders
**Priority:** Medium  
**Steps:**
1. Create multiple tasks with different start times
2. Wait for reminder times

**Expected Result:**
- Each task gets its own reminder
- Reminders don't interfere with each other
- All reminders fire at correct times

---

#### TC-NOTIF-004: Cancel Reminders
**Priority:** Medium  
**Steps:**
1. Create a task with start time
2. Delete or complete the task before reminder time

**Expected Result:**
- Reminder cancelled automatically
- No notification appears for deleted/completed tasks

---

### 9. Pomodoro Timer

#### TC-POMODORO-001: Start Pomodoro Timer
**Priority:** Medium  
**Steps:**
1. Edit a task
2. Click "Show Timer" in Focus Timer section
3. Click "Start" button

**Expected Result:**
- Timer starts counting down from 25:00
- Circular progress indicator animates
- Timer runs in background
- Can pause timer

---

#### TC-POMODORO-002: Pomodoro Complete
**Priority:** Medium  
**Steps:**
1. Start a Pomodoro timer
2. Wait for timer to complete (or fast-forward in test)

**Expected Result:**
- Notification appears when timer completes
- Auto-switches to short break mode
- Break timer starts automatically
- Pomodoro count increments

---

#### TC-POMODORO-003: Break Modes
**Priority:** Low  
**Steps:**
1. Open Pomodoro timer
2. Switch between modes:
   - Focus (25 min)
   - Short Break (5 min)
   - Long Break (15 min)

**Expected Result:**
- Timer duration changes
- Color changes per mode:
   - Focus: Cyan
   - Short Break: Green
   - Long Break: Purple
- Progress indicator updates

---

#### TC-POMODORO-004: Reset Timer
**Priority:** Low  
**Steps:**
1. Start a Pomodoro timer
2. Click "Reset" button

**Expected Result:**
- Timer resets to initial duration
- Timer stops
- Progress indicator resets

---

### 10. Keyboard Shortcuts

#### TC-KB-001: Navigation Shortcuts
**Priority:** Low  
**Steps:**
1. Press `Alt + 1` (or `Cmd + 1` on Mac)
2. Press `Alt + 2`
3. Press `Alt + 3`
4. Press `Alt + 4`
5. Press `Alt + 5`

**Expected Result:**
- Alt+1: Navigate to Today page
- Alt+2: Navigate to Week page
- Alt+3: Navigate to Habits page
- Alt+4: Navigate to Analytics page
- Alt+5: Navigate to Settings page

---

#### TC-KB-002: Show Keyboard Shortcuts Help
**Priority:** Low  
**Steps:**
1. Press `?` key
2. Or click keyboard icon (⌨️) in header

**Expected Result:**
- Keyboard shortcuts help modal opens
- All shortcuts listed
- Can close modal with button or X

---

#### TC-KB-003: Escape Key
**Priority:** Low  
**Steps:**
1. Open any modal (Task Form, etc.)
2. Press `Esc` key

**Expected Result:**
- Modal closes
- Returns to previous view
- No data loss (if form not submitted)

---

### 11. Data Export

#### TC-EXPORT-001: Export Tasks to CSV
**Priority:** Medium  
**Steps:**
1. Navigate to Settings page
2. Scroll to "Export Data" section
3. Click "CSV" button under "Export Tasks"

**Expected Result:**
- CSV file downloads
- Filename: `tasks_YYYY-MM-DD.csv`
- File contains all task data
- Proper CSV formatting
- Headers included

---

#### TC-EXPORT-002: Export Tasks to JSON
**Priority:** Medium  
**Steps:**
1. Navigate to Settings page
2. Click "JSON" button under "Export Tasks"

**Expected Result:**
- JSON file downloads
- Filename: `tasks_YYYY-MM-DD.json`
- File contains structured task data
- Includes subtasks
- Valid JSON format

---

#### TC-EXPORT-003: Export Habits to CSV
**Priority:** Medium  
**Steps:**
1. Navigate to Settings page
2. Click "CSV" button under "Export Habits"

**Expected Result:**
- CSV file downloads
- Filename: `habits_YYYY-MM-DD.csv`
- All habit data included
- Proper formatting

---

#### TC-EXPORT-004: Export Empty Data
**Priority:** Low  
**Steps:**
1. Create new account with no tasks/habits
2. Try to export data

**Expected Result:**
- Export buttons disabled or show message
- No error occurs
- User informed if no data to export

---

### 12. Recurring Tasks

#### TC-RECUR-001: Daily Recurrence
**Priority:** Medium  
**Steps:**
1. Create task with:
   - Recurrence: "Daily"
   - End date: 3 days from today
2. Save task
3. Check tasks for next few days

**Expected Result:**
- Task created for original date
- Tasks automatically created for each day until end date
- All instances have same details
- Recurring badge visible

---

#### TC-RECUR-002: Weekly Recurrence
**Priority:** Medium  
**Steps:**
1. Create task with:
   - Recurrence: "Weekly"
   - End date: 3 weeks from today
2. Save task

**Expected Result:**
- Tasks created for same day of week
- Tasks appear weekly until end date
- Correct dates generated

---

#### TC-RECUR-003: Weekdays Recurrence
**Priority:** Medium  
**Steps:**
1. Create task with:
   - Recurrence: "Weekdays"
   - End date: 1 week from today
2. Save task

**Expected Result:**
- Tasks created only for Monday-Friday
- No tasks for weekends
- Correct pattern maintained

---

#### TC-RECUR-004: Weekends Recurrence
**Priority:** Medium  
**Steps:**
1. Create task with:
   - Recurrence: "Weekends"
   - End date: 2 weeks from today
2. Save task

**Expected Result:**
- Tasks created only for Saturday-Sunday
- No tasks for weekdays
- Correct pattern maintained

---

### 13. Subtasks

#### TC-SUB-001: Add Subtask
**Priority:** Medium  
**Steps:**
1. Edit an existing task
2. Scroll to Subtasks section
3. Click "+ Add subtask"
4. Enter title: "Subtask 1"
5. Press Enter or click Add

**Expected Result:**
- Subtask added to list
- Checkbox appears
- Can add multiple subtasks
- Subtask count updates on task card

---

#### TC-SUB-002: Complete Subtask
**Priority:** Medium  
**Steps:**
1. Add a subtask to a task
2. Click subtask checkbox

**Expected Result:**
- Subtask marked as complete
- Checkbox shows checkmark
- Subtask text has strikethrough
- Progress updates (X / Y subtasks)

---

#### TC-SUB-003: Delete Subtask
**Priority:** Low  
**Steps:**
1. Hover over a subtask
2. Click delete button (×)

**Expected Result:**
- Subtask deleted
- Removed from list
- Count updates
- No confirmation needed

---

### 14. Error Handling

#### TC-ERROR-001: Network Error
**Priority:** High  
**Steps:**
1. Stop backend server
2. Try to perform any action (create task, etc.)

**Expected Result:**
- Error message displayed
- User-friendly error message
- Application doesn't crash
- Can retry after fixing connection

---

#### TC-ERROR-002: Invalid Form Data
**Priority:** High  
**Steps:**
1. Try to create task without title
2. Try to submit form

**Expected Result:**
- Form validation prevents submission
- Error message near invalid field
- Required fields highlighted
- Form doesn't submit

---

#### TC-ERROR-003: Session Expiry
**Priority:** Medium  
**Steps:**
1. Login to application
2. Wait for token to expire (or manually remove token)
3. Try to perform action

**Expected Result:**
- User redirected to login
- Error message: "Session expired" or similar
- Can login again
- No data loss

---

## Regression Testing

### Critical Paths to Test After Each Release

1. **User Flow:**
   - Register → Login → Create Task → Complete Task → Logout

2. **Task Management:**
   - Create → Edit → Complete → Delete

3. **Habit Flow:**
   - Create Habit → Check In → View Streak → Edit → Deactivate

4. **Navigation:**
   - All pages accessible
   - Navigation works in both desktop and mobile
   - Keyboard shortcuts functional

5. **Data Persistence:**
   - Tasks persist after refresh
   - Habits persist after refresh
   - Theme preference persists
   - User session persists

---

## Browser Compatibility

### Supported Browsers
- **Chrome** (latest 2 versions) - Primary
- **Firefox** (latest 2 versions)
- **Safari** (latest 2 versions)
- **Edge** (latest 2 versions)

### Test Checklist per Browser
- [ ] Login/Register works
- [ ] Tasks CRUD operations
- [ ] Habits check-in
- [ ] Notifications work
- [ ] Theme toggle works
- [ ] Export functions work
- [ ] Responsive design
- [ ] No console errors

---

## Mobile Testing

### Devices to Test
- iPhone (iOS 14+)
- Android Phone (Android 10+)
- iPad/Tablet

### Mobile-Specific Test Cases

#### TC-MOBILE-001: Touch Interactions
**Steps:**
1. Tap all buttons
2. Swipe on task cards
3. Long press interactions

**Expected Result:**
- All buttons respond to touch
- No accidental clicks
- Touch targets appropriately sized (min 44x44px)

---

#### TC-MOBILE-002: Bottom Navigation
**Steps:**
1. View application on mobile
2. Use bottom navigation bar

**Expected Result:**
- Bottom nav visible and accessible
- Icons and labels clear
- Active page highlighted
- Navigation smooth

---

#### TC-MOBILE-003: Mobile Forms
**Steps:**
1. Create task on mobile
2. Fill in all form fields

**Expected Result:**
- Keyboard appears appropriately
- Form fields accessible
- Date/time pickers work
- Can scroll form if needed

---

## Bug Reporting

### Bug Report Template

```
**Bug ID:** BUG-XXX
**Title:** [Brief description]
**Priority:** High/Medium/Low
**Severity:** Critical/Major/Minor
**Environment:**
- Browser: [Chrome 120]
- OS: [macOS 14.0]
- Device: [Desktop/Mobile]
- Backend Version: [if applicable]
- Frontend Version: [if applicable]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Screenshots/Videos:**
[Attach if applicable]

**Console Errors:**
[Copy any console errors]

**Additional Notes:**
[Any other relevant information]
```

### Priority Guidelines
- **High:** Blocks core functionality, data loss, security issues
- **Medium:** Affects user experience, workaround available
- **Low:** Cosmetic issues, minor inconveniences

---

## Performance Testing

### TC-PERF-001: Page Load Time
**Steps:**
1. Open browser DevTools
2. Navigate to Today page
3. Check load time

**Expected Result:**
- Initial load: < 3 seconds
- Subsequent navigation: < 1 second
- No significant lag

---

### TC-PERF-002: Large Dataset
**Steps:**
1. Create 100+ tasks
2. Navigate through pages
3. Apply filters

**Expected Result:**
- Application remains responsive
- No significant slowdown
- Filters work efficiently
- Pagination or virtualization if needed

---

## Security Testing

### TC-SEC-001: Authentication
**Steps:**
1. Try to access protected routes without login
2. Try to access other user's data via API

**Expected Result:**
- Redirected to login
- Cannot access protected routes
- API returns 401/403 for unauthorized access

---

### TC-SEC-002: Input Validation
**Steps:**
1. Try SQL injection in task title
2. Try XSS in task description
3. Try very long inputs

**Expected Result:**
- Input sanitized
- No code execution
- Appropriate length limits
- Special characters handled safely

---

## Test Execution Checklist

### Pre-Release Testing
- [ ] All High Priority test cases passed
- [ ] All Medium Priority test cases passed
- [ ] Critical user flows tested
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed
- [ ] Performance acceptable
- [ ] No critical bugs
- [ ] Security tests passed

### Daily Smoke Tests (Quick Check)
- [ ] Login works
- [ ] Can create task
- [ ] Can complete task
- [ ] Navigation works
- [ ] No console errors
- [ ] Responsive design intact

---

## Test Data Management

### Creating Test Data
1. Use seed script: `npm run seed` (creates demo user and sample data)
2. Manual creation through UI
3. API calls for bulk data

### Test Data Cleanup
- Reset database between test runs if needed
- Use separate test database for automated tests
- Clear browser storage if testing authentication

---

## Notes for QA Team

1. **Test Environment:**
   - Always test in development environment first
   - Use staging environment for final validation
   - Never test in production

2. **Bug Triage:**
   - Document all bugs found
   - Include steps to reproduce
   - Attach screenshots/videos
   - Note browser/device information

3. **Communication:**
   - Report critical bugs immediately
   - Daily test status updates
   - Weekly test summary report

4. **Test Coverage:**
   - Focus on new features first
   - Regression test existing features
   - Test edge cases and error scenarios

---

## Contact and Support

For questions about testing or to report issues:
- Check `TESTING.md` for automated test information
- Review code comments for implementation details
- Document any unclear behavior for clarification

---

**Last Updated:** [Current Date]  
**Version:** 1.0

