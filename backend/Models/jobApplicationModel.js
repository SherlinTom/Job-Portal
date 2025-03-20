const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    job_id: {
        type: String,
         ref: "job"
    },
    user_id: {
        type: String,
         ref: "User"
    },
    status: {
        type: String,
        enum: ['applied','application viewed','Interview Scheduled','selected','rejected'],
        default: 'applied'
    },
    interview_date: {
        type: Date
    },
    applied_on: {
        type: Date,
        default:Date.now
    },
    remark: {
        type: String
    },
    job_title:{
        type: String,
        ref: "job"
    },
    company_name:{
        type: String,
        ref: "job"
    },
    company_address:{
        type: String,
        ref: "job"
    }

});
const JobApplication = mongoose.model('application',applicationSchema);
module.exports = JobApplication;