import Alert from '@/components/Alert/Alert';
import Table from '@/components/Table/Table';
import GenericTabs from '@/components/Tabs/Tabs';
import StaticLayout from '@/layouts/StaticLayout';
import React, { useEffect, useState } from 'react';

import { getAll } from '@/features/Organizations/hooks/useGetAllQuery';
import { putTakeOrganization } from '@/features/Organizations/hooks/usePutTakeQuery';
import BackHandIcon from '@mui/icons-material/BackHand';
import EditIcon from '@mui/icons-material/Edit';

import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { hasPermission } from '@/hooks/useUserHasPermissionQuery';
import LoadingSpinner from '@/components/Loading/Loading';

const OrganizationPage: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { selectedTab, message } = router.query;

	const [isLoading, setIsLoading] = useState(true);

	const [misSolicitudes, setMisSolicitudes] = useState([]);
	const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
	const [todas, setTodas] = useState([]);

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [aSelectedTab, setASelectedTab] = useState(0);

	useEffect(() => {
		if (session?.user?.email) {
			checkUserPermission(session?.user?.email);
			// getData()
		}
		if (message) {
			setShowMessage(message as string);
			setShowInfo(true);
			setASelectedTab(selectedTab ? parseInt(selectedTab as string, 10) : 0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, selectedTab, message]);

	const checkUserPermission = async (email: string) => {
		let response = await hasPermission(email, 'readAny', 'organizationRequest');
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
		getData();
	};

	const getData = async () => {
		try {
			const response = await getAll();
			console.log(
				'🚀 ~ file: index.tsx:49 ~ getData ~ response:',
				response.data[0]
			);

			const solicitudesParser = response.data.map(
				(s: {
					id: any;
					legalName: any;
					address: any;
					createdAt: moment.MomentInput;
					validator: { email: any };
					status: any;
				}) => {
					return {
						id: s.id,
						legalName: s.legalName,
						address: s.address,
						createdAt: moment.utc(s.createdAt).format('DD-MM-yyyy'),
						validator: s.validator ? s.validator.email : '-',
						status: s.status,
					};
				}
			);

			solicitudesParser.sort(
				(
					a: { status: string; createdAt: moment.MomentInput },
					b: { status: string; createdAt: moment.MomentInput }
				) => {
					const dateA = moment(a.createdAt, 'DD-MM-yyyy').toDate();
					const dateB = moment(b.createdAt, 'DD-MM-yyyy').toDate();
					return dateA.getTime() - dateB.getTime();
				}
			);

			setTodas(solicitudesParser);

			let aSolicitudesPendientes = solicitudesParser.filter(
				(s: { status: string }) => s.status === 'Pendiente'
			);

			setSolicitudesPendientes(aSolicitudesPendientes);

			const userValidatorEmail = session?.user?.email;
			const filteredSolicitudes = solicitudesParser.filter(
				(solicitud: { validator: string | null | undefined }) =>
					solicitud.validator === userValidatorEmail
			);
			filteredSolicitudes.sort(
				(
					a: { status: string; createdAt: moment.MomentInput },
					b: { status: string; createdAt: moment.MomentInput }
				) => {
					if (a.status === 'En revisión' && b.status !== 'En revisión') {
						return -1;
					} else if (a.status !== 'En revisión' && b.status === 'En revisión') {
						return 1;
					} else {
						const dateA = moment(a.createdAt, 'DD-MM-yyyy').toDate();
						const dateB = moment(b.createdAt, 'DD-MM-yyyy').toDate();
						return dateA.getTime() - dateB.getTime();
					}
				}
			);
			setMisSolicitudes(filteredSolicitudes);
		} catch (error) {
			console.log('🚀 ~ file: index.tsx:85 ~ getData ~ error:', error);
		}
		setIsLoading(false);
	};

	const columnsMisSolicitudes: GridColDef[] = [
		{
			field: 'legalName',
			headerName: 'Razón social',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'address',
			headerName: 'Domicilio',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'createdAt',
			headerName: 'Fecha',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'status',
			headerName: 'Estado',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'actions',
			headerName: 'Acciones',
			align: 'center',
			headerAlign: 'center',
			renderCell: (params: GridRenderCellParams) => (
				<>
					{params.row.status === 'En revisión' && (
						<IconButton
							onClick={() => handleEdit(params.row.id)}
							color='secondary'
						>
							<EditIcon />
						</IconButton>
					)}
					{params.row.status === 'En espera' && (
						<IconButton
							onClick={() => handleGet(params.row.id)}
							color='secondary'
						>
							<BackHandIcon />
						</IconButton>
					)}
				</>
			),
		},
	];

	const columnsPendientes: GridColDef[] = [
		{
			field: 'legalName',
			headerName: 'Razón social',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'address',
			headerName: 'Domicilio',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'createdAt',
			headerName: 'Fecha',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'status',
			headerName: 'Estado',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'actions',
			headerName: 'Acciones',
			align: 'center',
			headerAlign: 'center',
			renderCell: (params: GridRenderCellParams) =>
				params.row.status === 'Pendiente' && (
					<IconButton
						onClick={() => handleGet(params.row.id)}
						color='secondary'
					>
						<BackHandIcon />
					</IconButton>
				),
		},
	];

	const columnsTodas: GridColDef[] = [
		{
			field: 'legalName',
			headerName: 'Razón social',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'address',
			headerName: 'Domicilio',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'createdAt',
			headerName: 'Fecha',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'validator',
			headerName: 'Validador',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'status',
			headerName: 'Estado',
			type: 'string',
			align: 'center',
			headerAlign: 'center',
		},
	];

	const handleEdit = async (id: string) => {
		router.push(`/organization/${id}`);
	};

	const handleGet = async (id: string) => {
		let aMisSol = misSolicitudes.filter(
			(s: { status: any }) => s.status === 'En revisión'
		);
		console.log('🚀 ~ file: index.tsx:232 ~ handleGet ~ aMisSol:', aMisSol);
		if (aMisSol && aMisSol.length > 0) {
			setShowInfo(true);
			setShowMessage(
				'Ya existe una solicitud en revisión. Al terminar la gestión de la misma podrá tomar una nueva.'
			);
		} else {
			setShowInfo(true);
			setShowMessage('Solicitud tomada con éxito.');
			const aValidator = await getuserByEmail(session!.user!.email!);
			const body = {
				id: id,
				validator: aValidator.data,
			};
			await putTakeOrganization(body);
			getData();
		}
	};

	type TabData = {
		label: string;
		content: React.ReactNode;
	};

	const tabsData: TabData[] = [
		{
			label: `Mis verificaciones (${misSolicitudes.length})`,
			content: (
				<Table
					columns={columnsMisSolicitudes}
					data={misSolicitudes}
					showFilters={false}
				/>
			),
		},
		{
			label: `Solicitudes pendientes (${solicitudesPendientes.length})`,
			content: (
				<Table
					columns={columnsPendientes}
					data={solicitudesPendientes}
					showFilters={false}
				/>
			),
		},
		{
			label: `Todas (${todas.length})`,
			content: (
				<Table columns={columnsTodas} data={todas} showFilters={false} />
			),
		},
	];

	return (
		<StaticLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					{showInfo && (
						<Alert
							label={showMessage}
							severity='info'
							onClose={() => setShowInfo(false)}
						/>
					)}
					<GenericTabs tabs={tabsData} numberTab={aSelectedTab} />
				</>
			)}
		</StaticLayout>
	);
};

export default OrganizationPage;
