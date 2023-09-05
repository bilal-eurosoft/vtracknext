"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { VehicleData } from "@/types/vehicle";
import RedCar from "../../../public/redcar.svg";
import GreenCar from "../../../public/greencar.svg";
import YellowCar from "../../../public/yellowcar.svg";

import L from "leaflet";

const CarMap = ({
  carData,
  clientSettings,
}: {
  carData: VehicleData[];
  clientSettings: ClientSettings[];
}) => {
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
    const rotation = angle; // Set the rotation angle here
    
    const customIcon = L.divIcon({
      html: `<div style="transform: rotate(${rotation}deg);"><img src="${IconComponent.src}" style="transform: rotate(270deg)"} /></div>`,

      iconSize: [40, 40], // Adjust the size of the icon as needed
      className: "custom-icon", // Add any custom CSS classes here
    });

    return customIcon;
  };
  

  const pos: string[] = carData?.map((datas) => datas?.vehicleNo);

  const clientMapSettings = clientSettings?.filter(
    (el) => el?.PropertDesc === "Map"
  )[0]?.PropertyValue;

  const clientZoomSettings = clientSettings?.filter(
    (el) => el?.PropertDesc === "Zoom"
  )[0]?.PropertyValue;

  if (!clientMapSettings) {
    return <>Map Loading...</>;
  }
  let mapCoordinates: [number, number] = [0, 0];


  // Use a regular expression to match and extract lat and lng values
const regex = /lat:([^,]+),lng:([^}]+)/;
const match = clientMapSettings.match(regex);

if (match) {
  // match[1] contains the lat value, match[2] contains the lng value
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  
  // Store lat and lng values in an array
  mapCoordinates = [lat, lng];
  console.log(mapCoordinates); // Output: [51.5361504, -0.28807]
} else {
  console.log("No match found");
}


  const mapSettingsSplit = clientMapSettings.split(",");

  if (mapSettingsSplit.length > 0) {
    mapCoordinates = [
      parseFloat(mapSettingsSplit[0].split(":")[1]),
      parseFloat(mapSettingsSplit[1].split(":")[1].replace("}", "")),
    ];
  }

  // Set zoom level
  const zoom = clientZoomSettings ? parseInt(clientZoomSettings) : 11; // Adjust the zoom level as needed

  return (
    <>
      <MapContainer
        center={mapCoordinates}
        zoom={zoom}
        className="w-full h-screen"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>'
        />

        {positions.map((position, index) => (
          <Marker
            key={index}
            position={position}
            icon={icon(
              speeds[index] || 0,
              ignitions[index] || 0,
              angles[index] || 0
            )}
          >
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
