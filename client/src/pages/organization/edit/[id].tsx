import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getuserByEmail } from "@/features/Users/hooks/useGetUserByEmailQuery";
import DialogConfirmDelete from "@/components/Dialog/ConfirmDeleteDialog";
import BasicLayout from "@/layouts/BasicLayout";
import Input from "@/components/Input/Input";
import { number, object, string } from "yup";
import { getCategoriasByParent } from "@/features/Categories/hooks/useGetCategoriasQuery";
import { getAllCategorias } from "@/features/Categories/hooks/useGetAllCategoriasQuery";
import useGetUsersQuery from "@/features/Users/hooks/useGetUsersQuery";
import { Formik, Form, Field } from "formik";
import Button from "@/components/Button/Button";
import { TextField, Autocomplete } from "@mui/material";
import FileUploadPreview from "@/components/Input/FileInput";
import Label from "@/components/Label/Label";
import GenericList from "@/components/List/List";
import MainLayout from "@/layouts/MainLayout";
import { User } from "@/features/Users/user";
import { updateSolicitud } from "@/features/Organizations/hooks/useUpdateSolicitudQuery";
import { createSolicitud } from "@/features/Organizations/hooks/useCreateSolicitudQuery";
import { useRouter } from "next/router";
import { Organization } from "@/features/Organizations/Organization";
import { getById } from "@/features/Organizations/hooks/useGetByIdQuery";
import { deleteSolicitud } from "@/features/Organizations/hooks/useDeleteQuery";
import en from "@/locale/en";
import es from "@/locale/es";

