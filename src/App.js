import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./Pages/About";
import Feed from "./Pages/Feed";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Register from "./Pages/Register";
import SignIn from "./Pages/SignIn";
import Story from "./Pages/Story";
import WritePost from "./Pages/WritePost";

import "./index.css";
import UserProfile from "./Pages/UserProfile";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/story/:id",
        element: <Story />,
      },  {
        path: "/userprofile/:id",
        element: <UserProfile />,
      },
      {
        path: "/writepost",
        element: <WritePost />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/feed",
        element: <Feed />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
