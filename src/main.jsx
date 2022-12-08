import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useLocation, } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import TopBar from './components/TopBar/TopBar'
import About from './pages/About'
import ErrorPage from './pages/ErrorPage';

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
        <TopBar />
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
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
)
