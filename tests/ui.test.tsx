import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Badge from '../src/components/ui/Badge';
import DemoBadge from '../src/components/ui/DemoBadge';
import StatusIndicator from '../src/components/ui/StatusIndicator';
import { t } from '../src/i18n/translations';

describe('UI Components', () => {
  it('renders Badge with text and variant', () => {
    render(<Badge variant="green">Healthy</Badge>);
    expect(screen.getByText('Healthy')).toBeDefined();
  });

  it('renders DemoBadge with warning notice', () => {
    render(<DemoBadge />);
    expect(screen.getByText('Demo Data')).toBeDefined();
  });

  it('renders StatusIndicator online state', () => {
    render(<StatusIndicator online={true} label="Online" />);
    expect(screen.getByText('Online')).toBeDefined();
  });

  it('renders StatusIndicator offline state', () => {
    render(<StatusIndicator online={false} label="Offline" />);
    expect(screen.getByText('Offline')).toBeDefined();
  });
});

describe('i18n Translations', () => {
  it('translates English dashboard title correctly', () => {
    const title = t('en', 'dashboard.title');
    expect(title).toBe('Dashboard');
  });

  it('translates Tamil dashboard title correctly', () => {
    const title = t('ta', 'dashboard.title');
    expect(title).toBe('டாஷ்போர்டு');
  });

  it('translates crop doctor in Tamil', () => {
    const title = t('ta', 'cropDoctor.title');
    expect(title).toBe('AI பயிர் மருத்துவர்');
  });

  it('falls back to key when translation missing', () => {
    const res = t('en', 'nonexistent.key');
    expect(res).toBe('nonexistent.key');
  });
});
