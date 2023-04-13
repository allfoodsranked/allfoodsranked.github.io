import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from '../auth/auth-context';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp
