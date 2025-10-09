import React from 'react';
import { Modal, Button } from 'react-bootstrap';


interface DeleteConfirmModalProps {
    show: boolean;
    onClose: () => void;
    onDelete: () => void;
    onConfirm: () => void;
    movieTitle: string;

}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ show, onClose, onConfirm }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this movie.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="danger" onClick={onConfirm}>Delete</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default DeleteConfirmModal;