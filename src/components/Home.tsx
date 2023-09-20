"use client";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Genres from "./Genres";
import Welcome from "./Welcome";

import { BsPlayFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const Home = () => {
  interface IMDBMovie {
    poster_path: string;
    title: string;
    genres: [
      {
        name: string;
        id: string;
      }
    ];
    original_language: string;
    popularity:string;
    release_date: string;
    runtime: string;
    vote_average: string;
    overview: string;
    videos: { results: [{ type: string; key: string }] };
  }

  const searchParams = useSearchParams();
  const [movie, setMovie] = useState<IMDBMovie>();

  const [isLoading, setIsLoading] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const [player, setPlayer] = useState(false);
  const [trailer, setTrailer] = useState("");

  useEffect(() => {
    // setIsLoading(true);
    setIsImgLoading(true);

    let searchMovie = searchParams.get("movie");

    if (searchMovie === null) {
      searchMovie = " ";
    }

    axios
      .get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: process.env.NEXT_PUBLIC_API_KEY,
          query: searchMovie,
        },
      })
      .then((res) => {
        axios
          .get(
            `https://api.themoviedb.org/3/movie/${res?.data?.results[0]?.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=videos`
          )
          .then((res) => {
            setMovie(res.data);
            setIsLoading(false);
            console.log(res.data);
          });
      });
  }, [searchParams]);

  useEffect(() => {
    const trailerIndex = movie?.videos?.results?.findIndex(
      (element) => element.type === "Trailer"
    );

    const trailerURL = `https://www.youtube.com/watch?v=${
      movie?.videos?.results[trailerIndex || 0]?.key
    }`;
    setTrailer(trailerURL);
  }, [movie]);

  return (
    <div className="bg-zinc-600	text-white	 relative px-4 md:px-0">
      {isLoading && <Loading/>}
      {!movie  ?  (<Welcome />) : (
      
      <div className="container mx-auto  flex items-center relative min-h-[calc(100vh-75px)] ">
       
        <div className="flex-col lg:flex-row flex gap-10 lg:mx-30 py-30">
        
          <div className="space-y-6">
            <div className="uppercase -translate-y-3 text-[26px] md:text-[24px] font-medium pr-3">
              {movie?.title}
            </div>

            <div className="pt-12 space-y-2 pr-3">
              <div>Summary:</div>
              <div className="lg:line-clamp-4">{movie?.overview}</div>
            </div>

            <div className="flex flex-col">
              <div className="flex gap-5 flex-wrap"> Genres: {movie?.genres?.map((genre, index) => (
                <Genres
                  key={genre?.id}
                  index={index}
                  length={movie?.genres?.length}
                  name={genre?.name}
                />
              ))}</div>
            
              <div>Language: &nbsp; {movie?.original_language?.toUpperCase()}</div> 

              <div>Release:  &nbsp; {movie?.release_date}</div> 
              <div>Runtime:  &nbsp; {movie?.runtime} </div> 
              {/* <div>Poster:  &nbsp; {movie?.poster_path} </div>  */}
              <div>Rating/Stars:  &nbsp; {movie?.vote_average} / 10</div> 
              {/* <div>Popularity:  &nbsp; {movie?.popularity} </div>  */}
            </div>

            <div
              className="inline-block cursor-pointer pt-6 "
              onClick={() => setPlayer(true)}
            >
              <div className="flex gap-2 items-center bg-white text-black px-4 py-2 mb-6 hover:bg-[#b4b4b4]">
                <BsPlayFill size={24} />
                Watch Trailer
              </div>
            </div>
          </div>

          <div className="mx-auto flex-none relative">
            <Image className="w-[300px] object-cover rounded"
              src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
              width={700}
              height={700}
              alt="movie image"
              onLoadingComplete={() => setIsImgLoading(false)}
              priority
            />
            {/* {isImgLoading && <Loading />} */}
          </div>
         
        </div>

        
        {/* React Player */}
        <div
          className={`absolute top-3 inset-x-[7%] md:inset-x-[13%] rounded overflow-hidden transition duration-1000 ${
            player ? "opacity-100 z-50" : "opacity-0 -z-10"
          }`}
        >
          <div className="flex items-center justify-between bg-black text-[#f9f9f9] p-3.5">
            <span className="font-semibold">Playing Trailer</span>
            <div
              className="cursor-pointer w-8 h-8 flex justify-center items-center rounded-lg opacity-50 hover:opacity-75 hover:bg-[#0F0F0F]"
              onClick={() => setPlayer(false)}
            >
              <IoMdClose className="h-5" />
            </div>
          </div>
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              url={trailer}
              width="100%"
              height="90%"
              style={{ position: "absolute", top: "0", left: "0" }}
              controls={true}
              playing={player}
            />
          </div>
        </div>
      </div>)}
    </div>
  );
};

export default Home;
