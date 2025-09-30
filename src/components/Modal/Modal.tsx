import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import css from "./Modal.module.css";

const modalRoot = document.getElementById('modal-root') as HTMLElement; 
interface ModalProps{
  children : ReactNode;
  onClose: ()=> void;
}
export default function Modal({ children, onClose }: ModalProps) {

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  

  const handleBackdropClick = (e:React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className={css.backdrop} 
      role="dialog" 
      aria-modal="true" 
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        {children}
      </div>
    </div>,
    modalRoot 
  );
}