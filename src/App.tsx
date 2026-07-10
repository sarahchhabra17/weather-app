import { useState, type FormEvent } from 'react'
import { fetchWeather, geocodeCity } from './api'
import { describeWeatherCode } from './weatherCodes'
import type { CurrentWeather, DailyForecast, GeoResult } from './types'
import './App.css'

type Status = 'idle' | 'loading' | 'error'

function App() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [location, setLocation] = useState<GeoResult | null>(null)
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [daily, setDaily] = useState<DailyForecast[]>([])

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setStatus('loading')
    setError('')

    try {
      const matches = await geocodeCity(query.trim())
      if (matches.length === 0) {
        setStatus('error')
        setError(`No results for "${query}"`)
        return
      }

      const place = matches[0]
      const weather = await fetchWeather(place.latitude, place.longitude)

      setLocation(place)
      setCurrent(weather.current)
      setDaily(weather.daily)
      setStatus('idle')
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="app">
      <h1>Weather</h1>

      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          aria-label="City name"
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching...' : 'Search'}
        </button>
      </form>

      {status === 'error' && <p className="error">{error}</p>}

      {current && location && (
        <section className="result">
          <h2>
            {location.name}
            {location.admin1 ? `, ${location.admin1}` : ''}, {location.country}
          </h2>

          <div className="current">
            <span className="icon">{describeWeatherCode(current.weatherCode).icon}</span>
            <span className="temp">{Math.round(current.temperature)}°C</span>
          </div>
          <p className="label">{describeWeatherCode(current.weatherCode).label}</p>

          <dl className="details">
            <div>
              <dt>Wind</dt>
              <dd>{current.windSpeed} km/h</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{current.humidity}%</dd>
            </div>
          </dl>

          <ul className="forecast">
            {daily.slice(0, 5).map((day) => (
              <li key={day.date}>
                <span className="day">
                  {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className="icon">{describeWeatherCode(day.weatherCode).icon}</span>
                <span className="range">
                  {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

export default App
