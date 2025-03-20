const express = require('express');
const { UserAuthenticate, userAuthorize } = require('../Middlewares/authenticate');
const { allUsers, pendingJobs, approveJob, rejectJob, removeUsers } = require('../Controllers/adminController');
const { jobDetails } = require('../Controllers/jobController');
const router = express.Router();

router.route('/all-users').get(allUsers);
router.route('/pending-jobs').get(UserAuthenticate,userAuthorize('admin'),pendingJobs);
router.route('/approve-job/:id').put(UserAuthenticate,userAuthorize('admin'),approveJob);
router.route('/reject-job/:id').put(UserAuthenticate,userAuthorize('admin'),rejectJob);
router.route('/job-details/:id').get(jobDetails);
router.route('/delete-users/:id').delete(removeUsers);
module.exports = router;