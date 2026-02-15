const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const dbPath = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL.replace('file:', '') 
  : './prisma/dev.db';
const jwt = require("jsonwebtoken")
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });
const bcrypt = require('bcrypt')
async function login(email , password) {
    const user = await prisma.user.findFirst({
        where: {
            email:email

        }
    })
    if(!user){
        throw new Error('Email Was Not Found')

    }
    if(await bcrypt.compare(password , user.password)){
        const payload = {
            userid : user.id,
            email: user.email
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"60m"})
        return {
            token:token,
            user:{
                id:user.id
            }
        }


    }



    
    else{
        throw new Error('password is incorrect')
    }
    

}
module.exports = {login}