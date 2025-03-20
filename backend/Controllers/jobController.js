const JobApplication = require("../Models/jobApplicationModel");
const Job = require("../Models/jobModel");
const SavedJob = require("../Models/savedJobModel");
const { savedJobList } = require("./userController");

exports.addJob = async(req,res) =>{    
    console.log("Request Headers:", req.headers); // Debugging

    const token = req.headers.authorization; // Extract token
    console.log("Received Token:", token); // Debugging

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is missing"
        });
    }
    const {job_title,description,salary,company_name,company_address} = req.body;
    // if(!job_title || !description || !salary || !company_name || !company_address ){
    //     return res.status(401).json({
    //         success: false,
    //         message: "Please fill all required fields"
    //     });
    // }
    try {
        const job_details = req.body;
        const user_id = req.id;
        const newJob = await Job.create({...job_details,user_id});

        res.status(201).json({
            success: true,
            message: "Job posted successfully..! Waiting for approval",
            newJob
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}
//Show all approved jobs for users
exports.approvedJobs= async(req,res)=>{    
const page = parseInt(req.query.page) || 1; // Default to page 1
const limit = parseInt(req.query.limit) || 18; // Default to 10 jobs per page
const skip = (page - 1) * limit; 
const jobs = await Job.find({status:'approved'}).sort({posted_on: -1}).skip(skip).limit(limit);
const totalJobs = await Job.countDocuments();
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
        success: false,
        message: error.message
    });
}

}

exports.jobAddedByEmployer = async(req,res) =>{
    console.log("userid",req.id);
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page
    const skip = (page - 1) * limit; 
    const jobs = await Job.find({user_id:req.id}).sort({ posted_on: -1 }).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments({ user_id: req.id });
    if(jobs.length === 0){
    return res.status(404).json({
        success: false,
        message: 'No Jobs Available now..!'
    })
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
            success: false,
            message: error.message
        });
    }
    }

exports.pendingJobsofEmployer = async(req,res) =>{
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page
    const skip = (page - 1) * limit; 
const pending_jobs = await Job.find({user_id:req.id,status:'pending'}).sort({ posted_on: -1 }).skip(skip).limit(limit);
const totalJobs = await Job.countDocuments({ user_id: req.id,status:'pending' });
if(pending_jobs.length === 0){
    return res.status(404).json({
        success: false,
        message: 'No Jobs Available now..!'
    })
}
try {
    res.status(200).json({
        success: true,
        pending_jobs,
        totalPages: Math.ceil(totalJobs / limit), 
        currentPage: page,
        totalJobs
    })
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
}
}
exports.approvedJobsofEmployer = async(req,res) =>{
    
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page
    const skip = (page - 1) * limit; 
    const approved_jobs = await Job.find({user_id:req.id,status:'approved'}).sort({ posted_on: -1 }).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments({ user_id: req.id,status:'approved' });
    console.log("hhhh",totalJobs);

    if(approved_jobs.length === 0){
        return res.status(404).json({
            success: false,
            message: 'No Jobs Available now..!'
        })
    }
    try {
        res.status(200).json({
            success: true,
            approved_jobs,
            totalPages: Math.ceil(totalJobs / limit), 
            currentPage: page,
            totalJobs
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    }
exports.rejectedJobsofEmployer = async(req,res) =>{
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page
    const skip = (page - 1) * limit; 
    const rejected_jobs = await Job.find({user_id:req.id,status:'rejected'}).sort({ posted_on: -1 }).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments({ user_id: req.id,status:'rejected' });
if(rejected_jobs.length === 0){
    return res.status(404).json({
        success: false,
        message: 'No Jobs Available now..!'
    })
}
try {
    res.status(200).json({
        success: true,
        rejected_jobs,
        totalPages: Math.ceil(totalJobs / limit), 
        currentPage: page,
        totalJobs
    })
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
}
}

exports.updateJob = async(req,res) =>{
const {id} = req.params;
const updated_data = req.body;

const my_jobs = await Job.findByIdAndUpdate(id,{$set:updated_data},{new: true,runValidator: true});
if(!my_jobs){
    return res.status(401).json({
        success: false,
        message: "Job not found"
    });

}
try {
    res.status(200).json({
        success: true,
        message:"Updated successfully!",
        my_jobs
    });
    console.log(my_jobs);
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
}
}

exports.deleteJob = async(req,res) =>{
    const {id} = req.params;

    try {
        const deleteJob = await Job.findByIdAndDelete(id);
        console.log(id);
        
        if(!deleteJob){
            res.status(404).json({
                success:false,
                message:"Job not found"
            });
        }
        await SavedJob.deleteMany({ job_id: id });
        await JobApplication.updateMany(
            { job_id: id }, // Find applications with this job ID
            { $set: { remark: "Job Closed" } } 
        );

        res.status(200).json({
            success: true,
            message:"Job Deleted!",
            Job
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }

 }

 exports.allApplications = async(req,res) =>{
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit; 
        // Fetch applications only for jobs posted by the employer
        const applications = await JobApplication.find({
            job_id: { $in: req.employerJobIds }, // Only applications for employer's jobs
            status: { $in: ['applied', 'application viewed', 'Interview Scheduled']}
        }).populate('user_id', 'name email resume').populate('job_id','job_title company_name').sort({applied_on: -1}).skip(skip).limit(limit); 
        
        const totalApplications = await JobApplication.countDocuments({ 
            job_id: { $in: req.employerJobIds }, 
            status: { $in: ['applied', 'application viewed'] } 
        });
        res.status(200).json({
            success: true,
            applications,
            totalPages: Math.ceil(totalApplications / limit),
            currentPage: page,
            totalApplications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
 }

 exports.verifyAndUpdateApplications = async(req,res) =>{
    
    try {
    const {id} =req.params;
    const updated_status = req.body;
    console.log(updated_status);
    
    const updated_data = await JobApplication.findByIdAndUpdate(id,{$set:updated_status},{new: true,runValidator: true});
    if(!updated_data) {
        return res.status(404).json({
            success: false,
            message: "Application not found"
        });
    }
        res.status(200).json({
            success: true,
            message: "Interview Scheduled ..!",
            updated_data
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
 }
 exports.updateStatus = async(req,res) =>{
    try {
        const { id } = req.params;
        const { status } = req.body;

        await JobApplication.findByIdAndUpdate(id, { status });

        res.status(200).json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

 }

 exports.jobDetails = async(req,res)=>{
    const {id} = req.params;
    try {
        const job_details = await Job.findById(id);
        console.log(job_details);
        
        if(!job_details){
            return res.status(404).json({
                success: false,
                message: "Not found"
            });
        }
       res.status(200).json({
        success: true,
        job_details
       });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
 }
