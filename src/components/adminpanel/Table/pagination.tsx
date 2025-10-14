import { Pagination as BootstrapPagination, Form } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    paginationStatus: string;
    itemsPerPage: number; 
    setItemsPerPage: (perPage: number) => void; 
}

const PaginationComponent = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    paginationStatus,
    itemsPerPage, 
    setItemsPerPage,
}: PaginationProps) => {
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

    return (
        <div className="d-flex justify-content-end align-items-center mt-4">
            <div className="d-flex align-items-center me-3">
                <Form.Label className="me-2 mb-0">Rows per page:</Form.Label>
                <Form.Select
                    value={itemsPerPage} 
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    style={{ width: '80px' }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                     <option value="100">100</option>

                </Form.Select>
            </div>
            <span className="me-3 text-muted">{paginationStatus}</span>
            <BootstrapPagination className='mb-0'>
                <BootstrapPagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label='Previous'
                >
                    <i className="bi bi-caret-left-fill" aria-hidden="true"></i>
                </BootstrapPagination.Prev>
                <BootstrapPagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label='Next'
                >
                    <i className="bi bi-caret-right-fill" aria-hidden="true"></i>
                </BootstrapPagination.Next>
            </BootstrapPagination>
        </div>
    );
};

export default PaginationComponent;
