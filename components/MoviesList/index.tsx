import React from "react";
import {isEmpty} from 'lodash'

import MovieCard from "../MovieCard";

interface Movie {
    id: string;
    thumbnailUrl: string;
    duration: string;
    genre: string;
  }

interface MoviesListProps {
    data:Movie[],
    title: string
}

const MoviesList:React.FC<MoviesListProps> = ({data, title}) => {
    if(isEmpty(data)) return null;


    return (
        <div className="px-4 md:px-12 mr-4 space-y-8">
            <div>
                <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
                    {title}
                </p>
                <div className="grid grid-cols-4 gap-2">
                    {data.map((movie) => (
                    
                        <div key={movie.id}>
                            <MovieCard data={movie} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MoviesList;