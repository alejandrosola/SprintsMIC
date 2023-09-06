import Button from '@/components/Button/Button';
import Image from '@/components/Image/Image';
import ImageCarousel from '@/components/ImageCarousel/ImageCarousel';
import Label from '@/components/Label/Label';
import ScheduleAccordion from '@/components/ScheduleAccordion/ScheduleAccordion';
import { findById } from '@/features/Places/hooks/useFindByIdQuery';
import { Place } from '@/features/Places/place';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import myScreenshot from './map.png';

const ViewCard: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const [placeData, setPlaceData] = useState<Place | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [screenshotUrl, setScreenshotUrl] = useState('');
	const handleModalOpen = (screenshotUrl: string) => {
		setScreenshotUrl(screenshotUrl);
		setModalOpen(true);
	};
	useEffect(() => {
		async function fetchPlaceData() {
			try {
				if (typeof id === 'string') {
					const place = await findById(id);
					console.log(
						'🚀 ~ file: [id].tsx:33 ~ fetchPlaceData ~ place:',
						place.data
					);
					setPlaceData(place.data);
				}
			} catch (error) {
				console.error('Error fetching place data:', error);
			}
		}
		fetchPlaceData();
	}, [id]);

	const handleEditClick = (id: string) => {
		router.push(`/places/edit/${id}`);
	};

	return (
		<div>
			<MainLayout>
				<BasicLayout title={placeData ? placeData.name : ''}>
					{placeData && (
						<div>
							<div>
								{/* Adjust the button placement for mobile */}
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button onClick={() => handleEditClick(placeData.id!)}>
										Editar
									</Button>
								</div>
								{/* <Label text={placeData.description} /> */}
								<Label text={placeData.note} />
								<Label text={placeData.url} />
								<Label text={placeData.phone} />
								{placeData.domicile}
								<LocationOnIcon
									onClick={() => handleModalOpen(myScreenshot.src)}
								/>
							</div>
							<br />
							<ScheduleAccordion schedules={placeData.schedules} />
							<div>
								<br />
								<ImageCarousel
									images={placeData.photos.map((photo) => photo.photoUrl)}
									maxWidth='500px'
								/>
							</div>
						</div>
					)}
				</BasicLayout>
			</MainLayout>
			<Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
				<DialogTitle>Ubicación</DialogTitle>
				<DialogContent>
					<Image src={screenshotUrl} alt='Captura de pantalla' />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ViewCard;
