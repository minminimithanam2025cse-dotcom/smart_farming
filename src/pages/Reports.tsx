import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, PieChart, Activity, Download } from 'lucide-react';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { t, translateCrop, translateCondition } from '../i18n/translations';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const COLORS = ['#10b981', '#f43f5e'];

export const Reports: React.FC = () => {
  const { language } = useApp();
  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => api.analytics.summary(),
  });

  const pieData = [
    { name: t(language, 'reports.healthyCount'), value: summary?.healthy_diagnoses || 0 },
    { name: t(language, 'reports.diseasedCount'), value: summary?.diseased_diagnoses || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t(language, 'reports.title')}</h1>
        <p className="text-sm text-stone-500 mt-1">{t(language, 'reports.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={t(language, 'reports.healthBreakdown')}>
          <div className="h-64 w-full">
            {summary?.total_diagnoses && summary.total_diagnoses > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-400 text-sm">
                {t(language, 'reports.noData')}
              </div>
            )}
          </div>
          <div className="flex justify-center gap-6 text-xs mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> {t(language, 'reports.healthyCount')}: {summary?.healthy_diagnoses || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> {t(language, 'reports.diseasedCount')}: {summary?.diseased_diagnoses || 0}
            </span>
          </div>
        </Card>

        <Card title={t(language, 'reports.summaryMetrics')}>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-stone-50 rounded-lg text-sm">
              <span className="text-stone-600">{t(language, 'reports.totalFarms')}</span>
              <span className="font-bold text-stone-900">{summary?.total_farms || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-50 rounded-lg text-sm">
              <span className="text-stone-600">{t(language, 'reports.activeCrops')}</span>
              <span className="font-bold text-stone-900">{summary?.total_active_crops || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-50 rounded-lg text-sm">
              <span className="text-stone-600">{t(language, 'reports.totalDiagnoses')}</span>
              <span className="font-bold text-stone-900">{summary?.total_diagnoses || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-50 rounded-lg text-sm">
              <span className="text-stone-600">{t(language, 'reports.unreadAlerts')}</span>
              <span className="font-bold text-amber-600">{summary?.unread_alerts || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Diagnoses Activity Table */}
      {summary?.recent_diagnoses && summary.recent_diagnoses.length > 0 && (
        <Card title={t(language, 'reports.recentRecords')}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">{t(language, 'history.crop')}</th>
                  <th className="py-2.5 px-3">{t(language, 'reports.detectedCondition')}</th>
                  <th className="py-2.5 px-3">{t(language, 'reports.healthStatus')}</th>
                  <th className="py-2.5 px-3">{t(language, 'history.confidence')}</th>
                  <th className="py-2.5 px-3">{t(language, 'history.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {summary.recent_diagnoses.map((d: any) => (
                  <tr key={d.id} className="hover:bg-stone-50/50">
                    <td className="py-2 px-3 font-semibold text-stone-900">
                      {translateCrop(d.predicted_crop, language)}
                    </td>
                    <td className="py-2 px-3">
                      {translateCondition(d.predicted_condition, language)}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.is_healthy
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {d.is_healthy
                          ? (language === 'ta' ? 'ஆரோக்கியமானது' : 'HEALTHY')
                          : (language === 'ta' ? 'நோயுற்றது' : 'DISEASED')}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono font-medium">
                      {(d.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-2 px-3 text-stone-400">
                      {new Date(d.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;
