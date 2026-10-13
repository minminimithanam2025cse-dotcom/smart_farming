import React from 'react';
import { HelpCircle, ExternalLink, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n/translations';
import Card from '../components/ui/Card';

export const HelpAbout: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t(language, 'help.title')}</h1>
        <p className="text-sm text-stone-500 mt-1">
          {t(language, 'help.subtitle')}
        </p>
      </div>

      <Card title={t(language, 'help.aboutTitle')}>
        <p className="text-sm text-stone-700 leading-relaxed">
          {t(language, 'help.aboutDesc')}
        </p>
      </Card>

      <Card title={t(language, 'help.coreFeatures')}>
        <div className="space-y-3 text-xs text-stone-700">
          <div className="p-3 bg-stone-50 rounded-lg">
            <p className="font-bold text-stone-900 mb-1">
              🌿 {language === 'ta' ? 'AI பயிர் மருத்துவர்' : 'AI Crop Doctor'}
            </p>
            <p>
              {language === 'ta'
                ? 'MobileNetV3 AI மாடல் மூலம் இலை புகைப்படங்களிலிருந்து நோய்களைக் கண்டறிகிறது. அதிகபட்ச நம்பகத்தன்மை மதிப்பீட்டோடு 15 வகையான பயிர் நோய்களை வகைப்படுத்துகிறது.'
                : 'Runs MobileNetV3 transfer learning to classify leaf diseases from photographs with top-5 confidence ranking and uncertainty rejection.'}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <p className="font-bold text-stone-900 mb-1">
              💧 {language === 'ta' ? 'நேர்த்தியான நீர்ப்பாசன இயந்திரம்' : 'Smart Irrigation Engine'}
            </p>
            <p>
              {language === 'ta'
                ? 'மண் ஈரப்பதம், வெப்பநிலை, சுற்றுச்சூழல் மற்றும் வானிலை முன்னறிவிப்பை ஒப்பிட்டு, பயிருக்குத் தேவையான போது மட்டும் நீர்ப்பாசனம் செய்ய வழிகாட்டுகிறது.'
                : 'Rule-based agronomical engine that evaluates soil moisture, air temperature, relative humidity, and forecast rainfall to recommend irrigation only when necessary.'}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <p className="font-bold text-stone-900 mb-1">
              🌤️ {language === 'ta' ? 'வானிலை & அபாய கண்காணிப்பு' : 'Weather & Risk Monitoring'}
            </p>
            <p>
              {language === 'ta'
                ? 'Open-Meteo வானிலை API மூலம் 7-நாள் முன்னறிவிப்பு மற்றும் வெப்ப அலை, அதீத மழை, வறட்சி அபாய எச்சரிக்கைகளை உடனுக்குடன் வழங்குகிறது.'
                : 'Open-Meteo integration providing 7-day hourly and daily weather metrics with automated heat-stress, heavy-rain, and dry-spell risk alerts.'}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <p className="font-bold text-stone-900 mb-1">
              🗣️ {language === 'ta' ? 'தமிழ் விவசாய உதவியாளர்' : 'Tamil Farmer Assistant'}
            </p>
            <p>
              {language === 'ta'
                ? 'ஜீவாமிர்தம் இயற்கை உரம் தயாரிப்பு, PMKSY மானிய விவரங்கள், பூச்சி மேலாண்மை மற்றும் தமிழ் குரல் வழி (Text-to-Speech) ஆடியோ வாசிப்பு வசதி கொண்டுள்ளது.'
                : 'Built-in localized advisory database with Web Speech API text-to-speech for accessible guidance in Tamil.'}
            </p>
          </div>
        </div>
      </Card>

      <Card title={t(language, 'help.cmdTitle')}>
        <div className="space-y-2 font-mono text-xs text-stone-800 bg-stone-900 text-stone-200 p-4 rounded-xl">
          <p className="text-stone-400"># Start backend API (FastAPI)</p>
          <p className="text-emerald-400">.\scripts\run_backend.ps1</p>
          <p className="text-stone-400 pt-2"># Start frontend dev server (Vite + React)</p>
          <p className="text-emerald-400">.\scripts\run_frontend.ps1</p>
          <p className="text-stone-400 pt-2"># Download PlantVillage dataset</p>
          <p className="text-emerald-400">py scripts\download_dataset.py</p>
          <p className="text-stone-400 pt-2"># Train MobileNetV3 model</p>
          <p className="text-emerald-400">py backend\app\ml\train.py</p>
          <p className="text-stone-400 pt-2"># Run test suite</p>
          <p className="text-emerald-400">py -m pytest backend/tests</p>
        </div>
      </Card>
    </div>
  );
};

export default HelpAbout;
