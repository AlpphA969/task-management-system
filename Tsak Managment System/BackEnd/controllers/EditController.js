const edittask = require('../services/edittask')
async function EditController(req,res) {
    const taskid = Number(req.params.taskid)
    const {completed} = req.body
    try{
        const edited = await edittask(taskid , completed)
        res.status(200).json("edited successfully" , edited)
    }catch(err){
        res.status(404).json(err)
    }
    
}
module.exports = EditController