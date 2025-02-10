import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/log-in';
import SignUp from '../pages/sign-Up';
import Dashboard from '../pages/Dashboard';
import Customer from '../pages/User';
import Tools from '../pages/Tools';
import Return from '../pages/return';
import OutList from '../pages/out-list';


const Router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <SignUp />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/return',
    element: <Return />,
  },
  {
    path: '/Customer',
    element: <Customer />,
  },
  {
    path: '/Tools',
    element: <Tools />,
  },
  {
    path: '/outlist',
    element: <OutList />,
  }
 
]);

export default Router;
