import React from 'react';
import { useRouter } from 'next/router';

import BasicLayout from '@/layouts/BasicLayout';
import Input from '@/components/Input/Input';
import PasswordInput from '@/components/Input/PasswordInput';
import { object, string } from 'yup';
import GenericForm from '@/components/Form/ValidationForm';
import { postUser } from '@/features/Users/hooks/usePostUserQuery';
import Image from '@/components/Image/Image';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';

const UserList = () => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === 'en' ? en : es;

	const handleButtonClick = async (values: Record<string, any>) => {
		const user = {
			email: values.email,
			password: values.password,
		};
		const response = await postUser(user);

		if (response.statusCode === 200) {
			router.push('/register/email-validate');
		}

		if (response.statusCode === 500) {
			router.push('/register/error-register');
		}
	};

	const initialValues = {
		email: '',
		password: '',
	};

	const validationSchema = object().shape({
		email: string().email('Email inválido').required(t.emailrequired),
		password: string()
			.required(t.passwordrequired)
			.min(8, t.eightchar)
			.matches(
				/(?=.*[A-Z])(?=.*?[0-9])/,
				t.eightchar
			),
	});

	const fields = [
		{
			name: 'email',
			label: 'Campo 1',
			props: { label: 'Email' },
			component: Input,
		},
		{
			name: 'password',
			label: 'Campo 2',
			props: { label: t.password },
			component: PasswordInput,
		},
	];
	return (
		<MainLayout>
			<BasicLayout title={t.register}>
				<Image
					src='/logo.jpg' // Asegúrate de proporcionar la ruta correcta a la imagen dentro de la carpeta "public"
					alt='logo'
				/>
				<br />
				<GenericForm
					initialValues={initialValues}
					validationSchema={validationSchema}
					fields={fields}
					onSubmit={handleButtonClick}
					buttonLabel={t.signup}
				/>
			</BasicLayout>
		</MainLayout>
	);
};

export default UserList;
