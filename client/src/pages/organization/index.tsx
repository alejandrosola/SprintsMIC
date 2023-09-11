import React, { useEffect, useState } from 'react';
import StaticLayout from '@/layouts/StaticLayout';
import Table from '@/components/Table/Table';
import GenericTabs from '@/components/Tabs/Tabs';
import Alert from '@/components/Alert/Alert';

import BackHandIcon from '@mui/icons-material/BackHand';
import EditIcon from '@mui/icons-material/Edit';
import { getAll } from '@/features/Organizations/hooks/useGetAllQuery';
import { putTakeOrganization } from '@/features/Organizations/hooks/usePutTakeQuery';

import moment from 'moment';
import { useSession } from 'next-auth/react';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { useRouter } from 'next/router';
import { OrganizationStatus } from '@/features/Organizations/status.enum';

const OrganizationPage: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { selectedTab, message } = router.query;

	const [solicitudes, setSolicitudes] = useState([]);
	const [misSolicitudes, setMisSolicitudes] = useState([]);

	const [showInfo, setShowInfo] = useState(false);

	useEffect(() => {
		if (session?.user?.email) {
			getData();
		}
		if (message) {
			setShowInfo(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, selectedTab, message]);

	const getData = async () => {
		const response = await getAll();
		const solicitudesParser = response.data.map(
			(s: {
				categories: [
					{
						name: any;
					},
				];
				subcategories: [
					{
						name: any;
					},
				];
				owner: {
					email: any;
					name: any;
				};
				validator: {
					email: any;
				};
				operators: [
					{
						email: any;
						name: any;
					},
				];
				updatedAt: Date;
			}) => {
				return {
					...s,
					categories:
						s.categories.length > 0
							? s.categories.map((s) => s.name).join(', ')
							: '-',
					subcategories:
						s.subcategories.length > 0
							? s.subcategories.map((s) => s.name).join(', ')
							: '-',
					owner: s.owner.name ? s.owner.name : s.owner.email,
					validator: s.validator ? s.validator.email : '-',
					operators:
						s.operators.length > 0
							? s.operators.map((s) => (s.name ? s.name : s.email)).join(', ')
							: '-',
					updatedAt: moment.utc(s.updatedAt).format('DD-MM-yyyy'),
				};
			}
		);

		solicitudesParser.sort(
			(
				a: { status: string; updatedAt: moment.MomentInput },
				b: { status: string; updatedAt: moment.MomentInput }
			) => {
				if (
					a.status === OrganizationStatus.PENDING &&
					b.status !== OrganizationStatus.PENDING
				) {
					return -1;
				} else if (
					a.status !== OrganizationStatus.PENDING &&
					b.status === OrganizationStatus.PENDING
				) {
					return 1;
				} else {
					const dateA = moment(a.updatedAt, 'DD-MM-yyyy').toDate();
					const dateB = moment(b.updatedAt, 'DD-MM-yyyy').toDate();
					return dateA.getTime() - dateB.getTime();
				}
			}
		);

		setSolicitudes(solicitudesParser);

		const filteredSolicitudes = solicitudesParser.filter(
			(solicitud: { validator: string | null | undefined }) =>
				solicitud.validator === session?.user?.email
		);
		filteredSolicitudes.sort(
			(
				a: { status: string; updatedAt: moment.MomentInput },
				b: { status: string; updatedAt: moment.MomentInput }
			) => {
				if (
					a.status === OrganizationStatus.IN_REVIEW &&
					b.status !== OrganizationStatus.IN_REVIEW
				) {
					return -1;
				} else if (
					a.status !== OrganizationStatus.IN_REVIEW &&
					b.status === OrganizationStatus.IN_REVIEW
				) {
					return 1;
				} else {
					const dateA = moment(a.updatedAt, 'DD-MM-yyyy').toDate();
					const dateB = moment(b.updatedAt, 'DD-MM-yyyy').toDate();
					return dateA.getTime() - dateB.getTime();
				}
			}
		);
		setMisSolicitudes(filteredSolicitudes);
	};

	const columns = [
		{
			id: 'legalName',
			label: 'Razón social',
			accessor: 'legalName',
		},
		{
			id: 'address',
			label: 'Domicilio',
			accessor: 'address',
		},
		{
			id: 'cuit',
			label: 'CUIT',
			accessor: 'cuit',
		},
		{
			id: 'categories',
			label: 'Categorías',
			accessor: 'categories',
		},
		{
			id: 'subcategories',
			label: 'Subcategorías',
			accessor: 'subcategories',
		},
		{
			id: 'phone',
			label: 'Teléfono',
			accessor: 'phone',
		},
		{
			id: 'owner',
			label: 'Propietario',
			accessor: 'owner',
		},
		{
			id: 'operators',
			label: 'Operadores',
			accessor: 'operators',
		},
		{
			id: 'validator',
			label: 'Validador',
			accessor: 'validator',
		},
		{
			id: 'updatedAt',
			label: 'Fecha',
			accessor: 'updatedAt',
		},
		{
			id: 'status',
			label: 'Estado',
			accessor: 'status',
		},
	];

	const handleEdit = async (id: string) => {
		router.push(`/organization/detail/${id}`);
	};

	const handleGet = async (id: string) => {
		setShowInfo(true);
		const aValidator = await getuserByEmail(session!.user!.email!);
		const body = {
			id: id,
			validator: aValidator.data,
		};
		await putTakeOrganization(body);
		getData();
	};

	type TabData = {
		label: string;
		content: React.ReactNode;
	};

	const tabsData: TabData[] = [
		{
			label: 'Solicitudes pendientes',
			content: (
				<Table
					columns={columns}
					data={solicitudes}
					icon={<BackHandIcon />}
					onClick={handleGet}
					condition={(rowData) => rowData.status === OrganizationStatus.PENDING}
				/>
			),
		},
		{
			label: 'Mis verificaciones',
			content: (
				<Table
					columns={columns}
					data={misSolicitudes}
					icon={<EditIcon />}
					onClick={handleEdit}
					condition={(rowData) =>
						rowData.status === OrganizationStatus.IN_REVIEW
					}
				/>
			),
		},
	];

	return (
		<StaticLayout>
			{showInfo && (
				<Alert
					label={
						message
							? (message as string)
							: `Solicitud tomada con éxito. Para administrarlo, vaya a la pestaña "MIS VERIFICACIONES"`
					}
					severity='info'
					onClose={() => setShowInfo(false)}
				/>
			)}
			<GenericTabs
				tabs={tabsData}
				numberTab={selectedTab ? parseInt(selectedTab as string, 10) : 0}
			/>
		</StaticLayout>
	);
};

export default OrganizationPage;
