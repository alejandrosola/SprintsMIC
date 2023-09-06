import Card from '@/components/Card/Card';
import { findAll } from '@/features/Places/hooks/useFindAllQuery';
import { Place } from '@/features/Places/place';
import BasicLayout from '@/layouts/BasicLayout';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';


const CardList: React.FC = () => {
  const [list, setList] = useState<JSX.Element[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPlaceData() {
      try {
        const somePlaces = await findAll();
        console.log (somePlaces.data)
        if (Array.isArray(somePlaces.data)) {
          const placeList = somePlaces.data.map((placeDato: Place, i: number) => (
            <div key={i}>
              <Card 
                title={placeDato.name}
                content={placeDato.description}
                photoUrl={placeDato.photos.length > 0 ? placeDato.photos[0].photoUrl : "https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg"}
                id={placeDato.id}
                onClick={() => handleCardClick(placeDato.id!)} // Pasa el id directamente aquí
              />
            </div>
          ));
          setList(placeList);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    }

    fetchPlaceData();
  }, []);

  const handleCardClick = (id: string) => {
    router.push(`/places/${id}`);
  };

  return (
    <div>
      <MainLayout>
        <BasicLayout title='Lugares'>
          <div>
            {list}
          </div>
        </BasicLayout>
      </MainLayout>
    </div>
  );
};

export default CardList;