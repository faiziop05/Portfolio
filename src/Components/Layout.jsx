import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark text-light overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} My Portfolio. Built with React &
        Tailwind.
      </footer>
      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  );
};

export default Layout;
