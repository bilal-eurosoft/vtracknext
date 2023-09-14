"use client";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import dynamic from "next/dynamic"; // Import dynamic from Next.js
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { zonelistType } from "@/types/zoneType";
import { ZoneFindById } from "@/utils/API_CALLS";

// why we use it because Load MapContainer and related components dynamically on the client side
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
const Polygon = dynamic(
  () => import("react-leaflet/Polygon").then((module) => module.Polygon),
  { ssr: false }
);

const EditControl = dynamic(
  () => import("react-leaflet-draw").then((module) => module.EditControl),
  { ssr: false }
);

const ZonePage: React.FC = () => {
  const { data: session } = useSession();
  const [zoneCoordinates, setZoneCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [zoneCoordinatesById, setZoneCoordinatesById] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [zoneDataById, setZoneDataById] = useState<zonelistType | null>(null); // Use null initially
  const [Form, setForm] = useState({
    GeoFenceType: "",
    centerPoints: "",
    id: "",
    zoneName: "",
    zoneShortName: "",
    zoneType: "Polygon",
  });
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchZoneDataById = async () => {
      try {
        if (id && session) {
          const data = await ZoneFindById({
            token: session.accessToken,
            id: id,
          });
          console.log("id data", data);
          setZoneDataById(data);
        }
      } catch (error) {
        console.error("Error fetching zone data:", error);
      }
    };

    fetchZoneDataById();
  }, [id, session]);

  const latdata = zoneDataById?.latlngCordinates;

  useEffect(() => {
    if (latdata) {
      const latlngdata = JSON.parse(latdata);
      const formattedCoordinates = latlngdata?.map(
        (coord: { lat: number; lng: number }) => ({
          latitude: coord.lat,
          longitude: coord.lng,
        })
      );

      setZoneCoordinatesById(formattedCoordinates);
    }
  }, [latdata]);

  useEffect(() => {
    if (zoneDataById) {
      const formData = {
        GeoFenceType: zoneDataById.GeoFenceType || "",
        centerPoints: zoneDataById.centerPoints || "",
        id: zoneDataById.id || "",
        zoneName: zoneDataById.zoneName || "",
        zoneShortName: zoneDataById.zoneShortName || "",
        zoneType: zoneDataById.zoneType || "Polygon",
      };
      setForm(formData);
    }
  }, [zoneDataById]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...Form, [name]: value });
  };

  const handleZoneSave = (coordinates: [number, number][]) => {
    console.log("Received coordinates:", coordinates);
    const zoneCoords = coordinates.slice(0, -1).map(([lat, lng]) => ({
      latitude: lat,
      longitude: lng,
    }));

    setZoneCoordinates(zoneCoords);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      ...Form,
      latlngCordinates: zoneCoordinates || zoneDataById?.latlngCordinates,
      clientId: session?.clientId || zoneDataById?.clientId,
    };
    setForm(formData);
  };
  console.log("form ", Form);
  let polygonCoords: [number, number][] = [];

  if (zoneCoordinatesById && zoneCoordinatesById.length > 0) {
    polygonCoords = zoneCoordinatesById.map((coord) => [
      coord.latitude,
      coord.longitude,
    ]);
  }

  let mapCenter: [number, number] = [0, 0]; // Default center

  if (polygonCoords.length > 0) {
    const lats = polygonCoords.map((coord) => coord[0]);
    const lngs = polygonCoords.map((coord) => coord[1]);
    console.log("lats", lats, "lngs", lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const avglat = (minLat + maxLat) / 2;
    const avglng = (minLng + maxLng) / 2;
    console.log("minLat", minLat.toFixed(5), "lng", avglng);
    mapCenter = [avglat, avglng];
    /*  mapCenter = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
    let lat = mapCenter[0];
    let lng = mapCenter[1];
    mapCenter = [lat, lng]; */
  } else {
    mapCenter = [24.86531784185422, 67.07918112343596];
  }
  console.log("mapCenter", mapCenter);
  return (
    <div className="mx-8 mt-8 shadow-lg bg-bgLight h-5/6 ">
      <p className="bg-[#00B56C] px-4 py-1 text-white">Zone Entry</p>

      <div className="grid lg:grid-cols-6 sm:grid-cols-5 md:grid-cols-5 grid-cols-1 pt-8 ">
        <form onSubmit={handleSave}>
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-4 col-span-4 bg-gray-200 mx-5">
            <label className="text-gray text-sm">
              <span className="text-red">*</span> Please Enter Zone Name:{" "}
            </label>
            <input
              aria-required
              onChange={handleChange}
              type="text"
              name="zoneName"
              value={Form.zoneName}
              className="  block py-2 px-0 w-full text-sm text-labelColor bg-white-10 border border-grayLight appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-green mb-5"
              placeholder="Enter Zone Name "
              required
            />
            <label className="text-gray text-sm">
              <span className="text-red">*</span> Geofence:{" "}
            </label>
            <select
              onChange={handleChange}
              value={Form?.GeoFenceType}
              className="block py-2 px-0 w-full text-sm text-labelColor bg-white-10 border border-grayLight px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 outline-green mb-5"
              placeholder="geofence"
              required
              name="GeoFenceType"
            >
              <option>On-Site</option>
              <option>Off-Site</option>
              <option>City-Area</option>
            </select>
            <label className="text-gray text-sm">
              <span className="text-red">*</span> Zone Short Name:{" "}
            </label>
            <input
              aria-required
              onChange={handleChange}
              type="text"
              name="zoneShortName"
              value={Form?.zoneShortName}
              className="  block py-2 px-0 w-full text-sm text-labelColor bg-white-10 border border-grayLight appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-green mb-5"
              placeholder="Enter Zone Name "
              required
            />
            <div className="flex justify-center">
              <div className="grid lg:grid-cols-2 grid-cols-2 bg-green w-24">
                <div className="col-span-1">
                  <svg
                    className="h-10 py-3 w-full text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                </div>
                <div className="col-span-1">
                  <button
                    className="text-white  h-10 bg-[#00B56C] -ms-2"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            <br></br>
          </div>
        </form>
        <div className="lg:col-span-5 md:col-span-4 sm:col-span-5 col-span-4 mx-3">
          <label className="text-gray text-sm">
            please enter text to search{" "}
          </label>
          <input
            type="text"
            className="  block py-2 px-0 w-full text-sm text-labelColor bg-white-10 border border-grayLight appearance-none px-3 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-green mb-5"
            placeholder="Search"
            required
          />
          <div className="flex justify-start"></div>
          <div className="lg:col-span-5  md:col-span-4  sm:col-span-5 col-span-4 mx-3">
            <div className="flex justify-start"></div>
            <div

              className="w-full  mt-4 overflow-hidden"
            >
              <MapContainer
                zoom={mapCenter ? 14 : 8}
                center={mapCenter}
                className="z-10 "
                style={{ height: '48em' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>'
                />
                {zoneCoordinates.length == 0 ? (
                  <FeatureGroup>
                    <EditControl
                      position="topright"
                      onCreated={(e) => {
                        const coordinates = e.layer
                          .toGeoJSON()
                          .geometry.coordinates[0].map((coord: any[]) => [
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
                            message:
                              "<strong>Oh snap!</strong> you can't draw that!",
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
                    <Polygon positions={polygonCoords} color="#97009c" />
                  </FeatureGroup>
                ) : (
                  <FeatureGroup>
                    <EditControl
                      position="topright"
                      draw={{
                        polyline: false,
                        polygon: false,
                        circle: false,
                        marker: false,
                        circlemarker: false,
                        rectangle: false,
                      }}
                    />
                  </FeatureGroup>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonePage;
