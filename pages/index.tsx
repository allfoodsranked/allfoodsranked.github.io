import { Session } from '@supabase/supabase-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { useSession } from '../auth/auth-context';
import { LoginForm } from '../auth/login';
import { Vote } from '../components/vote';

const Home: NextPage = () => {
  const session = useSession();

  if (!session)
    return (
      <div>
        <LoginForm />
      </div>
    );

  return (
    <div className="grid grid-cols-1">
      <Vote />
    </div>
  );
};

export default Home;
