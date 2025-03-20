const express = require('express');
const multer = require('multer');
// const path = require('path');
const { userRegister, userLogin, getUserProfile, UpdateUserProfile, deleteUser, applyJob, saveJob, savedJobList, appliedJobs, deleteApplication, shortList, searchJob, UserLogout, removeFromSave, checkAppliedOrNot, changePasswordOnly, resetPassword, forgotPassword } = require('../Controllers/userController');
const { UserAuthenticate, userAuthorize } = require('../Middlewares/authenticate');
const { approvedJobs } = require('../Controllers/jobController');
const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  });

  
const upload = multer({ storage });

router.route('/register').post(userRegister);
router.route('/login').post(userLogin);
router.route('/change-password').put(UserAuthenticate,changePasswordOnly);
router.route('/user-profile').get(UserAuthenticate,getUserProfile);
router.route("/update-profile").put(UserAuthenticate, upload.fields([{ name: "profilePic", maxCount: 1 }, { name: "resume", maxCount: 1 }]), UpdateUserProfile);
router.route('/delete-account').delete(UserAuthenticate,deleteUser);
router.route('/approved-jobs').get(approvedJobs);
router.route('/apply-for-job/:id').post(UserAuthenticate,userAuthorize('user'),applyJob);
router.route('/save-job/:id').post(UserAuthenticate,userAuthorize('user'),saveJob);
router.route('/all-saved-jobs').get(UserAuthenticate,userAuthorize('user'),savedJobList);
router.route('/remove-from-saved-list/:id').delete(UserAuthenticate,userAuthorize('user'),removeFromSave);
router.route('/all-applied-jobs').get(UserAuthenticate,userAuthorize('user'),appliedJobs);
router.route('/check-applied-or-not').get(UserAuthenticate,userAuthorize('user'),checkAppliedOrNot);
router.route('/delete-application/:id').delete(UserAuthenticate,userAuthorize('user'),deleteApplication);
router.route('/shortlisted-jobs').get(UserAuthenticate,userAuthorize('user'),shortList); 
router.route('/search-jobs').get(searchJob);
router.route('/logout').post(UserAuthenticate,UserLogout);

module.exports = router;
