import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapOptions: google.maps.MapOptions = {
  zoomControl: true,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: true,
  rotateControl: false,
  scaleControl: false,
  panControl: false,
};

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [inputAddress, setInputAddress] = useState("");

  const handleMapClick = async (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkers([...markers, newMarker]);

    const geocoder = new google.maps.Geocoder();
    await geocoder.geocode({ location: event.latLng }, (results, status) => {
      if (status === "OK") {
        setSelectedAddress(results[0].formatted_address);
      }
    });
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleDeleteMarker = () => {
    const updatedMarkers = markers.filter(
      (marker) => marker !== selectedMarker
    );
    setMarkers(updatedMarkers);
    setSelectedMarker(null);
    setSelectedAddress("");
  };

  const handleSearchAddress = async () => {
    if (inputAddress) {
      const completeAddress = `${inputAddress}, U9120 Puerto Madryn, Chubut, Argentina`;
      const geocoder = new google.maps.Geocoder();
      await geocoder.geocode(
        { address: completeAddress },
        (results, status) => {
          if (status === "OK" && results[0].geometry) {
            const newMarker = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            };
            setMarkers([...markers, newMarker]);
            setMapCenter(newMarker);
            setSelectedMarker(newMarker);
            setSelectedAddress(results[0].formatted_address);
          } else {
            console.log("No se pudo encontrar la dirección ingresada.");
          }
        }
      );
    }
  };

  const setMapCenter = (position) => {
    map && map.panTo(position);
  };

  return (
    <LoadScript googleMapsApiKey="" libraries={["places"]}>
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: -42.767197, lng: -65.036468 }}
          zoom={16}
          options={mapOptions}
          onLoad={(map) => setMap(map)}
          onClick={handleMapClick}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}
        </GoogleMap>
        {selectedMarker && (
          <div className="marker-info">
            <p>{`Dirección: ${selectedAddress}`}</p>
            <button onClick={handleDeleteMarker}>Eliminar Marcador</button>
          </div>
        )}
      </div>

      <div className="address-search">
        <input
          type="text"
          placeholder="Escribe una dirección"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
        />
        <button onClick={handleSearchAddress}>Buscar y Marcar</button>
      </div>
      <style jsx>{`
        .map-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .marker-info {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .address-search {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
        }

        .address-search input {
          margin-right: 10px;
          padding: 5px;
        }

        .address-search button {
          padding: 5px 10px;
        }
      `}</style>
    </LoadScript>
  );
};

export default MapComponent;
