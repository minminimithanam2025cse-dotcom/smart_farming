// AgriMitra AI - TypeScript type definitions

export interface Farm {
  id: string;
  name: string;
  owner_name?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  area_acres?: number;
  soil_type: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CropRecord {
  id: string;
  farm_id: string;
  crop_name: string;
  crop_variety?: string;
  growth_stage?: string;
  planting_date?: string;
  expected_harvest_date?: string;
  area_acres?: number;
  plot_name?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PredictionItem {
  class_name: string;
  probability: number;
}

export interface Diagnosis {
  id: string;
  farm_id?: string;
  crop_record_id?: string;
  image_filename?: string;
  predicted_class?: string;
  predicted_crop?: string;
  predicted_condition?: string;
  confidence?: number;
  is_healthy?: boolean;
  is_uncertain: boolean;
  top_predictions?: PredictionItem[];
  model_version?: string;
  model_name?: string;
  status: string;
  error_message?: string;
  advisory_text?: string;
  is_demo: boolean;
  farmer_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id?: string;
  farm_id?: string;
  sensor_id?: string;
  soil_moisture?: number;
  temperature?: number;
  humidity?: number;
  light_intensity?: number;
  soil_ph?: number;
  rainfall_mm?: number;
  source: string;
  is_demo: boolean;
  is_stale?: boolean;
  age_hours?: number;
  recorded_at: string;
}

export interface IrrigationRecommendation {
  status: 'irrigate' | 'monitor' | 'skip' | 'insufficient_data';
  reason: string;
  recommendation_text: string;
  soil_moisture?: number;
  temperature?: number;
  humidity?: number;
  moisture_threshold_low: number;
  moisture_threshold_high: number;
  is_demo: boolean;
  crop_name?: string;
}

export interface WeatherCurrent {
  temperature?: number;
  apparent_temperature?: number;
  humidity?: number;
  precipitation?: number;
  wind_speed?: number;
  weather_code?: number;
  weather_description?: string;
  pressure?: number;
}

export interface WeatherForecastDay {
  date: string;
  weather_code?: number;
  weather_description?: string;
  temp_max?: number;
  temp_min?: number;
  precipitation_mm?: number;
  precipitation_probability?: number;
  wind_speed_max?: number;
}

export interface WeatherAlert {
  type: string;
  severity: string;
  title: string;
  message: string;
}

export interface WeatherData {
  success: boolean;
  error?: string;
  location?: {
    latitude: number;
    longitude: number;
    name: string;
    timezone?: string;
  };
  current?: WeatherCurrent;
  forecast?: WeatherForecastDay[];
  alerts?: WeatherAlert[];
  fetched_at?: string;
  attribution?: string;
}

export interface Alert {
  id: string;
  farm_id?: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  is_read: boolean;
  is_resolved: boolean;
  is_demo: boolean;
  created_at: string;
  resolved_at?: string;
}

export interface AnalyticsSummary {
  total_farms: number;
  total_active_crops: number;
  total_diagnoses: number;
  healthy_diagnoses: number;
  diseased_diagnoses: number;
  unread_alerts: number;
  recent_diagnoses: Diagnosis[];
}

export interface SystemStatus {
  app_name: string;
  version: string;
  environment: string;
  demo_mode: boolean;
  model: {
    is_loaded: boolean;
    model_name?: string;
    model_version?: string;
    num_classes?: number;
    load_error?: string;
  };
  features: {
    crop_diagnosis: boolean;
    pest_detection: boolean;
    irrigation: boolean;
    weather: boolean;
    farm_management: boolean;
    tamil_assistant: boolean;
  };
}

export type Language = 'en' | 'ta';

export interface AppState {
  language: Language;
  selectedFarmId: string | null;
  demoMode: boolean;
}
