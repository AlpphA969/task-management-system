const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const dbPath = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace('file:', '') 
  : './prisma/dev.db';
const jwt = require("jsonwebtoken");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });
async function edittask(taskid,completed) {
    const task = await prisma.task.findFirst({
        where:{id:taskid}
    })
    if(!task){
        throw new Error("task not found")
    }
    await prisma.task.update({
        where:{id:taskid},
        data:{completed:completed}
    })


    
}
module.exports = edittask