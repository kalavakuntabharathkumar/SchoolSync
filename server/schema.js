const { gql } = require('graphql-tag');
const typeDefs = gql`
 enum Role { TEACHER STUDENT PARENT }
 type Teacher { id: ID!, name: String!, classes: [SchoolClass!]! }
 type SchoolClass { id: ID!, name: String!, teacher: Teacher, timetable: [TimetableEntry!]! }
 type TimetableEntry { id: ID!, day: String!, period: Int!, subject: String!, room: String!, class: SchoolClass! }
 type Announcement { id: ID!, title: String!, body: String!, audience: String!, createdAt: String! }
 type Dashboard { role: Role!, displayName: String!, classes: [SchoolClass!]!, announcements: [Announcement!]! }
 type Query {
  dashboard(role: Role!, userId: ID!): Dashboard!
  classes: [SchoolClass!]!
  timetable(classId: ID!): [TimetableEntry!]!
  announcements(role: Role!): [Announcement!]!
 }
 type Mutation { addAnnouncement(title: String!, body: String!, audience: String!): Announcement! }
`;
const resolvers = {
 Query: {
  dashboard: async (_, {role,userId}, ctx) => {
   const teacher = ctx.db.prepare('SELECT id,name FROM teachers WHERE id=?').get(Number(userId)) || ctx.db.prepare('SELECT id,name FROM teachers LIMIT 1').get();
   return { role, displayName: role==='PARENT' ? 'Family dashboard' : role==='STUDENT' ? 'Student dashboard' : teacher.name, classes: ctx.db.prepare('SELECT id,name,teacher_id AS teacherId FROM classes').all(), announcements: await ctx.loaders.announcementsByAudience.load(role) };
  },
  classes: (_,__,ctx)=>ctx.db.prepare('SELECT id,name,teacher_id AS teacherId FROM classes').all(),
  timetable: (_, {classId},ctx)=>ctx.db.prepare('SELECT id,class_id AS classId,day,period,subject,room FROM timetable WHERE class_id=? ORDER BY CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 ELSE 5 END,period').all(Number(classId)),
  announcements: (_, {role},ctx)=>ctx.loaders.announcementsByAudience.load(role)
 },
 Mutation: { addAnnouncement: (_,args,ctx)=>{ const result=ctx.db.prepare('INSERT INTO announcements(title,body,audience,created_at) VALUES(?,?,?,?)').run(args.title,args.body,args.audience,new Date().toISOString()); return ctx.db.prepare('SELECT id,title,body,audience,created_at AS createdAt FROM announcements WHERE id=?').get(result.lastInsertRowid); } },
 Teacher: { classes:(teacher,_,ctx)=>ctx.loaders.classesByTeacher.load(Number(teacher.id)) },
 SchoolClass: { teacher:(schoolClass,_,ctx)=>ctx.loaders.teacherById.load(Number(schoolClass.teacherId)), timetable:(schoolClass,_,ctx)=>ctx.loaders.timetableByClass.load(Number(schoolClass.id)) },
 TimetableEntry: { class:(entry,_,ctx)=>ctx.loaders.classById.load(Number(entry.classId)) }
};
module.exports={typeDefs,resolvers};
