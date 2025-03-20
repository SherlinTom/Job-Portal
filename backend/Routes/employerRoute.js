const express = require('express');
const { UserAuthenticate, userAuthorize, verifyOwnership, verifyEmployerAccess } = require('../Middlewares/authenticate');
const { addJob, jobAddedByEmployer, updateJob, deleteJob, allApplications, verifyAndUpdateApplications, pendingJobsofEmployer, approvedJobsofEmployer, rejectedJobsofEmployer, updateStatus } = require('../Controllers/jobController');
const router = express.Router();

router.route('/add-job').post(UserAuthenticate,userAuthorize('employer'),addJob);
router.route('/job-by-employer').get(UserAuthenticate,userAuthorize('employer'),jobAddedByEmployer);
router.route('/pending-job-by-employer').get(UserAuthenticate,userAuthorize('employer'),pendingJobsofEmployer);
router.route('/approved-job-by-employer').get(UserAuthenticate,userAuthorize('employer'),approvedJobsofEmployer);
router.route('/rejected-job-by-employer').get(UserAuthenticate,userAuthorize('employer'),rejectedJobsofEmployer);
router.route('/update-job/:id').put(UserAuthenticate,verifyOwnership(),updateJob);
router.route('/delete-job/:id').delete(UserAuthenticate,verifyOwnership(),deleteJob);
router.route('/all-applications').get(UserAuthenticate,userAuthorize('employer'),verifyEmployerAccess,allApplications);
router.route('/verify-applications/:id').put(UserAuthenticate,userAuthorize('employer'),verifyAndUpdateApplications);
router.route('/update-applications-status/:id').put(UserAuthenticate,userAuthorize('employer'),updateStatus);
module.exports = router;