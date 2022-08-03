import { useState, useEffect } from 'react';
import Container from './Container/Container';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { Notify } from 'notiflix';
import fetchResult from '../services/Api';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Notification from './Notification/Notification';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(Status.IDLE);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [hits, setHits] = useState(null);
  const [results, setResults] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();
    const query = event.target.elements[1].value;
    setPage(1);
    setResults(null);
    setHits(null);
    setError(null);

    if (query.trim() === '') {
      Notify.failure('Type search query');
      event.target.reset();
      return;
    }
    setSearchQuery(query);
    event.target.reset();
  };

  const loadMore = () => {
    setPage(page => page + 1);
    return;
  };

  useEffect(() => {
    async function getResponse() {
      setStatus(Status.PENDING);
      const response = await fetchResult(searchQuery, page)
        .then(response => {
          if (results !== null) {
            setResults([...results, ...response.hits]);
            setStatus(Status.RESOLVED);
            return;
          }
          setResults(response.hits);
          setStatus(Status.RESOLVED);
          setHits(response.totalHits);
        })
        .catch(error => {
          setError(error);
          setStatus(Status.REJECTED);
        });

      setTimeout(() => {
        window.scrollBy({
          top: 9999,
          behavior: 'smooth',
        });
      }, '500');

      return response;
    }
    if (searchQuery) {
      getResponse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page]);

  const PENDING = status === 'pending';
  const RESPONSE = results && results.length > 0;
  const IMAGE_LIMIT = RESPONSE && results.length >= 500;
  const LOW_IMAGE_COUNT = RESPONSE && hits === results.length;

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      {RESPONSE && <ImageGallery images={results} />}
      {RESPONSE && !PENDING && !IMAGE_LIMIT && !LOW_IMAGE_COUNT && (
        <Button loadMore={loadMore} />
      )}
      {!PENDING && IMAGE_LIMIT && (
        <Notification>Sorry, 500 images limit</Notification>
      )}
      {PENDING && <Loader />}
    </Container>
  );
}
