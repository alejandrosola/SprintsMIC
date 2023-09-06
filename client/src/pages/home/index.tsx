import React from "react";
import MainLayout from "@/layouts/MainLayout";
import MapComponent from "@/components/Map/Map";

const HomePage = () => {
  return (
    <MainLayout>
      <MapComponent></MapComponent>
    </MainLayout>
  );
};

export default HomePage;
