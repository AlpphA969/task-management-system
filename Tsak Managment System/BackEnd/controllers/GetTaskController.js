const gettask = require('../services/gettsk')
async function GetTaskController(req,res){
    try{
        const userId = req.userId
    const tasks = await gettask(userId)
    res.status(200).json(tasks)
    }catch(err){
        res.status(400).json({
            err:err
        })


    }
 }
module.exports = GetTaskController