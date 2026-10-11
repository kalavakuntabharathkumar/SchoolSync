# API contract

- `dashboard(role, userId)` returns a role-specific display name, classes, timetables, and visible announcements.
- `classes` lists available classes.
- `timetable(classId)` returns entries ordered by weekday and period.
- `announcements(role)` includes global notices and role-visible notices.
- `addAnnouncement(title, body, audience)` creates a notice.

Roles are `TEACHER`, `STUDENT`, and `PARENT`. This demo's role selector is a presentation feature, not production authentication or authorization; secure deployments must derive identity and role from verified sessions.
