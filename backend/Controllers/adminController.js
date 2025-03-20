const Job = require("../Models/jobModel");
const User = require("../Models/userModel")

exports.allUsers = async(req,res) =>{
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page
    const skip = (page - 1) * limit; 
    const users = await User.find({ role: { $ne: "admin" } }).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const users_only = await User.countDocuments({ role: { $eq: "user" } });
    
    if(!users){
        return res.status(401).json({
            success: false,
            message: "Users not found..!"
        });
    }
    try {
        res.status(200).json({
            success: true,
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers,
            users_only

        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

exports.pendingJobs = async(req,res) =>{
    const page = parseInt(req.query.page)||1;
    const limit = parseInt(req.query.limit)||10;
    const skip = (page -1) * limit;
    const jobs = await Job.find({status:'pending'}).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments({status:'pending'});
    if(jobs.length === 0){
        return res.status(401).json({
            success: false,
            message: "Job not found..!"
        });
    }
    try {
        res.status(200).json({
            success: true,
            jobs,
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: page,
            totalJobs
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

exports.approveJob = async(req,res) =>{
    const {id} = req.params;
    const updated_data = await Job.findByIdAndUpdate(id,{status:"approved"},{new: true,runValidator: true});
    if(!updated_data) {
        return res.status(404).json({
            success: false,
            message: "Job not found"
        });
    }
    try {
        res.status(200).json({
            success: true,
            message: "Job Approved..!",
            updated_data
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}
exports.rejectJob = async(req,res) =>{
    const {id} = req.params;
    const updated_data = await Job.findByIdAndUpdate(id,{status:"rejected"},{new: true,runValidator: true});
    if(!updated_data) {
        return res.status(404).json({
            success: false,
            message: "Job not found"
        });
    }
    try {
        res.status(200).json({
            success: true,
            message: "Job Rejected..!",
            updated_data
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

exports.removeUsers = async(req,res) =>{
    const {id} = req.params;
   try {
     const delete_user = await User.findByIdAndDelete(id);
     if(!delete_user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
     }
     res.status(200).json({
        success: true,
        message: "Deleted..!",
        User
     });
   } catch (error) {
       res.status(500).json({
        success: false,
        message: error.message
       })
   }
}