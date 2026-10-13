import test from 'node:test';
import assert from 'node:assert/strict';
import { translations, t } from '../src/i18n/translations.ts';

test('i18n - English translations have core keys', () => {
  assert.equal(t('en', 'dashboard.title'), 'Dashboard');
  assert.equal(t('en', 'cropDoctor.title'), 'AI Crop Doctor');
  assert.equal(t('en', 'irrigation.title'), 'Smart Irrigation');
  assert.equal(t('en', 'weather.title'), 'Weather & Risk Monitoring');
  assert.equal(t('en', 'farms.title'), 'Farm Management');
  assert.equal(t('en', 'nav.dashboard'), 'Dashboard');
  assert.equal(t('en', 'nav.cropDoctor'), 'AI Crop Doctor');
  assert.equal(t('en', 'nav.irrigation'), 'Smart Irrigation');
});

test('i18n - Tamil translations have core keys', () => {
  assert.equal(t('ta', 'dashboard.title'), 'டாஷ்போர்டு');
  assert.equal(t('ta', 'cropDoctor.title'), 'AI பயிர் மருத்துவர்');
  assert.equal(t('ta', 'irrigation.title'), 'நேர்த்தியான நீர்ப்பாசனம்');
  assert.equal(t('ta', 'weather.title'), 'வானிலை & அபாய கண்காணிப்பு');
  assert.equal(t('ta', 'farms.title'), 'பண்ணை மேலாண்மை');
  assert.equal(t('ta', 'nav.dashboard'), 'டாஷ்போர்டு');
});

test('i18n - Fallback to key when translation missing', () => {
  assert.equal(t('en', 'missing.key.path'), 'missing.key.path');
  assert.equal(t('ta', 'nonexistent.element'), 'nonexistent.element');
});

test('i18n - Completeness check between English and Tamil keys', () => {
  const enKeys = Object.keys(translations.en);
  const taKeys = Object.keys(translations.ta);
  assert.deepEqual(enKeys.sort(), taKeys.sort());

  // Check sub-keys for nav
  const enNavKeys = Object.keys(translations.en.nav);
  const taNavKeys = Object.keys(translations.ta.nav);
  assert.deepEqual(enNavKeys.sort(), taNavKeys.sort());

  // Check sub-keys for dashboard
  const enDashKeys = Object.keys(translations.en.dashboard);
  const taDashKeys = Object.keys(translations.ta.dashboard);
  assert.deepEqual(enDashKeys.sort(), taDashKeys.sort());
});
