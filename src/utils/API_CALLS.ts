export async function getVehicleDataByClientId(clientId: string) {
  try {
    const response = await fetch('https://live.vtracksolutions.com/graphql', {
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
      },
      body: `{"query":"\\n          query {\\n            Currentlocation(id:\\"${clientId}\\"){\\n            id,\\n            Value\\n          }\\n        }"}`,
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch data from the API')
    }
    const data = await response.json()

    return data
  } catch (error) {
    console.log('Error fetching data')
    return []
  }
}


export async function getClientSettingByToken(token:string){
try {
  const response = await fetch("https://backend.vtracksolutions.com/SettingByClientId", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "authorization": `Bearer ${token}`,
      "content-type": "application/json",
      
    },
    "body": "{\"ClientId\":\"61e186bb39354279c013f6a4\"}",
    "method": "POST"
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data from the API')
  }
  const data = await response.json()
  return data
} catch (error) {
  console.log('Error fetching data')
  return []
}
}