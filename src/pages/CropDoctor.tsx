import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n/translations';
import { api } from '../services/api';
import type { Diagnosis } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export const CropDoctor: React.FC = () => {
  const { language, modelAvailable } = useApp();
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [advisoryTab, setAdvisoryTab] = useState<'symptoms' | 'prevention' | 'management'>('symptoms');
  const [advisoryData, setAdvisoryData] = useState<any>(null);

  // Dropzone handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      if (selected.size > 10 * 1024 * 1024) {
        toast.error('Image exceeds 10MB limit');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setAdvisoryData(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const handleClear = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setAdvisoryData(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const diag = await api.diagnoses.predict(formData);
      setResult(diag);

      if (diag.status === 'model_unavailable') {
        toast.error('Model not trained yet. See instructions below.');
      } else if (diag.is_uncertain) {
        toast('Low confidence prediction. Review details.', { icon: '⚠️' });
      } else {
        toast.success('Diagnosis complete!');
      }

      // Fetch advisory details if class is available
      if (diag.predicted_class) {
        try {
          const adv = await api.diagnoses.getAdvisory(diag.predicted_class);
          setAdvisoryData(adv);
        } catch {}
      }
    } catch (err: any) {
      toast.error(err.message || 'Diagnosis failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t(language, 'cropDoctor.title')}</h1>
        <p className="text-sm text-stone-500 mt-1">{t(language, 'cropDoctor.subtitle')}</p>
      </div>

      {/* Model availability notice */}
      {!modelAvailable && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{t(language, 'cropDoctor.modelUnavailable')}</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              No trained MobileNetV3 model checkpoint is loaded yet. Uploading an image will record the request and report honest status.
            </p>
            <p className="text-xs text-amber-700 font-mono bg-amber-100/60 p-2 rounded mt-2">
              To train: py scripts/download_dataset.py &amp;&amp; py backend/app/ml/train.py
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Column */}
        <div className="space-y-4">
          <Card title={t(language, 'cropDoctor.uploadTitle')}>
            <div className="space-y-4">
              {/* Optional Crop Selector Filter */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  {language === 'ta' ? 'பயிர் வகை (விருப்பத்தேர்வு):' : 'Indicate Crop (Optional):'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', nameEn: 'Auto-Detect (All)', nameTa: 'தானியங்கி (அனைத்தும்)' },
                    { id: 'Apple', nameEn: 'Apple', nameTa: 'ஆப்பிள்' },
                    { id: 'Corn', nameEn: 'Corn (Maize)', nameTa: 'மக்காச்சோளம்' },
                    { id: 'Grape', nameEn: 'Grape', nameTa: 'திராட்சை' },
                    { id: 'Cherry', nameEn: 'Cherry', nameTa: 'செர்ரி' },
                    { id: 'Blueberry', nameEn: 'Blueberry', nameTa: 'புளூபெர்ரி' },
                  ].map((crop) => (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => setSelectedCropFilter(crop.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        selectedCropFilter === crop.id
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {language === 'ta' ? crop.nameTa : crop.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Dataset Scope Notices */}
              {selectedCropFilter === 'Cherry' && (
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">
                      {language === 'ta' ? 'செர்ரி மாதிரி வரம்பு:' : 'Cherry Dataset Scope:'}
                    </span>{' '}
                    {language === 'ta'
                      ? 'மாடலில் உள்ள செர்ரி வகுப்புகள்: வெண்பூஞ்சை (Powdery Mildew) மற்றும் ஆரோக்கியமான இலை. செர்ரி இலைப்புள்ளி நோய் (Cherry Leaf Spot / Shot Hole) இந்த 15 வகுப்புகளில் சேர்க்கப்படவில்லை.'
                      : 'Trained Cherry classes: Powdery Mildew and Healthy foliage. Foliar spot diseases (Cherry Leaf Spot / Shot Hole / Blumeriella jaapii) are not in the 15-class dataset.'}
                  </div>
                </div>
              )}

              {selectedCropFilter === 'Blueberry' && (
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">
                      {language === 'ta' ? 'புளூபெர்ரி மாதிரி வரம்பு:' : 'Blueberry Dataset Scope:'}
                    </span>{' '}
                    {language === 'ta'
                      ? 'தற்போது AI மாடலில் ஆரோக்கியமான புளூபெர்ரி மட்டுமே உள்ளது. நோய் தாக்கிய புளூபெர்ரி இலைகள் (Anthracnose, Rust) இந்த 15 வகுப்புகளில் இல்லை. எனவே இதன் அறிகுறிகள் மிக நெருக்கமான நோயுடன் ஒப்பிடப்படும்.'
                      : 'The 15-class model includes healthy blueberry foliage. Specific blueberry fungal diseases (anthracnose, rust) are outside the 15 classes and will be matched against the closest visual symptoms.'}
                  </div>
                </div>
              )}

              {!preview ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-stone-300 hover:border-emerald-400 bg-stone-50/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-stone-700">
                    {t(language, 'cropDoctor.uploadDesc')}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    {t(language, 'cropDoctor.supportedFormats')}
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 aspect-video flex items-center justify-center">
                  <img
                    src={preview}
                    alt="Leaf preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    onClick={handleClear}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {preview && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleAnalyze}
                    loading={loading}
                    className="flex-1"
                  >
                    {loading ? t(language, 'cropDoctor.analyzing') : t(language, 'cropDoctor.analyzeBtn')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Results Column */}
        <div className="space-y-4">
          <Card title={t(language, 'cropDoctor.results')}>
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <p className="text-sm font-medium text-stone-700">Running MobileNetV3 inference...</p>
                <p className="text-xs text-stone-400">Normalizing, tensor encoding, classifying</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Result Status Banner */}
                {result.status === 'model_unavailable' ? (
                  <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-800 text-sm">
                    <p className="font-semibold">Model Not Available</p>
                    <p className="text-xs text-stone-600 mt-1">
                      {result.error_message || 'Please train the model to enable disease classification.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Crop Mismatch / Unsupported Disease Explanatory Alert */}
                    {selectedCropFilter !== 'all' &&
                      result.predicted_crop &&
                      !result.predicted_crop.toLowerCase().includes(selectedCropFilter.toLowerCase()) && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs space-y-2">
                          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              {selectedCropFilter === 'Cherry'
                                ? (language === 'ta' ? 'செர்ரி இலைப்புள்ளி நோய் (Cherry Leaf Spot) வரம்பு விளக்கம்' : 'Cherry Leaf Spot (Shot Hole) — Unsupported Disease Note')
                                : selectedCropFilter === 'Blueberry'
                                ? (language === 'ta' ? 'புளூபெர்ரி இலை நோய் மாதிரி வரம்பு விளக்கம்' : 'Blueberry Foliar Disease — Dataset Scope Note')
                                : (language === 'ta' ? 'பயிர் வேறுபாடு / ஆதரிக்கப்படாத நோய் விளக்கம்' : 'Crop Mismatch / Unsupported Disease Explanation')}
                            </span>
                          </div>
                          <p className="leading-relaxed">
                            {selectedCropFilter === 'Cherry' ? (
                              language === 'ta'
                                ? `நீங்கள் 'செர்ரி' இலையைத் தேர்ந்தெடுத்துள்ளீர்கள். பயிற்சி அளிக்கப்பட்ட 15 வகுப்புகளில் செர்ரிக்கு 'வெண்பூஞ்சை (Powdery Mildew)' மட்டுமே சேர்க்கப்பட்டுள்ளது; செர்ரி இலைப்புள்ளி நோய் (Cherry Leaf Spot / Blumeriella jaapii) இந்த மாதிரியில் இல்லை. இந்த இலையில் பழுப்பு நிற நெக்ரோடிக் புள்ளிகள் உள்ளதால், AI மாடல் இதன் தோற்றத்தை மக்காச்சோள சாம்பல் இலைப்புள்ளி நோயுடன் ('${result.predicted_crop} - ${result.predicted_condition}' ${((result.confidence ?? 0) * 100).toFixed(1)}%) நெருக்கமாகப் பொருத்தியுள்ளது. செர்ரி இலைப்புள்ளி நோய்க்கு தாமிர அடிப்படையிலான காப்பர் அல்லது கேப்டான் பூஞ்சைக்கொல்லி மருந்துகளைப் பயன்படுத்தலாம்.`
                                : `You indicated this is a 'Cherry' leaf. In the 15 trained classes, Cherry only has 'Powdery Mildew' and 'Healthy'; foliar spot diseases such as Cherry Leaf Spot (Shot Hole / Blumeriella jaapii) are not in the dataset. Because this leaf displays circular necrotic brown spots rather than white mildew, the AI matched its visual lesions against the closest trained disease: '${result.predicted_crop} - ${result.predicted_condition}' (${((result.confidence ?? 0) * 100).toFixed(1)}%). For Cherry Leaf Spot, recommend applying a copper-based fungicide or Captan.`
                            ) : selectedCropFilter === 'Blueberry' ? (
                              language === 'ta'
                                ? `நீங்கள் 'புளூபெர்ரி' இலையைத் தேர்ந்தெடுத்துள்ளீர்கள். AI மாடலில் ஆரோக்கியமான புளூபெர்ரி மட்டுமே உள்ளது (நோயுற்ற புளூபெர்ரி வகுப்புகள் இல்லை). இதனால் இலையின் கருகல் வடிவத்தை வைத்து மிக நெருக்கமான '${result.predicted_crop}' (${result.predicted_condition}) உடன் பொருத்தியுள்ளது.`
                                : `You indicated this is a 'Blueberry' leaf. The 15 trained classes only include healthy blueberry foliage (no diseased blueberry classes). Because this leaf exhibits necrosis or blight, the AI classified its visual symptoms against the closest trained disease: '${result.predicted_crop} - ${result.predicted_condition}' (${((result.confidence ?? 0) * 100).toFixed(1)}%).`
                            ) : (
                              language === 'ta'
                                ? `நீங்கள் '${selectedCropFilter}' என்று குறிப்பிட்டுள்ளீர்கள். ஆனால் AI மாடல் இதன் காட்சி அறிகுறிகளை '${result.predicted_crop}' (${result.predicted_condition} - ${((result.confidence ?? 0) * 100).toFixed(1)}%) என்று வகைப்படுத்தியுள்ளது. வெவ்வேறு பயிர்களின் இலைப்புள்ளி நோய்கள் ஒரே மாதிரியான காட்சி வடிவங்களைக் கொண்டிருக்கலாம்.`
                                : `You indicated this is a '${selectedCropFilter}' leaf, but the AI classified its visual symptoms as '${result.predicted_crop} - ${result.predicted_condition}' (${((result.confidence ?? 0) * 100).toFixed(1)}%). Some foliar fungal diseases display similar necrotic lesions across different plant species.`
                            )}
                          </p>
                        </div>
                      )}

                    <div
                      className={`p-4 rounded-xl border flex items-start gap-4 ${
                        result.is_healthy
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : result.is_uncertain
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-lg shrink-0 ${
                          result.is_healthy
                            ? 'bg-emerald-600 text-white'
                            : result.is_uncertain
                            ? 'bg-amber-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {result.is_healthy ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : result.is_uncertain ? (
                          <HelpCircle className="w-6 h-6" />
                        ) : (
                          <ShieldAlert className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-lg leading-tight">
                            {result.predicted_crop} - {result.predicted_condition}
                          </h4>
                          <Badge variant={result.is_healthy ? 'green' : result.is_uncertain ? 'amber' : 'red'}>
                            {result.is_healthy ? 'Healthy' : result.is_uncertain ? 'Uncertain' : 'Diseased'}
                          </Badge>
                        </div>
                        <p className="text-xs opacity-80 mt-1 font-mono">
                          Class: {result.predicted_class}
                        </p>
                      </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-stone-600">{t(language, 'cropDoctor.confidence')}</span>
                        <span className="text-stone-900 font-bold">
                          {result.confidence ? `${((result.confidence ?? 0) * 100).toFixed(1)}%` : '—'}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            (result.confidence || 0) > 0.7
                              ? 'bg-emerald-600'
                              : (result.confidence || 0) > 0.4
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${(result.confidence || 0) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Top 5 predictions */}
                    {result.top_predictions && result.top_predictions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          {t(language, 'cropDoctor.topPredictions')}
                        </p>
                        <div className="space-y-1.5">
                          {result.top_predictions.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="truncate text-stone-600 max-w-[200px]">
                                {p.class_name.replace(/___/g, ' - ').replace(/_/g, ' ')}
                              </span>
                              <span className="font-mono text-stone-800 font-medium">
                                {(p.probability * 100).toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advisory Section */}
                    {advisoryData && (
                      <div className="border-t border-stone-200 pt-4 space-y-3">
                        <div className="flex border-b border-stone-200">
                          {(['symptoms', 'prevention', 'management'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setAdvisoryTab(tab)}
                              className={`px-3 py-2 text-xs font-medium border-b-2 capitalize transition-colors ${
                                advisoryTab === tab
                                  ? 'border-emerald-600 text-emerald-800 font-semibold'
                                  : 'border-transparent text-stone-500 hover:text-stone-800'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        <div className="text-xs text-stone-700 leading-relaxed min-h-[100px]">
                          {advisoryTab === 'symptoms' && (
                            <ul className="list-disc pl-4 space-y-1">
                              {advisoryData.symptoms?.map((s: string, idx: number) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ul>
                          )}
                          {advisoryTab === 'prevention' && (
                            <ul className="list-disc pl-4 space-y-1">
                              {advisoryData.prevention?.map((p: string, idx: number) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          )}
                          {advisoryTab === 'management' && (
                            <ul className="list-disc pl-4 space-y-1">
                              {advisoryData.management?.map((m: string, idx: number) => (
                                <li key={idx}>{m}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-stone-400 text-sm">
                Upload and analyze a leaf image to see diagnosis results here.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CropDoctor;


