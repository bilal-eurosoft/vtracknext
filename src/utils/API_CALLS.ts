import { IgnitionReport, replayreport } from "@/types/IgnitionReport";
import { zonelistType } from "@/types/zoneType";

export async function getVehicleDataByClientId(clientId: string) {
  try {
    const response = await fetch(
      `https://socketio.vtracksolutions.com:1102/${clientId}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function getClientSettingByClinetIdAndToken({
  token,
  clientId,
}: {
  token: string;
  clientId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/SettingByClientId",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"ClientId\":\"${clientId}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function vehicleListByClientId({
  token,
  clientId,
}: {
  token: string;
  clientId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/vehicleListByClientId",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"clientId\":\"${clientId}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function IgnitionReportByTrip({
  token,
  payload,
}: {
  token: string;
  payload: IgnitionReport;
}) {
  try {
    const response = await fetch(
      "https://reports.vtracksolutions.com/api/IgnitionReport",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
}

export async function IgnitionReportByDailyactivity({
  token,
  payload,
}: {
  token: string;
  payload: IgnitionReport;
}) {
  try {
    const response = await fetch(
      "https://reports.vtracksolutions.com/api/IgnitionReportAddressWise",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}
export async function IgnitionReportByIgnition({
  token,
  payload,
}: {
  token: string;
  payload: IgnitionReport;
}) {
  try {
    const response = await fetch(
      "https://reports.vtracksolutions.com/api/IgnitionNewReport",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}
export async function IgnitionReportByEvents({
  token,
  payload,
}: {
  token: string;
  payload: IgnitionReport;
}) {
  try {
    const response = await fetch(
      "https://reports.vtracksolutions.com/api/EventsReport",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}
export async function IgnitionReportByDetailReport({
  token,
  payload,
}: {
  token: string;
  payload: IgnitionReport;
}) {
  try {
    const response = await fetch(
      "https://reports.vtracksolutions.com/api/DetailReportByStreet",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}
export async function IgnitionReportByIdlingActivity({
  token,
  payload,
}: {
  token: string;
  payload: IgnitionReport;
}) {
  try {
    const response = await fetch(
      "https://reports.vtracksolutions.com/api/MTSDailyIdling",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function videoList({
  token,
  clientId,
}: {
  token: string;
  clientId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/videolistbyId",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"clientId\":\"${clientId}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function getZoneListByClientId({
  token,
  clientId,
}: {
  token: string;
  clientId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/zonelist",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"clientId\":\"${clientId}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}
export async function postDriverDataByClientId({
  token,
  newformdata,
}: {
  token: string;
  newformdata: zonelistType;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/v2/Driver",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(newformdata),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error fetching data", error);
    return [];
  }
}

export async function forgetEmailByClientId({
  token,
  newformdata,
}: {
  token: any;
  newformdata: any;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/forgotpassword/forgotpassword",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(newformdata),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data", error);
    return [];
  }
}

export async function forgetPasswordByClientId({
  token,
  newformdata,
}: {
  token: any;
  newformdata: zonelistType;
  link: any;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/forgotpassword/GetByLink",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(newformdata),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data", error);
    return [];
  }
}

export async function forgetPasswordUpdateLinkClientId({
  token,
  newformdata,
}: {
  token: any;
  newformdata: any;
  link: any;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/forgotpassword/UpdateLink",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(newformdata),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data", error);
    return [];
  }
}

export async function postDriverDataAssignByClientId({
  token,
  newformdata,
}: {
  token: string;
  newformdata: zonelistType;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/v2/DriverAssign",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(newformdata),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error fetching data", error);
    return [];
  }
}

export async function GetDriverDataByClientId({
  token,
  clientId,
}: {
  token: string;
  clientId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/v2/AllDrivers",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"clientId\":\"${clientId}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function GetDriverDataAssignByClientId({
  token,
  clientId,
}: {
  token: string;
  clientId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/v2/driverAssignList",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"clientId\":\"${clientId}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function ZoneFindById({
  token,
  id,
}: {
  token: string;
  id: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/findById",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"id\":\"${id}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function alertSettingCountZone({
  token,
  clientId,
  zoneId,
}: {
  token: string;
  clientId: string;
  zoneId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/alertSettingCountZone",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"clientId\":\"${clientId}\", \"zoneId\":\"${zoneId}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function zoneRuleDeleteByZoneId({
  token,
  id,
}: {
  token: string;
  id: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/zoneRuleDeleteByZoneId",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"id\":\"${id}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function zonevehicleByZoneId({
  token,
  zoneId,
}: {
  token: string;
  zoneId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/NotificationCenter/zonevehicleByZoneId",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"zoneId\":\"${zoneId}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function modifyCollectionStatus({
  token,
  collectionName,
}: {
  token: string;
  collectionName: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/modifyCollectionStatus",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"collectionName\":\"${collectionName}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function postZoneDataByClientId({
  token,
  newformdata,
}: {
  token: string;
  newformdata: zonelistType;
}) {
  try {
    const response = await fetch("https://backend.vtracksolutions.com/zone", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(newformdata),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data", error);
    return [];
  }
}

export async function zoneDelete({ token, id }: { token: string; id: string }) {
  try {
    console.log("before api", id);
    const response = await fetch(
      "https://backend.vtracksolutions.com/zoneDelete",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: `{\"id\":\"${id}\"}`,
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data");
    return [];
  }
}

export async function zonenamesearch({
  token,
  filter,
  clientId,
}: {
  token: string;
  filter: object;
  clientId: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/zonenamesearch",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ clientId: clientId, Filters: [filter] }),
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data:", error);
    return [];
  }
}

export async function TripsByBucketAndVehicle({
  token,
  payload,
}: {
  token: string;
  payload: replayreport;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/v2/TripsByBucketAndVehicleV2",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function TravelHistoryByBucketV2({
  token,
  payload,
}: {
  token: string;
  payload: replayreport;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/v2/TravelHistoryByBucketV2",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
}

export async function TripAddress({
  lat,
  lng,
  token,
}: {
  lat: number;
  lng: number;
  token: string;
}) {
  try {
    const response = await fetch(
      "https://backend.vtracksolutions.com/NotificationCenter/tripAddress",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
}

export async function getCurrentAddress({
  lat,
  lon,
  token,
}: {
  lat: number;
  lon: number;
  token: string;
}) {
  try {
    const response = await fetch(
      `https://eurosofttechosm.com/nominatim/reverse.php?lat=${lat}&lon=${lon}&zoom=19&format=jsonv2`,
      {
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
}
