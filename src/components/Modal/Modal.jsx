import { useEffect } from 'react';
import { OverlayStyled } from './Overlay';
import { ModalStyled } from './ModalStyled';

import * as ReactDOM from 'react-dom';

export default function Modal({ image, closeModal, closeModalState }) {
  useEffect(() => {
    document.addEventListener('keydown', closeModal);

    return () => {
      document.removeEventListener('keydown', closeModal);
    };
  });

  const closeModalOverlay = e => {
    if (e.target === document.querySelector(`.modal-overlay`)) {
      closeModalState();
    }
  };

  return ReactDOM.createPortal(
    <OverlayStyled className="modal-overlay" onClick={closeModalOverlay}>
      <ModalStyled>
        <img src={image.largeImageURL} alt={image.tags} />
      </ModalStyled>
    </OverlayStyled>,
    document.getElementById('modal')
  );
}
