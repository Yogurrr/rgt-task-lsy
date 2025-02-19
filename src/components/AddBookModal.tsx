import { FC } from 'react';

interface ModalProps {
  isOpen: boolean;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const AddBookModal: FC<ModalProps> = ({ isOpen, onConfirm, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">{title}</h2>
                <div>{children}</div>
                <div className="modal-footer">
                    <button onClick={onConfirm} className="modal-confirm-btn" style={{ marginRight: '2%' }}>확인</button>
                    <button onClick={onClose} className="modal-close-btn">닫기</button>
                </div>
            </div>
        </div>
    );
};

export default AddBookModal;