const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    job_title: {
        type: String,
        required: [true,"Please Enter Job Tiltle"]
    },
    description: {
        type: String,
        required: [true,"Please Enter Job Description"]
    },
    salary: {
        type: String,
        required: [true,"Please Enter Salary"]
    },
    company_name:{
        type: String,
        required: [true,"Please Enter Company Name"]
    },
    company_address: {
        type: String,
        required: [true,"Please Enter Company Address"]
    },
    status: {
        type: String,
        enum: ['pending','approved','rejected'],
        default: 'pending'
    },
    user_id: {
        type: String
    },
    posted_on: {
        type: Date,
        default:Date.now
    }
});

const Job = mongoose.model('job',jobSchema);
module.exports = Job;