"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Home from "./Home";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const fetchMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`?movie=${query}`);
    setQuery("");
  };

  return (
    <div className="bg-cyan-700	 pt-4 py-4 px-4 md:px-2">
      <div className="flex container mx-auto  justify-between items-center">
        <Link href="/">
          <div className="text-[30px] font-serif font-normal"> Erarica's Movie Search engine</div>
        </Link>

        <form onSubmit={fetchMovie}>
          <div>
            <input
              className="bg-slate-400 px-16 py-4 outline-1 placeholder:text-white"
              value={query}
              type="text"
              placeholder="Search a Movie here...."
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Navbar;
