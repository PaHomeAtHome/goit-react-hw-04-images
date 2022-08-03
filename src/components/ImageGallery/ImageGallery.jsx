import { useState } from 'react';
import { ImageGalleryStyled } from './ImageGalleryStyled';

import Modal from 'components/Modal/Modal';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
export default function ImageGallery({ images }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const toggleModal = () => {
    setModalOpen(open => !open);
  };

  const closeModal = event => {
    if (event.key === 'Escape') {
      setModalOpen(false);
    }
  };

  const setImage = image => {
    setCurrentImage(image);
  };

  const closeModalState = () => {
    setModalOpen(false);
  };

  return (
    <ImageGalleryStyled className="gallery">
      {images.map(image => (
        <ImageGalleryItem
          image={image}
          toggleModal={toggleModal}
          setImage={setImage}
          key={image.id}
        />
      ))}
      {isModalOpen && (
        <Modal
          image={currentImage}
          closeModal={closeModal}
          closeModalState={closeModalState}
        />
      )}
    </ImageGalleryStyled>
  );
}
