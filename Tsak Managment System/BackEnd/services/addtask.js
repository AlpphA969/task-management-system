const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const dbPath = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace('file:', '') 
  : './prisma/dev.db';

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });
async function addtask(title , description , userId) {
    const existtask = await prisma.task.findFirst({
      where:{
        title: title
      }
    })
    if(existtask){
      throw new Error("Title_Already_Exist")

    }
    const task = prisma.task.create({
      data:{
        title:title,
        description:description,
        userId:userId
      }
    })
    return task

    
}
module.exports = addtask