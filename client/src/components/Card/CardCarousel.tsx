import React, { useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Place } from "@/features/Places/place";
import MyCard from "./Card";
import router from "next/router";

const CardCarousel: React.FC<{
  cards: Place[];
  onCardClick: (place: Place) => void;
  centerCardIndex: number | undefined;
  onCardCentered: (index: number) => void;
}> = ({ cards, onCardClick, centerCardIndex, onCardCentered }) => {
  const sliderRef = useRef<Carousel>(null);

  const handleSlideChange = (index: number) => {
    onCardCentered(index);
    const selectedPlaceId = cards[index]?.id;

    // Actualiza la URL con el ID del lugar seleccionado
    if (selectedPlaceId) {
      router.push({
        pathname: "/home",
        query: { place_id: selectedPlaceId },
      });
    }
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
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "transparent",
      }}
    >
      <Carousel
        ref={sliderRef}
        selectedItem={centerCardIndex}
        onChange={handleSlideChange}
        emulateTouch={true}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
      >
        {cards.map((card, index) => (
          <div key={index}>
            <MyCard
              onClick={() => onCardClick(card)}
              onClickTalk={function (): void {
                handleTalkClick(card.phone);
              }}
              onClickShare={function (): void {
                handleShareClick(card);
              }}
              {...card}
              title={card.name!}
              rating={4}
              description={card.description}
              photoUrl={
                card.photos!.length > 0
                  ? card.photos![0].photoUrl
                  : "https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
              }
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CardCarousel;