const RegistroInstitucion = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const [categoriasPrincipales, setCategoriasPrincipales] = useState<any[]>([]);
	const [categoriasPrincipalesSelected, setCategoriasPrincipalesSelected] =
		useState<any[]>([]);

	const [subcategorias, setSubcategorias] = useState<any[]>([]);
	const [subcategoriasSelected, setSubcategoriasSelected] = useState<any[]>([]);

	const [operadores, setOperadores] = useState<any[]>([]);
	const [operadoresSelected, setOperadoresSelected] = useState<any[]>([]);

	const [files, setFiles] = useState<File[]>([]);
	const [myUser, setMyUser] = useState<User | null>();
	const { id } = router.query;
	const { locale } = router;
	const t: any = locale === "en" ? en : es;
	const [organizationId, setORganizationId] = useState("");
	const [legalName, setLegalName] = useState("");
	const [address, setAddress] = useState("");
	const [cuit, setCuit] = useState("");
	const [phone, setPhone] = useState("");
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [operators, setOperators] = useState<any[]>([]);
	const [status, setStatus] = useState("");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	useEffect(() => {
		if (session?.user?.email) {
			getuserByEmail(session?.user?.email).then((response) => {
				if (response.data) {
					setMyUser(response.data);
				}
			});
		}
		getData();

		async function fetchOrganizationData() {
			try {
				if (typeof id === 'string' && id !== 'new') {
					const organization = await getById(id);
					console.log(
						'🚀 ~ file: [id].tsx:54 ~ fetchOrganizationData ~ organization:',
						organization.data
					);
					setORganizationId(organization.data.id);
					setLegalName(organization.data.legalName);
					setAddress(organization.data.address);
					setCuit(organization.data.cuit);
					setCategoriasPrincipalesSelected(organization.data.categories);
					setSubcategoriasSelected(organization.data.subcategories);
					setPhone(organization.data.phone);
					setOperadoresSelected(organization.data.operators);
					setStatus(organization.data.status);
				}
			} catch (error) {
				console.error('Error fetching place data:', error);
			}
		}

		fetchOrganizationData();
	}, [id, session]);

	const initialValues = {
		razonSocial: legalName,
		domicilio: address,
		cuit: cuit,
		telefono: phone,
	};

	const getData = async () => {
		const someCategorias = await getCategoriasByParent(null);
		setCategoriasPrincipales(someCategorias.data);
		const someSubcategorias = await getAllCategorias();
		setSubcategorias(someSubcategorias.data);
		setOperadores((await useGetUsersQuery.getUsers()).data);
	};

	const onSubmit = async (values: Record<string, any>) => {
		const aOrganization: Organization = {
			id: '',
			legalName: '',
			address: '',
			cuit: '',
			categories: [],
			subcategories: [],
			phone: '',
			operators: [],
			supportingDocumentation: [],
			status: '',
			owner: {
				password: '',
				email: '',
			},
			validator: {
				password: '',
				email: '',
			},
			createdAt: undefined,
			updatedAt: undefined,
			deletedAt: undefined,
		};

		aOrganization.supportingDocumentation = [];
		files.forEach((file) => {
			aOrganization.supportingDocumentation.push(file as any);
		});
		if (id != 'new') {
			aOrganization.id = organizationId;
			aOrganization.status = status;
		}

		aOrganization.legalName = values.razonSocial;
		aOrganization.address = values.domicilio;
		aOrganization.cuit = values.cuit;
		aOrganization.categories = categoriasPrincipalesSelected;
		aOrganization.subcategories = subcategoriasSelected;
		aOrganization.phone = values.telefono;

		if (myUser) {
			aOrganization.owner = myUser;
		}
		aOrganization.operators = operadoresSelected;

		let response;
		if (id != 'new') {
			response = await updateSolicitud(aOrganization);
		} else {
			response = await createSolicitud(aOrganization);
		}
		router.push(
			{
				pathname: `/mi_perfil`,
				query: { message: response.message },
			}
		);
	};

	const handleDelete = () => {
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		const response = await deleteSolicitud(organizationId);
		router.push(
			{
				pathname: `/mi_perfil`,
				query: { message: response.message },
			}
		);
		setIsDeleteDialogOpen(false);
	};

	const validationSchema = object().shape({
		razonSocial: string().required('*Campo requerido'),
		domicilio: string().required('*Campo requerido'),
		cuit: string().required('*Campo requerido'),
		telefono: string().required('*Campo requerido'),
		categoriasPrincipales: number().min(1, 'Seleccione al menos una categoría'),
	});

	const fields = [
		{
			name: 'razonSocial',
			label: 'razonSocial',
			props: { label: t['legalName'] },
			component: Input,
			value: legalName,
			disabled: status === 'Activo' || status === 'En revisión',
		},
		{
			name: 'domicilio',
			label: 'domicilio',
			props: { label: t['address'] },
			component: Input,
			value: address,
			disabled: false,
		},
		{
			name: 'cuit',
			label: 'cuit',
			props: { label: 'CUIT/CUIL' },
			component: Input,
			value: cuit,
			disabled: status === 'Activo' || status === 'En revisión',
		},
		{
			name: 'telefono',
			label: 'telefono',
			props: { label: t['phonenumber'] },
			component: Input,
			value: phone,
			disabled: false,
		},
	];

	const handleCatPrincipalesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		const subcategorias: any[] = [];

		for (const value of values) {
			const response = await getCategoriasByParent(value.name);
			subcategorias.push(...response.data);
		}

		const filteredSubcategoriasSelected = subcategoriasSelected.filter(
			(subcategoria) => subcategorias.some((sub) => sub.id === subcategoria.id)
		);

		setSubcategoriasSelected(filteredSubcategoriasSelected);
		setSubcategorias(subcategorias);
		setCategoriasPrincipalesSelected(values);
	};

	const handleSubcategoriasChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		setSubcategoriasSelected(values);
	};

	const handleOperadoresChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someOperadores = operadoresSelected;
		someOperadores = [...values];
		console.log(values);
		setOperators(someOperadores);
		setOperadoresSelected(someOperadores);
	};

	const handleFileChange = (newFiles: File[] | null) => {
		if (newFiles) setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleDeleteFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	return (
		<MainLayout>
			<BasicLayout
				title={id === "new" ? t["createorganization"] : t["editorganization"]}
			>
				<br />
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
				>
					{({ setFieldValue }) => (
						<Form>
							{fields.map((field) => (
								<div key={field.name} style={{ marginBottom: "14px" }}>
									<Field
										name={field.name}
										as={field.component}
										{...field.props}
										disabled={field.disabled}
									/>
								</div>
							))}
							<Autocomplete
								multiple
								options={categoriasPrincipales}
								getOptionLabel={(option) => option.name}
								value={categoriasPrincipalesSelected}
								onChange={(event, newValues) => {
									handleCatPrincipalesChange(event, newValues as any[]);
									setFieldValue("categoriasPrincipales", newValues.length);
								}}
								renderInput={(params: any) => (
									<TextField {...params} label={t["categories"]} />
								)}
							/>
							<br />
							<Autocomplete
								multiple
								options={subcategorias}
								value={subcategoriasSelected}
								disabled={categoriasPrincipalesSelected.length === 0}
								getOptionLabel={(option) => option.name}
								onChange={handleSubcategoriasChange}
								renderInput={(params: any) => (
									<TextField {...params} label={t["subcategories"]} />
								)}
							/>

							<br />
							<Autocomplete
								multiple={true}
								value={operadoresSelected}
								options={operadores}
								getOptionLabel={(option) => option.name}
								onChange={handleOperadoresChange}
								disabled={status === 'Activo' || status === 'En revisión'}
								renderInput={(params: any) => (
									<TextField {...params} label={t['operators']} />
								)}
							/>
							<br />
							<Label text={t['supportingDocumentation']} />
							<FileUploadPreview
								label={t['selectDocumentation']}
								accept={'image/jpg,image/jpeg,image/png,application/pdf'}
								onChange={handleFileChange}
								disabled={status === 'Activo' || status === 'En revisión'}
							/>
							{files.length > 0 && (
								<GenericList elements={files} onDelete={handleDeleteFile} />
							)}
							<br />
							<br />
							<Button label={t['go_back']} onClick={() => router.back()} />
							<Button label={t['save']} type='submit' />
							<Button
								label={t['delete']}
								onClick={handleDelete}
								disabled={id === 'new'}
							/>

							<DialogConfirmDelete
								isOpen={isDeleteDialogOpen}
								onClose={() => setIsDeleteDialogOpen(false)}
								onConfirm={handleConfirmDelete}
							/>
						</Form>
					)}
				</Formik>
			</BasicLayout>
		</MainLayout>
	);
};

export default RegistroInstitucion;
