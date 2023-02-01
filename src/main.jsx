import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useLocation, } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import UserGuide from "./pages/UserGuide";
import ErrorPage from './pages/ErrorPage';
import NavBar from './components/NavBar/NavBar';

//Import global style
import './App.scss'
import AppContext from './contexts/appContext';


const AppLayout = () => {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //redirects to dashboard if no path is provided
    if (location.pathname === "/") navigate("/dashboard");
  }, [location.pathname]);

  return (
    <AppContext>
      <div className="App" >
        <NavBar />
        <Outlet />
      </div>
    </AppContext>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      }, {
        path: "about",
        element: <About />
      },{
        path: "userguide",
        element: <UserGuide />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
)
