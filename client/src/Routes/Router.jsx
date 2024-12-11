import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/log-in';
import SignUp from '../pages/sign-Up'
import Dashboard from '../pages/Dashboard';
import Customer from '../pages/User';
import Tools from '../pages/Tools';


const Router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },{
    path:'/register',
    element:<SignUp/>
  },{
    path:'/',
    element:<Dashboard/>
  },{
    path:'/Customer',
    element:<Customer/>
  },{
    path:'/Tools',
    element:<Tools/>
  }
]);

export default Router;
