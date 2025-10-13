import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoTriangleRight } from "react-icons/go";
import { toast } from "sonner";
const NewPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        console.log("No token found");
        setLoading(false); // <-- dami loading haddii token maqan yahay
        return;
      }

      const res = await axios.get("http://localhost:5000/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMovies(res.data);
    } catch (err) {
      console.error("❌ Error fetching movies:", err.response?.data || err.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

const handleDeleteMovie = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      toast.error("Please login first!");
      return;
    }

    const res = await axios.delete(
      `http://localhost:5000/api/favorites/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setMovies((prev) => prev.filter((movie) => movie._id !== id));
    toast.success("Movie deleted successfully!");
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Error deleting movie");
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto min-h-screen">
        <p className="p-4 w-30 h-30 border-8 border-white rounded-full border-t-transparent animate-spin"></p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center relative"
      style={{
        backgroundImage: `url(https://i.pinimg.com/1200x/50/35/f2/5035f2cf008c38e4eeb86d0b9802d10c.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute bg-black/10 w-full backdrop-blur-2xl h-full"></div>

      <div className="absolute max-w-7xl mx-auto top-0 md:top-20 p-10 right-0 left-0 backdrop-blur-sm bg-gray-700/20 rounded-lg min-h-screen md:min-h-200 md:max-h-200 overflow-y-auto scrollbar-hide">
        <h1 className="text-3xl text-center py-3 font-bold font-Goldman">
          {movies.length > 0 ? "Your Favorite Movies" : "No Movies Found"}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div key={movie.tmdbId}>
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[250px] rounded-md object-cover"
                />

                {/* Delete Button */}
                <div
                  onClick={() => handleDeleteMovie(movie._id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full cursor-pointer"
                  title="Delete Movie"
                >
                  ✕
                </div>

                {/* Overlay */}
                <div className="absolute bottom-0 w-full bg-slate-800/20 h-1/3 rounded-t-4xl opacity-0 hover:opacity-100 flex items-center justify-center gap-5 pb-4 transition-opacity duration-500">
                  <button
                    onClick={() => navigate(`/movie/${movie.tmdbId}`)}
                    className="bg-white text-black font-semibold py-2 px-7 hover:bg-yellow-400 flex justify-center items-center transition"
                  >
                    Watch <GoTriangleRight />
                  </button>
                </div>
              </div>

              <div className="p-2 text-center">
                <h2 className="text-sm font-semibold text-[#ffd000] truncate">
                  {movie.title}
                </h2>
                <p className="text-xs text-gray-300">{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="bg-white w-1/2 mx-auto text-black mt-5 font-semibold py-2 px-3  flex justify-center items-center transition"
        >
          Back To Menu
        </button>
      </div>
    </div>
  );
};

export default NewPage;
