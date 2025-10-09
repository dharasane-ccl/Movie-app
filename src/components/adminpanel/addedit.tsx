
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Movie, MovieFormErrors } from './types';

interface AddEditMovieModalProps {
    show: boolean;
    isEditing: boolean;
    movie: Movie;
    formErrors: MovieFormErrors | null;
    onClose: () => void;
    onSave: () => void;
    allGenres: string[];
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const AddEditMovieModal: React.FC<AddEditMovieModalProps> = ({
    show,
    isEditing,
    movie,
    formErrors,
    onClose,
    onSave,
    onInputChange,
    allGenres,
}) => {

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave();
    };
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title <span className='text-danger'>*</span></Form.Label>

                        <Form.Control
                            type="text"
                            name="title"
                            value={movie.title}
                            onChange={onInputChange}
                            isInvalid={!!formErrors?.title}

                        />
                        <Form.Control.Feedback type="invalid">{formErrors?.title}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={movie.description}
                            onChange={onInputChange}
                            isInvalid={!!formErrors?.description}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors?.description}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="genre">
                        <Form.Label>Genre <span className='text-danger'>*</span></Form.Label>
                        <Form.Select
                            name="genre"
                            value={movie.genre}
                            onChange={onInputChange}
                            isInvalid={!!formErrors?.genre}
                        >
                            <option value="">Select Genre...</option>
                            {allGenres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formErrors?.genre}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="year">
                        <Form.Label>Year <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="year"
                            value={movie.year}
                            onChange={onInputChange}
                            isInvalid={!!formErrors?.year}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors?.year}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="image" >
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="image"
                            value={movie.image}
                            onChange={onInputChange}
                            isInvalid={!!formErrors?.image}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors?.image}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="targetUrl">
                        <Form.Label>Target URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="targetUrl"
                            value={movie.targetUrl}
                            onChange={onInputChange}
                            isInvalid={!!formErrors?.targetUrl}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors?.targetUrl}</Form.Control.Feedback>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Save Changes' : 'Add Movie'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddEditMovieModal;
