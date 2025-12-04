# QA Quick Reference Card

## Quick Test Checklist

### ✅ Daily Smoke Test (5 minutes)
- [ ] Login with `demo@example.com` / `demo123`
- [ ] Create a task
- [ ] Complete a task
- [ ] Navigate to Week page
- [ ] Check Habits page loads
- [ ] Toggle theme (dark/light)
- [ ] No console errors

### ✅ Feature Testing (15 minutes)
- [ ] Create task with all fields
- [ ] Quick add task
- [ ] Edit task
- [ ] Delete task
- [ ] Create habit and check in
- [ ] Search and filter tasks
- [ ] Export data (CSV/JSON)

### ✅ Mobile Testing (10 minutes)
- [ ] Login on mobile
- [ ] Create task on mobile
- [ ] Bottom navigation works
- [ ] Forms are usable
- [ ] No horizontal scroll

---

## Common Test Scenarios

### New User Journey
1. Register account
2. Login
3. See "Today's Focus" guide
4. Create first task
5. Create first habit
6. Check in habit
7. View analytics

### Power User Journey
1. Login
2. Create recurring task
3. Add subtasks
4. Set high priority
5. Use keyboard shortcuts
6. Export data
7. Use Pomodoro timer

### Error Scenarios
1. Try login with wrong password
2. Create task without title
3. Access page without login
4. Stop backend, try to create task

---

## Browser Test Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Login | ✅ | ✅ | ✅ | ✅ |
| Tasks | ✅ | ✅ | ✅ | ✅ |
| Habits | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ⚠️ | ✅ |
| Export | ✅ | ✅ | ✅ | ✅ |
| Theme | ✅ | ✅ | ✅ | ✅ |

⚠️ = May have limitations

---

## Critical Bugs to Watch For

1. **Data Loss:** Tasks/habits not saving
2. **Authentication:** Can't login or session expires unexpectedly
3. **Performance:** App becomes slow with many tasks
4. **Mobile:** Layout breaks or unusable
5. **Notifications:** Not working or firing incorrectly
6. **Export:** Files corrupted or incomplete

---

## Test Environment URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api (if available)

---

## Quick Commands

```bash
# Start backend
cd backend && npm run start:dev

# Start frontend
cd frontend && npm run dev

# Seed database
cd backend && npm run seed

# Run automated tests
cd backend && npm test
cd frontend && npm test
```

---

## Priority Test Cases (Must Test)

1. **TC-AUTH-002:** User Login
2. **TC-TASK-001:** Create New Task
3. **TC-TASK-004:** Complete Task
4. **TC-HABIT-002:** Check In Habit
5. **TC-FILTER-001:** Search Tasks
6. **TC-NOTIF-002:** Task Reminder Notification
7. **TC-UI-004:** Responsive Design - Mobile

---

**Print this page for quick reference during testing!**

