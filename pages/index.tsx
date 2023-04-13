import type { NextPage } from 'next';
import { useSession } from '../auth/auth-context';
import { Vote } from '../components/vote';
import { RequireAuth } from '../auth/with-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../db/client';
import Link from 'next/link';

const Home: NextPage = () => {
  const query = useQuery(['rankings'], async () => {
    const data = await supabase.from('rankings').select('*')
    return data;
  })
  const rankings = query.data?.data ?? []
  return (
    <>
      <h1 className='text-4xl'>ALL FOODS RANKED</h1>
      <div className="grid grid-cols-1 text-center">
        <div className="my-4">
          <h2>Top Foods</h2>
          <ol>
            {rankings.slice(0, 10).map((v, index) => (
              <li key={v.name}>{index+1}. {v.name}</li>
            ))}
          </ol>
        </div>
      <Link 
        href="/vote"
      >
        VOTE HERE
      </Link>
      </div>
    </>
  );
}

export default Home;