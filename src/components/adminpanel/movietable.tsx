import React, { useEffect, useMemo, useState } from 'react';
import { Movie } from './types';
import { Button, Form, Pagination } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
  onView: (movie: Movie) => void;
}

const MovieTable: React.FC<MovieTableProps> = ({ movies, onEdit, onView, onDelete }) => {

  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [currentPage, setCurrentPage] = useState(1);
  const [filterterm] = useState('')

  const filteredMovies = useMemo(() => {
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(filterterm.toLowerCase())
    );
  }, [movies]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredMovies.length / itemsPerPage);
  }, [filteredMovies, itemsPerPage]);

  const paginatedMovies = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredMovies.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredMovies, currentPage, itemsPerPage]);

  const paginationStatus = useMemo(() => {
    const totalFilteredItems = filteredMovies.length;
    if (totalFilteredItems === 0) {
      return "0-0 of 0";
    }
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalFilteredItems);

    return `${indexOfFirstItem}-${indexOfLastItem} of ${totalFilteredItems}`;
  }, [filteredMovies, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterterm, itemsPerPage]);

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
            <th>Movie Url</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMovies.map((movie: Movie, index: number) => (
            <tr key={movie._id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{movie.title}</td>
              <td>{movie.description}
              </td>
              <td>{movie.year}</td>
              <td>{movie.genre}</td>
              <td>
                {movie.image ? (
                  <img src={movie.image} alt={movie.title} style={{ width: '100px', height: '100px' }} />
                ) : (
                  'No Image'
                )}
              </td>
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
      <div className="d-flex justify-content-end">

        <Form.Select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          style={{ width: '67px' }}
        >
          <option value="5">5</option>
          <option value="10">10 </option>
          <option value="50">50 </option>
          <option value="100">100</option>
        </Form.Select>
        <span className="text-muted my-2 mx-5">
          {paginationStatus}
        </span>
        <Pagination >
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous"
          >
            <i className="bi bi-caret-left-fill" aria-hidden="true"></i>
          </Pagination.Prev>
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next"
          >
            <i className="bi bi-caret-right-fill" aria-hidden="true"></i>
          </Pagination.Next>
        </Pagination>
      </div>
    </div>
  );
};
export default MovieTable;
