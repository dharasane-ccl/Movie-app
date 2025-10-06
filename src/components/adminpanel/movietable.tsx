import React, { useState } from 'react';
import { Movie } from './types';
import { Button, Pagination } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
  onView: (movie: Movie) => void;
  
}

const MovieTable: React.FC<MovieTableProps> = ({ movies, onEdit, onView, onDelete }) => {
 
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = movies.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Description</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Movie Poster</th>
            <th>Movie URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((movie, index) => (
            <tr key={movie._id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td>{movie.year}</td>
              <td>{movie.genre}</td>
              <td>
                {movie.image ? (
                  <img src={movie.image} alt={movie.title} style={{ width: '100px', height: 'auto' }} />
                ) : (
                  'No Image'
                )}
              </td>
              <td>
                {movie.targetUrl ? (
                  <a href={movie.targetUrl} target="_blank" rel="noopener noreferrer">
                    Click Here to Watch
                  </a>
                ) : (
                  'No URL'
                )}
              </td>
              <td>
                <Button variant="outline-white" size="lg" className="me-2" onClick={() => onEdit(movie)}>
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button variant="outline-white" size="lg" className="me-2" onClick={() => onView(movie)}>
                  <i className="bi bi-eye"></i>
                </Button>
                <Button variant="outline-white" size="lg" onClick={() => onDelete(movie._id)}>
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </div>
  );
};
export default MovieTable;
