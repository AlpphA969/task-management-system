const signup = require('../services/signup')

 async function signupcontroller(req,res) {
    try{
        const {email , password } = req.body;

        await signup.signup(email,password)
        res.status(200).json({message:'acount created'})
       
    





    }

    catch(error){
        res.status(400).json({error: error.message})
    }

    
}
module.exports = {
  signupcontroller
}