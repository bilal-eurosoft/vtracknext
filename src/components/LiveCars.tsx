"use client";
//livecar.tsx
import React, { useEffect } from "react";
import { Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { VehicleData } from "@/types/vehicle";
import RedCar from "@../../public/redcar.svg";
import GreenCar from "@../../public/greencar.svg";
import YellowCar from "@../../public/yellowcar.svg";
import L from "leaflet";


const LiveCars = ({
    carData,
    clientSettings,
    selectedVehicle
}: {
    carData: VehicleData[];
    clientSettings: ClientSettings[];
    selectedVehicle: VehicleData | null; // Make sure it can handle null values
}) => {

    const map = useMap();
    const angles = carData?.map((data) => data.gps.Angle);
    const speeds = carData?.map((data) => data.gps.speed);
    const ignitions = carData?.map((data) => data.ignition);

    const getIconForStatus = (speed: number, ignition: number) => {
        if (speed === 0 && ignition === 0) {
            return RedCar;
        } else if (speed > 0 && ignition === 1) {
            return GreenCar;
        } else {
            return YellowCar;
        }
    };

    const icon = (speed: number, ignition: number, angle: number) => {
        const IconComponent = getIconForStatus(speed, ignition);
        const rotation = angle;

        const customIcon = L.divIcon({
            html: `<div style="transform: rotate(${rotation}deg);"><img src="${IconComponent.src}" style="transform: rotate(270deg)"} /></div>`,
            iconSize: [40, 40],
            className: "custom-icon",
        });

        return customIcon;
    };

    const pos: string[] = carData?.map((datas) => datas?.vehicleReg);

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


    // Use useEffect to fly the map to the selectedVehicle's GPS coordinates
    useEffect(() => {
        if (selectedVehicle) {
        
        const selectedVehicleCurrentData = carData.filter((el)=>el.IMEI === selectedVehicle?.IMEI)[0];

        console.log('inside useEffect of selected vehicle',selectedVehicleCurrentData)
            mapCoordinates = [selectedVehicleCurrentData.gps.latitude, selectedVehicleCurrentData.gps.longitude]
            map.flyTo(mapCoordinates, 18);

            
        }
    }, [carData, selectedVehicle, map]);
  

    const positions: [number, number][] = carData?.map((data) => [
        
        data.gps.latitude,
        data.gps.longitude,
    ]);
   

    return (
        <>
            {positions.map((position, index) => (
                <Marker
                key={carData[index]?.IMEI}
                   // key={index}
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
        </>
    );
};

export default LiveCars;

