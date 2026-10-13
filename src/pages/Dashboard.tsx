import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  Sprout,
  Stethoscope,
  Bell,
  Droplets,
  CloudSun,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t, translateCrop, translateCondition } from '../i18n/translations';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import DemoBadge from '../components/ui/DemoBadge';

export const Dashboard: React.FC = () => {
  const { language, demoMode, selectedFarmId } = useApp();
  const navigate = useNavigate();

  // Queries
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => api.analytics.summary(),
  });

  const { data: sensor } = useQuery({
    queryKey: ['latest-sensor', selectedFarmId],
    queryFn: () => api.sensors.latest(selectedFarmId || undefined),
  });

  const { data: irrigation } = useQuery({
    queryKey: ['irrigation-recommend', selectedFarmId],
    queryFn: () => api.sensors.irrigationRecommend(selectedFarmId || undefined),
  });

  const { data: weather } = useQuery({
    queryKey: ['weather-forecast'],
    queryFn: () => api.weather.forecast(13.0827, 80.2707, 'Chennai, Tamil Nadu'),
  });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-forest-900 bg-[#1e481e] p-6 md:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-700/80 text-emerald-200 border border-emerald-600/50">
              SIH26180 Assistant
            </span>
            {demoMode && <DemoBadge />}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            {t(language, 'dashboard.welcome')}
          </h1>
          <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed mb-6">
            {t(language, 'dashboard.welcomeDesc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              icon={<Stethoscope className="w-4 h-4" />}
              onClick={() => navigate('/crop-doctor')}
              className="bg-white text-emerald-900 hover:bg-emerald-50 border-transparent shadow-sm"
            >
              {t(language, 'dashboard.diagnoseNow')}
            </Button>
            <Button
              variant="secondary"
              icon={<Tractor className="w-4 h-4" />}
              onClick={() => navigate('/farms')}
              className="bg-emerald-700/60 text-white hover:bg-emerald-700 border-emerald-600/60"
            >
              {t(language, 'dashboard.addFarm')}
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                {t(language, 'dashboard.totalFarms')}
              </p>
              <p className="text-2xl font-bold text-stone-900 mt-1">
                {loadingSummary ? '—' : summary?.total_farms ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Tractor className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                {t(language, 'dashboard.activeCrops')}
              </p>
              <p className="text-2xl font-bold text-stone-900 mt-1">
                {loadingSummary ? '—' : summary?.total_active_crops ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Sprout className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                {t(language, 'dashboard.diagnoses')}
              </p>
              <p className="text-2xl font-bold text-stone-900 mt-1">
                {loadingSummary ? '—' : summary?.total_diagnoses ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                {t(language, 'dashboard.alerts')}
              </p>
              <p className="text-2xl font-bold text-stone-900 mt-1">
                {loadingSummary ? '—' : summary?.unread_alerts ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Bell className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Middle row: Irrigation status & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Irrigation status card */}
        <Card
          title={t(language, 'irrigation.currentStatus')}
          headerAction={sensor?.is_demo && <DemoBadge />}
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl flex items-center gap-4 ${
                irrigation?.status === 'irrigate'
                  ? 'bg-blue-50 border border-blue-200 text-blue-900'
                  : irrigation?.status === 'monitor'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-stone-50 border border-stone-200 text-stone-800'
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  irrigation?.status === 'irrigate'
                    ? 'bg-blue-600 text-white'
                    : irrigation?.status === 'monitor'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-500 text-white'
                }`}
              >
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium opacity-80 uppercase tracking-wider">
                  {language === 'ta' ? 'நிலை' : 'Status'}
                </p>
                <p className="text-lg font-bold capitalize">
                  {irrigation?.status === 'irrigate'
                    ? t(language, 'irrigation.irrigate')
                    : irrigation?.status === 'monitor'
                    ? t(language, 'irrigation.monitor')
                    : irrigation?.status === 'skip'
                    ? t(language, 'irrigation.skip')
                    : t(language, 'irrigation.insufficient')}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{t(language, 'irrigation.soilMoisture')}</span>
                <span className="font-semibold text-stone-800">
                  {sensor?.soil_moisture !== undefined ? `${sensor.soil_moisture}%` : '—'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{t(language, 'irrigation.temperature')}</span>
                <span className="font-semibold text-stone-800">
                  {sensor?.temperature !== undefined ? `${sensor.temperature}°C` : '—'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{t(language, 'irrigation.humidity')}</span>
                <span className="font-semibold text-stone-800">
                  {sensor?.humidity !== undefined ? `${sensor.humidity}%` : '—'}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50 p-3 rounded-lg">
              "{irrigation?.recommendation_text || (language === 'ta' ? 'சென்சார் அளவீடுகள் உகந்த நீர்ப்பாசனத்திற்கு கண்காணிக்கப்படுகின்றன.' : 'Monitoring sensors for optimal watering.')}"
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/irrigation')}
            >
              {t(language, 'dashboard.viewIrrigation')}
            </Button>
          </div>
        </Card>

        {/* Weather card */}
        <Card
          title={t(language, 'weather.current')}
          subtitle={weather?.location?.name || 'Chennai, Tamil Nadu'}
          className="lg:col-span-2"
          headerAction={
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/weather')}
            >
              {t(language, 'dashboard.forecast7Days')}
            </Button>
          }
        >
          {weather?.current ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50/80 rounded-xl">
                <div>
                  <p className="text-xs text-stone-500">{t(language, 'weather.temperature')}</p>
                  <p className="text-2xl font-bold text-stone-900 mt-1">
                    {weather.current.temperature !== undefined ? `${weather.current.temperature}°C` : '—'}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {weather.current.weather_description}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">{t(language, 'weather.humidity')}</p>
                  <p className="text-2xl font-bold text-stone-900 mt-1">
                    {weather.current.humidity !== undefined ? `${weather.current.humidity}%` : '—'}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ta' ? 'சார்பு அளவு' : 'Relative'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">{t(language, 'weather.wind')}</p>
                  <p className="text-2xl font-bold text-stone-900 mt-1">
                    {weather.current.wind_speed !== undefined ? `${weather.current.wind_speed} km/h` : '—'}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">10m</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">{t(language, 'weather.precipitation')}</p>
                  <p className="text-2xl font-bold text-stone-900 mt-1">
                    {weather.current.precipitation !== undefined ? `${weather.current.precipitation} mm` : '0 mm'}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ta' ? 'தற்போது' : 'Current'}
                  </p>
                </div>
              </div>

              {/* Weather risk alerts */}
              {weather.alerts && weather.alerts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    {t(language, 'weather.agriculturalAdvisories')}
                  </p>
                  {weather.alerts.slice(0, 2).map((a, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">{a.title}:</span> {a.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-stone-400 text-sm">
              {t(language, 'common.loading')}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Diagnoses table */}
      <Card
        title={t(language, 'dashboard.recentDiagnoses')}
        headerAction={
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/history')}
          >
            {t(language, 'dashboard.viewAll')}
          </Button>
        }
      >
        {summary?.recent_diagnoses && summary.recent_diagnoses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3">{t(language, 'history.crop')}</th>
                  <th className="px-4 py-3">{t(language, 'history.condition')}</th>
                  <th className="px-4 py-3">{t(language, 'history.confidence')}</th>
                  <th className="px-4 py-3">{t(language, 'history.status')}</th>
                  <th className="px-4 py-3">{t(language, 'history.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {summary.recent_diagnoses.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/60">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {translateCrop(d.predicted_crop, language)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        {d.is_healthy ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                        )}
                        {translateCondition(d.predicted_condition || d.predicted_class, language)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {d.confidence ? `${(d.confidence * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={d.is_healthy ? 'green' : 'red'}>
                        {d.is_healthy
                          ? (language === 'ta' ? 'ஆரோக்கியமானது' : 'Healthy')
                          : (language === 'ta' ? 'நோயுற்றது' : 'Diseased')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">
                      {new Date(d.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Stethoscope className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-600 font-medium text-sm">{t(language, 'dashboard.noDiagnoses')}</p>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto mb-4">
              {t(language, 'dashboard.noDiagnosesDesc')}
            </p>
            <Button
              size="sm"
              icon={<Stethoscope className="w-4 h-4" />}
              onClick={() => navigate('/crop-doctor')}
            >
              {t(language, 'dashboard.startDiagnosis')}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
