import React, { useState } from "react";
import Label from "../Label/Label";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Rating from "@/components/Rating/Rating";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import CallIcon from "@mui/icons-material/Call";

type CardProps = {
  id?: string;
  title: string;
  rating: number;
  description: string;
  photoUrl?: string;
  onClick: () => void;
  onClickTalk: () => void;
  onClickShare: () => void;
};
const MyCard: React.FC<CardProps> = ({
  title,
  rating,
  description,
  photoUrl,
  onClick,
  onClickTalk,
  onClickShare,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "row", // Cambiamos la dirección a fila para tener la imagen a la derecha
        cursor: "pointer",
        transform: isHovered ? "scale(1.05)" : "scale(1)", // Agranda un poco la tarjeta al pasar el mouse por encima
        transition: "transform 0.3s ease", // Agrega una transición suave
        backgroundColor: "#F3F5F6",
        borderRadius: 5,
        margin: 1,
        boxShadow: "none", // Elimina la sombra
      }}
    >
      <CardActionArea>
        <CardContent>
          <Label id={"card_title"} text={title} />
          <Rating
            value={rating}
            size="medium"
            color="gold"
            emptyColor="#8EA2A5"
          />

          <Label id={"card_description"} text={description} />
          <div>
            <IconButton
              onClick={onClickTalk}
              sx={{
                backgroundColor: "#8EA2A5",
                borderRadius: "50%", // Hace que el botón sea redondo
                margin: "0.5rem", // Ajusta el espaciado entre botones
                "&:hover": {
                  backgroundColor: "#8EA2A5", // Puedes ajustar el color de hover si es necesario
                },
              }}
              size="medium"
            >
              <CallIcon style={{ color: "white" }} /> {/* Icono en blanco */}
            </IconButton>
            <IconButton
              onClick={onClickShare}
              sx={{
                backgroundColor: "#8EA2A5",
                borderRadius: "50%",
                margin: "0.5rem",
                "&:hover": {
                  backgroundColor: "#8EA2A5",
                },
              }}
              size="medium"
            >
              <ShareIcon style={{ color: "white" }} /> {/* Icono en blanco */}
            </IconButton>
          </div>
        </CardContent>
      </CardActionArea>
      <CardMedia
        component="img"
        height="220" // Ajusta la altura al 100% de la card
        width="40%"
        image={photoUrl}
        alt={title}
        sx={{
          objectFit: "cover",
          mt: "auto",
          margin: 1,
          borderRadius: 5,
          overflow: "hidden", // Recorta el contenido que exceda los límites
        }}
      />
    </Card >
  );
};

export default MyCard;
