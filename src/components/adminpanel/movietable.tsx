import React, { useEffect, useMemo, useState } from 'react';
import { Movie } from './types';
import { Button, Col, Form, Pagination, Row } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
  onView: (movie: Movie) => void;
}

const MovieTable: React.FC<MovieTableProps> = ({ movies, onEdit, onView, onDelete }) => {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTerm] = useState('');

  const filteredMovies = useMemo(() => {
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [movies, filterTerm]);

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
  }, [filterTerm, itemsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      <table className="table align-middle table-xxl w-100">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Description</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Movie Url</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMovies.map((movie: Movie, index: number) => (
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
      <div className="d-flex justify-content-end align-items-center mt-4">
        <div className="d-flex align-items-center me-3">
          <Form.Label className="me-2 mb-0">
            Rows per page:
          </Form.Label>
          <Form.Select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={{ width: '80px' }}
          >
            <option value="5">5 </option>
            <option value="10">10</option>
            <option value="50">50 </option>
            <option value="100">100</option>
          </Form.Select>
        </div>
        <span className="me-3 text-muted">
          {paginationStatus}
        </span>
        <Pagination className='mb-0'>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label='previous'
          >
            <i className="bi bi-caret-left-fill" aria-hidden="true"></i>
          </Pagination.Prev>
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label='Next'
          >
            <i className="bi bi-caret-right-fill" aria-hidden="true"></i>
          </Pagination.Next>
        </Pagination>
      </div>
    </div>

  );
};
export default MovieTable;
