import type { NextPage } from 'next';
import { useSession } from '../auth/auth-context';
import { Vote } from '../components/vote';
import { RequireAuth } from '../auth/with-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../db/client';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <RequireAuth>
      <div className="mx-4 my-6">
        <form
          className="grid grid-cols-1 mx-auto"
          onSubmit={async (e) => {
            e.preventDefault();
            console.log(e.target);
            const form = new FormData(e.currentTarget);
            console.log(form.get('name')?.toString());
            const name = form.get('name')?.toString();
            if (name && name.length > 0) {
              e.currentTarget.reset();
              await supabase.from('foods').insert({ name });
            }
          }}
        >
          <h2 className="text-2xl mb-2">Add New Foods for Voting</h2>
          <input type="text" name="name" required />
          <button type="submit">add food</button>
        </form>
      </div>
    </RequireAuth>
  );
};

export default Home;
