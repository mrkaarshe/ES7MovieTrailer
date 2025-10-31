import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GoTriangleRight } from "react-icons/go";
import { IoChevronBackCircleOutline } from "react-icons/io5";
const API_KEY = 'a6dc73708449c9ddbd194f71534d5001';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
      const data = await res.json();
      setMovie(data);
    };

    const fetchTrailer = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
      const data = await res.json();
      const t = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      setTrailer(t?.key);

    };

    fetchDetails();
    fetchTrailer();
  }, [id]);
  

  const handlenavigat = () =>{
    navigate('/')
  }

  if (!movie) return (
        <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex space-x-2">
        <span className="w-7 h-7 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-7 h-7 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-7 h-7 bg-cyan-400 rounded-full animate-bounce" />
        <span className="w-7 h-7 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
      </div>
    </div>
  )
  return (
    <>
    <div  
         className=" min-h-screen  absolute z-10  top-0 left-0 right-0 bg-black/80   text-cyan-400 transition-all duration-700 ease-in-out"
      style={{
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        
   <div className="backdrop-blur-sm bg-black/10 absolute w-full h-screen"></div>
   
    <div className="absolute top-10 right-0  left-0 min-h-140  p-4 max-w-7xl  mx-auto  mt-0 md:mt-20 rounded-2xl"
          style={{
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
       
       <div className='flex flex-col justify-between items-center gap-5'>
       <div className='flex flex-col lg:flex-row gap-4 w-full'>
        <div className='bg-gray-800/70 backdrop-blur-sm w-1/1 lg:w-115 py-3  rounded-md px-5 mt-10'>
        <div className='flex gap-3 justify-start  '>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        className="mt-1 w-30 rounded-lg "
        alt={movie.title}
      />
      <div>
              <h2 className="text-xl md:text-3xl font-semibold font-Goldman text-cyan-500">
                        {movie?.title}
                      </h2>
            <p className="text-sm text-gray-200 mt-1">
                        🎞 {movie?.release_date} | ⭐ {movie?.vote_average}
       </p>
      </div>
        </div>
        <div className="relative z-10 max-w-2xl">      
              <p className="text-gray-200 text-xs md:text-sm mt-3 line-clamp-4  max-w-md">
                        {movie?.overview}
                      </p>
                      <div className="flex gap-3 mt-5">
                        <button
                          onClick={() => navigate(`/`)}
                          className="bg-gradient-to-r from-cyan-400 to-purple-400 w-1/1 text-gray-50 font-semibold py-2 px-3  hover:bg-cyan-400  flex justify-center items-center transition gap-3 "
                        >
                         <IoChevronBackCircleOutline/> Back To Menu 
                        </button>

                      </div>
                    </div>
        </div>
      
      
      {trailer ? (
        <iframe
          className="w-full z-100 min-h-100 mt-1 md:mt-10 rounded-md "
          src={`https://www.youtube.com/embed/${trailer}`}
          title="Movie Trailer"
          allowFullScreen
        ></iframe>
      ):<div className='w-full h-110 text-4xl mt-10'>no trailer</div>}
       </div>
       
        </div>
     </div>

   
      <div>
     
   
          
    </div>
  
    </div>
     </>
  );
};

export default MovieDetails;
