import { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '@/pages/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;