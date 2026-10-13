import React, { useState, useEffect } from 'react';
import { Bot, Send, Volume2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { t } from '../i18n/translations';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface QA {
  qEn: string;
  qTa: string;
  aEn: string;
  aTa: string;
  topic: string;
}

const KNOWLEDGE: QA[] = [
  {
    qEn: 'How to manage Tomato Early Blight?',
    qTa: 'தக்காளி ஆரம்ப கருகல் நோயை எவ்வாறு கட்டுப்படுத்துவது?',
    aEn: 'Early blight causes target-like circular brown spots on lower leaves. Management: Apply Mancozeb or Copper oxychloride preventively; remove infected leaves; avoid overhead watering; rotate crops for 3 years.',
    aTa: 'ஆரம்ப கருகல் நோய் இலைகளில் வட்டமான பழுப்பு புள்ளிகளை ஏற்படுத்துகிறது. மேலாண்மை: மேன்கோசெப் அல்லது காப்பர் ஆக்சிகுளோரைடு தெளிக்கவும்; பாதிக்கப்பட்ட இலைகளை அகற்றவும்; சொட்டு நீர் பாசனம் பயன்படுத்தவும்; 3 ஆண்டுகளுக்கு பயிர் சுழற்சி செய்யவும்.',
    topic: 'Disease',
  },
  {
    qEn: 'When should I irrigate my crops?',
    qTa: 'எனது பயிருக்கு எப்போது நீர் பாய்ச்ச வேண்டும்?',
    aEn: 'Irrigate when soil moisture falls below 30-35% for most crops. Water in the early morning to minimize evaporation. If rain is forecast, delay irrigation to avoid waterlogging.',
    aTa: 'பெரும்பாலான பயிர்களுக்கு மண் ஈரப்பதம் 30-35%க்கு கீழ் குறையும் போது நீர் பாய்ச்சவும். ஆவியாவதை குறைக்க அதிகாலையில் நீர் பாய்ச்சவும். மழை எதிர்பார்க்கப்பட்டால் நீர்ப்பாசனத்தை தள்ளிப்போடவும்.',
    topic: 'Irrigation',
  },
  {
    qEn: 'How to prevent potato late blight?',
    qTa: 'உருளைக்கிழங்கு பின் கருகல் நோயை எவ்வாறு தடுப்பது?',
    aEn: 'Late blight thrives in cool, humid weather. Use certified clean seed potatoes, plant in well-drained soils, avoid sprinkler irrigation, and spray Bordeaux mixture or Metalaxyl before dense fog or heavy rains.',
    aTa: 'குளிர்ந்த, ஈரப்பதமான வானிலையில் இந்நோய் பரவுகிறது. சான்றளிக்கப்பட்ட விதை உருளைக்கிழங்கைப் பயன்படுத்துங்கள், வடிகால் வசதியுள்ள நிலங்களில் நடுங்கள், போர்டோ கலவை தெளிக்கவும்.',
    topic: 'Disease',
  },
  {
    qEn: 'What are safe organic pest control methods?',
    qTa: 'பாதுகாப்பான இயற்கை பூச்சி கட்டுப்பாடு முறைகள் என்ன?',
    aEn: 'Use 5% Neem seed kernel extract (NSKE) or Neem oil spray for sucking pests; install yellow sticky traps for whiteflies; use pheromone traps for borers; spray ginger-garlic-chilli extract.',
    aTa: 'சாறு உறிஞ்சும் பூச்சிகளுக்கு 5% வேப்பங்கொட்டை கரைசல் அல்லது வேப்பெண்ணெய் தெளிக்கவும்; மஞ்சள் ஒட்டும் பொறிகளை அமைக்கவும்; இஞ்சி, பூண்டு, பச்சை மிளகாய் கரைசல் தெளிக்கவும்.',
    topic: 'Pest',
  },
  {
    qEn: 'How to control Common Rust in Maize (Corn)?',
    qTa: 'மக்காச்சோளத்தில் துரு நோயை (Common Rust) எவ்வாறு கட்டுப்படுத்துவது?',
    aEn: 'Common rust shows circular-to-elongate golden brown pustules on both leaf surfaces. Management: Plant resistant hybrids; spray Mancozeb (2g/L) or Azoxystrobin (1ml/L) at first sign of pustules; maintain optimal plant spacing.',
    aTa: 'மக்காச்சோள இலைகளில் செம்பழுப்பு நிற கொப்புளங்கள் தோன்றும். மேலாண்மை: நோய் எதிர்ப்பு ரகங்களை பயிரிடவும்; ஆரம்ப நிலையிலேயே மேன்கோசெப் 2 கிராம் அல்லது அசோக்சிஸ்ட்ரோபின் 1 மி.லி/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.',
    topic: 'Disease',
  },
  {
    qEn: 'How to control Black Rot in Grapes?',
    qTa: 'திராட்சையில் கருப்பு அழுகல் நோயை (Black Rot) எவ்வாறு தடுப்பது?',
    aEn: 'Black rot causes reddish-brown leaf spots and shriveled black mummified berries. Prune dead canes and destroy infected mummies. Apply Mancozeb or Myclobutanil early in the season before fruit set.',
    aTa: 'திராட்சை இலைகளில் பழுப்பு நிற புள்ளிகள் மற்றும் பழங்கள் சுருங்கி காய்ந்து உதிரும். காய்ந்த கொடிகள் மற்றும் பாதிக்கப்பட்ட பழங்களை அப்புறப்படுத்தி எரிக்கவும். பூக்கும் முன் மேன்கோசெப் அல்லது காப்பர் பூஞ்சாணக்கொல்லி தெளிக்கவும்.',
    topic: 'Disease',
  },
  {
    qEn: 'How to prepare Jeevamrutham organic bio-fertilizer?',
    qTa: 'ஜீவாமிர்தம் இயற்கை உரம் தயாரிப்பது எப்படி?',
    aEn: 'Mix 10 kg native cow dung, 10 L cow urine, 2 kg jaggery, 2 kg pulse flour, and a handful of fertile farm soil in 200 L water. Stir twice daily in shade for 48 hours. Apply via drip or soil drenching for rapid microbial proliferation.',
    aTa: '200 லிட்டர் நீரில் 10 கிலோ நாட்டு மாட்டு சாணம், 10 லிட்டர் கோமியம், 2 கிலோ வெல்லம், 2 கிலோ பயறு மாவு, கைப்பிடி வரப்பு மண் சேர்த்து கலக்கவும். நிழலில் 48 மணி நேரம் தினமும் இருமுறை கலக்கி விட்டு, பாசன நீருடன் கலந்து விடலாம்.',
    topic: 'Fertilizer',
  },
  {
    qEn: 'What is the government subsidy for Drip Irrigation in Tamil Nadu?',
    qTa: 'தமிழ்நாட்டில் சொட்டு நீர் பாசன மானியம் (Drip Subsidy) எவ்வளவு?',
    aEn: 'Under the PMKSY / Tamil Nadu Horticulture scheme, Small & Marginal farmers receive 100% subsidy, and other farmers receive 75% subsidy for installing micro-irrigation systems. Apply via the TNHORT portal.',
    aTa: 'பிரதமரின் நுண்ணீர்ப்பாசன திட்டத்தின் (PMKSY) கீழ் தமிழ்நாட்டில் சிறு மற்றும் குறு விவசாயிகளுக்கு 100% முழு மானியமும், இதர விவசாயிகளுக்கு 75% மானியமும் வழங்கப்படுகிறது. உழவன் செயலி அல்லது தோட்டக்கலைத்துறை மூலம் விண்ணப்பிக்கலாம்.',
    topic: 'Subsidy',
  },
  {
    qEn: 'How to collect soil sample for testing?',
    qTa: 'மண் பரிசோதனைக்காக மண் மாதிரி எடுப்பது எப்படி?',
    aEn: 'Divide farm into uniform blocks. Remove surface litter, dig V-shaped pits (15 cm depth), scrape thin slices from sides, mix samples thoroughly, shade dry, and send 500g composite sample to the nearest Agricultural Extension lab.',
    aTa: 'நிலத்தில் மேற்பரப்பு காய்ந்த சருகுகளை அகற்றி, V வடிவில் 15 செ.மீ ஆழத்தில் வெட்டி, பக்கவாட்டு மண்ணை சேகரிக்கவும். 10 முதல் 15 இடங்களில் எடுத்து ஒன்றாக கலந்து, நிழலில் உலர்த்தி 500 கிராம் மாதிரி எடுத்து வேளாண்மை விரிவாக்க மையத்தில் கொடுக்கவும்.',
    topic: 'Soil',
  },
];

export const TamilAssistant: React.FC = () => {
  const { language } = useApp();
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'bot'; text: string }>
  >(() => [
    {
      sender: 'bot',
      text:
        (localStorage.getItem('agrimitra_lang') || 'ta') === 'ta'
          ? 'வணக்கம்! நான் உங்கள் அக்ரிமித்ரா AI உதவியாளர். பயிர் நோய்கள், நீர்ப்பாசனம் மற்றும் வானிலை பற்றி என்னிடம் கேளுங்கள்.'
          : 'Hello! I am your AgriMitra AI Assistant. Ask me about crop diseases, irrigation, or weather advisories.',
    },
  ]);
  const [input, setInput] = useState('');

  // Synchronize greeting message when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            sender: 'bot',
            text:
              language === 'ta'
                ? 'வணக்கம்! நான் உங்கள் அக்ரிமித்ரா AI உதவியாளர். பயிர் நோய்கள், நீர்ப்பாசனம் மற்றும் வானிலை பற்றி என்னிடம் கேளுங்கள்.'
                : 'Hello! I am your AgriMitra AI Assistant. Ask me about crop diseases, irrigation, or weather advisories.',
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const handleSend = (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim()) return;

    // Add user message
    const newMsgs = [...messages, { sender: 'user' as const, text: q }];

    // Match in knowledge base
    const match = KNOWLEDGE.find(
      (k) =>
        k.qEn.toLowerCase().includes(q.toLowerCase()) ||
        k.qTa.includes(q) ||
        q.toLowerCase().includes(k.topic.toLowerCase())
    );

    let answer =
      language === 'ta'
        ? 'மன்னிக்கவும், இதற்கு சரியான தகவல் இல்லை. உங்கள் வட்டார வேளாண்மை அலுவலரை அணுகவும்.'
        : 'I do not have specific advice for this yet. Please consult your local agriculture extension officer.';

    if (match) {
      answer = language === 'ta' ? match.aTa : match.aEn;
    }

    setMessages([...newMsgs, { sender: 'bot' as const, text: answer }]);
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          {language === 'ta' ? 'தமிழ் வேளாண் உதவியாளர்' : 'Tamil Farmer Assistant'}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          {language === 'ta'
            ? 'தமிழ் மற்றும் ஆங்கிலத்தில் சான்றுகள் அடிப்படையிலான விவசாய வழிகாட்டல்'
            : 'Evidence-based agricultural Q&A in Tamil and English'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col h-[550px]">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-stone-100 text-stone-800 rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.sender === 'bot' && (
                    <button
                      onClick={() => speak(m.text)}
                      className="mt-2 text-stone-500 hover:text-stone-800 flex items-center gap-1 text-xs cursor-pointer font-medium"
                      title={language === 'ta' ? 'குரலில் வாசித்துக் காட்டு' : 'Read aloud'}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {language === 'ta' ? 'வாசி' : 'Speak'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input box */}
          <div className="pt-4 border-t border-stone-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                language === 'ta'
                  ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...'
                  : 'Ask a farming question...'
              }
              className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
            />
            <Button
              onClick={() => handleSend()}
              icon={<Send className="w-4 h-4" />}
            >
              {language === 'ta' ? 'அனுப்பு' : 'Send'}
            </Button>
          </div>
        </Card>

        {/* Suggested Questions */}
        <Card title={language === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Common Questions'}>
          <div className="space-y-2">
            {KNOWLEDGE.map((k, i) => {
              const qText = language === 'ta' ? k.qTa : k.qEn;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(qText)}
                  className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-100 text-xs font-medium text-stone-700 transition-colors flex items-start gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{qText}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TamilAssistant;

