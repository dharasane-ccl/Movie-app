import React, { useEffect, useMemo, useState } from 'react';
import { Movie } from '../types';
import { Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
  onView: (movie: Movie) => void;
}
const MovieTable: React.FC<MovieTableProps> = ({ movies, onEdit, onView, onDelete }) => {
  const [itemsPerPage,] = useState(5);
  const [currentPage,] = useState(1);
  const [filterTerm] = useState('');

  const filteredMovies = useMemo(() => {
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [movies, filterTerm]);

  useEffect(() => {
  }, [filterTerm]);

  const movieheaders = ["S.No", 'Title', "Description", "Year", "Genre", "Movie Url", "Actions"]
  return (
    <div className="table-container">
      <table className="table align-middle table-xxl w-100">
        <thead>
          <tr>
            {movieheaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredMovies.map((movie: Movie, index: number) => (
            <tr key={movie._id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td>{movie.year}</td>
              <td>{movie.genre}</td>
              <td>
                {movie.targetUrl ? (
                  <a href={movie.targetUrl} target="_blank" rel="noopener noreferrer" className='d-flex'>
                    watch
                  </a>
                ) : (
                  'No URL'
                )}
              </td>
              <td>
                <div className='d-flex '>
                  <Button variant="outline-white" size="lg" className="me-2" onClick={() => onEdit(movie)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button variant="outline-white" size="lg" className="me-2" onClick={() => onView(movie)}>
                    <i className="bi bi-eye"></i>
                  </Button>
                  <Button variant="outline-white" size="lg" className="me-2 " onClick={() => onDelete(movie._id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default MovieTable;
