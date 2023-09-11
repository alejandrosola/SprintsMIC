import React, { useEffect, useState } from 'react';
import { findAll } from '@/features/Faqs/hooks/useFindAllQuery';
import Accordion from '@/components/Accordion/Accordion';
import BasicLayout from '@/layouts/BasicLayout';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import { Faq } from '@/features/Faqs/faq';
import LoadingSpinner from '@/components/Loading/Loading';

const FaqPage = () => {
	const [list, setList] = useState([]);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	const buttonLabels: Record<string, string> = {
		'/register': 'Registrarse',
		'/mi_perfil': 'Mi Perfil',
		'/auth/signin': 'Recuperar contraseña',
		'/mi_perfil/change-password': 'Cambiar contraseña',
	};

	useEffect(() => {
		async function fetchFaqData() {
			const someFaqs = await findAll();

			const faqList = someFaqs.map((faqDato: Faq, i: number) => (
				<div key={i}>
					{' '}
					{/* Agrega una key única */}
					{faqDato.button_route ? (
						<Accordion
							question={faqDato.question}
							answer={faqDato.answer}
							nameButton={buttonLabels[faqDato.button_route]}
							onClick={() => {
								router.push(faqDato.button_route);
							}}
						/>
					) : (
						<Accordion question={faqDato.question} answer={faqDato.answer} />
					)}
				</div>
			));
			setList(faqList);
			setIsLoading(false);
		}

		fetchFaqData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<MainLayout>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<>
						<BasicLayout title='Preguntas frecuentes'>
							<div>{list}</div>
						</BasicLayout>
					</>
				)}
			</MainLayout>
		</div>
	);
};

export default FaqPage;
