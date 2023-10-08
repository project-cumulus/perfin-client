import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ISubscription } from '../../types';
import EditSubForm from './EditSubForm';
import './Subscription.css'

interface EditSubModalProps {
    show: boolean | undefined
    handleEditModalClose: () => void
    subscriptionToEdit: ISubscription | undefined
    getSubscriptions: () => void
};

const EditSubModal: React.FC<EditSubModalProps> = ({
    show,
    handleEditModalClose,
    subscriptionToEdit,
    getSubscriptions
}: EditSubModalProps) => {

    return (
        <Modal
            show={show}
            onHide={handleEditModalClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Subscription
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="edit_subscription_form">
                    <img src={subscriptionToEdit?.company_logo_url} alt={subscriptionToEdit?.subscription_name} />
                    <EditSubForm
                        handleEditModalClose={handleEditModalClose}
                        getSubscriptions={getSubscriptions}
                        subscriptionToEdit={subscriptionToEdit}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleEditModalClose}>Go Back</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditSubModal;