import { User, Movie } from "../user/types";
import "bootstrap-icons/font/bootstrap-icons.css";
import Search from './search';
import React, { useState, useMemo, useEffect } from 'react';
import { Pagination } from "react-bootstrap";
import { WindowStack } from "react-bootstrap-icons";

interface MovieViewPageProps {
    user: User;
    movielists: Movie[];
    favoriteMovies: Movie[];
    onToggleFavorite: (id: string) => void;
    onLogout: () => void;

}

const getDisplayName = (user: User | null): string => {
    if (!user) return "";
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
    return name || user.email;
};

const MovieViewPage: React.FC<MovieViewPageProps> = ({
    user,
    onToggleFavorite,
    movielists,
    onLogout,
}) => {
    
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserInfo, setShowUserInfo] = useState(false);

    const filteredMovies = useMemo(() => {
        let lists = movielists;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            lists = lists.filter(movie =>
                movie.title.toLowerCase().includes(lowerSearchTerm)
            );
        }
        if (selectedGenre) {
            const lowerGenreFilter = selectedGenre.toLowerCase();
            lists = lists.filter(movie =>
                movie.genre?.toLowerCase() === lowerGenreFilter
            );
        }
        return lists;
    }, [movielists, searchTerm, selectedGenre]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredMovies]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);

    
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container my-3">
            {user && (
                <div
                    className="position-fixed top-5 end-0 m-2 mx-5 rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                    style={{ width: "40px", height: "40px", fontSize: "18px", cursor: "pointer", zIndex: 1050 }}
                    onClick={() => setShowUserInfo(!showUserInfo)}
                >
                    {getDisplayName(user)?.charAt(0).toUpperCase()}
                    {showUserInfo && (
                        <div
                            className="position-absolute bg-white shadow p-2 rounded end-0"
                            style={{ top: "50px", minWidth: "100px", zIndex: 1060 }}
                        >
                            <div className="fw-bold">{getDisplayName(user)}</div>
                            <div className="text-muted">{user.first_name}</div>
                            <button
                                className="btn btn-sm btn-link text-danger w-100 mt-2"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
            <h1>Movies</h1>
            <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
            />
            <div className="row mt-3">
                {currentItems.length > 0 ? (
                    currentItems.map((movie, index) => (
                        <div className="col-md-4 mb-4" key={movie._id}>
                            <div className="card h-50 shadow-sm"
                            style={{width:'400px'}}>
                                <a
                                    href={movie.targetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={movie.image}
                                        className="card-img-top"
                                        alt={movie.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                </a>
                                <div className="card-body position-relative">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{movie.genre}</h6>
                                    <h6 className="card-year">{movie.year}</h6>
                                    <p className="card-text">{movie.description}</p>
                                    <button
                                        className="position-absolute top-0 end-0 m-2"
                                        onClick={() => onToggleFavorite(movie._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.5rem',
                                            color: movie.isFavorite ? 'red' : 'black',
                                        }}
                                    >
                                        {movie.isFavorite ? (
                                            <i className="bi bi-heart-fill" />
                                        ) : (
                                            <i className="bi bi-heart" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center mt-4">
                        <p>No movies found matching your search and filter criteria.</p>
                    </div>
                )}
            </div>
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
export default MovieViewPage;
