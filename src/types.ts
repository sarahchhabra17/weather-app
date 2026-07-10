export interface GeoResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

export interface CurrentWeather {
  temperature: number
  windSpeed: number
  humidity: number
  weatherCode: number
}

export interface DailyForecast {
  date: string
  maxTemp: number
  minTemp: number
  weatherCode: number
}
