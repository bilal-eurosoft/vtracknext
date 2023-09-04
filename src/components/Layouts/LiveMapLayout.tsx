"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import carpng from "../../../public/Images/703693_gps_512x512.png";
import { StaticImageData } from "next/image";
import { CarMapList } from "@/types/vehicle";

const CarMap: React.FC<CarMapList> = ({ carData }) => {
  const positions: [number, number][] = carData?.map((data) => [
    data.gps.latitude,
    data.gps.longitude,
  ]);

  const pos: string[] = carData?.map((datas) => datas?.vehicleNo);

  // Calculate the center of the positions
  const center: [number, number] = positions.reduce(
    (acc, [lat, lon]) => [acc[0] + lat, acc[1] + lon],
    [0, 0]
  );
  center[0] /= positions.length;
  center[1] /= positions.length;

  // Set zoom level
  const zoom = 12; // Adjust the zoom level as needed

  // Custom icon
  const customIcon = new Icon({
    iconUrl: (carpng as StaticImageData).src,
    iconSize: [38, 38], // Adjust the size as needed
  });

  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "800px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>'
        />

        {positions.map((position, index) => (
          <Marker key={index} position={position} icon={customIcon}>
            <Popup>
              <div>
                <h2>
                  {carData[index]?.vehicleMake} {carData[index]?.vehicleModel}
                </h2>
                <p>IMEI: {carData[index]?.IMEI}</p>
                <p>Location: {carData[index]?.OSM?.display_name}</p>
                <p>Timestamp: {carData[index]?.timestamp}</p>
              </div>
            </Popup>
            <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent>
              {pos[index]}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default CarMap;
