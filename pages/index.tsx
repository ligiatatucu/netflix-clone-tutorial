
import { getSession} from 'next-auth/react';
import { NextPageContext } from 'next';
//hooks
import useCurrentUser from '@/hooks/useCurrentUser';
import useInfoModal from '@/hooks/useInfoModal';
//components
import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard'; 
import MoviesList from '@/components/MoviesList';
import useMoviesList from '@/hooks/useMoviesList';
import useFavorites from '@/hooks/useFavorites';
import InfoModal from '@/components/InfoModal';

//session for the client side
export async  function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if(!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  }

  return { props: {}}
}

export default function Home() {
  const {data: movies = []} = useMoviesList();
  const {data: favorites =[]} = useFavorites();
  const {isOpen, closeModal} = useInfoModal();

  return (
    <div>
      <InfoModal visible={isOpen} onClose={closeModal}/>
      <Navbar />
      <Billboard />
      <div className='pb-40'>
        <MoviesList data={movies} title="Trending Now"/>
        <MoviesList data={favorites} title="Trending Now"/>
      </div>

    </div>
  );
}
