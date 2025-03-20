const mongoose = require('mongoose');

const savedJobSchema = mongoose.Schema({
    job_id: {
        type: String,
        ref: "job"
    },
    user_id: {
        type: String,
        ref: "User"
    },
    saved_on:{
        type: Date,
        default: Date.now
    }
});
const SavedJob = mongoose.model('saved_job',savedJobSchema);
module.exports = SavedJob;