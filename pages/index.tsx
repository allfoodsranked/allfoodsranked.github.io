import type { NextPage } from 'next';
import { useSession } from '../auth/auth-context';
import { Vote } from '../components/vote';
import { RequireAuth } from '../auth/with-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../db/client';

const Home: NextPage = () => {
  const query = useQuery(['rankings'], async () => {
    const data = await supabase.rpc('get_rankings')
    return data;
  })
  const rankings = query.data?.data ?? []
  return (
    <RequireAuth>
      <div className="grid grid-cols-12">
        <div className='col-span-1'>
          <h1>Top Foods</h1>
          <ol>
            {rankings.slice(0, 10).map((v, index) => (
              <li key={v.name}>{index+1}. {v.name}</li>
            ))}
          </ol>
        </div>
      <div className='col-span-10'>
        <Vote />
      </div>
      </div>
    </RequireAuth>
  );
}

export default Home;