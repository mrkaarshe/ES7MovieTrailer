import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetails";
import { Toaster } from "sonner";
import AuthPage from "./pages/AuthPage";
import FavoritsPage from "./pages/FavoritsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Favorite" element={<FavoritsPage/>} />
        <Route path="/movie/:id" element={<MovieDetail />} />
       <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<div className="bg-black text-white text-4xl font-Goldman">404</div>} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </Router>
  );
}

export default App;
