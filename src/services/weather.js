export const fetchPortWeather = async (portName) => {
  if (!portName || /open ocean|home port/i.test(portName)) return null;
  const location = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(portName)}&count=1&language=en&format=json`).then((response) => response.json());
  const place = location.results?.[0];
  if (!place) return null;
  const forecast = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`).then((response) => response.json());
  const code = forecast.current?.weather_code;
  const label = code === 0 ? 'Clear' : code < 4 ? 'Partly cloudy' : code < 70 ? 'Cloudy' : 'Rain or snow';
  return `${Math.round(forecast.current.temperature_2m)}°F · ${label} · ${Math.round(forecast.current.wind_speed_10m)} mph wind`;
};
