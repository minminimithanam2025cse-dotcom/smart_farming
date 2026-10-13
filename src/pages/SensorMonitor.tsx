import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Cpu,
  Wifi,
  BatteryCharging,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  FlaskConical,
  CloudRain,
  PlusCircle,
  RefreshCw,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import DemoBadge from '../components/ui/DemoBadge';

export const SensorMonitor: React.FC = () => {
  const { language, selectedFarmId, demoMode } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<'soil_moisture' | 'temperature' | 'humidity' | 'light_intensity' | 'soil_ph'>('soil_moisture');
  const [hoursRange, setHoursRange] = useState<number>(48);

  // Manual reading form state
  const [nodeId, setNodeId] = useState<string>('ESP32-NODE-01');
  const [moistureInput, setMoistureInput] = useState<string>('');
  const [tempInput, setTempInput] = useState<string>('');
  const [humidityInput, setHumidityInput] = useState<string>('');
  const [phInput, setPhInput] = useState<string>('6.8');
  const [luxInput, setLuxInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Queries
  const { data: latestSensor, refetch: refetchLatest } = useQuery({
    queryKey: ['sensor-latest', selectedFarmId],
    queryFn: () => api.sensors.latest(selectedFarmId || undefined),
  });

  const { data: history = [], refetch: refetchHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ['sensor-history', selectedFarmId, hoursRange],
    queryFn: () => api.sensors.history(selectedFarmId || undefined, hoursRange),
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moistureInput) {
      toast.error(language === 'ta' ? 'மண் ஈரப்பதத்தை உள்ளிடவும்' : 'Please enter soil moisture');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.sensors.addReading({
        sensor_id: nodeId,
        soil_moisture: parseFloat(moistureInput),
        temperature: tempInput ? parseFloat(tempInput) : undefined,
        humidity: humidityInput ? parseFloat(humidityInput) : undefined,
        soil_ph: phInput ? parseFloat(phInput) : undefined,
        light_intensity: luxInput ? parseFloat(luxInput) : undefined,
        source: 'manual',
      });
      toast.success(language === 'ta' ? 'சென்சார் அளவீடு பதிவானது!' : 'Sensor telemetry packet recorded!');
      setMoistureInput('');
      setTempInput('');
      setHumidityInput('');
      setLuxInput('');
      refetchLatest();
      refetchHistory();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit telemetry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format chart data
  const chartData = [...history]
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    .map((item) => ({
      time: new Date(item.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(item.recorded_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      soil_moisture: item.soil_moisture,
      temperature: item.temperature,
      humidity: item.humidity,
      light_intensity: item.light_intensity,
      soil_ph: item.soil_ph,
    }));

  const metricConfig = {
    soil_moisture: { label: language === 'ta' ? 'மண் ஈரப்பதம்' : 'Soil Moisture', unit: '%', color: '#059669', stroke: '#10b981' },
    temperature: { label: language === 'ta' ? 'வெப்பநிலை' : 'Soil & Ambient Temp', unit: '°C', color: '#ea580c', stroke: '#f97316' },
    humidity: { label: language === 'ta' ? 'காற்றின் ஈரப்பதம்' : 'Air Humidity', unit: '%', color: '#0284c7', stroke: '#38bdf8' },
    light_intensity: { label: language === 'ta' ? 'சூரிய ஒளி' : 'Sunlight Intensity', unit: 'Lux', color: '#ca8a04', stroke: '#eab308' },
    soil_ph: { label: language === 'ta' ? 'மண் காரத்தன்மை (pH)' : 'Soil pH', unit: 'pH', color: '#9333ea', stroke: '#a855f7' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900">
              {language === 'ta' ? 'IoT சென்சார் கண்காணிப்பகம்' : 'IoT Hardware & Telemetry Monitor'}
            </h1>
            <Badge variant="blue">IoT Telemetry Hub</Badge>
            {demoMode && <DemoBadge />}
          </div>
          <p className="text-sm text-stone-500 mt-1">
            {language === 'ta'
              ? 'களத்தில் உள்ள ESP32 சென்சார் சாதனங்கள், பேட்டரி நிலை மற்றும் நேரடி அளவீடுகளைக் கண்காணிக்கவும்'
              : 'Real-time telemetry stream, node health status, and multi-sensor diagnostics'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              refetchLatest();
              refetchHistory();
              toast.success(language === 'ta' ? 'தரவுகள் புதுப்பிக்கப்பட்டன' : 'Telemetry refreshed');
            }}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {language === 'ta' ? 'புதுப்பி' : 'Refresh Telemetry'}
          </Button>
        </div>
      </div>

      {/* Hardware Node Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 text-sm">ESP32-NODE-01</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-stone-500">North Field A1 • Active</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <Wifi className="w-3 h-3" /> -68 dBm
            </span>
            <span className="block text-stone-400">Battery: 3.9V (92%)</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 text-sm">ESP32-NODE-02</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-stone-500">Vineyard Sector 1 • Active</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <Wifi className="w-3 h-3" /> -74 dBm
            </span>
            <span className="block text-stone-400">Battery: 3.8V (86%)</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-sm">Transmission Rate</span>
              <p className="text-xs text-stone-500">MQTT over WiFi / LoRa</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="text-emerald-700 font-semibold block">1 packet / 60 min</span>
            <span className="text-stone-400">Loss Rate: 0.0%</span>
          </div>
        </div>
      </div>

      {/* 6-in-1 Real-time Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-sm hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">{language === 'ta' ? 'மண் ஈரப்பதம்' : 'Moisture'}</span>
            <Droplets className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-stone-900">
              {latestSensor?.soil_moisture !== undefined ? `${latestSensor.soil_moisture}%` : '—'}
            </span>
            <span className="block text-[10px] text-stone-400">Volumetric Water</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-sm hover:border-orange-500 transition-colors">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">{language === 'ta' ? 'வெப்பநிலை' : 'Temperature'}</span>
            <Thermometer className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-stone-900">
              {latestSensor?.temperature !== undefined ? `${latestSensor.temperature}°C` : '—'}
            </span>
            <span className="block text-[10px] text-stone-400">Calibrated Sensor</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-sm hover:border-sky-500 transition-colors">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">{language === 'ta' ? 'காற்றின் ஈரப்பதம்' : 'Air Humidity'}</span>
            <Wind className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-stone-900">
              {latestSensor?.humidity !== undefined ? `${latestSensor.humidity}%` : '—'}
            </span>
            <span className="block text-[10px] text-stone-400">Relative Humidity</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-sm hover:border-yellow-500 transition-colors">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">{language === 'ta' ? 'சூரிய ஒளி' : 'Light (Lux)'}</span>
            <Sun className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-stone-900">
              {latestSensor?.light_intensity !== undefined ? `${latestSensor.light_intensity}` : '—'}
            </span>
            <span className="block text-[10px] text-stone-400">Ambient Illumination</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-sm hover:border-purple-500 transition-colors">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">{language === 'ta' ? 'மண் காரத்தன்மை' : 'Soil pH'}</span>
            <FlaskConical className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-stone-900">
              {latestSensor?.soil_ph !== undefined ? `${latestSensor.soil_ph}` : '6.8'}
            </span>
            <span className="block text-[10px] text-stone-400">Neutral Range (6.5-7.5)</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-sm hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">{language === 'ta' ? 'மழை அளவு' : 'Rain Gauge'}</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-stone-900">
              {latestSensor?.rainfall_mm !== undefined ? `${latestSensor.rainfall_mm} mm` : '0.0 mm'}
            </span>
            <span className="block text-[10px] text-stone-400">Tipping Bucket Gauge</span>
          </div>
        </div>
      </div>

      {/* Multi-Metric Timeline Chart */}
      <Card
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-800">
                {language === 'ta' ? 'சென்சார் போக்கு காலக்கோடு' : 'Multi-Metric Telemetry Timeline'}
              </span>
              <span className="text-xs font-normal text-stone-400">({hoursRange}h Historical Window)</span>
            </div>

            {/* Metric Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(Object.keys(metricConfig) as Array<keyof typeof metricConfig>).map((key) => {
                const conf = metricConfig[key];
                const isSelected = selectedMetric === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>
        }
      >
        <div className="h-72 w-full pt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  unit={` ${metricConfig[selectedMetric].unit}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-stone-900 text-white text-xs p-2.5 rounded-lg shadow-lg space-y-1">
                          <p className="font-semibold text-stone-300">{label}</p>
                          <p className="text-emerald-400 font-bold">
                            {metricConfig[selectedMetric].label}: {payload[0].value} {metricConfig[selectedMetric].unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={metricConfig[selectedMetric].stroke}
                  strokeWidth={2.5}
                  dot={{ r: 2, fill: metricConfig[selectedMetric].stroke }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 text-sm">
              No historical telemetry packets in window
            </div>
          )}
        </div>
      </Card>

      {/* Bottom Section: Manual Telemetry Injection & Raw Data Packet Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Telemetry Entry Form */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ta' ? 'கையேடு சென்சார் அளவீடு பதிவு' : 'Manual Telemetry Injection'}</span>
            </div>
          }
        >
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <p className="text-xs text-stone-500">
              {language === 'ta'
                ? 'நேரடி வன்பொருள் இல்லாத போது கள அளவீடுகளை கைமுறையாக உள்ளிடவும்.'
                : 'Inject calibrated readings manually for field testing or offline verification.'}
            </p>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Sensor Node Identifier</label>
              <select
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-stone-50"
              >
                <option value="ESP32-NODE-01">ESP32-NODE-01 (North Field A1)</option>
                <option value="ESP32-NODE-02">ESP32-NODE-02 (Vineyard Sector 1)</option>
                <option value="ESP32-NODE-03">ESP32-NODE-03 (Delta Ayacut)</option>
                <option value="MANUAL-HANDHELD">Handheld Soil Probe</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {language === 'ta' ? 'ஈரப்பதம் (%)' : 'Moisture (%) *'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  placeholder="e.g. 35.5"
                  value={moistureInput}
                  onChange={(e) => setMoistureInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {language === 'ta' ? 'வெப்பநிலை (°C)' : 'Temp (°C)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 29.0"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {language === 'ta' ? 'காற்றின் ஈரப்பதம் (%)' : 'Air Humidity (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g. 62.0"
                  value={humidityInput}
                  onChange={(e) => setHumidityInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {language === 'ta' ? 'மண் pH' : 'Soil pH (0-14)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="e.g. 6.8"
                  value={phInput}
                  onChange={(e) => setPhInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:outline-emerald-600"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting
                ? (language === 'ta' ? 'பதிவாகிறது...' : 'Injecting Packet...')
                : (language === 'ta' ? 'அளவீட்டைப் பதிவு செய்' : 'Transmit Sensor Packet')}
            </Button>
          </form>
        </Card>

        {/* Raw Sensor Data Ingestion Table */}
        <Card
          title={
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-stone-800">
                {language === 'ta' ? 'நேரடி சென்சார் பாக்கெட் பதிவு' : 'Raw Sensor Packet Stream'}
              </span>
              <span className="text-xs font-normal text-stone-400">Latest 10 Packets</span>
            </div>
          }
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Node ID</th>
                  <th className="py-2.5 px-3">Moisture</th>
                  <th className="py-2.5 px-3">Temp</th>
                  <th className="py-2.5 px-3">Humidity</th>
                  <th className="py-2.5 px-3">pH</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {history.slice(0, 10).map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/50">
                    <td className="py-2 px-3 font-mono font-semibold text-stone-900">
                      {r.sensor_id || 'ESP32-NODE-01'}
                    </td>
                    <td className="py-2 px-3 font-semibold text-emerald-700">
                      {r.soil_moisture}%
                    </td>
                    <td className="py-2 px-3">{r.temperature}°C</td>
                    <td className="py-2 px-3">{r.humidity}%</td>
                    <td className="py-2 px-3 font-mono">{r.soil_ph ?? '6.8'}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          r.source === 'esp32'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {r.source.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-stone-400">
                      {new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SensorMonitor;
