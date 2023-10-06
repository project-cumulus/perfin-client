import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface RemoveSubModalProps {
    show: boolean | undefined
    handleClose: () => void
    processDelete: (id: number) => void
    subIDtoDelete: number
}

const RemoveSubModal: React.FC<RemoveSubModalProps> = ({ show, handleClose, processDelete, subIDtoDelete }: RemoveSubModalProps) => {

    return (
        <Modal
            show={show}

            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete Warning
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Are you sure you want to remove?</h4>
                <p>
                    This action cannot be undone!
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>Go Back</Button>
                <Button onClick={() => processDelete(subIDtoDelete)}>Delete</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RemoveSubModal;