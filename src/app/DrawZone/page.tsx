"use client";
import React, { useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import dynamic from "next/dynamic"; // Import dynamic from Next.js
import { layerGroup } from "leaflet";

// why we use it bcoz Load MapContainer and related components dynamically on the client side
const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  { ssr: false } // This ensures it's only loaded on the client side
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  { ssr: false }
);
const FeatureGroup = dynamic(
  () => import("react-leaflet").then((module) => module.FeatureGroup),
  { ssr: false }
);
const EditControl = dynamic(
  () => import("react-leaflet-draw").then((module) => module.EditControl),
  { ssr: false }
);

const ZonePage: React.FC = () => {
  const [zoneCoordinates, setZoneCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const handleZoneSave = (coordinates: [number, number][]) => {
    // Remove the duplicate last point if it exists
    if (coordinates.length >= 4) {
      const firstPoint = coordinates[0];
      const lastPoint = coordinates[coordinates.length - 1];
      if (firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1]) {
        coordinates.pop(); // Remove the last point
      }
    }

    const zoneCoords = coordinates.map(([lat, lng]) => ({
      latitude: lat,
      longitude: lng,
    }));
    console.log("Zone Coordinates:", zoneCoords);
    setZoneCoordinates(zoneCoords);
  };

  return (
    <>
      <div>
        <h1>Create a Zone</h1>
        <button
          onClick={() => {
            handleZoneSave([]);
          }}
        >
          redraw
        </button>
        <MapContainer
          center={[49.91073108485502, -97.16131092722385]}
          zoom={12}
          style={{ width: "100%", height: "800px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>'
          />
          {zoneCoordinates[0] == null ? (
            <FeatureGroup>
              <EditControl
                position="topright"
                onCreated={(e) => {
                  const coordinates = e.layer
                    .toGeoJSON()
                    .geometry.coordinates[0].map((coord: [number, number]) => [
                      coord[1],
                      coord[0],
                    ]);
                  handleZoneSave(coordinates);
                }}
                draw={{
                  polyline: false,
                  polygon: {
                    allowIntersection: false,
                    drawError: {
                      color: "#e1e100",
                      message: "<strong>Oh snap!</strong> you can't draw that!",
                    },
                    shapeOptions: {
                      color: "#97009c",
                    },
                  },
                  circle: false,
                  marker: false,
                  circlemarker: false,
                  rectangle: false,
                }}
              />
            </FeatureGroup>
          ) : (
            <FeatureGroup></FeatureGroup>
          )}
        </MapContainer>
        {zoneCoordinates && (
          <div>
            <h2>Zone Coordinates:</h2>
            <pre>{JSON.stringify(zoneCoordinates)}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default ZonePage;
