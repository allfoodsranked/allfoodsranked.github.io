import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../db/client';

const AuthContext = createContext<{ session: Session | null }>({
  session: null,
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then((s) => setSession(s.data.session))

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}

export function useSession() {
  try {
    const auth = useContext(AuthContext);
    return auth.session;
  } catch(e) {
    return null;
  }
}
