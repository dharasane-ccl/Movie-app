import React, { useState, useMemo, useEffect } from 'react';
import { Card, Row, Col, Form, Pagination } from "react-bootstrap";
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
    pageTitle: string;
    genre?: string
}
const getDisplayName = (user: User | null): string => {
    if (!user) return "";
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
    return name || user.email;
};

const MovieViewPage: React.FC<MovieViewPageProps> = ({
    user,
    movielists,
    onToggleFavorite,
    pageTitle,
}) => {
    const heading = pageTitle || 'Default Page Heading';
    const [itemsperpage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserInfo, setShowUserInfo] = useState(false);

    const filteredLists = useMemo(() => {
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

    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsperpage;
        const indexOfFirstItem = indexOfLastItem - itemsperpage;
        return filteredLists.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredLists, currentPage, itemsperpage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedGenre, itemsperpage]);

    const totalPages = Math.ceil(filteredLists.length / itemsperpage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
    };
    const paginationStatus = useMemo(() => {
        const totalFilteredItems = filteredLists.length;
        if (totalFilteredItems === 0) {
            return "0-0 of 0";
        }
        const indexOfFirstItem = (currentPage - 1) * itemsperpage + 1;
        const indexOfLastItem = Math.min(currentPage * itemsperpage, totalFilteredItems);

        return `${indexOfFirstItem}-${indexOfLastItem} of ${totalFilteredItems}`;
    }, [filteredLists, currentPage, itemsperpage]);

    return (
        <div className="container my-5">
            {user && (
                <div
                    className="position-fixed top-0 my-1 end-0 m-2 mx-5 rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                    style={{ width: "40px", height: "40px", fontSize: "18px", cursor: "pointer", zIndex: 1050 }}
                    onClick={() => setShowUserInfo(!showUserInfo)}
                >
                    {getDisplayName(user)?.charAt(0).toUpperCase()}

                    {showUserInfo && (
                        <div
                            className="position-absolute bg-white shadow p-2 py-4 rounded end-0"
                            style={{ top: "50px", minWidth: "200px", zIndex: 1060 }}
                        >

                            <div className="fw-bold py-1 mb-0 text-black">
                                {getDisplayName(user)}

                            </div>
                            {user?.employee_code && (
                                <div className="text-secondary py-1 mb-0">
                                    Emp. ID: {user.employee_code}
                                </div>
                            )}

                            {user?.email && (
                                <div>
                                    <a
                                        href={`https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=new}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                    >
                                        {user.email}
                                    </a>
                                </div>
                            )}
                        </div>

                    )}
                </div>
            )}
            <h1 className='mx-3 '>{heading}</h1>
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

                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.5rem',
                                            color: movie.isFavorite ? 'red' : 'black',
                                        }}
                                    >
                                        {movie.isFavorite ? (
                                            <i className="bi bi-heart-fill"></i>
                                        ) : (
                                            <i className="bi bi-heart"></i>
                                        )}
                                    </button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No movies found matching your criteria.</p>
                    </Col>
                )}
            </Row>
            <div className="d-flex justify-content-end align-items-end ">
                <div className="d-flex align-items-center">
                    <Form.Group as={Row} className="align-items-end my-0">
                        <Form.Label column xs="auto" className="me-2 my-0 ">
                            Rows per page:
                        </Form.Label>
                        <Col xs="auto" >
                            <Form.Select value={itemsperpage} onChange={handleItemsPerPageChange}>
                                <option value='5'>5</option>
                                <option value='10'>10</option>
                                <option value='50'>50</option>
                                <option value='100'>100</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </div>

                <div className="d-flex align-items-center">
                    <span className="me-3 text-muted mx-2">{paginationStatus}
                    </span>

                    <Pagination className='lusdt' my-0 >
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

        </div>
    );
};

export default MovieViewPage;
