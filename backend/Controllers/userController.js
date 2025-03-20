const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const JobApplication = require('../Models/jobApplicationModel');
const SavedJob = require('../Models/savedJobModel');
const Job = require('../Models/jobModel');

//User Registration
exports.userRegister = async(req,res,next) =>{
const {name,email,password,role} = req.body;
if(!name || !email || !password){
    return res.status(401).json({
        success: false,
        message: "Please fill all required fields"
    });
}
try {
    const user = req.body;
    const newUser = await User.create(user);
    console.log(newUser);

    res.status(201).json({
        success: true,
        message: "Registration completed successfully..!",
        newUser
    });
    
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
}
}

//userLogin
exports.userLogin = async(req,res) =>{
    
    try {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(401).json({
            success: false,
            message: "Please fill all required fields"
        });
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }
    
      const isValidPassword = await bcrypt.compare(password,user.password);
      if(!isValidPassword){
       return res.status(401).json({
        success: false,
        message: "Invalid email or password"
       }) 
      }
      const options = {
        id: user._id,
        role: user.role
      }
      const token = jwt.sign(options,process.env.JWT_SECRET_KEY,{expiresIn:'7d'});
      const userWithoutPassword = {
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        isAuthenticated: true,
        user_id: user._id
      }
      res.status(200).cookie("token",token).json({
        success:true,
        message: `${user.name}, Welcome to Job Hive `,
        user: userWithoutPassword,
        isAuthenticated: true,
        token
        
    });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

//User Profile
exports.getUserProfile = async(req,res)=>{
  
    const user = await User.findById(req.id);
    console.log("user",user);
    try {
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const user_details ={
            name: user.name,
            email: user.email,
            contact_no: user.contact_no,
            qualification: user.qualification,
            skills: user.skills,
            resume: user.resume,
            role: user.role,
            profilePic: user.profilePic,
            company_name: user.company_name,
            company_address: user.company_address 
        }

        res.status(200).json({
            success: true,
            message:"User Profile",
            user_details
        });
    } catch (error) {
         res.status(500).json({
            success:false,
            message: error.message
        });
    }
 }

 exports.UpdateUserProfile = async (req, res) => {
    try {
        const id = req?.id; // Ensure id is extracted from the authenticated user
        const updatedData = req.body;

        if (!id) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Ensure qualification and skills are always stored as arrays
        if (!Array.isArray(updatedData.qualification)) {
            updatedData.qualification = updatedData.qualification ? [updatedData.qualification] : [];
        }
        if (!Array.isArray(updatedData.skills)) {
            updatedData.skills = updatedData.skills ? [updatedData.skills] : [];
        }

        if (req.files?.profilePic) {
            updatedData.profilePic = `/uploads/${req.files.profilePic[0].filename}`;
          }
          
          if (req.files?.resume) {
            updatedData.resume = `/uploads/${req.files.resume[0].filename}`;
          }
        Object.assign(user, updatedData);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user,
        });

    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};




