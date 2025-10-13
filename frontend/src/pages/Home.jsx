import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoTriangleRight } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { SlRefresh } from "react-icons/sl";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import axios from "axios";
import { toast } from "sonner";

const API_KEY = "a6dc73708449c9ddbd194f71534d5001";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [userTogel, setUserTogel] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  //  Movies fetch
  const fetchMovies = async (reset = false, nextPage = page) => {
    setLoading(true);
    const url = searchQuery
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${nextPage}&include_adult=false`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${nextPage}&include_adult=false`;

    const res = await fetch(url);
    const data = await res.json();
    const filteredMovies = (data.results || []).filter(
      (movie) => movie.adult === false
    );

    if (reset) {
      setMovies(filteredMovies);
      if (filteredMovies.length > 0)
        setSelectedMovie(filteredMovies[18] || filteredMovies[0]);
    } else {
      setMovies((prev) => [...prev, ...filteredMovies]);
    }
    setLoading(false);
  };

  //  Marka la bilaabayo ama la raadinayo
  useEffect(() => {
    fetchMovies(true, 1);
  }, [searchQuery]);

 
  useEffect(() => {
    if (movies.length > 0 && !selectedMovie) {
      setSelectedMovie(movies[18] || movies[0]);
    }
  }, [movies, selectedMovie]);

  //  Load more movies
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(false, nextPage);
  };

  //  Marka user doorto movie
  const handleMovieClick = async (movie) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=videos`
    );
    const data = await res.json();
    setSelectedMovie(data);
  };

  //  Favorites
  const handleLoveMovie = async (selectedMovie) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      const favoritesRes = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const existing = favoritesRes.data.find(
        (fav) => fav.tmdbId === selectedMovie.id
      );

      if (existing) {
        toast.error(` "${selectedMovie.title}" is already in favorites!`);
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/favorites",
        {
          tmdbId: selectedMovie.id,
          title: selectedMovie.title,
          overview: selectedMovie.overview,
          release_date: selectedMovie.release_date,
          poster_path: selectedMovie.poster_path,
          backdrop_path: selectedMovie.backdrop_path,
          popularity: selectedMovie.popularity,
          vote_average: selectedMovie.vote_average,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(` Added to favorites: "${res.data.title}"`);
    } catch (error) {
      console.error(" Error toggling favorite:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Error toggling favorite");
    }
  };

  //  Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (!movies.length)
    return (
      <p className="p-4 flex justify-center items-center mx-auto my-40 w-30 h-30 border-8 border-gray-400 rounded-full border-t-transparent animate-spin"></p>
    );

  return (
    <div
      className="min-h-screen z-10 fixed top-0 left-0 right-0 bg-black/80 px-0 sm:px-3 md:px-0"
      style={{
        backgroundImage: selectedMovie
          ? `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-blur-sm bg-black/40 absolute w-full h-screen"></div>

      <div
        className="z-100 container relative h-[97vh] lg:h-[70vh] my-2 md:my-3 lg:my-20 rounded-lg max-w-7xl mx-auto overflow-hidden text-white transition-all duration-700 ease-in-out shadow-xs"
        style={{
          backgroundImage: selectedMovie
            ? `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/*  Header */}
        <nav className="backdrop-blur-xs bg-gray-500/20 text-white p-4 shadow-md rounded-b-3xl">
          <div className="flex justify-between items-center">
            <h1
              onClick={() => navigate("/")}
              className="text-white text-2xl md:text-3xl font-Goldman cursor-pointer"
            >
              MOVIE
              <span className="text-sm font-medium text-gray-300">/Trailer</span>
            </h1>

            <div className="hidden md:flex items-center gap-1">
              <div className="hidden abslute md:flex items-center gap-1">
                <div className="relative">
                  <input
                    className="h-5 px-9 max-w-40 border-x-1 overflow-auto text-white outline-none bg-transparent placeholder-gray-300"
                    value={searchQuery}
                    placeholder="Search..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <i className="absolute top-1 left-3 text-lg">
                    <IoSearch />
                  </i>
                </div>
                <button
                  onClick={() => navigate("/Favorite")}
                  className="px-1 py-2 rounded-md hover:text-white transition"
                >
                  <MdOutlineFavoriteBorder size={20} />
                </button>
              </div>

              {user ? (
                <>
                  <div
                    className="relative"
                    onClick={() => setUserTogel(!userTogel)}
                  >
                    <span className="h-10 rounded-full flex justify-center items-center hover:text-white">
                      <LuUser size={20} />
                    </span>
                  </div>
                  <div
                    className={`bg-gray-400/40 backdrop-blur-2xl w-1/6 p-5 right-2 rounded-lg flex flex-col gap-5 top-18 absolute ${
                      userTogel ? "" : "hidden"
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <span className=" rounded-full flex justify-center items-center">
                        <FaUser size={20} />
                      </span>
                      {user.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="border-2 border-gray-200 px-3 py-1 rounded-md hover:bg-gray-400 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="border border-gray-400 px-4 py-1 text-sm"
                >
                  Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl text-white"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {menuOpen && (
            <div className="flex bg-gray-300/30 p-5 backdrop-blur-sm flex-col-reverse rounded-md mt-4 gap-4 md:hidden">
              <div className="relative">
                <input
                  className="py-2 px-9 w-full text-white border-2 border-gray-200 outline-none rounded-md bg-transparent placeholder-gray-200"
                  value={searchQuery}
                  placeholder="Search..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="absolute text-white top-3 left-3 text-lg">
                  <IoSearch />
                </i>
              </div>

              <button
                onClick={() => {
                  navigate("/Favorite");
                  setMenuOpen(false);
                }}
                className="border-2 border-gray-200  py-2 rounded-md hover:bg-gray-400 hover:text-white transition flex items-center justify-center gap-1"
              >
                <MdFavorite /> Favorites
              </button>

              {user ? (
                <>
                  <span className="text-gray-300 text-center text-sm">
                    {user.email}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="border-2 border-gray-200 py-2 rounded-md hover:bg-gray-200 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="border-2 border-gray-200 py-2 text-center rounded-md hover:bg-gray-200 transition"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </nav>

        
        <div className="flex flex-col md:flex-row justify-between items-center absolute bottom-0 right-1 left-1 bg-gray-400/10 backdrop-blur-xs rounded-t-4xl shadow-lg p-5">
          {selectedMovie && (
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-lg font-Goldman font-bold text-white">
                {selectedMovie.title}
              </h2>
              <p className="text-sm text-gray-200 mt-1">
                🎞 {selectedMovie.release_date} | ⭐ {selectedMovie.vote_average}
              </p>
              <p className="text-gray-200 mt-3 text-xs md:text-md line-clamp-4 max-w-md">
                {selectedMovie.overview}
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => navigate(`/movie/${selectedMovie.id}`)}
                  className="hover:bg-gray-200 hover:text-white font-semibold py-2 px-7 bg-white text-black flex justify-center items-center transition"
                >
                  watch <GoTriangleRight />
                </button>
                <button
                  onClick={() => handleLoveMovie(selectedMovie)}
                  className="px-4 py-2 rounded border"
                >
                  <MdOutlineFavoriteBorder size={20} />
                </button>
              </div>
            </div>
          )}

          <div className="relative z-10 mt-5 w-full md:max-w-3xl overflow-x-auto scrollbar-hide">
            <div className="relative w-full flex gap-5">
              {movies.map((movie) => (
                <div key={movie.id} className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="cursor-pointer rounded-lg min-w-[150px] h-[220px] object-cover rshadow-lg"
                    onClick={() => handleMovieClick(movie)}
                  />
                </div>
              ))}

              <button
                onClick={loadMore}
                className={`w-1/3 rounded-full mt-10 h-30 text-5xl text-white items-center flex justify-center font-semibold py-2 px-5 ${
                  loading ? "animate-spin" : ""
                }`}
              >
                <SlRefresh />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
