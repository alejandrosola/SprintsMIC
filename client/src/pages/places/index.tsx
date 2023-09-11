import Card from "@/components/Card/Card";
import { Category } from "@/features/Categories/category";
import { findAllCategories } from "@/features/Categories/hooks/useFindAllQuery";
import { findAll } from "@/features/Places/hooks/useFindAllQuery";
import { findByCategory } from "@/features/Places/hooks/useFindByCategory";
import { findByDistance } from "@/features/Places/hooks/useFindByDistance";
import { Place } from "@/features/Places/place";
import MainLayout from "@/layouts/MainLayout";
import MapIcon from "@mui/icons-material/Map";
import Loading from "@/components/Loading/Loading";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const CardList: React.FC = () => {
  const [list, setList] = useState<Place[]>([]);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // Estado para la ubicación del usuario
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categorySeleccionada, setCategory] = useState<Category | null>(null);

  const handleRequestLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching places:", error);
      }
    );
  };

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

      setList(somePlaces.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
    console.log(userLocation);
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await findAllCategories();
        setCategoryOptions(categories.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    setIsLoading(true);
    fetchCategories();
    fetchPlaceData();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, categorySeleccionada]);

  const handleCardClick = (id: string) => {
    router.push(`/places/${id}`);
  };

  const handleTalkClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleShareClick = (placeData: Place) => {
    if (navigator.share) {
      navigator
        .share({
          title: placeData.name,
          text: placeData.description,
          url: window.location.href,
        })
        .then(() => console.log("Contenido compartido exitosamente"))
        .catch((error) => console.error("Error al compartir:", error));
    } else {
      console.log(
        "La función de compartir no está disponible en este navegador."
      );
      // Aquí podrías implementar tu propia lógica de compartir en caso de que la API no esté disponible
    }
  };

  const handleIconButtonClick = () => {
    // Usa history.push para navegar a la página /places
    router.push("/home");
  };

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
            {/* <div style={{ width: "90vw" }}>
				  <Input
					id="search"
					field={{
					  name: "¿Qué buscas?",
					  onChange: (e) => console.log(e.target.value),
					  label: "¿Qué buscas?",
					}}
				  />
				</div> */}
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
              onClick={handleIconButtonClick}
            >
              <MapIcon style={{ color: "#8EA2A5" }} />
            </IconButton>
          </div>

          <div>
            {list.map((placeData: Place, i: number) => (
              <div key={i}>
                <Card
                  title={placeData.name || ""}
                  rating={4}
                  description={placeData.description}
                  photoUrl={
                    placeData.photos!.length > 0
                      ? placeData.photos![0].photoUrl
                      : "https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                  }
                  id={placeData.id}
                  onClickTalk={() => handleTalkClick(placeData.phone)}
                  onClick={() => handleCardClick(placeData.id!)}
                  onClickShare={() => handleShareClick(placeData)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default CardList;
