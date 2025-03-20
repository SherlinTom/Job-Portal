import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { getLoggedUser } from '../Redux/UserSlice';

const UserRoute = ({requiredRole,children}) => {
 const dispatch = useDispatch();
 useEffect(()=>{
  dispatch(getLoggedUser());
 },[dispatch]);

  const admin_details = useSelector((state) => state?.users?.loggedUser ?? null );

  const isAuthenticated = admin_details?.isAuthenticated ?? true;
  const role =  admin_details?.role ?? 'user';

    if(!isAuthenticated) {
        return <Navigate to={'/login'}/>
    }
    if(requiredRole && !requiredRole.includes(role)) {
        return <Navigate to={'/login'}/>
    }
  return (
    <>
    {children}

    </>
  )
}

export default UserRoute