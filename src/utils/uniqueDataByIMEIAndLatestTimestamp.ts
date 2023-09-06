import { VehicleData } from '@/types/vehicle'

export default function uniqueDataByIMEIAndLatestTimestamp(
  data: VehicleData[],
) {
  const uniqueData: {
    [key: string]: { entry: VehicleData; timestamp: Date }
  } = {}

  data.forEach((entry) => {
    const IMEI = entry.IMEI
    const timestamp = new Date(entry.timestamp)

    if (!uniqueData[IMEI] || timestamp > uniqueData[IMEI].timestamp) {
      uniqueData[IMEI] = {
        entry,
        timestamp,
      }
    }
  })

  const uniqueEntries = Object.values(uniqueData).map((item) => item.entry)
  return uniqueEntries
}
