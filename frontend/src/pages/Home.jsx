import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoTriangleRight } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { SlRefresh } from "react-icons/sl";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import { MdOutlineKeyboardArrowUp ,MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiOutlineLogin ,HiOutlineLogout } from "react-icons/hi";
import axios from "axios";
import aos from 'aos'
import 'aos/dist/aos.css';

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
  const [togelFooter ,setTogelFooter] = useState(null)
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
        setSelectedMovie(filteredMovies[19] || filteredMovies[0]);
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
      setSelectedMovie(movies[19] || movies[0]);
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
      const favoritesRes = await axios.get("http://localhost:3000/api/favorites", {
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
        "http://localhost:3000/api/favorites",
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


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };
    useEffect(() => {
    aos.init({
      duration: 1000,
      once:true

    });
  }, []);

{loading && (
  <div className="flex flex-col items-center justify-center my-20">
    <p className="p-4 mx-auto w-20 h-20 border-8 border-gray-400 rounded-full border-t-transparent animate-spin"></p>
    <button
      onClick={() => setLoading(false)}
      className="mt-4 bg-red-500 text-cyan-400 px-4 py-2 rounded-lg"
    >
      stop Loading
    </button>
  </div>
)}
  return (
    <div
      className="min-h-screen z-10 fixed top-0 left-0 right-0  px-0 sm:px-3 md:px-0"
      style={{
        backgroundImage: selectedMovie
          ? `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-blur-xs bg-black/10 absolute w-full h-screen"></div>

      <div
        className="z-100 container relative h-[95vh] md:h-[90vh] lg:h-[70vh] mb-3  lg:my-20 rounded-lg max-w-7xl mx-auto overflow-hidden text-cyan-400 transition-all duration-700 ease-in-out shadow-xs"
        style={{
          backgroundImage: selectedMovie
            ? `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
            : "none",
          backgroundSize: "cover",
          backgroundRepeat :"no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/*  Header */}
        <nav data-aos="fade-down" className="backdrop-blur-xs bg-gray-900/30 text-cyan-400 p-5 mmin-h-20  shadow-md rounded-b-lg">
          <div className="flex justify-end gap-3 items-center">
            <h1
              onClick={() => navigate("/")}
              className="text-cyan-400 text-2xl absolute left-2  md:text-3xl font-Goldman cursor-pointer flex justify-start items-center"
            >
              MOVIE
              <span  className="text-sm font-medium text-gray-300 hidden mt-2 md:block">/Trailer</span>
            </h1>
                <div className="relative">
                 
                    <input
                    className="h-5 px-7  min-w-8 w-54 md:w-70 lg:w-sm overflow-auto text-cyan-400 text-md outline-none bg-transparent placeholder-cyan-200"
                    value={searchQuery}
                    placeholder="Search..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <i className="absolute  top-[3px] left-1 text-xl">
                    <IoSearch />
                  </i>
 
                </div>

            <div className="hidden md:flex justify-between  items-center gap-1">
              <div>
              </div>
              {user ? (
                <>

              <button
                  onClick={() => navigate("/Favorite")}
                  className="px-1 py-2 rounded-md hover:text-cyan-400 transition"
                >
                  <MdOutlineFavoriteBorder size={25} />
                </button>
                  <div
                    className="relative"
                    onClick={() => setUserTogel(!userTogel)}
                  >
                    <span className="h-10 rounded-full flex justify-center items-center hover:text-cyan-400">
                      <LuUser size={22} />
                    </span>
                  </div>
                  <div
                    className={`bg-gray-700/40 backdrop-blur-2xl w-1/6 p-5 right-1 rounded-lg flex flex-col gap-5 top-21 absolute ${
                      userTogel ? "" : "hidden"
                    }`}
                  > 
                    <div className="flex gap-2 items-center hover:bg-cyan-400 cursor-pointer hover:text-black h-10 transition rounded-md px-2">
                      <span className=" rounded-full flex justify-center  ">
                        <LuUser size={22} />
                      </span>
                      @{user.name}
                    </div>
                    <p
                      onClick={handleLogout}
                      className=" flex gap-2 items-center h-10 rounded-md cursor-pointer hover:bg-cyan-400 hover:text-black transition px-2"
                    >
                     <HiOutlineLogin size={22}/> Logout
                    </p>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className=" bg-cyan-400 text-black flex items-center gap-3 font-medium hover:border border-cyan-400 hover:bg-transparent hover:text-white  px-6 py-1 text-sm"
                >
                <HiOutlineLogout/>  Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl text-cyan-400"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {menuOpen && (
            <div className="flex absolute right-1 left-1 justify-between px-5 bg-gray-900/30  h-20  top-17 pt-5 gap-5 md:hidden">


              <button
                  onClick={() => { navigate("/Favorite"); setMenuOpen(false)}}
                  className="px-1 py-2 h-10 rounded-md hover:text-cyan-400 transition"
                >
                  <MdOutlineFavoriteBorder size={25} />
                </button>

              {user ? (
                <>
                     <div className="flex gap-2 items-center hover:bg-cyan-400 hover:text-black h-10 transition rounded-md px-2">
                      <span className=" rounded-full flex justify-center  ">
                        <LuUser size={22} />
                      </span>
                      @{user.name}
                    </div>
                  <p
                      onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                      className=" flex gap-2 items-center h-10 rounded-md  hover:text-black transition px-2"
                    >
                     <HiOutlineLogin size={22}/> Logout
                    </p>
  
                  
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={()=> setMenuOpen(false)}
                  className="flex justify-center items-center gap-3 text-cyan font-medium  hover:bg-transparent hover:text-black  px-6 py-1 text-md"
                >
                 <HiOutlineLogout size={22}/> Login
                </Link>
              )}
            </div>
          )}
        </nav>

    
          
          <div className={`flex flex-col md:flex-row  justify-between items-center absolute bottom-0 right-1 left-1 bg-gray-900/30 backdrop-blur-xs transition-all ease-in-out rounded-t-lg shadow-lg p-5`}>
          <button onClick={()=> setTogelFooter(!togelFooter)} className="absolute w-20 h-20 -top-12 right-0 text-4xl">{!togelFooter ? <MdOutlineKeyboardArrowDown size={50} /> :  <MdOutlineKeyboardArrowUp size={50} /> }</button>
          {selectedMovie && (
            <div data-aos="fade-rigth" className="relative z-10 max-w-2xl">
              <h2 className="text-lg font-Goldman font-bold text-cyan-400">
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
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 w-1/3 text-gray-50 font-semibold py-2 px-3  hover:bg-cyan-400  flex justify-center items-center transition gap-3"
                >
                  watch <GoTriangleRight />
                </button>
                <button
                  onClick={() => handleLoveMovie(selectedMovie)}
                  className="px-4 py-2 rounded border hover:border-0"
                >
                  <MdOutlineFavoriteBorder size={20} />
                </button>
              </div>
            </div>
          )}

          <div   className={`${togelFooter ? "hidden" : ""} relative z-10 mt-5 w-full md:max-w-3xl overflow-x-auto scrollbar-hide`}>
            <div className="relative w-full flex gap-5">
              {movies.map((movie) => (
                <div key={movie.id} className="relative border rounded-md ">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="cursor-pointer rounded-md min-w-30 md:w-60 object-cover  shadow-lg"
                    onClick={() => handleMovieClick(movie)}
                  />
                </div>
              ))}

              <button
                onClick={loadMore}
                className={`w-1/3 rounded-full mt-10 h-30 text-5xl text-cyan-400 items-center flex justify-center font-semibold py-2 px-5 ${
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
