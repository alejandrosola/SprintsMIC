import Carousel from "@/components/ImageCarousel/Carousel";
import Label from "@/components/Label/Label";
import Rating from '@/components/Rating/Rating';
import ScheduleAccordion from "@/components/ScheduleAccordion/ScheduleAccordion";
import Loading from '@/components/Loading/Loading';
import Tag from '@/components/Tag/Tag';
import TagCategory from "@/components/Tag/TagCategory";
import { findById } from "@/features/Places/hooks/useFindByIdQuery";
import { Place } from "@/features/Places/place";
import MainLayout from "@/layouts/MainLayout";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MapIcon from '@mui/icons-material/Map';

const ViewCard: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(true);

  const [placeData, setPlaceData] = useState<Place | null>(null);

  useEffect(() => {
    async function fetchPlaceData() {
      try {
        if (typeof id === "string") {
          const place = await findById(id);
          setPlaceData(place.data);
        }
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
      setIsLoading(false)
    }
    fetchPlaceData();
  }, [id]);

  const toMap = (id: string) => {
    router.push({
      pathname: '/home',
      query: { place_id: id },
    });
  }

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {placeData && (
            <div style={{
              padding: 10,
            }}>
              {/* Title - Rating */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 10,
                  paddingRight: 10
                }}>
                <Label id={"card_title"} text={placeData.name!} />
                <Rating value={4} size="medium" color="gold" emptyColor="#8EA2A5" />
              </div>

              {/* PrincipalCategory - Categories */}
              <div
                style={{
                  overflowX: 'auto', // Agrega un desbordamiento horizontal
                  whiteSpace: 'nowrap', // Evita el ajuste de línea
                  maxWidth: '100%', // Ajusta el ancho máximo según tus necesidades
                }}
              >
                <TagCategory text={placeData.principalCategory!.name} />
                {placeData.categories!.map((category, index) => (
                  <TagCategory key={index} text={category.name} />
                ))}
              </div>

              {/* Address - To Map */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: "#8EA2A5",
                    borderRadius: "50%",
                    margin: "0.2rem",
                    "&:hover": {
                      backgroundColor: "#8EA2A5",
                    },
                  }}
                  size="small"
                  onClick={() => toMap(placeData.id!)}
                >
                  <MapIcon style={{ color: "white" }} />
                </IconButton>
                <Label id={"card_description"} text={placeData.domicile} />
              </div>

              {/* Card - Info */}
              {(placeData.note || placeData.url || placeData.facebook_url || placeData.instagram_url || placeData.twitter_url || placeData.phone) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#F3F5F6",
                    borderRadius: 5,
                    padding: 10,
                    margin: 10,
                    boxShadow: "none"
                  }}
                >
                  <div
                    style={{
                      display: "flex"
                    }}
                  >
                    <Tag text="Nosotros" />
                  </div>
                  <div
                    style={{
                      padding: 5,
                    }}
                  >
                    <Label id={"card_description"} text={placeData.note} />
                    {placeData.url && (
                      <IconButton
                        sx={{
                          backgroundColor: "#8EA2A5",
                          borderRadius: "50%",
                          margin: "0.2rem",
                          "&:hover": {
                            backgroundColor: "#8EA2A5",
                          },
                        }}
                        size="small"
                        onClick={() => {
                          let url = placeData.url;
                          if (!/^https?:\/\//i.test(url)) {
                            url = `https://${url}`;
                          }
                          window.open(url, "_blank");
                        }}
                      >
                        <LanguageIcon style={{ color: "white" }} />
                      </IconButton>
                    )}

                    {placeData.facebook_url && (
                      <IconButton
                        sx={{
                          backgroundColor: "#1877F2",
                          borderRadius: "50%",
                          margin: "0.2rem",
                          "&:hover": {
                            backgroundColor: "#0F65DA",
                          },
                        }}
                        size="small"
                        onClick={() => {
                          let url = placeData.facebook_url;
                          if (!/^https?:\/\//i.test(url)) {
                            url = `https://${url}`;
                          }
                          window.open(url, "_blank");
                        }}
                      >
                        <FacebookIcon style={{ color: "white" }} />
                      </IconButton>
                    )}

                    {placeData.instagram_url && (
                      <IconButton
                        sx={{
                          backgroundColor: "#E4405F",
                          borderRadius: "50%",
                          margin: "0.2rem",
                          "&:hover": {
                            backgroundColor: "#D5354A",
                          },
                        }}
                        size="small"
                        onClick={() => {
                          let url = placeData.instagram_url;
                          if (!/^https?:\/\//i.test(url)) {
                            url = `https://${url}`;
                          }
                          window.open(url, "_blank");
                        }}
                      >
                        <InstagramIcon style={{ color: "white" }} />
                      </IconButton>
                    )}

                    {placeData.twitter_url && (
                      <IconButton
                        sx={{
                          backgroundColor: "#1DA1F2",
                          borderRadius: "50%",
                          margin: "0.2rem",
                          "&:hover": {
                            backgroundColor: "#0B7BBF",
                          },
                        }}
                        size="small"
                        onClick={() => {
                          let url = placeData.twitter_url;
                          if (!/^https?:\/\//i.test(url)) {
                            url = `https://${url}`;
                          }
                          window.open(url, "_blank");
                        }}
                      >
                        <TwitterIcon style={{ color: "white" }} />
                      </IconButton>
                    )}

                    {placeData.phone && (
                      <IconButton
                        sx={{
                          backgroundColor: "#25D366",
                          borderRadius: "50%",
                          margin: "0.2rem",
                          "&:hover": {
                            backgroundColor: "#1DB954",
                          },
                        }}
                        size="small"
                        onClick={() => {
                          const phoneNumber = placeData.phone;
                          const whatsappURL = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneNumber)}`;
                          window.open(whatsappURL, "_blank");
                        }}
                      >
                        <WhatsAppIcon style={{ color: "white" }} />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}

              {/* Card - Schedules */}
              {placeData.schedules && placeData.schedules.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#F3F5F6",
                    borderRadius: 5,
                    paddingLeft: 10,
                    margin: 10,
                    boxShadow: "none"
                  }}
                >
                  <ScheduleAccordion schedules={placeData.schedules!} />
                </div>) : null}

              {/* Card - Images */}
              {placeData.photos!.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#F3F5F6",
                    borderRadius: 5,
                    padding: 10,
                    margin: 10,
                    boxShadow: "none"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: 10
                    }}
                  >
                    <Tag text="Fotos" />
                  </div>
                  <Carousel images={placeData.photos!.map((photo) => photo.photoUrl)} />
                </div>
              )}

              {/* Card - Services */}
              {placeData.services!.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#F3F5F6",
                    borderRadius: 5,
                    padding: 10,
                    margin: 10,
                    boxShadow: "none"
                  }}
                >
                  <div
                    style={{
                      display: "flex"
                    }}
                  >
                    <Tag text="Servicios" />
                  </div>
                  <div
                    style={{
                      padding: 5,
                    }}
                  >
                    {placeData.services!.map((service) => (
                      <div style={{ display: "flex", alignItems: "flex-start", margin: 2 }} key={service.id}>
                        <CheckCircleIcon style={{ color: "#8EA2A5" }} />
                        <Label id={"card_description"} text={service.name} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card - Accesibilities */}
              {placeData.accessibilities!.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#F3F5F6",
                    borderRadius: 5,
                    padding: 10,
                    margin: 10,
                    boxShadow: "none"
                  }}
                >
                  <div
                    style={{
                      display: "flex"
                    }}
                  >
                    <Tag text="Accesibilidades" />
                  </div>
                  <div
                    style={{
                      padding: 5,
                    }}
                  >
                    {placeData.accessibilities!.map((accessibilitie) => (
                      <div style={{ display: "flex", alignItems: "flex-start", margin: 2 }} key={accessibilitie.id}>
                        <CheckCircleIcon style={{ color: "#8EA2A5" }} />
                        <Label id={"card_description"} text={accessibilitie.name} />
                      </div>
                    ))}
                    {/* <Label text={placeData.url} /> */}
                    {/* <Label text={placeData.phone} /> */}


                  </div>
                  {/* <Label id={"card_description"} text={placeData.description} /> */}

                </div>
              )}
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default ViewCard;
