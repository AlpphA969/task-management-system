const validator = require('validator');
function validate(req,res,next){
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({error: "Email and Password are required"});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error:"Incorrect Email Format"})
    }
    if(password.length<6){
        return res.status(400).json({error:'Email must be more that 6 char'})
    }
    next();
    

}
module.exports = {
    validate
}
