import { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase'; // Fix the import path

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const signInIfNeeded = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error(error);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
      } else {
        const { data: signInData } = await supabase.auth.signInAnonymously();
        if (signInData.session) {
          setSession(signInData.session);
        }
      }
    };

    signInIfNeeded();
  }, []);

  const user = session?.user ?? null;
  const isAuthenticated = !!session;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
