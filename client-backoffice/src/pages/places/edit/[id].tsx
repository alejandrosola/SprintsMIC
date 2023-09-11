import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button/Button'; // Ajusta la ruta según la ubicación real
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import FileUploadPreview from '@/components/Input/FileInput';
import Input from '@/components/Input/Input'; // Ajusta la ruta según la ubicación real
import Label from '@/components/Label/Label';
import GenericList from '@/components/List/List';
import LoadingSpinner from '@/components/Loading/Loading';
import MapChequeoBidireccionalComponent from '@/components/Map/MapChequeoBidireccional';
import ModalComponent from '@/components/ModalComponent/ModalComponent';
import { Accessibility } from '@/features/Accessibilities/Accessibility';
import { findAllAccessibility } from '@/features/Accessibilities/hooks/useFindAllQuery';
import { Category } from '@/features/Categories/category';
import { findAllCategories } from '@/features/Categories/hooks/useFindAllQuery';
import { getAll } from '@/features/Organizations/hooks/useGetAllQuery';
import { Organization } from '@/features/Organizations/organization';
import { findById } from '@/features/Places/hooks/useFindByIdQuery';
import { postPlace } from '@/features/Places/hooks/usePostPlaceQuery';
import { putPlace } from '@/features/Places/hooks/usePutPlaceQuery';
import { Place } from '@/features/Places/place';
import { PlaceCategory } from '@/features/PlacesCategories/place_category';
import { PlacePhoto } from '@/features/PlacesPhotos/place_photo';
import { PlaceSchedule } from '@/features/PlacesSchedules/place_schedule';
import { Service } from '@/features/Services/Service';
import { findAllService } from '@/features/Services/hooks/useFindAllQuery';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import CloseIcon from '@mui/icons-material/Close';
import { FormControlLabel, IconButton, Switch, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const EditPlace: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;

	const [isLoading, setIsLoading] = useState(true);

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState('');

	const [placeData, setPlaceData] = useState<Place | null>(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [note, setNote] = useState('');
	const [url, setUrl] = useState('');
	const [facebook_url, setFacebook_url] = useState('');
	const [twitter_url, setTwitter_url] = useState('');
	const [instagram_url, setInstagram_url] = useState('');
	const [phone, setPhone] = useState('');
	const [domicile, setDomicile] = useState('');
	const [minors, setMinors] = useState('');
	const [principalCategory, setCategory] = useState<Category | null>(null);
	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
	const [organization, setOrganization] = useState<Organization | null>(null);
	const [organizationOptions, setOrganizationOptions] = useState<
		Organization[]
	>([]);

	const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);

	const [services, setServices] = useState<Service[]>([]);
	const [servicesSelected, setServiceSelected] = useState<Service[] | null>();

	const [accesibilities, setAccesibilities] = useState<Accessibility[]>([]);
	const [accesibilitiesSelected, setAccesibilitiesSelected] = useState<
		Accessibility[] | null
	>();

	const [photos, setPhotos] = useState<PlacePhoto[]>([]);

	const [files, setFiles] = useState<File[]>([]);

	const [edit, setEdit] = useState<boolean>(false);

	const [modalOpen, setModalOpen] = useState(false);

	const [schedules, setSchedules] = useState<PlaceSchedule[]>([]);

	const [coordinates, setCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const [showScheduleInputs, setShowScheduleInputs] = useState<boolean>(false);
	const [daysOfWeek, setDayOfWeek] = useState<any[]>([
		{
			day: 'LUNES',
			checked: false,
			schedules: [],
		},
		{
			day: 'MARTES',
			checked: false,
			schedules: [],
		},
		{
			day: 'MIERCOLES',
			checked: false,
			schedules: [],
		},
		{
			day: 'JUEVES',
			checked: false,
			schedules: [],
		},
		{
			day: 'VIERNES',
			checked: false,
			schedules: [],
		},
		{
			day: 'SABADO',
			checked: false,
			schedules: [],
		},
		{
			day: 'DOMINGO',
			checked: false,
			schedules: [],
		},
	]);

	const handleAddressChange = (newAddress: string) => {
		setDomicile(newAddress);

		const geocoder = new google.maps.Geocoder();

		geocoder.geocode({ address: newAddress }, (results, status) => {
			if (status === 'OK' && results![0].geometry) {
				const location = results![0].geometry.location;
				const newCoordinates = {
					lat: location.lat(),
					lng: location.lng(),
				};
				setCoordinates(newCoordinates);
			} else {
				setCoordinates(null);
			}
		});
	};

	const handleCoordinatesFromAddress = () => {
		const geocoder = new google.maps.Geocoder();
		return new Promise((resolve, reject) => {
			geocoder.geocode({ address: domicile }, (results, status) => {
				if (status === 'OK' && results![0]?.geometry?.location) {
					const newCoordinates = {
						lat: results![0].geometry.location.lat(),
						lng: results![0].geometry.location.lng(),
					};
					setCoordinates(newCoordinates);
					resolve(newCoordinates);
				} else {
					console.error('Error geocodificando la dirección:', status);
					reject(status);
				}
			});
		});
	};

	const handleMapClick = async (lat: number, lng: number) => {
		setCoordinates({ lat, lng });

		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=`
			);
			const data = await response.json();
			const newDomicile = data.results[0].formatted_address;
			setDomicile(newDomicile);
		} catch (error) {
			console.error('Error fetching geocode data:', error);
		}
	};

	useEffect(() => {
		async function fetchCategories() {
			try {
				const categories = await findAllCategories();
				setCategoryOptions(categories.data);
				if (placeData) {
					setCategory(placeData.principalCategory!);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchOrganizations() {
			try {
				const organizations = await getAll();
				setOrganizationOptions(organizations.data);
				if (placeData) {
					setOrganization(placeData.organization!);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchServices() {
			try {
				const services = await findAllService();
				setServices(services.data);
				if (placeData) {
					setServices(placeData.services!);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchAccesibility() {
			try {
				const accesibilities = await findAllAccessibility();
				setAccesibilities(accesibilities.data);
				if (placeData) {
					setAccesibilities(placeData.accessibilities!);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		}

		async function fetchPlaceData() {
			try {
				if (id === 'new') {
					// Caso para crear un nuevo lugar
					setEdit(false); // No estamos editando, sino creando un nuevo lugar
				} else if (typeof id === 'string') {
					// Caso para editar un lugar existente
					const place = await findById(id);

					setPlaceData(place.data);
					setName(place.data.name);
					setDescription(place.data.description ? place.data.description : '');
					setNote(place.data.note ? place.data.note : '');
					setUrl(place.data.url ? place.data.url : '');
					setFacebook_url(place.data.facebook_url ? place.data.facebook_url : '');
					setTwitter_url(place.data.twitter_url ? place.data.twitter_url : '');
					setInstagram_url(place.data.instagram_url ? place.data.instagram_url : '');
					setPhone(place.data.phone ? place.data.phone : '');
					setDomicile(place.data.domicile);
					setMinors(place.data.minors);
					setCategory(place.data.principalCategory);
					place.data.location && setCoordinates(place.data.location);
					const categ: Category[] = [];
					place.data.categories.forEach((cat: PlaceCategory) => {
						categ.push(cat.category);
					});
					setCategoriesSelected(categ);
					// setCategoriesSelected(place.data.categories)
					setOrganization(place.data.organization);
					setPhotos(place.data.photos);
					setServiceSelected(place.data.services);
					setAccesibilitiesSelected(place.data.accessibilities);
					const updatedDaysOfWeek = daysOfWeek.map((day) => {
						const schedulesForDay = place.data.schedules.filter(
							(schedule: { dayOfWeek: { name: any } }) =>
								schedule.dayOfWeek.name === day.day
						);
						if (schedulesForDay.length > 0) {
							return {
								...day,
								checked: true,
								schedules: schedulesForDay,
							};
						}
						return day;
					});

					setDayOfWeek(updatedDaysOfWeek);

					setSchedules(place.data.schedules);
					setEdit(true);
					if (placeData && placeData.domicile) {
						handleCoordinatesFromAddress();
					}
				}
			} catch (error) {
				console.error('Error fetching place data:', error);
			}
			setIsLoading(false);
		}

		fetchAccesibility();
		fetchCategories();
		fetchOrganizations();
		fetchPlaceData();
		fetchServices();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleSaveChanges = async (e: React.FormEvent) => {
		e.preventDefault();
		let response;
		try {
			if (edit) {
				if (placeData) {
					const formData = new FormData();
					const updatedSchedules: PlaceSchedule[] = [...schedules];
					console.log(daysOfWeek);
					console.log('antes: ', updatedSchedules);
					daysOfWeek.forEach((day) => {
						if (day.checked) {
							day.schedules.forEach(
								(schedule: { openingHour: string; closingHour: string }) => {
									const existingScheduleIndex = updatedSchedules.findIndex(
										(s) =>
											s.dayOfWeek?.name === day.day &&
											s.openingHour === schedule.openingHour &&
											s.closingHour === schedule.closingHour
									);

									if (existingScheduleIndex === -1) {
										// Only add the schedule if it's not already in updatedSchedules
										updatedSchedules.push({
											place: placeData,
											dayOfWeek: { name: day.day },
											openingHour: schedule.openingHour,
											closingHour: schedule.closingHour,
										});
									}
								}
							);
						}
					});
					console.log('despues: ', updatedSchedules);
					const updatedCategories: PlaceCategory[] = [];
					categoriesSelected.forEach((cat) => {
						updatedCategories.push({
							place: placeData,
							category: cat,
						});
					});
					files.forEach((file) => {
						formData.append('files', file);
					});
					formData.append('id', placeData.id as string);
					formData.append('name', name);
					formData.append('description', description);
					formData.append('note', note);
					formData.append('schedules', JSON.stringify(updatedSchedules));
					formData.append(
						'principalCategory',
						JSON.stringify(principalCategory)
					);
					formData.append('organization', JSON.stringify(organization));
					formData.append('categories', JSON.stringify(updatedCategories));
					formData.append('url', url);
					formData.append('facebook_url', facebook_url);
					formData.append('twitter_url', twitter_url);
					formData.append('instagram_url', instagram_url);
					formData.append('phone', phone);
					formData.append('domicile', domicile);
					formData.append('minors', minors);
					formData.append('origin', placeData.origin!);

					formData.append('location', JSON.stringify(coordinates));
					formData.append('photos', JSON.stringify(photos));
					formData.append('services', JSON.stringify(servicesSelected));
					formData.append(
						'accessibilities',
						JSON.stringify(accesibilitiesSelected)
					);

					response = await putPlace(formData);
				} else {
					console.error('No place data to update.');
				}
			} else {
				const formData = new FormData();
				const updatedSchedules: PlaceSchedule[] = [...schedules];
				daysOfWeek.forEach((day) => {
					if (day.checked) {
						day.schedules.forEach(
							(schedule: { openingHour: string; closingHour: string }) => {
								const existingScheduleIndex = updatedSchedules.findIndex(
									(s) =>
										s.dayOfWeek?.name === day.day &&
										s.openingHour === schedule.openingHour &&
										s.closingHour === schedule.closingHour
								);

								if (existingScheduleIndex === -1) {
									// Only add the schedule if it's not already in updatedSchedules
									updatedSchedules.push({
										place: placeData!,
										dayOfWeek: { name: day.day },
										openingHour: schedule.openingHour,
										closingHour: schedule.closingHour,
									});
								}
							}
						);
					}
				});
				const updatedCategories: PlaceCategory[] = [];
				categoriesSelected.forEach((cat) => {
					updatedCategories.push({
						place: placeData!,
						category: cat,
					});
				});

				files.forEach((file) => {
					formData.append('files', file);
				});
				formData.append('name', name);
				formData.append('description', description);
				formData.append('note', note);
				formData.append('url', url);
				formData.append('facebook_url', facebook_url);
				formData.append('twitter_url', twitter_url);
				formData.append('instagram_url', instagram_url);
				formData.append('phone', phone);
				formData.append('domicile', domicile);
				formData.append('minors', minors);
				formData.append('principalCategory', principalCategory ? JSON.stringify(principalCategory) : '');
				formData.append('categories', updatedCategories ? JSON.stringify(updatedCategories) : '');
				formData.append('organization', organization ? JSON.stringify(organization) : '');
				formData.append('photos', photos ? JSON.stringify(photos) : '');
				formData.append('schedules', updatedSchedules ? JSON.stringify(updatedSchedules) : '');
				formData.append('location', JSON.stringify(coordinates));
				formData.append('services', servicesSelected ? JSON.stringify(servicesSelected) : '');
				formData.append(
					'accessibilities',
					accesibilitiesSelected ? JSON.stringify(accesibilitiesSelected) : ''
				);

				response = await postPlace(formData);
				console.log('Changes saved:', response);
			}
			if (response.statusCode !== 500) {
				router.push(
					{
						pathname: `/places`,
						query: { message: response.message },
					}
				);
			}
			setShowMessage(response.message);
			setShowInfo(true);
		} catch (error) {
			router.push({
				pathname: `/places`,
				query: { message: error as string },
			});
		}
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

	const handleServicesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someServices = servicesSelected;
		someServices = [...values];
		setServiceSelected(someServices);
	};

	const handleAccesibilitiesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someAccessibilities = accesibilitiesSelected;
		someAccessibilities = [...values];
		setAccesibilitiesSelected(someAccessibilities);
	};

	const handleCategoriesChange = async (
		e: React.SyntheticEvent<Element, Event>,
		values: any[]
	) => {
		let someCategories = categoriesSelected;
		someCategories = [...values];
		setCategoriesSelected(someCategories);
	};

	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	const handleOpeningHourChange = (
		newOpeningHour: string,
		dayIndex: number,
		scheduleIndex: string | number
	) => {
		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].schedules[scheduleIndex].openingHour =
			newOpeningHour;
		setDayOfWeek(updatedDaysOfWeek);
	};

	const handleClosingHourChange = (
		newClosingHour: string,
		dayIndex: number,
		scheduleIndex: string | number
	) => {
		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].schedules[scheduleIndex].closingHour =
			newClosingHour;
		setDayOfWeek(updatedDaysOfWeek);
	};

	const removeSchedule = (dayIndex: number, openingHour: string) => {
		const updatedSchedules = schedules;
		const day = daysOfWeek[dayIndex];
		const daySchedules = updatedSchedules.filter(
			(schedule) =>
				schedule.dayOfWeek?.name === day.day &&
				schedule.openingHour === openingHour
		);

		daySchedules.forEach((scheduleToRemove) => {
			const index = updatedSchedules.findIndex(
				(schedule) =>
					schedule.dayOfWeek?.name === scheduleToRemove.dayOfWeek?.name &&
					schedule.openingHour === scheduleToRemove.openingHour &&
					schedule.closingHour === scheduleToRemove.closingHour
			);
			console.log('indice a eliminar', index);
			console.log('lengt', updatedSchedules.length);
			if (index !== -1) {
				updatedSchedules.splice(index, 1);
			}
		});
		console.log('cambio de horario', updatedSchedules);
		setSchedules(updatedSchedules);

		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].schedules = day.schedules.filter(
			(schedule: any) => schedule.openingHour !== openingHour
		);
		setDayOfWeek(updatedDaysOfWeek);
	};

	const addNewSchedule = (dayIndex: number) => {
		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].schedules.push({
			openingHour: '',
			closingHour: '',
		});
		setDayOfWeek(updatedDaysOfWeek);
	};

	const handleDeletePhoto = (index: number) => {
		const updatedPhotos = [...photos];
		updatedPhotos.splice(index, 1); // Elimina la foto del arreglo en el índice proporcionado
		setPhotos(updatedPhotos); // Actualiza el estado con las fotos restantes
	};
	return (
		<div>
			<MainLayout>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<BasicLayout title={edit ? 'Editar lugar' : 'Nuevo lugar'}>
						<form onSubmit={handleSaveChanges}>
							<div style={inputStyle}>
								<Input
									field={{
										name: 'name',
										value: name,
										onChange: (e) => setName(e.target.value),
										onBlur: () => { },
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
										onBlur: () => { },
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
										onBlur: () => { },
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
										onBlur: () => { },
										label: 'Url:',
									}}
									shrink // Agrega shrink
								/>
							</div>
							<div style={inputStyle}>
								<Input
									field={{
										name: 'facebook_url',
										value: facebook_url,
										onChange: (e) => setFacebook_url(e.target.value),
										onBlur: () => { },
										label: 'Facebook:',
									}}
									shrink // Agrega shrink
								/>
							</div>
							<div style={inputStyle}>
								<Input
									field={{
										name: 'twitter_url',
										value: twitter_url,
										onChange: (e) => setTwitter_url(e.target.value),
										onBlur: () => { },
										label: 'Twitter:',
									}}
									shrink // Agrega shrink
								/>
							</div>
							<div style={inputStyle}>
								<Input
									field={{
										name: 'instagram_url',
										value: instagram_url,
										onChange: (e) => setInstagram_url(e.target.value),
										onBlur: () => { },
										label: 'Instagram:',
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
										onBlur: () => { },
										label: 'Telefono:',
									}}
									shrink // Agrega shrink
								/>
							</div>
							<div style={inputStyle}>
								<div style={inputStyle}>
									<Input
										field={{
											name: 'domicile',
											value: domicile,
											onChange: (e) => handleAddressChange(e.target.value),
											onBlur: (e) => setDomicile(e.target.value), // Pasar el valor del domicilio al perder el foco
											label: 'Domicilio:',
										}}
										shrink
									/>
								</div>
							</div>
							<MapChequeoBidireccionalComponent
								coordinates={coordinates}
								onMapClick={handleMapClick}
							/>
							<div style={inputStyle}></div>
							<div style={inputStyle}>
								<TextField
									select
									label='Edad recomendada'
									value={minors}
									onChange={(e) => setMinors(e.target.value)}
									SelectProps={{
										native: true,
									}}
									style={{ width: '100%', fontSize: '16px' }}
									InputLabelProps={{ shrink: true }}
								>
									<option value=''></option>
									<option value='APTA TODO PÚBLICO'>
										Apta para todo publico
									</option>
									<option value='+7'>+7</option>
									<option value='+13'>+13</option>
									<option value='+16'>+16</option>
									<option value='+18'>+18</option>
								</TextField>
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
											label='Categoría principal:'
											InputLabelProps={{ shrink: true }}
										/>
									)}
								/>
							</div>
							<div style={inputStyle}>
								<Autocomplete
									multiple
									options={categoryOptions}
									isOptionEqualToValue={(option: any, value) =>
										option.id === value.id
									}
									getOptionLabel={(option) => option.name}
									onChange={handleCategoriesChange}
									value={categoriesSelected!}
									renderInput={(params: any) => (
										<TextField
											{...params}
											label={'Categorias secundarias'}
											InputLabelProps={{ shrink: true }}
										/>
									)}
								/>
							</div>
							<div style={inputStyle}>
								<Autocomplete
									options={organizationOptions}
									getOptionLabel={(organization) => organization.legalName}
									value={organization}
									onChange={(event, newValue) => setOrganization(newValue)}
									renderInput={(params) => (
										<TextField
											{...params}
											label='Organización:'
											InputLabelProps={{ shrink: true }}
										/>
									)}
								/>
							</div>
							<div style={inputStyle}>
								<Autocomplete
									multiple
									options={services}
									isOptionEqualToValue={(option: any, value) =>
										option.id === value.id
									}
									getOptionLabel={(option) => option.name}
									onChange={handleServicesChange}
									value={servicesSelected!}
									renderInput={(params: any) => (
										<TextField
											{...params}
											label={'Servicios'}
											InputLabelProps={{ shrink: true }}
										/>
									)}
								/>
							</div>
							<div style={inputStyle}>
								<Autocomplete
									multiple
									options={accesibilities}
									isOptionEqualToValue={(option: any, value) =>
										option.id === value.id
									}
									getOptionLabel={(option) => option.name}
									onChange={handleAccesibilitiesChange}
									value={accesibilitiesSelected!}
									renderInput={(params: any) => (
										<TextField
											{...params}
											label={'Accesibilidades'}
											InputLabelProps={{ shrink: true }}
										/>
									)}
								/>
							</div>
							{photos && photos.length > 0 && (
								<Label text={'Imágenes del lugar'} />
							)}
							{/* <div style={inputStyle}>
                <ImageCarousel
                  images={photos.map((photo) => photo.photoUrl)}
                  maxWidth="150px"
                />
              </div> */}

							<div style={inputStyle}>
								{photos && photos.length > 0 && (
									<ImageSlider
										images={photos.map((photo) => photo.photoUrl)}
										onDelete={(index) => handleDeletePhoto(index)}
										sx={{ maxWidth: '1000px' }}
									/>
								)}
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
							<div>
								<Button onClick={handleOpenModal}>Agregar horarios</Button>
								<ModalComponent isOpen={modalOpen} onClose={handleCloseModal}>
									<div>
										<Label text={'Agregar horarios'}></Label>
										{daysOfWeek.map((currentDay, index) => (
											<div
												key={currentDay.day}
												style={{ marginBottom: '10px' }}
											>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<Label text={currentDay.day} />
													<FormControlLabel
														control={
															<Switch
																checked={currentDay.checked}
																onChange={() => {
																	const updatedDaysOfWeek = [...daysOfWeek];
																	updatedDaysOfWeek[index].checked =
																		!updatedDaysOfWeek[index].checked;

																	if (!currentDay.checked) {
																		for (const schedule of updatedDaysOfWeek[
																			index
																		].schedules) {
																			removeSchedule(
																				index,
																				schedule.openingHour
																			);
																		}
																	}
																	setDayOfWeek(updatedDaysOfWeek);
																	setShowScheduleInputs(!showScheduleInputs);
																}}
															/>
														}
														label={currentDay.checked ? 'Abierto' : 'Cerrado'}
														style={{ margin: 'auto' }}
													/>
												</div>
												{currentDay.checked && (
													<div style={{ marginLeft: '40px' }}>
														{currentDay.schedules.map(
															(
																schedule: {
																	openingHour:
																	| string
																	| number
																	| readonly string[]
																	| undefined;
																	closingHour:
																	| string
																	| number
																	| readonly string[]
																	| undefined;
																},
																scheduleIndex: number
															) => (
																<div key={scheduleIndex}>
																	<div
																		style={{
																			marginBottom: '10px',
																			display: 'flex',
																			alignItems: 'center',
																			gap: '10px',
																		}}
																	>
																		<input
																			type='time'
																			value={schedule.openingHour}
																			onChange={(e) =>
																				handleOpeningHourChange(
																					e.target.value,
																					index,
																					scheduleIndex
																				)
																			}
																		/>

																		<input
																			type='time'
																			value={schedule.closingHour}
																			onChange={(e) =>
																				handleClosingHourChange(
																					e.target.value,
																					index,
																					scheduleIndex
																				)
																			}
																		/>
																		<IconButton
																			onClick={() =>
																				removeSchedule(
																					index,
																					schedule.openingHour as string
																				)
																			}
																			aria-label='Remove schedule'
																		>
																			<CloseIcon />
																		</IconButton>
																	</div>
																</div>
															)
														)}
														<Button
															onClick={() => addNewSchedule(index)}
															color='primary'
															variant='text'
														>
															Agregar horario
														</Button>
													</div>
												)}
											</div>
										))}

										<Button onClick={handleCloseModal}>Cerrar</Button>
									</div>
								</ModalComponent>
							</div>
							<br />
							{showInfo && (
								<Alert
									label={showMessage}
									severity='info'
									onClose={() => setShowInfo(false)}
								/>
							)}
							<br />
							<Button type='submit'>Guardar cambios</Button>

						</form>

					</BasicLayout>
				)}
			</MainLayout>
		</div>
	);
};

export default EditPlace;
