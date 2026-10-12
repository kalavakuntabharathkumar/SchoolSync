const DataLoader = require('dataloader');
module.exports = db => ({
 teacherById: new DataLoader(async ids => { const rows=db.prepare(`SELECT id,name FROM teachers WHERE id IN (${ids.map(()=>'?').join(',')})`).all(...ids); const map=new Map(rows.map(x=>[x.id,x])); return ids.map(id=>map.get(id)||null); }),
 classById: new DataLoader(async ids => { const rows=db.prepare(`SELECT id,name,teacher_id AS teacherId FROM classes WHERE id IN (${ids.map(()=>'?').join(',')})`).all(...ids); const map=new Map(rows.map(x=>[x.id,x])); return ids.map(id=>map.get(id)||null); }),
 classesByTeacher: new DataLoader(async ids => { const rows=db.prepare(`SELECT id,name,teacher_id AS teacherId FROM classes WHERE teacher_id IN (${ids.map(()=>'?').join(',')})`).all(...ids); return ids.map(id=>rows.filter(x=>x.teacherId===id)); }),
 timetableByClass: new DataLoader(async ids => { const rows=db.prepare(`SELECT id,class_id AS classId,day,period,subject,room FROM timetable WHERE class_id IN (${ids.map(()=>'?').join(',')}) ORDER BY period`).all(...ids); return ids.map(id=>rows.filter(x=>x.classId===id)); }),
 announcementsByAudience: new DataLoader(async roles => { const rows=db.prepare('SELECT id,title,body,audience,created_at AS createdAt FROM announcements ORDER BY created_at DESC').all(); return roles.map(role=>rows.filter(x=>x.audience==='ALL'||x.audience===role)); })
});
