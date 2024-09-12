import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Contact,About,Projects,Home } from "./Screens/index.js";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Contact",
    element: <Contact />,
  },
  {
    path: "/Projects",
    element: <Projects />,
  },
  {
    path: "/About",
    element: <About />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
