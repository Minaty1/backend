const axios = require('axios')

const WEATHER_API_BASE = process.env.JARVIS_WEATHER_API_BASE || 'https://api.weatherapi.com/v1'

class WeatherService {
  async getCurrentWeather(city = 'London') {
    try {
      const apiKey = process.env.JARVIS_WEATHER_API_KEY
      if (!apiKey) {
        return {
          city,
          temperature: 20,
          feelsLike: 19,
          condition: 'Clear',
          humidity: 60,
          windSpeed: 5,
          timestamp: new Date().toISOString(),
          source: 'mock'
        }
      }

      const resp = await axios.get(`${WEATHER_API_BASE}/current.json`, {
        params: {
          q: city,
          key: apiKey
        }
      })

      const data = resp.data
      return {
        city: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        feelsLike: Math.round(data.current.feelslike_c),
        condition: data.current.condition.text,
        description: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km * 1000,
        timestamp: new Date().toISOString(),
        source: 'weatherapi'
      }
    } catch (err) {
      console.error('Weather API Error:', err.message)
      throw new Error('Failed to fetch weather data')
    }
  }

  async getForecast(city = 'London', days = 5) {
    try {
      const apiKey = process.env.JARVIS_WEATHER_API_KEY
      if (!apiKey) {
        const forecast = []
        for (let i = 0; i < days; i++) {
          const date = new Date()
          date.setDate(date.getDate() + i)
          forecast.push({
            date: date.toISOString().split('T')[0],
            temp: 18 + Math.floor(Math.random() * 10),
            condition: ['Sunny', 'Cloudy', 'Rain'][Math.floor(Math.random() * 3)]
          })
        }
        return { city, forecast, source: 'mock' }
      }

      const resp = await axios.get(`${WEATHER_API_BASE}/forecast.json`, {
        params: {
          q: city,
          key: apiKey,
          days: days
        }
      })

      const forecast = resp.data.forecast.forecastday.map(item => ({
        date: item.date,
        time: "12:00:00",
        temp: Math.round(item.day.avgtemp_c),
        condition: item.day.condition.text,
        humidity: item.day.avghumidity
      }))

      return {
        city: resp.data.location.name,
        forecast,
        source: 'weatherapi'
      }
    } catch (err) {
      console.error('Forecast API Error:', err.message)
      throw new Error('Failed to fetch forecast data')
    }
  }
}

module.exports = new WeatherService()
