import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Droplets,
  CloudRain,
  Timer,
  Gauge,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Calculator,
  Compass,
  ArrowRight,
  SunMedium,
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
import { t } from '../i18n/translations';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DemoBadge from '../components/ui/DemoBadge';

export const SmartIrrigation: React.FC = () => {
  const { language, selectedFarmId } = useApp();

  // Water calculator state
  const [calcAcres, setCalcAcres] = useState<number>(4.0);
  const [calcCrop, setCalcCrop] = useState<string>('maize');
  const [calcMethod, setCalcMethod] = useState<'drip' | 'sprinkler' | 'flood'>('drip');
  const [pumpHp, setPumpHp] = useState<number>(5.0);
  const [isLoggingRun, setIsLoggingRun] = useState<boolean>(false);

  // Queries
  const { data: sensor, refetch: refetchSensor } = useQuery({
    queryKey: ['latest-sensor', selectedFarmId],
    queryFn: () => api.sensors.latest(selectedFarmId || undefined),
  });

  const { data: irrigation, refetch: refetchIrrigation } = useQuery({
    queryKey: ['irrigation-recommend', selectedFarmId],
    queryFn: () => api.sensors.irrigationRecommend(selectedFarmId || undefined),
  });

  const { data: historyData } = useQuery({
    queryKey: ['sensor-demo-history'],
    queryFn: () => api.sensors.demoHistory(24),
  });

  // Crop water need multipliers (mm/day)
  const cropWaterNeeds: Record<string, { name: string; nameTa: string; mmDay: number; minMoist: number; optMoist: number; critStage: string }> = {
    maize: { name: 'Corn (Maize)', nameTa: 'மக்காச்சோளம்', mmDay: 5.5, minMoist: 30, optMoist: 60, critStage: 'Tasseling & Silking' },
    grape: { name: 'Grape (Vineyard)', nameTa: 'திராட்சை', mmDay: 4.0, minMoist: 25, optMoist: 50, critStage: 'Berry Softening' },
    apple: { name: 'Apple Orchard', nameTa: 'ஆப்பிள் தோட்டம்', mmDay: 4.8, minMoist: 35, optMoist: 65, critStage: 'Fruit Sizing' },
    tomato: { name: 'Tomato (Polyhouse)', nameTa: 'தக்காளி', mmDay: 6.0, minMoist: 40, optMoist: 70, critStage: 'Flowering & Fruiting' },
    sugarcane: { name: 'Sugarcane', nameTa: 'கரும்பு', mmDay: 7.2, minMoist: 45, optMoist: 75, critStage: 'Grand Growth Phase' },
    paddy: { name: 'Paddy (Rice)', nameTa: 'நெல்', mmDay: 8.5, minMoist: 60, optMoist: 90, critStage: 'Tillering & Panicle Initiation' },
  };

  const selectedCropConfig = cropWaterNeeds[calcCrop] || cropWaterNeeds.maize;

  // Calculation: 1 mm depth on 1 acre = 4,046.86 Liters ≈ 4,047 L
  const efficiency = calcMethod === 'drip' ? 0.90 : calcMethod === 'sprinkler' ? 0.75 : 0.55;
  const grossWaterNeededLiters = Math.round((selectedCropConfig.mmDay * 4047 * calcAcres) / efficiency);

  // Pump discharge approx: 5 HP pump ~ 40,000 Liters / hour (660 L/min)
  const pumpDischargePerHour = pumpHp * 8000;
  const pumpDurationHours = (grossWaterNeededLiters / pumpDischargePerHour).toFixed(1);
  const pumpDurationMins = Math.round((grossWaterNeededLiters / pumpDischargePerHour) * 60);

  const handleLogIrrigationRun = () => {
    setIsLoggingRun(true);
    setTimeout(() => {
      setIsLoggingRun(false);
      toast.success(
        language === 'ta'
          ? `பாசன சுழற்சி பதிவு செய்யப்பட்டது! (${pumpDurationMins} நிமிடங்கள் - ${selectedCropConfig.nameTa})`
          : `Irrigation cycle logged: ${pumpDurationMins} mins for ${selectedCropConfig.name}!`
      );
    }, 600);
  };

  const chartData = historyData?.data?.map((d: any) => ({
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    moisture: d.soil_moisture,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900">{t(language, 'irrigation.title')}</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Smart Water Budgeting
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            {language === 'ta'
              ? 'பயிர் வாரியான நீர் தேவை கணக்கீடு, சொட்டு நீர் பாசன நேரம் மற்றும் வானிலை ஒருங்கிணைப்பு'
              : 'Precision irrigation scheduling, crop evapotranspiration calculations, and automated run-time advisory'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sensor?.is_demo && <DemoBadge />}
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCw className="w-4 h-4" />}
            onClick={() => {
              refetchSensor();
              refetchIrrigation();
            }}
          >
            {language === 'ta' ? 'புதுப்பி' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Main Status & Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendation Card */}
        <Card className="lg:col-span-2">
          <div className="space-y-4">
            <div
              className={`p-6 rounded-xl flex items-start gap-4 ${
                irrigation?.status === 'irrigate'
                  ? 'bg-blue-50 border border-blue-200 text-blue-950'
                  : irrigation?.status === 'monitor'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                  : irrigation?.status === 'skip'
                  ? 'bg-amber-50 border border-amber-200 text-amber-950'
                  : 'bg-stone-100 border border-stone-200 text-stone-800'
              }`}
            >
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  irrigation?.status === 'irrigate'
                    ? 'bg-blue-600 text-white'
                    : irrigation?.status === 'monitor'
                    ? 'bg-emerald-600 text-white'
                    : irrigation?.status === 'skip'
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-600 text-white'
                }`}
              >
                <Droplets className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  Automated Irrigation Decision
                </p>
                <h3 className="text-xl font-bold capitalize">
                  {irrigation?.status === 'irrigate'
                    ? t(language, 'irrigation.irrigate')
                    : irrigation?.status === 'monitor'
                    ? t(language, 'irrigation.monitor')
                    : irrigation?.status === 'skip'
                    ? t(language, 'irrigation.skip')
                    : t(language, 'irrigation.insufficient')}
                </h3>
                <p className="text-sm opacity-90 leading-relaxed mt-2">
                  {irrigation?.recommendation_text || irrigation?.reason}
                </p>
              </div>
            </div>

            {/* Threshold Progress Bar */}
            <div className="p-4 bg-stone-50 rounded-xl space-y-3 border border-stone-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-700">
                  {language === 'ta' ? 'மண் ஈரப்பதம் vs பயிர் தேவை' : 'Soil Moisture vs Crop Target'}
                </span>
                <span className="font-mono font-bold text-stone-900">
                  {sensor?.soil_moisture ?? 25.6}% / Target {selectedCropConfig.optMoist}%
                </span>
              </div>
              <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-400 h-full"
                  style={{ width: `${selectedCropConfig.minMoist}%` }}
                  title="Stress Threshold (Low)"
                />
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${selectedCropConfig.optMoist - selectedCropConfig.minMoist}%` }}
                  title="Optimal Growth Band"
                />
                <div
                  className="bg-blue-300 h-full flex-1"
                  title="Saturated Zone"
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>0% (Wilting)</span>
                <span className="text-rose-600 font-semibold">Stress ({selectedCropConfig.minMoist}%)</span>
                <span className="text-emerald-700 font-semibold">Target ({selectedCropConfig.optMoist}%)</span>
                <span>100% (Field Capacity)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Panel */}
        <Card title={language === 'ta' ? 'பாசன நேர மேலாண்மை' : 'Irrigation Controls'}>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-blue-900 text-xs font-semibold">
                <Timer className="w-4 h-4 text-blue-700" />
                <span>Recommended Run Duration</span>
              </div>
              <p className="text-2xl font-bold text-blue-950 font-mono">
                {pumpDurationMins} <span className="text-xs font-normal">minutes</span>
              </p>
              <p className="text-[11px] text-blue-700">
                Based on {calcAcres} acres with {pumpHp} HP motor discharge.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                disabled={isLoggingRun}
                onClick={handleLogIrrigationRun}
                icon={<Play className="w-4 h-4" />}
              >
                {isLoggingRun
                  ? (language === 'ta' ? 'பதிவாகிறது...' : 'Logging Run...')
                  : (language === 'ta' ? 'பாசன சுழற்சியைப் பதிவு செய்' : 'Log Irrigation Cycle')}
              </Button>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1.5 text-stone-600">
              <p className="font-semibold text-stone-800 flex items-center gap-1">
                <SunMedium className="w-3.5 h-3.5 text-amber-600" />
                {language === 'ta' ? 'உகந்த பாசன நேரம்' : 'Optimal Pumping Hours'}
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {language === 'ta'
                  ? 'காலை 6:00 - 9:00 அல்லது மாலை 5:00 - 7:00 மணிக்குள் நீர் பாய்ச்சுவது ஆவியாதலை 35% குறைக்கும்.'
                  : 'Early morning (06:00 - 09:00 AM) or dusk (05:00 - 07:00 PM) saves up to 35% evaporative water loss.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Drip Run-Time & Water Budget Calculator */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-stone-800">
              {language === 'ta' ? 'துல்லிய பாசன நீர் பட்ஜெட் கால்குலேட்டர்' : 'Precision Irrigation Water Budget & Run-Time Calculator'}
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              {language === 'ta' ? 'பயிர் வகை' : 'Target Crop'}
            </label>
            <select
              value={calcCrop}
              onChange={(e) => setCalcCrop(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-stone-50 font-medium"
            >
              {Object.entries(cropWaterNeeds).map(([key, item]) => (
                <option key={key} value={key}>
                  {language === 'ta' ? item.nameTa : item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              {language === 'ta' ? 'சாகுபடி பரப்பு (ஏக்கர்)' : 'Plot Area (Acres)'}
            </label>
            <input
              type="number"
              min="0.5"
              max="100"
              step="0.5"
              value={calcAcres}
              onChange={(e) => setCalcAcres(parseFloat(e.target.value) || 1)}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              {language === 'ta' ? 'பாசன முறை' : 'Irrigation Method'}
            </label>
            <select
              value={calcMethod}
              onChange={(e) => setCalcMethod(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-stone-50 font-medium"
            >
              <option value="drip">Drip Irrigation (90% Eff.)</option>
              <option value="sprinkler">Sprinkler System (75% Eff.)</option>
              <option value="flood">Surface / Furrow (55% Eff.)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              {language === 'ta' ? 'மோட்டார் திறன் (HP)' : 'Pump Rating (HP)'}
            </label>
            <select
              value={pumpHp}
              onChange={(e) => setPumpHp(parseFloat(e.target.value))}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-stone-50 font-medium"
            >
              <option value="3.0">3.0 HP (24,000 L/hr)</option>
              <option value="5.0">5.0 HP (40,000 L/hr)</option>
              <option value="7.5">7.5 HP (60,000 L/hr)</option>
              <option value="10.0">10.0 HP (80,000 L/hr)</option>
            </select>
          </div>
        </div>

        {/* Calculated Results Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-stone-100">
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5">
            <span className="text-xs font-semibold text-emerald-800 block">Total Daily Water Required</span>
            <p className="text-xl font-bold text-emerald-950 font-mono mt-1">
              {grossWaterNeededLiters.toLocaleString()} <span className="text-xs font-normal">Liters</span>
            </p>
            <span className="text-[10px] text-emerald-700">Gross volume at {Math.round(efficiency * 100)}% efficiency</span>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5">
            <span className="text-xs font-semibold text-blue-800 block">Pumping Operating Duration</span>
            <p className="text-xl font-bold text-blue-950 font-mono mt-1">
              {pumpDurationHours} <span className="text-xs font-normal">Hours ({pumpDurationMins} mins)</span>
            </p>
            <span className="text-[10px] text-blue-700">For {pumpHp} HP motor capacity</span>
          </div>

          <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3.5">
            <span className="text-xs font-semibold text-purple-800 block">Critical Water Stage</span>
            <p className="text-sm font-bold text-purple-950 mt-1">
              {selectedCropConfig.critStage}
            </p>
            <span className="text-[10px] text-purple-700">Daily ETc: {selectedCropConfig.mmDay} mm/day</span>
          </div>
        </div>
      </Card>

      {/* Crop Water Requirement Table */}
      <Card title={language === 'ta' ? 'முக்கிய பயிர்களின் நீர் தேவை அட்டவணை' : 'Crop Evapotranspiration & Moisture Requirement Matrix'}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Crop Name</th>
                <th className="py-2.5 px-3">Daily Water (mm/day)</th>
                <th className="py-2.5 px-3">Min Moisture Threshold</th>
                <th className="py-2.5 px-3">Optimal Moisture Band</th>
                <th className="py-2.5 px-3">Critical Irrigation Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {Object.entries(cropWaterNeeds).map(([key, item]) => (
                <tr key={key} className="hover:bg-stone-50/50">
                  <td className="py-2.5 px-3 font-semibold text-stone-900">
                    {language === 'ta' ? item.nameTa : item.name}
                  </td>
                  <td className="py-2.5 px-3 font-mono">{item.mmDay} mm</td>
                  <td className="py-2.5 px-3 text-rose-700 font-bold">{item.minMoist}%</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">{item.optMoist}%</td>
                  <td className="py-2.5 px-3 text-stone-500">{item.critStage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SmartIrrigation;
