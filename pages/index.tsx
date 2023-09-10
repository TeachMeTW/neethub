import useCurrentUser from '@/hooks/useCurrentUser';
import { NextPageContext } from 'next';
import { getSession, signOut } from 'next-auth/react';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function Home() {
  const { data: user } = useCurrentUser();
  return (
    <>
    <h1 className="text-2xl text-blue-500">
      Hello world!
    </h1>
    <p> Logged in as {user?.email}</p>
    <button onClick={() => signOut()}>Sign out</button>
    </>
  )
}