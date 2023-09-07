"use client";
//livecar.tsx
import React, { useEffect, useRef } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import { VehicleData } from "@/types/vehicle";
import L from "leaflet";

const LiveCars = ({
  carData,
  clientSettings,
  selectedVehicle,
}: {
  carData: VehicleData[];
  clientSettings: ClientSettings[];
  selectedVehicle: VehicleData | null; // Make sure it can handle null values
}) => {
  const map = useMap();
  const selectedVehicleCurrentData = useRef<VehicleData | null>(null);

  // Use useEffect to fly the map to the selectedVehicle's GPS coordinates
  useEffect(() => {
    if (selectedVehicle) {
      selectedVehicleCurrentData.current = carData.filter(
        (el) => el.IMEI === selectedVehicle?.IMEI
      )[0];
      map.flyTo(
        [
          selectedVehicleCurrentData.current.gps.latitude,
          selectedVehicleCurrentData.current.gps.longitude,
        ],
        18
      );
    }
  }, [carData, selectedVehicle, map]);
  const angle = carData?.map((data) => data.gps.Angle);
  const speed = carData?.map((data) => data.gps.speed);
  const ignition = carData?.map((data) => data.ignition);

  const icon = (speed: number, ignition: number, angle: number) => {
    return new L.DivIcon({
      className: "custom-icon",
      iconSize: [38, 38],
      html: `<div class="car  ${
        speed === 0 && ignition === 0
          ? "redCarBG"
          : speed > 0 && ignition === 1
          ? "greenCarBG"
          : "yellowCarBG"
      }" style="transform: rotate(${angle}deg);"></div>`,
    });
  };

  const pos: string[] = carData?.map((datas) => datas?.vehicleReg);
  const clientMapSettings = clientSettings?.filter(
    (el) => el?.PropertDesc === "Map"
  )[0]?.PropertyValue;

  if (!clientMapSettings) {
    return <>Map Loading...</>;
  }
  let mapCoordinates: [number, number] = [0, 0];

  const regex = /lat:([^,]+),lng:([^}]+)/;
  const match = clientMapSettings.match(regex);

  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    mapCoordinates = [lat, lng];
  }

  const positions: [number, number][] = carData?.map((data) => [
    data.gps.latitude,
    data.gps.longitude,
  ]);

  return (
    <>
      {positions.map((position, index) => (
        <Marker
          key={carData[index]?.IMEI}
          position={position}
          icon={icon(
            speed[index] || 0,
            ignition[index] || 0,
            angle[index] || 0
          )}
        >
          <Tooltip direction="bottom" offset={[0, 10]} opacity={1} permanent>
            {pos[index]}
          </Tooltip>
        </Marker>
      ))}
    </>
  );
};

export default LiveCars;
