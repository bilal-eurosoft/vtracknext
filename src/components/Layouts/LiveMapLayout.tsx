"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CarMapList } from "@/types/vehicle";
import   RedCar  from "../../../public/redcar.svg";
import   GreenCar  from "../../../public/greencar.svg";
import   YellowCar  from "../../../public/yellowcar.svg";

import L from "leaflet";

const CarMap: React.FC<CarMapList> = ({ carData }) => {
  const positions: [number, number][] = carData?.map((data) => [
    data.gps.latitude,
    data.gps.longitude,
  ]);


const angles = carData?.map((data) => data.gps.Angle);
const speeds = carData?.map((data) => data.gps.speed);
const ignitions = carData?.map((data) => data.ignition);

const getIconForStatus = (speed: number, ignition: number) => {
  if (speed === 0 && ignition === 0) {
    return RedCar; // Replace redSvg with your red SVG icon URL
  } else if (speed > 0 && ignition === 1) {
    return GreenCar; // Replace greenSvg with your green SVG icon URL
  } else {
    return YellowCar; // Replace yellowSvg with your yellow SVG icon URL
  }
};

const icon = (speed: number, ignition: number, angle: number) => {
  const IconComponent = getIconForStatus(speed, ignition);
  const rotation = angle ; // Set the rotation angle here

  const customIcon = L.divIcon({
    html: `<div style="transform: rotate(${rotation}deg);"><img src="${IconComponent.src}" style="transform: rotate(270deg)"} /></div>`,
    
    iconSize: [40, 40], // Adjust the size of the icon as needed
    className: "custom-icon", // Add any custom CSS classes here
  });

  return customIcon;
};


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


  return (
    <>
    
      <MapContainer
        center={center}
        zoom={zoom}
       className="w-full h-screen"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>'
        />

        {positions.map((position, index) => (


          <Marker key={index} position={position}  icon={icon(speeds[index] || 0, ignitions[index] || 0, angles[index] || 0)}>
        
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

