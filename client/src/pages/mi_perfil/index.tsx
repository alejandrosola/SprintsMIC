import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Avatar from '@/components/Avatar/Avatar';
import {
	default as Button,
	default as MyButton,
} from '@/components/Button/Button';
import GenericForm from '@/components/Form/ValidationForm';
import ImageInput from '@/components/Input/ImageInput';
import Input from '@/components/Input/Input';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { putUser } from '@/features/Users/hooks/usePutUserQuery';
import { User } from '@/features/Users/user';
import BasicLayout from '@/layouts/BasicLayout';
import dayjz from 'dayjs';
import { signIn, useSession } from 'next-auth/react';
import { date, object, string } from 'yup';
import SideBar from '@/components/SideBar/SideBar';
import GenericTabs from '@/components/Tabs/Tabs';
import en from '@/locale/en';
import es from '@/locale/es';
import { getByOwner } from '@/features/Organizations/hooks/useGetByOwnerQuery';
import Card from '@/components/Card/GenericCard';
import { FaUserAlt, FaUsers } from 'react-icons/fa';

import StaticLayout from '@/layouts/StaticLayout';
import { Organization } from '@/features/Organizations/Organization';
import { hasPermission } from '../../hooks/useUserHasPermissionQuery';
import LoadingSpinner from '@/components/Loading/Loading';
import Alert from '@/components/Alert/Alert';

const MiPerfil = () => {
	const router = useRouter();
	const { message } = router.query;
	const { data: session } = useSession();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [avatarTmpImage, setAvatarTmpImage] = useState<File | null>(null);
	const [initialValues, setInitialValues] = useState<any>({
		avatar: undefined,
		name: '',
		email: '',
		fechaNacimiento: '',
	});
	const [myUser, setMyUser] = useState<User | null>();
	const [list, setList] = useState<JSX.Element[]>([]);
	const [selectedTab, setSelectedTab] = useState(0);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (session?.user?.email) {
			checkUserPermission(session?.user?.email);
			getuserByEmail(session?.user?.email).then((response) => {
				if (response.data) {
					setMyUser(response.data);
				}
			});
			if (message) {
				setShowMessage(message as string);
				setShowInfo(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, message]);

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

		async function fetchOrganizationData() {
			try {
				const someOrganizations = myUser?.id
					? (await getByOwner(myUser!.id)).data
					: [];
				const organizationList = [];

				// Agregar la card "Nueva organización" al inicio
				organizationList.push(
					<div key='new-organization'>
						<Card
							title={t['neworganization']}
							content={t['createneworganizationmessage']}
							photoUrl={undefined}
							onClick={() => handleCardClick('new')}
						/>
					</div>
				);
				// Generar cards para las organizaciones existentes
				if (Array.isArray(someOrganizations)) {
					const organizationCards = someOrganizations.map(
						(organizationDato: Organization, i: number) => (
							<div key={i}>
								<Card
									title={organizationDato.legalName}
									content={organizationDato.status}
									photoUrl={undefined}
									id={organizationDato.id}
									onClick={() => handleCardClick(organizationDato.id!)}
								/>
							</div>
						)
					);
					organizationList.push(...organizationCards);
				}

				setList(organizationList);
				console.log(organizationList);
			} catch (error) {
				console.error('Error fetching places:', error);
			}
		}

		fetchOrganizationData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myUser]);

	const checkUserPermission = async (email: string) => {
		const response = await hasPermission(email, 'updateOwn', 'user');
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
		setIsLoading(false);
	};

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
			setShowMessage(response.message);
			setShowInfo(true);
		}
	};

	const handleCancelClick = () => {
		router.back();
	};

	const validationSchema = object().shape({
		name: string(),
		fechaNacimiento: date().max(
			new Date(),
			'Fecha de nacimiento incorrecta, no puede ser mayor al día actual.'
		),
		email: string().required(),
	});

	const myProfileFields = [
		{
			name: 'avatar',
			props: {
				label: t['change_avatar'],
				type: 'file',
				name: 'avatar',
				onChange: handleAvatarChange,
			},
			component: ImageInput,
		},
		{
			name: 'name',
			props: {
				label: t['full_name'],
				text: 'text',
			},
			component: Input,
		},
		{
			name: 'email',
			props: {
				type: t['email'],
				label: 'Email',
				disabled: true,
			},
			component: Input,
		},
		{
			name: 'fechaNacimiento',
			props: {
				type: 'date',
				label: t['birth_date'],
				shrink: true,
			},
			component: Input,
		},
	];

	const handleCardClick = (id: string) => {
		router.push(`/organization/edit/${id}`);
	};

	const tabs = [
		{
			label: t['profile'],
			content: (
				<BasicLayout title={t['profile']}>
					<MyButton
						onClick={() => {
							router.push('/mi_perfil/change-password');
						}}
						sx={{ marginBottom: '20px' }}
						label={t['change_password']}
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
						fields={myProfileFields}
						onSubmit={handleSubmitClick}
						buttonLabel={t['confirm_changes']}
						cancelLabel={t['cancellabel']}
						isCancelable={true}
						onCancel={handleCancelClick}
					/>
				</BasicLayout>
			),
			icon: <FaUserAlt />,
		},
		{
			label: t['my_organizations'],
			content: <BasicLayout title={t['my_organizations']}>{list}</BasicLayout>,
			icon: <FaUsers />,
		},
	];

	const handleTabSelect = async (index: number) => {
		await setSelectedTab(index);
	};

	return (
		<StaticLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<br />
					<div
						style={{
							flex: 1,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
							textAlign: 'center',
						}}
					>
						{showInfo && (
							<Alert
								label={showMessage}
								severity='info'
								onClose={() => setShowInfo(false)}
							/>
						)}</div>
					<GenericTabs
						tabs={tabs}
						sx={{
							display: { xs: 'flex', md: 'none' }, // Mostrar solo en md y mayores
						}}
						onTabChange={handleTabSelect}
						selected={selectedTab}
					/>
					{session ? (
						<SideBar
							tabs={tabs}
							onTabSelect={handleTabSelect}
							selectedTab={selectedTab}
							sx={{ display: { xs: 'none', md: 'flex' } }}
						/>
					) : (
						<Button label={'Sign In'} onClick={() => signIn()}></Button>
					)}
				</>
			)}
		</StaticLayout>
	);
};

export default MiPerfil;
