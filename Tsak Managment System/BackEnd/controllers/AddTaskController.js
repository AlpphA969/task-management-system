const addtask  = require("../services/addtask");

async function AddTaskController(req,res) {
    try{
        const {title , description} = req.body
        const userId = req.userId
        
         await addtask(title , description , userId)
        res.status(200).json({
            message:"Task_Added"
        })

    }catch(error){
        res.status(400).json({message: error.message})
    
    }
    
}
module.exports = AddTaskController