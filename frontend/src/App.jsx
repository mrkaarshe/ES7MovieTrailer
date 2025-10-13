import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetails";
import NewPage from "./pages/NewPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "sonner";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Favorite" element={<NewPage/>} />
        <Route path="/movie/:id" element={<MovieDetail />} />
       <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<div className="bg-black text-white text-4xl font-Goldman">404</div>} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </Router>
  );
}

export default App;
