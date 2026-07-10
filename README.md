# Weather App

A simple weather app built with React, TypeScript, and Vite. Search any city and see current conditions plus a 5-day forecast.

## Features

- Search for a city by name
- Current temperature, conditions, wind speed, and humidity
- 5-day forecast with daily highs/lows
- Loading and error states
- Light/dark mode support

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for tooling
- [Open-Meteo](https://open-meteo.com/) for geocoding and weather data (free, no API key required)

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Project structure

- `src/api.ts` — fetches city coordinates and weather data from Open-Meteo
- `src/weatherCodes.ts` — maps Open-Meteo's weather codes to human-readable labels and icons
- `src/App.tsx` — search form and results UI
