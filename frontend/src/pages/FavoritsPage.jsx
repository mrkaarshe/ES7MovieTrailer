import React, { useState, useEffect } from "react";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { BsHeartbreak } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoTriangleRight } from "react-icons/go";
import { toast } from "sonner";
const FavoritsPage = () => {
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

      const res = await axios.get("https://kaarshemovietrailer.onrender.com/api/favorites", {
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
      `https://kaarshemovietrailer.onrender.com/api/favorites/${id}`,
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
        <p className="p-4 w-30 h-30 border-8 border-cyan-400 rounded-full border-t-transparent animate-spin"></p>
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
       <div className="flex justify-between  items-center my-5">
          <h1 className="text-xs md:text-3xl text-cyan-400  py-2 font-bold font-Goldman">
          {movies.length > 0 ? "There Is Your Favorite Movies" : "No Movies Found!"}
        </h1>
          <button
          onClick={() => navigate("/")}
          className=" text-xs md:text-2xl text-gray-50 font-semibold py-2 px-3 flex items-center justify-end transition gap-3"
        >

          <IoChevronBackCircleOutline/> Back To Menu
        </button>

</div>
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
                  className="absolute -top-3 right-0 bg-red-500 hover:bg-red-600 text-white-400 font-extrabold w-7 h-7 flex items-center justify-center rounded-full cursor-pointer"
                  title="Delete Movie"
                >
                  <BsHeartbreak/>
                </div>

                {/* Overlay */}
                <div className="absolute bottom-0 w-full bg-slate-800/10 h-[90%] rounded-t-4xl opacity-0 hover:opacity-100 flex items-center justify-center gap-5 pb-4 transition-opacity duration-500">
                  <button
                    onClick={() => navigate(`/movie/${movie.tmdbId}`)}
                    className="bg-gradient-to-r from-cyan-400 to-purple-400  hover: font-semibold py-2 px-7  flex justify-center items-center transition"
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


      </div>
    </div>
  );
};

export default FavoritsPage;
