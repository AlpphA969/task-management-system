const validator = require('validator');
const sanitize = require('sanitize-html')

function taskvalidate(req,res,next){
    const { title , description} = req.body
    if(!title){
        res.status(400).json({error : "title can not be empty"})
    }
     const titlesanitize =sanitize(title , {allowedTags: [] , allowedAttributes : {}})
     const discSanitize = sanitize(description ,{allowedTags:[] , allowedAttributes:{}} )
    req.body = {... req.body ,
    title: titlesanitize,
    description : discSanitize,
}
next()
}
module.exports = taskvalidate