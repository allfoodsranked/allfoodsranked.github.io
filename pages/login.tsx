import { Session } from '@supabase/supabase-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSession } from '../auth/auth-context';
import { LoginForm } from '../auth/login';

const Home: NextPage = () => {
  const session = useSession();

  return (
    <div>
      <h1 className="text-2xl p-4">Recipe Gen</h1>
      <LoginForm />
    </div>
  );
};

export default Home;
