import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';

import BasicLayout from '@/layouts/BasicLayout';
import Input from '@/components/Input/Input';
import { number, object, string } from 'yup';
import { getCategoriasByParent } from '@/features/Categories/hooks/useGetCategoriasQuery';
import { getAllCategorias } from '@/features/Categories/hooks/useGetAllCategoriasQuery';
import useGetUsersQuery from '@/features/Users/hooks/useGetUsersQuery';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from '@/components/Button/Button';
import { TextField, Autocomplete } from '@mui/material';
import FileUploadPreview from '@/components/Input/FileInput';
import Label from '@/components/Label/Label';
import GenericList from '@/components/List/List';
import MainLayout from '@/layouts/MainLayout';
import { User } from '@/features/Users/user';
import { createSolicitud } from '@/features/Organizations/hooks/useCreateSolicitudQuery';
import { useRouter } from 'next/router';

const RegistroInstitucion = () => {
	const { data: session } = useSession();
	const router = useRouter()

	const [categoriasPrincipales, setCategoriasPrincipales] = useState<any[]>([]);
	const [categoriasPrincipalesSelected, setCategoriasPrincipalesSelected] = useState<any[]>([]);

	const [subcategorias, setSubcategorias] = useState<any[]>([]);
	const [subcategoriasSelected, setSubcategoriasSelected] = useState<any[]>([]);

	const [operadores, setOperadores] = useState<any[]>([]);
	const [operadoresSelected, setOperadoresSelected] = useState<any[]>([]);

	const [files, setFiles] = useState<File[]>([]);
	const [myUser, setMyUser] = useState<User | null>();


	useEffect(() => {
		if (session?.user?.email) {
			getuserByEmail(session?.user?.email).then((response) => {
				if (response.data) {
					setMyUser(response.data);
				}
			});
		}
		getData();
	}, [session]);

	const getData = async () => {
		const someCategorias = await getCategoriasByParent(null)
		setCategoriasPrincipales(someCategorias.data);
		const someSubcategorias = await getAllCategorias();
		setSubcategorias(someSubcategorias.data)
		setOperadores((await useGetUsersQuery.getUsers()).data);
	}

	const onSubmit = async (values: Record<string, any>) => {
		const formData = new FormData();

		files.forEach(file => {
			formData.append('supportingDocumentation', file);
		});
		formData.append('legalName', values.razonSocial);
		formData.append('address', values.domicilio);
		formData.append('cuit', values.cuit);
		formData.append('categories', JSON.stringify(categoriasPrincipalesSelected));
		formData.append('subcategories', JSON.stringify(subcategoriasSelected));
		formData.append('phone', values.telefono);

		if (myUser) {
			formData.append('owner', JSON.stringify(myUser))
		}
		formData.append('operators', JSON.stringify(operadoresSelected));

		await createSolicitud(formData);
		router.replace({
			pathname: '/organization',
			query: { selectedTab: 0, message: "Organizacion creada con exito" },
		});
	};

	const initialValues = {
		razonSocial: '',
		domicilio: '',
		cuit: '',
		telefono: '',
		categoriasPrincipales: 0
	};

	const validationSchema = object().shape({
		razonSocial: string().required('*Campo requerido'),
		domicilio: string().required('*Campo requerido'),
		cuit: string().required('*Campo requerido'),
		telefono: string().required('*Campo requerido'),
		categoriasPrincipales: number().min(1, "Seleccione al menos una categoría")
	});

	const fields = [
		{
			name: 'razonSocial',
			label: 'razonSocial',
			props: { label: 'Razon Social' },
			component: Input,
		},
		{
			name: 'domicilio',
			label: 'domicilio',
			props: { label: 'Domicilio' },
			component: Input,
		},
		{
			name: 'cuit',
			label: 'cuit',
			props: { label: 'CUIT/CUIL' },
			component: Input,
		},
		{
			name: 'telefono',
			label: 'telefono',
			props: { label: 'Numero de telefono' },
			component: Input,
		},
	];

	const handleCatPrincipalesChange = async (e: React.SyntheticEvent<Element, Event>, values: any[]) => {
		const subcategorias: any[] = [];

		for (const value of values) {
			const response = await getCategoriasByParent(value.name);
			subcategorias.push(...response.data);
		}

		const filteredSubcategoriasSelected = subcategoriasSelected.filter(subcategoria =>
			subcategorias.some(sub => sub.id === subcategoria.id)
		);

		setSubcategoriasSelected(filteredSubcategoriasSelected);
		setSubcategorias(subcategorias);
		setCategoriasPrincipalesSelected(values);
	}


	const handleSubcategoriasChange = async (e: React.SyntheticEvent<Element, Event>, values: any[]) => {
		setSubcategoriasSelected(values);
	}


	const handleOperadoresChange = async (e: React.SyntheticEvent<Element, Event>, values: any[]) => {
		let someOperadores = operadoresSelected;
		someOperadores = [...values];
		setOperadoresSelected(someOperadores);
	}

	const handleFileChange = (newFiles: File[] | null) => {
		if (newFiles)
			setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleDeleteFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	return (
		<MainLayout>
			<BasicLayout title="Solicitud de alta de institución/organización">
				<br />
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
				>
					{({ setFieldValue, errors, touched }) => (
						<Form>
							{fields.map((field) => (
								<div key={field.name} style={{ marginBottom: '14px' }}>
									<Field
										name={field.name}
										as={field.component}
										{...field.props}
									/>
									{/* {errors[field.name] && touched[field.name] && (
										<span style={{ color: 'red' }}>
											<ErrorMessage name={field.name} />
										</span>
									)} */}
								</div>
							))
							}
							<Autocomplete
								multiple
								options={categoriasPrincipales}
								getOptionLabel={(option) => option.name}
								onChange={(event, newValues) => {
									handleCatPrincipalesChange(event, newValues as string[])
									setFieldValue("categoriasPrincipales", newValues.length)
								}}
								renderInput={(params: any) => <TextField {...params} label={'Categorías principales'} />}
							/>
							{errors.categoriasPrincipales && touched.categoriasPrincipales && (
								<span style={{ color: 'red' }}>
									<ErrorMessage name={"categoriasPrincipales"} />
								</span>
							)}
							<br />
							<Autocomplete
								multiple
								options={subcategorias}
								value={subcategoriasSelected}
								disabled={categoriasPrincipalesSelected.length === 0}
								getOptionLabel={(option) => option.name}
								onChange={handleSubcategoriasChange}
								renderInput={(params: any) => <TextField {...params} label={'Subcategorías'} />}
							/>

							<br />
							<Autocomplete
								multiple={true}
								options={operadores}
								getOptionLabel={(option) => option.name}
								onChange={handleOperadoresChange}
								renderInput={(params: any) => <TextField {...params} label={'Operadores'} />}
							/>
							<br />
							<Label text={'Documentación de soporte'} />
							<FileUploadPreview label={'Seleccionar documentacion'} accept={"image/jpg,image/jpeg,image/png,application/pdf"} onChange={handleFileChange} />
							{files.length > 0 &&
								<GenericList elements={files} onDelete={handleDeleteFile} />
							}
							<br />
							<br />
							<Button label={'Guardar'} type='submit' />
						</Form>
					)}
				</Formik>
			</BasicLayout>
		</MainLayout>
	);
};

export default RegistroInstitucion;
