import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { toast } from 'react-toastify';

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
    const [movies, setMovies] = useState<Movie[]>(() => {
        try {
            const savedMovies = localStorage.getItem('movies');
            return savedMovies ? JSON.parse(savedMovies) : (Lists as Movie[]);
        } catch (error) {
            console.error("Failed to parse movies from local storage:", error);
            return Lists as Movie[];
        }
    });
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
    const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
    const [isEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('movies', JSON.stringify(movies));
    }, [movies]);


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
        let processedValue: string | number = value;


        if (name === 'year') {
            const sanitizedValue = value.replace(/[^0-9]/g, '');
            processedValue = sanitizedValue === '' ? '' : parseInt(sanitizedValue) || 0;
        } else {
            processedValue = value;
        }

        if (editingMovie) {
            setEditingMovie({ ...editingMovie, [name]: processedValue });
        } else {
            setNewMovie({ ...newMovie, [name]: processedValue });
        }
    };

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

    useEffect(() => {
        checkUserStatus();
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
        const currentYear = new Date().getFullYear();
        const minYear = 1888;
        if (!movie.year) {
            errors.year = 'Year is required.';
        } else if (isNaN(Number(movie.year))) {
            errors.year = 'Year must be a number.';
        } else if (Number(movie.year) < minYear || Number(movie.year) > currentYear) {
            errors.year = `Year must be between ${minYear} and ${currentYear}.`;
        }
        if (movie.targetUrl && !/^(ftp|http|https):\/\/[^ "]+$/.test(movie.targetUrl)) errors.targetUrl = 'Invalid Target URL format.';
        return errors;
    }, []);

    const handleCreate = () => {
        const errors = validateMovie(newMovie);
        if (Object.keys(errors).length > 0) {
            setAddFormErrors(errors);
            return;
        } const isTitleTaken = movies.some(movie => movie.title === newMovie.title);

        if (isTitleTaken) {
            setAddFormErrors({ ...errors, title: "A movie title already exists" });
            return;
        }

        setMovies(prevMovies => [{ ...newMovie, _id: uuidv4() }, ...prevMovies]);
        setCurrentPage(1)
        handleCloseAddModal();
        toast.success(`Movie "${newMovie.title}" added successfully!`, { position: "top-right", className: "bg-success text-white" });
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
        toast.success(`Movie "${editingMovie.title}" updated successfully!`, { position: "top-right", className: "bg-success text-white" });
    };

    const handleDelete = (deletingMovieId: string) => {
        if (!deletingMovieId) return;

        const movieTitle = movies.find(m => m._id === deletingMovieId)?.title;
        setMovies(prevMovies => prevMovies.filter(m => m._id !== deletingMovieId));

        handleCloseDeleteConfirmModal();

        toast.success(`Movie "${movieTitle}" deleted successfully.`, { position: "top-right", className: "bg-success text-white" });
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


    return (
        <div className="container mt-4">
            {isLoading ? (
                <div className="position-fixed top-0 my-0 end-0 m-2 mx-5" style={{ zIndex: 1050 }}>
                    Loading...
                </div>
            ) : user ? (
                <div
                    className="position-fixed top-0 end-0 m-2 mx-5 rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
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
            ) : (
                <div className="position-fixed top-5 end-0 m-2 mx-5" style={{ zIndex: 1050 }}>
                </div>
            )}
            <h2 className="mb-4 mx-2 my-5">Master Movies</h2>
            <Row className="mb-4 align-items-center" >
                <Col md={4} className="mb-2 mb-md-0 px-3" >
                    <input
                        type="text"
                        className="form-control "
                        style={{ marginRight: '10px' }}
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={4} className="mb-2 mb-md-0 px-3" >
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

                <Col md={4} className="mb-2 mb-md-0 d-flex justify-content-md-end ">
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