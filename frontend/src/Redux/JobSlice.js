import { createSlice } from "@reduxjs/toolkit";
const initialState ={
    job: [],
    applications: [],
    saved_jobs: []
}
const JobSlice = createSlice({
    initialState,
    name:'Job Slice',
    reducers : {
        postAJob: (state, action) => {
            // Ensure `state.job` is an array
            if (!Array.isArray(state.job)) {
                state.job = [];
            }
        
            const existing_data = JSON.parse(localStorage.getItem('job') || "[]");
            const new_data = { ...action.payload };
        
            state.job.push(new_data);
        
            const updated_data = [...existing_data, new_data];
            localStorage.setItem('job', JSON.stringify(updated_data));
        },
        getAllJobs: (state)=>{
            const jobs = JSON.parse(localStorage.getItem('job'));
            if(jobs) {
                state.job = jobs
            }
        },
        updateJob: (state, action) => {
            if (!Array.isArray(state.job)) {
                state.job = []; // ✅ Ensure `state.job` is an array
            }
        
            // Find the job and update it
            state.job = state.job.map((job) =>
                job._id === action.payload._id ? { ...job, ...action.payload } : job
            );
        
            localStorage.setItem("job", JSON.stringify(state.job)); // ✅ Save updated state to local storage
        },
        deleteJob: (state,action)=>{
            if (!Array.isArray(state.job)) {
                state.job = []; // Reset if not an array
            }
            const index = state.job.findIndex((jobs)=>jobs._id === action.payload._id);
            if(index !== -1){
                state.job.splice(index,1);
            }
            localStorage.setItem('job',JSON.stringify(state.job));
        },
        pendingJobs:(state)=>{
            const pending_jobs = state.job.find((job)=>job.status === "pending");
            if(pending_jobs){
                state.job = pending_jobs;
            }
        },
        approveOrRejectJob: (state, action) => {
            if (!Array.isArray(state.job)) {
                state.job = []; // ✅ Ensure `state.job` is always an array
            }
        
            // ✅ Get current jobs from localStorage (to maintain previously added jobs)
            const existingJobs = JSON.parse(localStorage.getItem("job")) || [];
        
            // ✅ Find the job that needs to be updated
            const updatedJob = action.payload;
            const index = existingJobs.findIndex(job => job._id === updatedJob._id);
        
            if (index !== -1) {
                // ✅ Update the existing job
                existingJobs[index] = { ...existingJobs[index], ...updatedJob };
            } else {
                // ✅ If not found, add the new job (to ensure it doesn’t get lost)
                existingJobs.push(updatedJob);
            }
        
            // ✅ Update Redux state
            state.job = existingJobs;
        
            // ✅ Save updated array to localStorage
            localStorage.setItem("job", JSON.stringify(existingJobs));
        },
        applyForJob: (state,action) =>{
            const existing_data = JSON.parse(localStorage.getItem('applications')) || [];
            const new_data = {...action.payload};
            state.applications.push(new_data);
            const updated_data = [...existing_data,new_data];
            localStorage.setItem('applications',JSON.stringify(updated_data));

        },
        saveJob: (state,action) =>{
            const existing_data = JSON.parse(localStorage.getItem('saved_jobs')) || [];
            const new_data = {...action.payload};
            state.saved_jobs.push(new_data);
            const updated_data = [...existing_data,new_data];
            localStorage.setItem('saved_jobs',JSON.stringify(updated_data));
        },
        withdrawApplication: (state,action) =>{
            const index = state.applications.findIndex((jobs)=>jobs._id === action.payload._id);
            if(index !== -1){
                state.applications.splice(index,1);
            }
            localStorage.setItem('applications',JSON.stringify(state.applications));
        },
            
        
        
    }
});
export const {postAJob,getAllJobs,updateJob,deleteJob,approveOrRejectJob,pendingJobs,applyForJob,saveJob,withdrawApplication} = JobSlice.actions;
export default JobSlice.reducer;