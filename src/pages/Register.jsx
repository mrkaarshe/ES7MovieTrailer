import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", { name, email, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl mb-5 text-rose-500">Register</h2>
        <input type="text" placeholder="Name" className="block mb-3 p-2 bg-gray-700" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="block mb-3 p-2 bg-gray-700" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="block mb-3 p-2 bg-gray-700" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-rose-500 px-5 py-2 hover:bg-rose-600">Register</button>
      </form>
    </div>
  );
}
