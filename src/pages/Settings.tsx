import React from 'react';
import { Settings as SettingsIcon, Globe, Database, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n/translations';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export const Settings: React.FC = () => {
  const { language, setLanguage, demoMode, setDemoMode } = useApp();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t(language, 'settings.title')}</h1>
        <p className="text-sm text-stone-500 mt-1">{t(language, 'settings.subtitle')}</p>
      </div>

      <Card title={t(language, 'settings.languageCard')}>
        <div className="space-y-3">
          <label className="text-xs font-semibold text-stone-700 block">
            {t(language, 'settings.interfaceLang')}
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setLanguage('en');
                toast.success('Language set to English');
              }}
              className={`flex-1 p-3 rounded-xl border text-sm font-semibold transition-all ${
                language === 'en'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage('ta');
                toast.success('மொழி தமிழுக்கு மாற்றப்பட்டது');
              }}
              className={`flex-1 p-3 rounded-xl border text-sm font-semibold transition-all ${
                language === 'ta'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>
        </div>
      </Card>

      <Card title={t(language, 'settings.demoCard')}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-800">{t(language, 'settings.simulateData')}</p>
            <p className="text-xs text-stone-500 mt-0.5 max-w-md">
              {t(language, 'settings.simulateDesc')}
            </p>
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ml-4 ${
              demoMode ? 'bg-emerald-600' : 'bg-stone-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                demoMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      <Card title={t(language, 'settings.systemInfo')}>
        <div className="space-y-2 text-xs text-stone-600">
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span>{t(language, 'settings.application')}</span>
            <span className="font-semibold text-stone-800">AgriMitra AI</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span>{t(language, 'settings.problemStatement')}</span>
            <span className="font-semibold text-stone-800">SIH26180</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span>{t(language, 'settings.version')}</span>
            <span className="font-mono text-stone-800">1.0.0</span>
          </div>
          <div className="flex justify-between py-1">
            <span>{t(language, 'settings.targetOs')}</span>
            <span className="text-stone-800">Windows PowerShell / Cross-platform</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
