const jwt = require('jsonwebtoken');
const Job = require('../Models/jobModel');
const SavedJob = require('../Models/savedJobModel');

exports.UserAuthenticate = (req,res,next) =>{
    // const {token} = req.cookies;
    
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("token",token);
    
    if(!token){
        return res.status(403).json({
            success: false,
            message: "Token is not found or invalid"
        });
    }
    try {
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log("jwt token",verifyToken);
        
        req.id = verifyToken.id;
        req.role = verifyToken.role;
        
        next();

    } catch (error) {
         res.status(500).json({
            success: false,
            message:error.message
     } )
    }

}

exports.userAuthorize = (...roles) =>{

    return (req,res,next) => {
        const userRole = req.role;
        console.log("user role..",userRole);
        
        if(!roles.includes(userRole)){
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            })
        }
        next();
    }
}

exports.verifyOwnership = () => {
    return async (req, res, next) => {
        try {
            const user_id = req.id; 

            const job = await Job.findById(req.params.id);
            console.log("job",job);
            
            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: "Job not found",
                });
            }

            if (job.user_id.toString() !== user_id) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized access",
                });
            }
            next(); 
        } catch (error) {
            console.error("Error in verifyOwnership:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };
};



exports.verifyEmployerAccess  = async(req,res,next) =>{
    try {
        const employer_id = req.id; 

        // Find all jobs created by the employer
        const jobs = await Job.find({ user_id: employer_id }).select('_id');

        if (!jobs.length) {
            return res.status(403).json({
                success: false,
                message: "You don't have any jobs posted, so you cannot view applications.",
            });
        }

        // Store the job IDs in the request object to use in the next middleware/controller
        req.employerJobIds = jobs.map(job => job._id.toString());

        next(); // Proceed to the next function
    } catch (error) {
        console.error("Error in verifyEmployerAccess:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}