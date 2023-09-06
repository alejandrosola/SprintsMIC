import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Avatar from '@/components/Avatar/Avatar';
import { default as Button, default as MyButton } from '@/components/Button/Button';
import GenericForm from '@/components/Form/ValidationForm';
import ImageInput from '@/components/Input/ImageInput';
import Input from '@/components/Input/Input';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { putUser } from '@/features/Users/hooks/usePutUserQuery';
import { User } from '@/features/Users/user';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import dayjz from 'dayjs';
import { signIn, useSession } from 'next-auth/react';
import { date, object, string } from 'yup';

const MiPerfil = () => {
	const router = useRouter();
	const { data: session } = useSession();

	// minioClient: Client;

	const [avatarTmpImage, setAvatarTmpImage] = useState<File | null>(null);
	const [initialValues, setInitialValues] = useState<any>({
		avatar: undefined,
		name: '',
		email: '',
		fechaNacimiento: '',
	});
	const [myUser, setMyUser] = useState<User | null>();

	const handleAvatarChange = (file: File | null) => {
		// Actualiza el estado local con el archivo seleccionado
		setAvatarTmpImage(file);
	};

	const handleSubmitClick = async (values: Record<string, any>) => {
		const data = new FormData();

		data.append('name', values.name);

		data.append('email', values.email || myUser?.email);

		data.append(
			'fechaNacimiento',
			values.fechaNacimiento ? values.fechaNacimiento : ''
		);

		if (avatarTmpImage) {
			const newFile = new File([avatarTmpImage], myUser!.email, {
				type: avatarTmpImage.type,
			});
			setAvatarTmpImage(newFile);
			data.append('avatar', values.avatar);
		} else if (myUser?.avatar) {
			data.append('avatar', myUser!.avatar);
		}

		const response = await putUser(data);
		if (response.statusCode === 200) {
			// router.push('/');
		}
	};

	const handleCancelClick = () => {
		router.back();
	};

	useEffect(() => {
		if (session?.user?.email) {
			getuserByEmail(session?.user?.email).then((response) => {
				if (response.data) {
					setMyUser(response.data);
				}
			});
		}
	}, [session]);

	useEffect(() => {
		if (myUser) {
			setInitialValues({
				avatar: myUser.avatar || undefined,
				name: myUser.name || '',
				email: myUser.email || '',
				fechaNacimiento:
					(myUser.fechaNacimiento &&
						dayjz(myUser.fechaNacimiento).format('YYYY-MM-DD')) ||
					'',
			});
		}
	}, [myUser]);

	const validationSchema = object().shape({
		name: string(),
		fechaNacimiento: date().max(
			new Date(),
			'Fecha de nacimiento incorrecta, no puede ser mayor al día actual.'
		),
		email: string().required(),
	});

	const fields = [
		{
			name: 'avatar',
			props: {
				label: 'Cambiar imagen',
				type: 'file',
				name: 'avatar',
				onChange: handleAvatarChange,
			},
			component: ImageInput,
		},
		{
			name: 'name',
			props: {
				label: 'Nombre completo',
				text: 'text',
			},
			component: Input,
		},
		{
			name: 'email',
			props: {
				type: 'email',
				label: 'Email',
				disabled: true,
			},
			component: Input,
		},
		{
			name: 'fechaNacimiento',
			props: {
				type: 'date',
				label: 'Fecha de nacimiento',
				shrink: true,
			},
			component: Input,
		},
	];

	return (
		<MainLayout>
			{session ? (
				<BasicLayout title='Mi perfil'>
					<MyButton
						onClick={() => {
							router.push('/mi_perfil/change-password');
						}}
						sx={{ marginBottom: '20px' }}
						label='Cambiar clave'
					></MyButton>
					<Avatar
						sx={{ height: 70, width: 70, marginBottom: '20px' }}
						src={
							(avatarTmpImage && URL.createObjectURL(avatarTmpImage)) ||
							myUser?.avatar ||
							undefined
						}
						alt={myUser?.name}
					></Avatar>
					<GenericForm
						initialValues={initialValues}
						validationSchema={validationSchema}
						fields={fields}
						onSubmit={handleSubmitClick}
						buttonLabel='Confirmar cambios'
						cancelLabel='Cancelar'
						isCancelable={true}
						onCancel={handleCancelClick}
					/>
				</BasicLayout>
			) : (
				<Button label={'Sign In'} onClick={() => signIn()}></Button>
			)}
		</MainLayout>
	);
};

export default MiPerfil;
