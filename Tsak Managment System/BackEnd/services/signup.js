const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const dbPath = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace('file:', '') 
  : './prisma/dev.db';

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });
const bcrypt = require('bcrypt');

async function signup(email , password) {
    const existemail =  await prisma.user.findFirst({
        where:{
            email:email

        }
    })
    if(existemail){
        throw new Error('email_already_exist')
    }
    const hashpassword = await bcrypt.hash(password , 10)
    const user  = await prisma.user.create({
        data:{
            email: email,
            password: hashpassword
        }
    })
    return user;




    
}
module.exports = {
  signup
}