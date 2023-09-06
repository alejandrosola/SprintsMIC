import Button from '@/components/Button/Button'; // Ajusta la ruta según la ubicación real
import ImageCarousel from '@/components/ImageCarousel/ImageCarousel';
import FileUploadPreview from '@/components/Input/FileInput';
import Input from '@/components/Input/Input'; // Ajusta la ruta según la ubicación real
import Label from '@/components/Label/Label';
import GenericList from '@/components/List/List';
import { Category } from '@/features/Categories/category';
import { findAll } from '@/features/Categories/hooks/useFindAllQuery';
import { findById } from '@/features/Places/hooks/useFindByIdQuery';
import { putPlace } from '@/features/Places/hooks/usePutPlaceQuery';
import { Place } from '@/features/Places/place';
import { PlacePhoto } from '@/features/PlacesPhotos/place_photo';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const EditPlace: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;

	const [placeData, setPlaceData] = useState<Place | null>(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [note, setNote] = useState('');
	const [url, setUrl] = useState('');
	const [phone, setPhone] = useState('');
	const [domicile, setDomicile] = useState('');
	const [principalCategory, setCategory] = useState<Category | null>(null);
	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

	const [photos, setPhotos] = useState<PlacePhoto[]>([]);

	const [files, setFiles] = useState<File[]>([]);

	useEffect(() => {
		async function fetchCategories() {
			try {
				const categories = await findAll();
				setCategoryOptions(categories.data);
				if (placeData) {
					setCategory(placeData.principalCategory);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchPlaceData() {
			try {
				if (typeof id === 'string') {
					const place = await findById(id);
					console.log(
						'🚀 ~ file: [id].tsx:54 ~ fetchPlaceData ~ place:',
						place.data
					);
					setPlaceData(place.data);
					setName(place.data.name);
					setDescription(place.data.description);
					setNote(place.data.note);
					setUrl(place.data.url);
					setPhone(place.data.phone);
					setDomicile(place.data.domicile);
					setCategory(place.data.principalCategory);
					setPhotos(place.data.photos);
				}
			} catch (error) {
				console.error('Error fetching place data:', error);
			}
		}

		fetchCategories();
		fetchPlaceData();
	}, [id]);

	const handleSaveChanges = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (placeData) {
				const formData = new FormData();
				files.forEach((file) => {
					formData.append('files', file);
				});
				formData.append('id', placeData.id as string);
				formData.append('name', name);
				formData.append('description', description);
				formData.append('note', note);
				formData.append('schedules', JSON.stringify(placeData.schedules));
				formData.append(
					'principalCategory',
					JSON.stringify(placeData.principalCategory)
				);
				formData.append('categories', JSON.stringify(placeData.categories));
				formData.append('url', url);
				formData.append('phone', phone);
				formData.append('domicile', domicile);
				formData.append('origin', placeData.origin);
				formData.append('location', JSON.stringify(placeData.location));
				formData.append('photos', JSON.stringify(photos));

				const response = await putPlace(formData);
				console.log('Changes saved:', response);
			} else {
				console.error('No place data to update.');
			}
		} catch (error) {
			console.error('Error saving changes:', error);
		}
		// router.push(`/places`);
	};

	const inputStyle = {
		width: '100%', // Ajusta el ancho según tus necesidades
		marginBottom: '20px',
	};

	const handleFileChange = (newFiles: File[] | null) => {
		if (newFiles) setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleDeleteFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	return (
		<div>
			<MainLayout>
				<BasicLayout title='Editar'>
					<form onSubmit={handleSaveChanges}>
						<div style={inputStyle}>
							<Input
								field={{
									name: 'name',
									value: name,
									onChange: (e) => setName(e.target.value),
									onBlur: () => {},
									label: 'Nombre:',
								}}
								shrink // Agrega shrink
							/>
						</div>
						<div style={inputStyle}>
							<Input
								field={{
									name: 'description',
									value: description,
									onChange: (e) => setDescription(e.target.value),
									onBlur: () => {},
									label: 'Descripción:',
								}}
								shrink // Agrega shrink
							/>
						</div>
						<div style={inputStyle}>
							<Input
								field={{
									name: 'note',
									value: note,
									onChange: (e) => setNote(e.target.value),
									onBlur: () => {},
									label: 'Nota:',
								}}
								shrink // Agrega shrink
							/>
						</div>
						<div style={inputStyle}>
							<Input
								field={{
									name: 'url',
									value: url,
									onChange: (e) => setUrl(e.target.value),
									onBlur: () => {},
									label: 'Url:',
								}}
								shrink // Agrega shrink
							/>
						</div>
						<div style={inputStyle}>
							<Input
								field={{
									name: 'phone',
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									onBlur: () => {},
									label: 'Telefono:',
								}}
								shrink // Agrega shrink
							/>
						</div>
						<div style={inputStyle}>
							<Input
								field={{
									name: 'domicile',
									value: domicile,
									onChange: (e) => setDomicile(e.target.value),
									onBlur: () => {},
									label: 'Domicilio:',
								}}
								shrink // Agrega shrink
							/>
						</div>
						<div style={inputStyle}>
							<Autocomplete
								options={categoryOptions}
								getOptionLabel={(category) => category.name}
								value={principalCategory}
								onChange={(event, newValue) => setCategory(newValue)}
								renderInput={(params) => (
									<TextField
										{...params}
										label='Categoría:'
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
						</div>
						{photos && photos.length > 0 && (
							<Label text={'Imágenes del lugar'} />
						)}
						<div style={inputStyle}>
							<ImageCarousel
								images={photos.map((photo) => photo.photoUrl)}
								maxWidth='150px'
							/>
						</div>

						<FileUploadPreview
							label={'Agregar imágenes'}
							accept={'image/jpg,image/jpeg,image/png'}
							onChange={handleFileChange}
						/>
						{files.length > 0 && (
							<GenericList elements={files} onDelete={handleDeleteFile} />
						)}
						<br />
						<br />
						<Button type='submit'>Guardar cambios</Button>
					</form>
				</BasicLayout>
			</MainLayout>
		</div>
	);
};

export default EditPlace;
