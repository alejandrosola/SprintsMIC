import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/components/Theme';
import type { AppProps } from 'next/app';
import MainLayout from '@/layouts/MainLayout';
import { LanguageProvider } from '@/components/Language/LanguageProvider';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<LanguageProvider>
		<SessionProvider session={session}>
			<ThemeProvider theme={theme}>
        <Head>
          <link rel="icon" href="/icono_pequeno_Mesa_de_trabajo_1.svg" />
        </Head>
				<Component {...pageProps} />
			</ThemeProvider>
		</SessionProvider>
		</LanguageProvider>
	);
}
