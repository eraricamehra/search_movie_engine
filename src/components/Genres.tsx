import React from "react";

interface IMovieGenres {
    index: number;
    name: string;
    length: number | undefined;
}

const Genres: React.FC<IMovieGenres> = ({ index, name, length}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <div ><strong>{name}</strong></div>
      <div className="text-white">{index + 1 !== length ? "/" : ""}</div>
    </div>
  );
};

export default Genres;
