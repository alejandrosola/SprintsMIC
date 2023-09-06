import React, { useState, useEffect } from 'react';
import { object, string } from 'yup';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import BasicLayout from '@/layouts/BasicLayout';
import Input from '@/components/Input/Input';
import Label from '@/components/Label/Label';
import PasswordInput from '@/components/Input/PasswordInput';
import Alert from '@/components/Alert/Alert';
import Image from '@/components/Image/Image';
import SignInButton from '@/components/Button/SignInButton';
import GenericForm from '@/components/Form/ValidationForm';
import SignUpLink from '@/components/Button/SignUpLink';
import MainLayout from '@/layouts/MainLayout';
import { Link, Typography } from '@mui/material';
import en from '@/locale/en';
import es from '@/locale/es';

const Login = () => {
	const router = useRouter();

	const [showInfo, setShowInfo] = useState(false);
	const [error, setError] = useState({ message: "", type: "" });

	const { locale } = router;
	const t = locale === 'en' ? en : es;

	useEffect(() => {
		const { error } = router.query;
		const { info } = router.query;

		if (info) {
			setError({ message: 'Contraseña cambiada con éxito', type: 'success' });
			setShowInfo(true);
		}
		if (error) {
			if (error === 'CredentialsSignin') {
				setError({ message: 'Las credenciales proporcionadas no son válidas', type: 'error' });
				setShowInfo(true);
			} else {
				setError({ message: error as string, type: 'error' });
				setShowInfo(true);
			}
		}
	}, [router.query]);

	const handleButtonClick = async (values: Record<string, string>) => {
		const { email, password } = values;
		console.log(email);
		console.log(password);
		const sign = await signIn('credentials', {
			callbackUrl: '/home',
			email,
			password,
		});
	};

	const handleGoogleLogin = () => {
		signIn('google', { callbackUrl: '/home' });
	};

	const handleSignUpClick = () => {
		router.push('/register');
	};

	const onClickOlvideMiPass = () => {
		router.push('/restorePassword');
	};

	const initialValues = {
		email: '',
		password: '',
	};

	const validationSchema = object().shape({
		email: string().required('*Email requerido').email('Email inválido'),
		password: string().required('*Contraseña requerida'),
	});

	const fields = [
		{
			name: 'email',
			label: 'Campo 1',
			props: { label: 'Email', required: true },
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
			<BasicLayout title={ t.signin }>
				{showInfo && error && (
					<Alert
						label={error.message}
						severity={error.type === 'success' ? 'success' : 'error'}
						onClose={() => setShowInfo(false)}
					/>
				)}
				<br />
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
					buttonLabel= { t.signin }
				/>
				<br />
				<Label text={'ó'} />
				<br />
				<SignInButton
					provider='google'
					onClick={handleGoogleLogin}
					icon={<FcGoogle style={{ marginRight: '8px' }} />}
				/>
				<br />
				<SignInButton
					provider='facebook'
					onClick={handleGoogleLogin}
					icon={<BsFacebook style={{ marginRight: '8px' }} />}
				/>
				<br />
				<Typography variant="body2">
					<Link component="button" onClick={onClickOlvideMiPass}>
						Olvidé mi contraseña
					</Link>
				</Typography>
				<br />
				<br />
				<SignUpLink onClick={handleSignUpClick} />
			</BasicLayout>
		</MainLayout>
	);
};

export default Login;
