import React, { useEffect, useState } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';

import { Place } from '@/features/Places/place';

interface GoogleMapProps {
	places: Place[];
}

const containerStyle = {
	width: '100%',
	height: '100%',
};

const center = {
	lat: -42.767197,
	lng: -65.036468,
};

const GenericMap: React.FC<
	GoogleMapProps & {
		selectedPlace: Place | null;
		onMarkerClick: (place: Place, index: number) => void;
		centerCardIndex: number | undefined;
		userLocation: { lat: number; lng: number } | null;
	}
> = ({
	places = [],
	selectedPlace,
	onMarkerClick,
	centerCardIndex,
	userLocation,
}) => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: '', // Coloca aquí tu clave de API de Google Maps
	});

	const [map, setMap] = useState<google.maps.Map | null>(null); // Estado para el mapa

	useEffect(() => {
		if (map && selectedPlace) {
			map.panTo(selectedPlace.location!);
		}
	}, [map, selectedPlace]);

	if (loadError) return <div>Error al cargar el mapa</div>;
	if (!isLoaded) return <div>Cargando...</div>;

	const handleMapLoad = (map: google.maps.Map) => {
		setMap(map);
		map.setOptions({
			minZoom: 3.5,
			maxZoom: 20,
		});
	};

	const handleMarkerClick = (place: Place) => {
		onMarkerClick(place, places.indexOf(place));
	};

	return (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={center}
			zoom={15}
			onLoad={handleMapLoad}
		>
			{/* Agrega un marcador para la ubicación del usuario */}
			{userLocation && (
				<MarkerF
					position={userLocation}
					icon={{
						url: '/userMarker.png', // Personaliza el icono del usuario
						scaledSize: new window.google.maps.Size(15, 27.5),
					}}
					title='Mi ubicación' // Agrega un mensaje personalizado
				/>
			)}
			{places.map((place, index) => {
				const isMarkerSelected = index === centerCardIndex;

				return (
					<MarkerF
						key={place.id + (isMarkerSelected ? '-selected' : '')} // Agrega "-selected" si el marcador está seleccionado
						position={place.location!}
						onClick={() => {
							handleMarkerClick(place);
						}}
						icon={{
							url: isMarkerSelected ? '/markerSelected.png' : '/marker.png',
							scaledSize: new window.google.maps.Size(15, 27.5),
						}}
						animation={
							isMarkerSelected ? window.google.maps.Animation.BOUNCE : undefined
						}
					/>
				);
			})}
		</GoogleMap>
	);
};

export default GenericMap;
