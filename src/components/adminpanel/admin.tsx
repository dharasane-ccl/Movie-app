import React, { useState, useEffect, useCallback, useMemo } from 'react';
import react from "react-select";
import { v4 as uuidv4 } from 'uuid';
import Lists from '../moviepage/movie-list';
import { Movie, User } from "./types";
import { Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MovieTable from './movietable';
import AddEditMovieModal from './addedit';
import ViewMovieModal from './viewmodal';
import DeleteConfirmModal from './delete';
import { title } from 'process';
import Select from "react-select";



interface MovieFormErrors {
    user?: User;
    title?: string;
    description?: string;
    genre?: string;
    year?: string;
    image?: string;
    targetUrl?: string;
}
const initialNewMovieState: Movie = {
    _id: '',
    title: '',
    description: '',
    genre: '',
    image: '',
    isFavorite: false,
    year: 0,
    targetUrl: '',
};

const getDisplayName = (currentUser: User | null): string => {
    if (!currentUser) return "";
    const name = [currentUser.first_name, currentUser.last_name].filter(Boolean).join(" ").trim();
    return name || currentUser.email;
};
const AdminPanel: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterGenre, setFilterGenre] = useState<string>('All');
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [deletingMovieId, setDeletingMovieId] = useState<string | null>(null);
    const [newMovie, setNewMovie] = useState<Movie>(initialNewMovieState);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showViewModal, setShowViewModal] = useState<boolean>(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
    const [viewingMovie, setViewingMovie] = useState<Movie | null>(null);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [addFormErrors, setAddFormErrors] = useState<MovieFormErrors | null>(null);
    const [editFormErrors, setEditFormErrors] = useState<MovieFormErrors | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const allGenres = useMemo(() => {
        return Array.from(new Set(movies.map(movie => movie.genre)));
    }, [movies]);

    const genreOptions = useMemo(() => {
        const options = allGenres.map(genre => ({ value: genre, label: genre }));
        return [{ value: "All", label: "All Genres" }, ...options];
    }, [allGenres]);

    const selectedGenreOption = useMemo(() => {
        return genreOptions.find(option => option.value === filterGenre) || { value: 'All', label: 'All Genres' };
    }, [filterGenre, genreOptions]);

    const handleGenreChange = (option: any) => {
        setFilterGenre(option.value);
    };

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
        const { name, value } = e.target;
        const processedValue = name === 'year' ? parseInt(value) || 0 : value;

        if (editingMovie) {
            setEditingMovie({ ...editingMovie, [name]: processedValue });
        } else {
            setNewMovie({ ...newMovie, [name]: processedValue });
        }
    };

    useEffect(() => {
        const checkUserStatus = () => {
            setIsLoading(true);
            try {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to parse user data from localStorage:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserStatus();
        setMovies(Lists as Movie[]);
    }, []);


    const filteredMovies = useMemo(() => {
        return movies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = filterGenre === 'All' || movie.genre === filterGenre;
            return matchesSearch && matchesGenre;
        });
    }, [movies, searchTerm, filterGenre]);

    const validateMovie = useCallback((movie: Movie): MovieFormErrors => {
        let errors: MovieFormErrors = {};
        if (!movie.title.trim()) errors.title = 'Title is required.';
        if (!movie.description.trim()) errors.description = 'Description is required.';
        if (!movie.genre.trim()) errors.genre = 'Genre is required.';
        if (!movie.year || movie.year <= 0 || isNaN(movie.year)) errors.year = 'Year must be a positive number.';
        if (movie.targetUrl && !/^(ftp|http|https):\/\/[^ "]+$/.test(movie.targetUrl)) errors.targetUrl = 'Invalid Target URL format.';
        return errors;
    }, []);

    const handleCreate = () => {
        const errors = validateMovie(newMovie);
        if (Object.keys(errors).length > 0) {
            setAddFormErrors(errors);
            return;
        }
        setMovies(prevMovies => [{ ...newMovie, _id: uuidv4() }, ...prevMovies]);
        setCurrentPage(1)
        handleCloseAddModal();
    };

    const handleUpdate = () => {
        if (!editingMovie) return;
        const errors = validateMovie(editingMovie);
        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            return;
        }
        setMovies(prevMovies => prevMovies.map(m => m._id === editingMovie._id ? editingMovie : m));
        handleCloseEditModal();
    };

    const handleDelete = (id: string) => {
        setMovies(prevMovies => prevMovies.filter(m => m._id !== id));
        handleCloseDeleteConfirmModal();
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setAddFormErrors(null);
        setNewMovie(initialNewMovieState);
    };
    const handleShowAddModal = () => setShowAddModal(true);
    const handleOpenEditModal = (movie: Movie) => {
        setEditingMovie(movie);
        setEditFormErrors(null);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingMovie(null);
        setEditFormErrors(null);
    };
    const handleView = (movie: Movie) => {
        setViewingMovie(movie);
        setShowViewModal(true);
    };
    const handleCloseViewModal = () => {
        setViewingMovie(null);
        setShowViewModal(false);
    };
    const handleOpenDeleteConfirmModal = (id: string) => {
        setDeletingMovieId(id);
        setShowDeleteConfirmModal(true);
    };
    const handleCloseDeleteConfirmModal = () => {
        setDeletingMovieId(null);
        setShowDeleteConfirmModal(false);
    };

    const onLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        setUser(null);
        setShowUserInfo(false);
    };
    return (
        <div className="container mt-4">
            {isLoading ? (
                <div className="position-fixed top-5 end-0 m-2 mx-5" style={{ zIndex: 1050 }}>
                    Loading...
                </div>
            ) : user ? (
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
                            <div className="text-muted">{user.email}</div>
                            <button
                                className="btn btn-sm btn-link text-danger w-100 mt-2"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="position-fixed top-5 end-0 m-2 mx-5" style={{ zIndex: 1050 }}>
                </div>
            )}
            <h2 className="mb-4">Admin Page</h2>
            <Row className="mb-4 align-items-center">
                <Col md={4} className="mb-2 mb-md-0 px-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={4} className="mb-2 mb-md-0 px-5">
                    <Select
                        options={genreOptions}
                        value={selectedGenreOption}
                        onChange={handleGenreChange}
                        menuPlacement="auto"
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                    />
                </Col>
                <Col md={4} className="mb-2 mb-md-0 d-flex justify-content-md-end">
                    {user && (
                        <Button variant="primary" onClick={handleShowAddModal}>
                            Add New Movie
                        </Button>
                    )}
                </Col>
            </Row>
            {user && (
                <MovieTable
                    movies={filteredMovies}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteConfirmModal}
                    onView={handleView}
                />
            )}
            <AddEditMovieModal
                show={showAddModal || showEditModal}
                isEditing={!!editingMovie}
                movie={editingMovie || newMovie}
                formErrors={editingMovie ? editFormErrors : addFormErrors}
                onSave={editingMovie ? handleUpdate : handleCreate}
                onClose={editingMovie ? handleCloseEditModal : handleCloseAddModal}
                onInputChange={handleInputChange}
                allGenres={allGenres}
            />
            {editingMovie && (
                <AddEditMovieModal
                    show={showEditModal}
                    isEditing={true}
                    movie={editingMovie}
                    formErrors={editFormErrors}
                    onSave={handleUpdate}
                    onClose={handleCloseEditModal}
                    onInputChange={handleInputChange}
                    allGenres={allGenres} />
            )}
            {viewingMovie && (
                <ViewMovieModal
                    show={showViewModal}
                    onClose={handleCloseViewModal}
                    movie={viewingMovie}
                />
            )}
            <DeleteConfirmModal
                show={showDeleteConfirmModal}
                onClose={handleCloseDeleteConfirmModal}
                onConfirm={() => deletingMovieId && handleDelete(deletingMovieId)}
                movieTitle={title}
                onDelete={handleDelete as any}
            />
        </div>
    );
};


export default AdminPanel;
