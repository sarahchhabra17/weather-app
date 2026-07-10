import type { CurrentWeather, DailyForecast, GeoResult } from './types'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function geocodeCity(query: string): Promise<GeoResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to search for that city')

  const data = await res.json()
  return data.results ?? []
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<{ current: CurrentWeather; daily: DailyForecast[] }> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: 'auto',
  })
  const res = await fetch(`${FORECAST_URL}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch weather data')

  const data = await res.json()

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
  }

  const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
    date,
    maxTemp: data.daily.temperature_2m_max[i],
    minTemp: data.daily.temperature_2m_min[i],
    weatherCode: data.daily.weather_code[i],
  }))

  return { current, daily }
}
