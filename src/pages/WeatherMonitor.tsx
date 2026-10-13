import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CloudSun,
  Wind,
  Droplets,
  Gauge,
  AlertTriangle,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n/translations';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export const WeatherMonitor: React.FC = () => {
  const { language } = useApp();
  const [lat, setLat] = useState<number>(13.0827);
  const [lon, setLon] = useState<number>(80.2707);
  const [locationName, setLocationName] = useState<string>('Chennai, Tamil Nadu');

  const { data: weather, isLoading, refetch } = useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => api.weather.forecast(lat, lon, locationName),
  });

  const chartData = weather?.forecast?.map((d) => ({
    date: new Date(d.date).toLocaleDateString([], { weekday: 'short' }),
    max: d.temp_max,
    min: d.temp_min,
    rain: d.precipitation_mm,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t(language, 'weather.title')}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {t(language, 'weather.subtitle')}
          </p>
        </div>

        {/* Quick Location Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { nameEn: 'Pollachi / Coimbatore', nameTa: 'பொள்ளாச்சி / கோவை', lat: 10.6609, lon: 77.0048 },
            { nameEn: 'Madurai', nameTa: 'மதுரை', lat: 10.0526, lon: 77.9472 },
            { nameEn: 'Thanjavur Delta', nameTa: 'தஞ்சாவூர் டெல்டா', lat: 10.9602, lon: 79.3845 },
            { nameEn: 'Kodaikanal', nameTa: 'கொடைக்கானல்', lat: 10.2381, lon: 77.4892 },
            { nameEn: 'Salem', nameTa: 'சேலம்', lat: 11.6643, lon: 78.1460 },
            { nameEn: 'Chennai', nameTa: 'சென்னை', lat: 13.0827, lon: 80.2707 },
          ].map((loc) => {
            const isActive = Math.abs(lat - loc.lat) < 0.05 && Math.abs(lon - loc.lon) < 0.05;
            return (
              <button
                key={loc.nameEn}
                onClick={() => {
                  setLat(loc.lat);
                  setLon(loc.lon);
                  setLocationName(language === 'ta' ? loc.nameTa : loc.nameEn);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {language === 'ta' ? loc.nameTa : loc.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Conditions Card */}
      {weather?.current && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <CloudSun className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{weather.location?.name}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 mt-1">
                    {weather.current.temperature !== undefined ? `${weather.current.temperature}°C` : '—'}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium capitalize mt-0.5">
                    {weather.current.weather_description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-xs text-stone-400 block">{t(language, 'weather.humidity')}</span>
                  <span className="text-sm font-bold text-stone-800">
                    {weather.current.humidity}%
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-xs text-stone-400 block">{t(language, 'weather.wind')}</span>
                  <span className="text-sm font-bold text-stone-800">
                    {weather.current.wind_speed} km/h
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-xs text-stone-400 block">{t(language, 'weather.precipitation')}</span>
                  <span className="text-sm font-bold text-stone-800">
                    {weather.current.precipitation} mm
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Alerts */}
            {weather.alerts && weather.alerts.length > 0 && (
              <div className="pt-4 space-y-2">
                <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  {t(language, 'weather.agriculturalAdvisories')}
                </p>
                {weather.alerts.map((a, i) => (
                  <div
                    key={i}
                    className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{a.title}: </span>
                      {a.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Location Presets */}
          <Card title={t(language, 'weather.quickLocations')}>
            <div className="space-y-2">
              {[
                { nameEn: 'Chennai', nameTa: 'சென்னை', lat: 13.0827, lon: 80.2707 },
                { nameEn: 'Coimbatore', nameTa: 'கோயம்புத்தூர்', lat: 11.0168, lon: 76.9558 },
                { nameEn: 'Madurai', nameTa: 'மதுரை', lat: 9.9252, lon: 78.1198 },
                { nameEn: 'Tiruchirappalli', nameTa: 'திருச்சிராப்பள்ளி', lat: 10.7905, lon: 78.7047 },
                { nameEn: 'Salem', nameTa: 'சேலம்', lat: 11.6643, lon: 78.1460 },
              ].map((loc) => (
                <button
                  key={loc.nameEn}
                  onClick={() => {
                    setLat(loc.lat);
                    setLon(loc.lon);
                    setLocationName(`${language === 'ta' ? loc.nameTa : loc.nameEn}, Tamil Nadu`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    locationName.includes(loc.nameEn) || locationName.includes(loc.nameTa)
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>{language === 'ta' ? loc.nameTa : loc.nameEn}</span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 7-Day Forecast Grid */}
      <Card title={t(language, 'weather.daily7Day')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather?.forecast?.map((day, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center space-y-1.5"
            >
              <p className="text-xs font-semibold text-stone-700">
                {new Date(day.date).toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' })}
              </p>
              <p className="text-[11px] text-stone-500 truncate" title={day.weather_description}>
                {day.weather_description}
              </p>
              <div className="text-sm font-bold text-stone-900">
                <span>{day.temp_max}°</span>
                <span className="text-xs font-normal text-stone-400 ml-1">{day.temp_min}°</span>
              </div>
              <p className="text-[10px] text-sky-600 font-medium">
                💧 {day.precipitation_mm || 0}mm
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Precipitation Bar Chart */}
      <Card title={t(language, 'weather.expectedRain')}>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} unit="mm" />
              <Tooltip />
              <Bar dataKey="rain" name={language === 'ta' ? 'மழைப்பொழிவு (mm)' : 'Rainfall (mm)'} fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Attribution */}
      <p className="text-xs text-stone-400 text-center">
        {weather?.attribution || 'Weather data by Open-Meteo under CC BY 4.0'}
      </p>
    </div>
  );
};

export default WeatherMonitor;
