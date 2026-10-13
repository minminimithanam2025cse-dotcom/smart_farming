import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { t, translateCrop, translateCondition } from '../i18n/translations';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import DemoBadge from '../components/ui/DemoBadge';

export const DiagnosisHistory: React.FC = () => {
  const { language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'healthy' | 'diseased'>('all');

  const { data: diagnoses = [], refetch } = useQuery({
    queryKey: ['diagnoses-history'],
    queryFn: () => api.diagnoses.list(undefined, 0, 50),
  });

  const filtered = diagnoses.filter((d) => {
    const matchesSearch =
      (d.predicted_crop?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (d.predicted_condition?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (d.predicted_class?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    if (filterType === 'healthy') return matchesSearch && d.is_healthy === true;
    if (filterType === 'diseased') return matchesSearch && d.is_healthy === false;
    return matchesSearch;
  });

  const exportCSV = () => {
    if (diagnoses.length === 0) {
      toast.error(language === 'ta' ? 'பதிவிறக்கம் செய்ய பதிவுகள் இல்லை' : 'No diagnosis records to export');
      return;
    }
    const headers = ['ID', 'Crop', 'Condition', 'Confidence', 'Healthy', 'Date'];
    const rows = diagnoses.map((d) => [
      d.id,
      d.predicted_crop || '',
      d.predicted_condition || '',
      d.confidence ? (d.confidence * 100).toFixed(1) + '%' : '',
      d.is_healthy ? 'Yes' : 'No',
      new Date(d.created_at).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrimitra_diagnoses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(language === 'ta' ? 'CSV வெற்றிகரமாக பதிவிறக்கப்பட்டது' : 'CSV downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t(language, 'history.title')}</h1>
          <p className="text-sm text-stone-500 mt-1">{t(language, 'history.subtitle')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          icon={<Download className="w-4 h-4" />}
        >
          {t(language, 'history.exportCSV')}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder={t(language, 'history.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-emerald-600"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'healthy', 'diseased'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                filterType === type
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              {type === 'all'
                ? t(language, 'history.all')
                : type === 'healthy'
                ? t(language, 'history.healthy')
                : t(language, 'history.diseased')}
            </button>
          ))}
        </div>
      </div>

      {/* Diagnoses Table */}
      <Card>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3">{t(language, 'history.crop')}</th>
                  <th className="px-4 py-3">{t(language, 'history.condition')}</th>
                  <th className="px-4 py-3">{t(language, 'history.confidence')}</th>
                  <th className="px-4 py-3">{t(language, 'history.status')}</th>
                  <th className="px-4 py-3">{t(language, 'history.mode')}</th>
                  <th className="px-4 py-3">{t(language, 'history.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/60">
                    <td className="px-4 py-3 font-semibold text-stone-900">
                      {translateCrop(d.predicted_crop, language)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        {d.is_healthy ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span className="truncate max-w-[280px]">
                          {translateCondition(d.predicted_condition || d.predicted_class, language)}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {d.confidence ? `${(d.confidence * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={d.is_healthy ? 'green' : 'red'}>
                        {d.is_healthy
                          ? (language === 'ta' ? 'ஆரோக்கியமானது' : 'Healthy')
                          : (language === 'ta' ? 'நோயுற்றது' : 'Diseased')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {d.is_demo ? <DemoBadge /> : (
                        <span className="text-xs text-stone-400">
                          {language === 'ta' ? 'நேரடி' : 'Live'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 text-sm">
            <History className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p>{t(language, 'history.empty')}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DiagnosisHistory;
