import useSwr from 'swr';
import fetcher from '@/libs/fetcher';

const useMovies = (classifier = 'movie') => {
  const endpoint = classifier === 'movie' ? '/api/movies' : `/api/movies?classifier=${classifier}`;
  const { data, error, isLoading } = useSwr(endpoint, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading
  };
};

export default useMovies;
