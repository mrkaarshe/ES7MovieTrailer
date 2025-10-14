import { useState } from "react";
import axios from "axios";
import { useNavigate ,Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@radix-ui/react-tabs";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      console.log(res.data)
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/register", {
      name,
      email,
      password,
    });

    // Ku kaydi user info & token
    localStorage.setItem("user", JSON.stringify(res.data));

    toast.success("Account created successfully!");
    setTab("login"); // beddel tab-ka login
  } catch (err) {
    console.error("❌ Registration Error:", err.response?.data || err.message);
    toast.error(err.response?.data?.error || "Registration failed");
  }
};


  return (
    <div className="flex relative items-center justify-center min-h-screen  bg-black text-white"
          style={{
        backgroundImage: `url()`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="absolute w-full bg-black/40 backdrop-blur-2xl h-full "></div>
      <div className="absolute bg-gray-900/40  p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-6 font-Goldman">
          Welcome
        </h1>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex justify-center mb-6 bg-gray-800 rounded-xl">
            <TabsTrigger
              value="login"
              className={`px-5 py-2 rounded-xl font-semibold ${
                tab === "login"
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className={`px-5 py-2 rounded-xl font-semibold ${
                tab === "register"
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg transition"
              >
                Login
              </button>
              <Link to={'/'} className="text-sm flex justify-center">Back To Menu</Link>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="name"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg transition"
              >
                Create Account
              </button>
               <Link to={'/'} className="text-sm flex justify-center">Back To Menu</Link>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
