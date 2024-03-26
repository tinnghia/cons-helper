import { FC } from 'react';
import './ConfirmationModal.css'; // Import your CSS file for component styling

interface ConfirmationProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}
const ConfirmationModal: FC<ConfirmationProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <p>{message}</p>
                <div className="button-container">
                    <button className="confirm-button" onClick={onConfirm}>Yes</button>
                    <button className="cancel-button" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
