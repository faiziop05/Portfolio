import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigate("/admin");
    } catch (error) {
      toast.error("Invalid credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-slate-800 p-8 rounded-xl border border-slate-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-primary py-2 rounded font-bold text-white hover:bg-indigo-600 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
