// import React from "react";
// import { GoogleMap, LoadScript } from "@react-google-maps/api";

// const MapComponent = ({ center, zoom, mapOptions, width, height }) => {
//   return (
//     <LoadScript
//       googleMapsApiKey={process.env.GOOGLE_APIKEY!}
//       libraries={["places"]}
//     >
//       <div className="map-container">
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "100%" }}
//           center={{ lat: -42.767197, lng: -65.036468 }}
//           zoom={16}
//           options={mapOptions}
//           onLoad={(map) => setMap(map)}
//           onClick={handleMapClick}
//         >
//           {markers.map((marker, index) => (
//             <Marker
//               key={index}
//               position={marker}
//               onClick={() => handleMarkerClick(marker)}
//             />
//           ))}
//         </GoogleMap>
//         {selectedMarker && (
//           <div className="marker-info">
//             <p>{`Dirección: ${markerAddresses[markers.indexOf(selectedMarker)] ||
//               selectedMarker.address
//               }`}</p>
//             <button onClick={handleDeleteMarker}>Eliminar Marcador</button>
//           </div>
//         )}
//       </div>

//       <div className="search-button">
//         {showSearch ? (
//           <div className="search-input">
//             <IconButton onClick={handleCloseSearch}>
//               <CloseIcon fontSize="large" style={{ color: "#3FA7CD" }} />
//             </IconButton>
//             <PlacesAutocomplete
//               value={inputAddress}
//               onChange={setInputAddress}
//               onSelect={async (address) => {
//                 setInputAddress(address);
//                 const results = await geocodeByAddress(address);
//                 if (results && results.length > 0) {
//                   const latLng = await getLatLng(results[0]);
//                   handleSearchAddress(latLng);
//                 }
//               }}
//             >
//               {({ getInputProps, suggestions, getSuggestionItemProps }) => (
//                 <div>
//                   <TextField
//                     id="outlined-basic"
//                     variant="outlined"
//                     {...getInputProps({
//                       placeholder: "Escribe una dirección",
//                     })}
//                   />

//                   <div className="autocomplete-dropdown-container">
//                     {suggestions.map((suggestion, index) => {
//                       const className = suggestion.active
//                         ? "suggestion-item--active"
//                         : "suggestion-item";
//                       return (
//                         <div
//                           key={index}
//                           {...getSuggestionItemProps(suggestion, {
//                             className,
//                           })}
//                         >
//                           <span>{suggestion.description}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </PlacesAutocomplete>
//             <IconButton onClick={handleSearchButtonClick}>
//               <AddLocationIcon fontSize="large" style={{ color: "#E6BE17" }} />
//             </IconButton>
//           </div>
//         ) : (
//           <IconButton onClick={handleAddLocationClick}>
//             <PlaceIcon style={{ color: "#984D98" }} />
//           </IconButton>
//         )}
//       </div>
//       <style jsx>{`
//         .map-container {
//           width: 100%;
//           height: 100%;
//           position: relative;
//         }

//         .marker-info {
//           position: absolute;
//           top: 10px;
//           left: 10px;
//           background-color: white;
//           padding: 10px;
//           border-radius: 5px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//         }

//         .search-button {
//           position: absolute;
//           background-color: white;
//           top: 390px;
//           right: 18px; /* Cambia el valor de "right" a "left" */
//           z-index: 1;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//         }
//         .search-input {
//           display: flex;
//           align-items: center;
//           padding: 3px;
//           border-radius: 3px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           margin-top: 3px;
//           width: 270px; /* Ancho ajustable según tus preferencias */
//         }
//         .search-input input {
//           flex: 1;
//           padding: 2px;
//         }
//         .search-input button {
//           padding: 4px;
//         }

//         .autocomplete-container {
//           width: 100%;
//         }

//         .autocomplete-dropdown-container {
//           position: relative;
//           background-color: white;
//           border: 1px solid #ccc;
//           border-top: none;
//           width: 100%;
//           max-height: 200px;
//           overflow-y: auto;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//         }

//         /* Estilos específicos para dispositivos móviles */
//         @media (max-width: 768px) {
//           .search-input input {
//             margin-right: 2px;
//             padding: 1px;
//           }

//           .search-button {
//             padding: 1px 2px;
//           }
//         }
//       `}</style>
//     </LoadScript>
//   );
// };

// export default MapComponent;
