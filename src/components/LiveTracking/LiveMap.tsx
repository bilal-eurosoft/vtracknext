"use client";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { VehicleData } from "@/types/vehicle";
import { zonelistType } from "@/types/zoneType";
import { ClientSettings } from "@/types/clientSettings";
import { useState } from "react";

import LiveCars from "./LiveCars";

const DynamicCarMap = ({
  carData,
  clientSettings,
  selectedVehicle,
}: {
  carData: VehicleData[];
  clientSettings: ClientSettings[];
  selectedVehicle: VehicleData | null; // Make sure it can handle null values
}) => {
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

  const regex = /lat:([^,]+),lng:([^}]+)/;
  const match = clientMapSettings.match(regex);

  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    mapCoordinates = [lat, lng];
  }
  const zoom = clientZoomSettings ? parseInt(clientZoomSettings) : 11;
  const [zoneList, setZoneList] = useState<zonelistType[]>([]);
  const [showZones, setShowZones] = useState(false);
  const MapContainer = dynamic(
    () => import("react-leaflet").then((module) => module.MapContainer),
    { ssr: false }
  );
  const TileLayer = dynamic(
    () => import("react-leaflet").then((module) => module.TileLayer),
    { ssr: false }
  );
  const Polyline = dynamic(
    () => import("react-leaflet").then((module) => module.Polyline),
    { ssr: false }
  );
  const Polygon = dynamic(
    () => import("react-leaflet/Polygon").then((module) => module.Polygon),
    { ssr: false }
  );
  const Circle = dynamic(
    () => import("react-leaflet/Circle").then((module) => module.Circle),
    { ssr: false }
  );
  return (
    <>
      <div className="lg:col-span-4  md:col-span-3  sm:col-span-5 col-span-4 ">
        <div>
          <MapContainer
            id="map"
            center={mapCoordinates}
            zoom={zoom}
            className="z-10 "
            style={{ height: "71.5em" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>'
            />
            <LiveCars
              carData={carData}
              clientSettings={clientSettings}
              selectedVehicle={selectedVehicle}
            />
          </MapContainer>
        </div>
        {showZones &&
          zoneList.map(function (singleRecord) {
            return singleRecord.zoneType == "Circle" ? (
              <>
                <Circle
                  center={[
                    Number(singleRecord.centerPoints.split(",")[0]),
                    Number(singleRecord.centerPoints.split(",")[1]),
                  ]}
                  radius={Number(singleRecord.latlngCordinates)}
                />
              </>
            ) : (
              <Polygon positions={JSON.parse(singleRecord.latlngCordinates)} />
            );
          })}
        {/* <h1>test</h1> */}
      </div>
    </>
  );
};

export default DynamicCarMap;
