const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const dbPath = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace('file:', '') 
  : './prisma/dev.db';
const jwt = require("jsonwebtoken");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });
async function gettask(userId) {
     const tasks = await prisma.task.findMany({
        where:{
            userId:userId
        }
     })
     if(!tasks){
        throw new Error("No_Task_Found")
     }
     return tasks
    
}
module.exports = gettask
