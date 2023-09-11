import CardCarousel from "@/components/Card/CardCarousel";
import Input from "@/components/Input/Input";
import GenericMap from "@/components/Map/GenericMap";
import { findAll } from "@/features/Places/hooks/useFindAllQuery";
import { findByDistance } from "@/features/Places/hooks/useFindByDistance";
import { Place } from "@/features/Places/place";
import MainLayout from "@/layouts/MainLayout";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";
import { Category } from "@/features/Categories/category";
import { findByCategory } from "@/features/Places/hooks/useFindByCategory";
import { findAllCategories } from "@/features/Categories/hooks/useFindAllQuery";

const HomePage = () => {
  const router = useRouter();
  const { place_id } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categorySeleccionada, setCategory] = useState<Category | null>(null);
  const [list, setList] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null); // Estado para el lugar seleccionado
  const [selectedCardIndex, setSelectedCardIndex] = useState<
    number | undefined
  >(undefined);
  // const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // Estado para la ubicación del usuario

  //useEffect(() => {
  //  fetchPlaceData();
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, [userLocation]);

  useEffect(() => {
    // setShowLocationDialog(true);
    fetchCategories();
    fetchPlaceData();
    handleRequestLocation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPlaceData(); // Llama a fetchPlaceData cuando la categoría cambie
  }, [categorySeleccionada, userLocation]);

  async function fetchCategories() {
    try {
      const categories = await findAllCategories();
      setCategoryOptions(categories.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchPlaceData() {
    try {
      let somePlaces;
      if (categorySeleccionada) {
        somePlaces = await findByCategory(categorySeleccionada.id);
      } else if (userLocation) {
        somePlaces = await findByDistance(userLocation.lat, userLocation.lng);
      } else {
        somePlaces = await findAll();
      }

      if (place_id) {
        const placeSelected = somePlaces.data.find(
          (p: { id: string | string[] }) => p.id === place_id
        );
        setSelectedPlace(placeSelected);
        const indexSelected = somePlaces.data.findIndex(
          (p: { id: string | string[] }) => p.id === place_id
        );
        setSelectedCardIndex(indexSelected);
      } else {
        setSelectedPlace(somePlaces.data[0]);
        setSelectedCardIndex(0);
      }
      setList(somePlaces.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
    setIsLoading(false);
  }

  const handleCardClick = (place: Place) => {
    router.push(`/places/${place.id}`);
  };

  const handleMarkerClick = (place: Place, cardIndex: number) => {
    setSelectedCardIndex(cardIndex);
  };

  const handleCardCentered = (index: number) => {
    setSelectedCardIndex(index); // Actualiza el índice de la tarjeta centrada
    const selectedPlace = list[index];
    setSelectedPlace(selectedPlace);
  };

  const handleRequestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
      { enableHighAccuracy: true } // Desactiva el cuadro de diálogo predeterminado del navegador
    );
    // setShowLocationDialog(false);
  };

  // const handleCloseLocationDialog = () => {
  //   setShowLocationDialog(false);
  // };

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div
            style={{
              margin: 10,
              width: "95vw",
              flexDirection: "row",
              display: "flex",
            }}
          >
            <div style={{ width: "90vw" }}>
              <Autocomplete
                options={categoryOptions}
                getOptionLabel={(category) => category.name}
                value={categorySeleccionada}
                onChange={(event, newValue) => {
                  setCategory(newValue); // Actualiza el estado con la nueva selección
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="¿Qué buscas?"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </div>
            <IconButton
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                margin: "0.2rem",
                "&:hover": {
                  backgroundColor: "white",
                },
                width: "5vw",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "12px",
              }}
              size="large"
              onClick={() => router.push("/places")}
            >
              <ViewDayIcon style={{ color: "#8EA2A5" }} />
            </IconButton>
          </div>
          <GenericMap
            places={list}
            selectedPlace={selectedPlace}
            onMarkerClick={(place, index) => handleMarkerClick(place, index)}
            centerCardIndex={selectedCardIndex}
            userLocation={userLocation}
          />
          <CardCarousel
            cards={list}
            onCardClick={handleCardClick}
            centerCardIndex={selectedCardIndex}
            onCardCentered={handleCardCentered}
          />
        </>
      )}
      {/* {"geolocation" in navigator ? (
        <Dialog open={showLocationDialog} onClose={handleCloseLocationDialog}>
          <DialogTitle>Permisos de Ubicación</DialogTitle>
          <DialogContent>
            <p>
              Esta aplicación necesita acceder a tu ubicación para funcionar
              correctamente. ¿Deseas permitir el acceso a la ubicación?
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLocationDialog} color="primary">
              No
            </Button>
            <Button onClick={handleRequestLocation} color="primary">
              Sí
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )} */}
    </MainLayout>
  );
};

export default HomePage;
