import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    users: [],
    loggedUser: null
};
const UserSlice = createSlice({
    initialState,
    name: "User Slice",
    reducers: {
        userRegister: (state,action) =>{
            const existing_data = JSON.parse(localStorage.getItem('users') )|| [];
           
            const new_data = {...action.payload};
            state.users.push(new_data);
 
            const update_data=[...existing_data,new_data];
            localStorage.setItem('users',JSON.stringify(update_data));
        },
    
    setLoggedUser: (state,action) => {
        const loggedUser = {...action.payload};
        state.loggedUser = loggedUser;
        localStorage.setItem('loggedUser',JSON.stringify(loggedUser));
    },
    getLoggedUser: (state) => {
        const logged_users = JSON.parse(localStorage.getItem("loggedUser"));
        if (logged_users) {
            state.loggedUser = logged_users; 
        }
    },
    logoutUser: (state) => {
        state.loggedUser = null;
        localStorage.removeItem('loggedUser');
    },
      updateProfile: (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload }; // Merge new data
        }
        
        // Store updated users list in local storage
        localStorage.setItem("users", JSON.stringify(state.users));
    },
    
    deleteUsers: (state,action)=>{
            
        const index = state.users.findIndex((user)=>user._id === action.payload._id);
        if(index !== -1){
            state.users.splice(index,1);
        }
        localStorage.setItem('users',JSON.stringify(state.users));
    },
}
});
export const {userRegister,setLoggedUser,getLoggedUser,logoutUser,updateProfile,deleteUsers} = UserSlice.actions;
export default UserSlice.reducer;