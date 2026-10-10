const Database = require('better-sqlite3');
const db = new Database(process.env.DB_FILE || ':memory:');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY, name TEXT NOT NULL, teacher_id INTEGER REFERENCES teachers(id));
CREATE TABLE IF NOT EXISTS timetable (id INTEGER PRIMARY KEY, class_id INTEGER REFERENCES classes(id), day TEXT NOT NULL, period INTEGER NOT NULL, subject TEXT NOT NULL, room TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS announcements (id INTEGER PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, audience TEXT NOT NULL, created_at TEXT NOT NULL);
`);
const count = db.prepare('SELECT COUNT(*) AS n FROM teachers').get().n;
if (!count) {
 db.prepare('INSERT INTO teachers (id,name) VALUES (?,?)').run(1,'Anita Rao');
 db.prepare('INSERT INTO classes (id,name,teacher_id) VALUES (?,?,?)').run(1,'Class 8A',1);
 const insert = db.prepare('INSERT INTO timetable (class_id,day,period,subject,room) VALUES (?,?,?,?,?)');
 const rows=[['Monday',1,'Mathematics','Room 12'],['Monday',2,'Science','Lab 2'],['Tuesday',1,'English','Room 12'],['Wednesday',3,'History','Room 8'],['Thursday',2,'Computer Science','Lab 1'],['Friday',1,'Physical Education','Ground']];
 const tx=db.transaction(()=>rows.forEach(row=>insert.run(1,...row))); tx();
 const announcement=db.prepare('INSERT INTO announcements (title,body,audience,created_at) VALUES (?,?,?,?)');
 announcement.run('Science exhibition','Project proposals are due this Friday.','ALL','2026-10-10T09:00:00.000Z');
 announcement.run('Class 8A timetable update','Computer Science moves to Lab 1 on Thursday.','STUDENT','2026-10-10T10:00:00.000Z');
}
module.exports=db;
