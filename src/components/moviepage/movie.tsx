import React, { useState, useMemo, useEffect } from 'react';
import { Card, Row, Col, Form } from "react-bootstrap";
import { User, Movie } from "../user/types";
import "bootstrap-icons/font/bootstrap-icons.css";
import Search from './search';

interface MovieViewPageProps {
    user: User;
    movielists: Movie[];
    favoriteMovies: Movie[];
    onToggleFavorite: (id: string) => void;
    onLogout: () => void;
    isFavoritesPage: boolean;
    pageTitle: string
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
    pageTitle,
}) => {
    const heading = pageTitle || 'Default Page Heading';
    const [itemsperpage, setItemsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserInfo, setShowUserInfo] = useState(false);

    const currentItems = useMemo(() => {
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

        const indexOfLastItem = currentPage * itemsperpage;
        const indexOfFirstItem = indexOfLastItem - itemsperpage;
        return lists.slice(indexOfFirstItem, indexOfLastItem);
    }, [movielists, searchTerm, selectedGenre, currentPage, itemsperpage]);

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
    }, [searchTerm, selectedGenre, itemsperpage]);
    const totalPages = Math.ceil(filteredMovies.length / itemsperpage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    const paginationStatus = useMemo(() => {
        const totalFilteredItems = filteredMovies.length;
        if (totalFilteredItems === 0) {
            return "0-0 of 0";
        }
        const indexOfFirstItem = (currentPage - 1) * itemsperpage + 1;
        const indexOfLastItem = Math.min(currentPage * itemsperpage, totalFilteredItems);

        return `${indexOfFirstItem}-${indexOfLastItem} of ${totalFilteredItems}`;
    }, [filteredMovies, currentPage, itemsperpage]);

    return (
        <div className="container my-3">
            {user && (
                <div
                    className="position-fixed top-0 end-0 m-2 mx-5 rounded-circle bg-success text-white d-flex justify-content-center align-items-center "
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
            <h1>{heading}</h1>
            <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
            />

            <Row className="mt-3">
                {currentItems.length > 0 ? (
                    currentItems.map((movie) => (
                        <Col xs={12} md={6} lg={4} className="mb-4" key={movie._id}>
                            <Card className="h-100 shadow-sm d-flex flex-column">
                                <a
                                    href={movie.targetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Card.Img
                                        variant="top"
                                        src={movie.image}
                                        alt={movie.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                </a>

                                <Card.Body className="d-flex flex-column position-relative">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{movie.genre}</h6>
                                    <h6 className="card-year">{movie.year}</h6>
                                    <p className="card-text text-truncate flex-grow-1">{movie.description}</p>

                                    <button
                                        className="position-absolute top-0 end-0 m-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onToggleFavorite(movie._id)
                                        }
                                        }
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

                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col xs={12} className="text-center mt-4">
                        <p>No movies found matching your search and filter criteria.</p>
                    </Col>
                )}
            </Row>
            <div className="d-flex justify-content-end">
                <Form.Select
                    value={itemsperpage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    style={{ width: '67px' }}
                >
                    <option value="4">4 </option>
                    <option value="6">6 </option>
                    <option value="10">10 </option>
                    <option value="18">18</option>
                </Form.Select>
                <span className="text-muted my-2 mx-5">
                    {paginationStatus}
                </span>
            </div>
        </div>
    );
};
export default MovieViewPage;
