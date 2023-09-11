import { useState, useEffect } from 'react';
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/components/Theme";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/components/Language/LanguageProvider";
import Splash from '@/components/Splash/Splash';

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	}, []);

	return (
		<LanguageProvider>
			<SessionProvider session={session}>
				<ThemeProvider theme={theme}>
					<Head>
						<link
							rel="icon"
							href="/icono_pequeno_Mesa_de_trabajo_1.svg"
						/>
					</Head>
					{isLoading ? (
						<Splash />
					) : (
						<Component {...pageProps} />
					)}
				</ThemeProvider>
			</SessionProvider>
		</LanguageProvider>
	);
}
