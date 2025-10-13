import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl mb-5 text-rose-500">Login</h2>
        <input type="email" placeholder="Email" className="block mb-3 p-2 bg-gray-700" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="block mb-3 p-2 bg-gray-700" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-rose-500 px-5 py-2 hover:bg-rose-600">Login</button>
      </form>
    </div>
  );
}