exports.deleteUser = async(req,res) =>{
    const id = req.id; 
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        if(!deleteUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message:" Account deleted..!",
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

    exports.applyJob = async (req, res) => {
        try {
            const { id } = req.params;
            console.log("Applying for job ID:", id);
            console.log("User ID:", req.id); // Log user_id

            if (!req.id) {
                return res.status(400).json({ success: false, message: "User ID is missing" });
            }

            const user_id = req.id;

            const user = await User.findById(user_id);
            
            // Check if user has a resume uploaded
            if (!user.resume) {
                return res.status(400).json({ success: false, message: "Cannot apply. Please complete your profile and upload a resume." });
            }
            // Check if the job exists
            const jobExists = await Job.findById(id);
            if (!jobExists) {
                return res.status(404).json({ success: false, message: "Job not found" });
            }

            // Check if the application already exists
            const application = await JobApplication.findOne({ job_id: id, user_id });
            if (application) {
                return res.status(401).json({
                    success: false,
                    message: "Application already sent..!"
                });
            }

            // Create new job application
            const new_application = await JobApplication.create({ job_id: id, user_id, job_title: jobExists.job_title, company_name: jobExists.company_name, company_address: jobExists.company_address});

            res.status(201).json({
                success: true,
                message: "Application sent",
                new_application
            });

        } catch (error) {
            console.error("Error applying for job:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };


exports.saveJob = async(req,res) =>{
    try {
    const {id} = req.params;
    const user_id = req.id;
    const saved_job = await SavedJob.findOne({job_id:id,user_id});
    if(saved_job){
        await SavedJob.findOneAndDelete({job_id:id,user_id});
        return res.status(200).json({
            success: true,
            message: "Job removed from saved jobs..!"
        })
    }
    
       await SavedJob.create({job_id:id,user_id});

        res.status(201).json({
            success: true,
            message: "Job Saved",
            
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

exports.savedJobList = async(req,res) =>{
        const job = await SavedJob.find({user_id:req.id}).sort({ saved_on: -1 }).populate("job_id").exec();
     
        try {
            res.status(200).json({
                success: true,
                job
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
} 

exports.removeFromSave = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the saved job while populating job_id
        const remove_job = await SavedJob.findByIdAndDelete(id).populate("job_id");

        if (!remove_job) {
            return res.status(404).json({
                success: false,
                message: "Saved job not found",
            });
        }

        if (!remove_job.job_id) {  // Check if job_id exists
            return res.status(404).json({
                success: false,
                message: "Job details not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `${remove_job.job_id.job_title} removed from save list`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.appliedJobs = async (req, res) => {
    try {
        let jobs = await JobApplication.find({
            user_id: req.id,
            status: { $in: ["applied", "application viewed", "rejected"] }
        })
        .sort({ applied_on: -1 })
        .populate("job_id") // Fetch full job details
        .exec();

        // Handle cases where job_id is null
        jobs = jobs.map(job => ({
            ...job._doc,
            job_id: job.job_id 
                ? job.job_id 
                : { 
                    job_title: job.job_title || "Job removed by employer", 
                    company_name: job.company_name || "Unknown", 
                    company_address: job.company_address || "Unknown"
                  }
        }));

        res.status(200).json({
            success: true,
            jobs 
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.checkAppliedOrNot = async (req, res) => {
    try {
        const jobs = await JobApplication.find({ user_id: req.id }).sort({ applied_on: -1 })
            .populate("job_id")  // Fetch full job details
            .exec();

        res.status(200).json({
            success: true,
            jobs 
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.deleteApplication = async(req,res)=>{
    try {
        const {id} = req.params;
        const application = await JobApplication.findById(id);
        const delete_application = await JobApplication.findByIdAndDelete(id);
        if(!delete_application){
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }
        res.status(200).json({
            success: true,
            message: `Application for ${application.job_title} is deleted! `
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.shortList = async (req, res) => {
    try {
        let selected_job = await JobApplication.find({
            user_id: req.id,
            status: { $in: ["selected", "Interview Scheduled"] }
        }).populate("job_id").exec();
        // Handle cases where job_id is null
        selected_job = selected_job.map(job => ({
            ...job._doc,
            job_id: job.job_id 
                ? job.job_id 
                : { 
                    job_title: job.job_title || "Job removed by employer", 
                    company_name: job.company_name || "Unknown", 
                    company_address: job.company_address || "Unknown"
                }
        }));
        res.status(200).json({
            success: true,  
            selected_job: selected_job || [] // ✅ Always return an array
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.searchJob = async (req, res) => {
    try {
        const { search } = req.query; // Extract search word from query parameters

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search term is required",
            });
        }
        
        // Ensure search term is properly applied
        let filter = {
            status: "approved", // Always filter by approved jobs
            $or: [
                { job_title: { $regex: search, $options: "i" } },
                { company_name: { $regex: search, $options: "i" } },
                { company_address: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ],
        };

        // Fetch jobs from the database
        const jobs = await Job.find(filter).sort({posted_on: -1});
        console.log("Search results:", jobs);
        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Jobs Found ..!",
            });
        }

        console.log("Jobs Found:", jobs.length);

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.UserLogout = (req, res) => {
    try {
        // if (!req.cookies.token) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "No token found",
        //     });
        // }

        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully..!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.changePasswordOnly = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Just update the password directly (pre('save') will hash it)
        user.password = req.body.password;
        await user.save();

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};



