import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
  Farm, CropRecord, Diagnosis, SensorReading, IrrigationRecommendation,
  WeatherData, Alert, AnalyticsSummary, SystemStatus
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Error handler
function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const ae = error as AxiosError<{ detail?: string | object }>;
    const detail = ae.response?.data?.detail;
    if (typeof detail === 'string') throw new Error(detail);
    if (ae.code === 'ECONNABORTED') throw new Error('Request timed out. Please try again.');
    if (!ae.response) throw new Error('Cannot connect to backend server. Is it running?');
    throw new Error(`Server error (${ae.response.status})`);
  }
  throw error;
}

// ---- System ----
export const api = {
  system: {
    status: async (): Promise<SystemStatus> => {
      try {
        const { data } = await apiClient.get('/system/status');
        return data;
      } catch (e) { return handleError(e); }
    },
    health: async () => {
      try {
        const { data } = await apiClient.get('/system/status');
        return {
          status: 'ok',
          model_available: Boolean(data?.model?.is_loaded),
          app_name: data?.app_name,
          version: data?.version,
        };
      } catch {
        try {
          const { data } = await axios.get('/health', { timeout: 5000 });
          return data;
        } catch (e) {
          return handleError(e);
        }
      }
    },
  },

  // ---- Farms ----
  farms: {
    list: async (): Promise<Farm[]> => {
      try { const { data } = await apiClient.get('/farms'); return data; }
      catch (e) { return handleError(e); }
    },
    get: async (id: string): Promise<Farm> => {
      try { const { data } = await apiClient.get(`/farms/${id}`); return data; }
      catch (e) { return handleError(e); }
    },
    create: async (farm: Partial<Farm>): Promise<Farm> => {
      try { const { data } = await apiClient.post('/farms', farm); return data; }
      catch (e) { return handleError(e); }
    },
    update: async (id: string, farm: Partial<Farm>): Promise<Farm> => {
      try { const { data } = await apiClient.patch(`/farms/${id}`, farm); return data; }
      catch (e) { return handleError(e); }
    },
    delete: async (id: string): Promise<void> => {
      try { await apiClient.delete(`/farms/${id}`); }
      catch (e) { return handleError(e); }
    },
    crops: {
      list: async (farmId: string): Promise<CropRecord[]> => {
        try { const { data } = await apiClient.get(`/farms/${farmId}/crops`); return data; }
        catch (e) { return handleError(e); }
      },
      create: async (farmId: string, crop: Partial<CropRecord>): Promise<CropRecord> => {
        try { const { data } = await apiClient.post(`/farms/${farmId}/crops`, crop); return data; }
        catch (e) { return handleError(e); }
      },
    },
  },

  // ---- Diagnoses ----
  diagnoses: {
    predict: async (formData: FormData): Promise<Diagnosis> => {
      try {
        const { data } = await apiClient.post('/diagnoses/predict', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000,
        });
        return data;
      } catch (e) { return handleError(e); }
    },
    list: async (farmId?: string, skip = 0, limit = 20): Promise<Diagnosis[]> => {
      try {
        const params: Record<string, unknown> = { skip, limit };
        if (farmId) params.farm_id = farmId;
        const { data } = await apiClient.get('/diagnoses', { params });
        return data;
      } catch (e) { return handleError(e); }
    },
    get: async (id: string): Promise<Diagnosis> => {
      try { const { data } = await apiClient.get(`/diagnoses/${id}`); return data; }
      catch (e) { return handleError(e); }
    },
    delete: async (id: string): Promise<void> => {
      try { await apiClient.delete(`/diagnoses/${id}`); }
      catch (e) { return handleError(e); }
    },
    getAdvisory: async (className: string) => {
      try { const { data } = await apiClient.get(`/diagnoses/advisory/${encodeURIComponent(className)}`); return data; }
      catch (e) { return handleError(e); }
    },
  },

  // ---- Sensors ----
  sensors: {
    latest: async (farmId?: string): Promise<SensorReading> => {
      try {
        const params = farmId ? { farm_id: farmId } : {};
        const { data } = await apiClient.get('/sensors/latest', { params });
        return data;
      } catch (e) { return handleError(e); }
    },
    history: async (farmId?: string, hours = 24): Promise<SensorReading[]> => {
      try {
        const params: Record<string, unknown> = { hours };
        if (farmId) params.farm_id = farmId;
        const { data } = await apiClient.get('/sensors/history', { params });
        return data;
      } catch (e) { return handleError(e); }
    },
    demoHistory: async (points = 48) => {
      try {
        const { data } = await apiClient.get(`/sensors/demo-history?points=${points}`);
        return data;
      } catch (e) { return handleError(e); }
    },
    addReading: async (reading: Partial<SensorReading>): Promise<SensorReading> => {
      try { const { data } = await apiClient.post('/sensors/readings', reading); return data; }
      catch (e) { return handleError(e); }
    },
    irrigationRecommend: async (farmId?: string, cropName?: string): Promise<IrrigationRecommendation> => {
      try {
        const params: Record<string, unknown> = {};
        if (farmId) params.farm_id = farmId;
        if (cropName) params.crop_name = cropName;
        const { data } = await apiClient.get('/sensors/irrigation/recommend', { params });
        return data;
      } catch (e) { return handleError(e); }
    },
  },

  // ---- Weather ----
  weather: {
    forecast: async (lat: number, lon: number, locationName?: string): Promise<WeatherData> => {
      try {
        const params: Record<string, unknown> = { latitude: lat, longitude: lon };
        if (locationName) params.location_name = locationName;
        const { data } = await apiClient.get('/weather/forecast', { params });
        return data;
      } catch (e) { return handleError(e); }
    },
  },

  // ---- Alerts ----
  alerts: {
    list: async (farmId?: string): Promise<Alert[]> => {
      try {
        const params = farmId ? { farm_id: farmId } : {};
        const { data } = await apiClient.get('/alerts', { params });
        return data;
      } catch (e) { return handleError(e); }
    },
    markRead: async (id: string): Promise<Alert> => {
      try { const { data } = await apiClient.patch(`/alerts/${id}/read`); return data; }
      catch (e) { return handleError(e); }
    },
  },

  // ---- Analytics ----
  analytics: {
    summary: async (): Promise<AnalyticsSummary> => {
      try { const { data } = await apiClient.get('/analytics/summary'); return data; }
      catch (e) { return handleError(e); }
    },
  },
};

export default api;
