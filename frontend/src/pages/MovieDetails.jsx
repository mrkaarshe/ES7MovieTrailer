import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GoTriangleRight } from "react-icons/go";
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

  if (!movie) return <div className=' flex justify-center items-center my-30 mx-auto min-h-screen' ><p className="p-4  w-30 h-30 border-8 border-white rounded-full border-t-transparent animate-spin"></p></div>;

  return (
    <>
    <div  
         className=" min-h-screen  absolute z-10  top-0 left-0 right-0 bg-black/80   text-white transition-all duration-700 ease-in-out"
      style={{
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        
   <div className="backdrop-blur-sm bg-black/40 absolute w-full h-screen"></div>
   
    <div className="absolute top-10 right-0 left-0 min-h-140  p-4 max-w-7xl  mx-auto  mt-0 md:mt-20 rounded-2xl"
          style={{
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
       <div className='flex flex-col justify-between items-center gap-5'>
       <div className='flex flex-col lg:flex-row gap-5 w-full'>
        <div className='bg-gray-700/10 backdrop-blur-sm w-1/1 lg:w-1/3 py-3 rounded-md px-2 mt-10'>
        <div className='flex gap-3 justify-start  '>
          <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        className="mt-1 w-30 rounded-lg "
        alt={movie.title}
      />
      <div>
              <h2 className="text-xl md:text-3xl font-semibold font-Goldman text-white">
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
                          className="bg-white text-black font-semibold py-2 px-3  hover:bg-gray-200 hover:text-white  flex justify-center items-center transition"
                        >
                         - Back To Menu 
                        </button>

                      </div>
                    </div>
        </div>
      
      
      {trailer ? (
        <iframe
          className="w-full min-h-100 mt-1 md:mt-10 rounded-md "
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
