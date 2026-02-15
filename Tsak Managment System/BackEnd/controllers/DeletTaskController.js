const delettask = require("../services/delettask")
async function DeletTaskController(req,res) {
    try{
        const taskid = parseInt(req.params.taskid, 10)
        if (isNaN(taskid)) {
            return res.status(404).json({ message: "Invalid task id" })
        }
        const deletedtask = await delettask(taskid)
        res.status(200).json(deletedtask)
    }catch(err){
        res.status(400).json({message:err.message})

    }
    
}
module.exports = DeletTaskController