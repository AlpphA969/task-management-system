const {login} = require('../services/login')
async function LoginController(req,res) {
    try{
        const {email , password} = req.body 
       const result =  await login(email , password) 
        res.status(200).json(result)

    }
    catch(error){
        res.status(400).json({error: error.message})

    }

    
    
}
module.exports = {LoginController}