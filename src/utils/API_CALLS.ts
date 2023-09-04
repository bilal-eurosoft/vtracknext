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
