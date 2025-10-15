import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Movie } from './types';

interface ViewMovieModalProps {
    show: boolean;
    onClose: () => void;
    movie: Movie | null;
}

const ViewMovieModal: React.FC<ViewMovieModalProps> = ({ show, onClose, movie }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{movie?.title} Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {movie ? (
                    <div>
                        <p><strong>Title:</strong> {movie.title}</p>
                        <p><strong>Description:</strong> {movie.description}</p>
                        <p><strong>Year:</strong> {movie.year}</p>
                        <p><strong>Genre:</strong> {movie.genre}</p>
                        {movie.image && (
                            <div className="my-3">
                                <p><strong>Image:</strong></p>
                                <img src={movie.image} alt={movie.title} style={{ maxWidth: '100%' }} /> 
                            </div>
                        )}
                        {movie.targetUrl && (
                            <div className="my-3">
                                <p><strong>Target URL:</strong></p>
                                <a href={movie.targetUrl} target="_blank" rel="noopener noreferrer">
                                    {movie.targetUrl}
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No movie details available.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ViewMovieModal;