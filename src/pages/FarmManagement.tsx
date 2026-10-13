import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Tractor,
  Plus,
  Trash2,
  MapPin,
  Sprout,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import { t, translateSoil } from '../i18n/translations';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Farm } from '../types';

export const FarmManagement: React.FC = () => {
  const { language, selectedFarmId, setSelectedFarmId } = useApp();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [soilType, setSoilType] = useState('loamy');

  const { data: farms = [], isLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.farms.list(),
  });

  const createFarmMutation = useMutation({
    mutationFn: (newFarm: Partial<Farm>) => api.farms.create(newFarm),
    onSuccess: (created: any) => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success(language === 'ta' ? 'பண்ணை வெற்றிகரமாக சேர்க்கப்பட்டது' : 'Farm added successfully');
      setShowAddModal(false);
      resetForm();
      if (!selectedFarmId) setSelectedFarmId(created.id);
    },
    onError: (err: any) => {
      toast.error(err.message || (language === 'ta' ? 'பண்ணை சேர்ப்பதில் தோல்வி' : 'Failed to add farm'));
    },
  });

  const deleteFarmMutation = useMutation({
    mutationFn: (id: string) => api.farms.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success(language === 'ta' ? 'பண்ணை நீக்கப்பட்டது' : 'Farm deleted');
      if (selectedFarmId === deletedId) setSelectedFarmId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || (language === 'ta' ? 'பண்ணை நீக்குவதில் தோல்வி' : 'Failed to delete farm'));
    },
  });

  const resetForm = () => {
    setName('');
    setOwner('');
    setLocation('');
    setArea('');
    setSoilType('loamy');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(language === 'ta' ? 'பண்ணை பெயர் அவசியம்' : 'Farm name is required');
      return;
    }
    createFarmMutation.mutate({
      name: name.trim(),
      owner_name: owner.trim() || undefined,
      location: location.trim() || undefined,
      area_acres: area ? parseFloat(area) : undefined,
      soil_type: soilType,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t(language, 'farms.title')}</h1>
          <p className="text-sm text-stone-500 mt-1">{t(language, 'farms.subtitle')}</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          {t(language, 'farms.addFarm')}
        </Button>
      </div>

      {/* Farms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <Card
            key={farm.id}
            className={`cursor-pointer transition-all ${
              selectedFarmId === farm.id
                ? 'ring-2 ring-emerald-600 border-emerald-500 shadow-sm'
                : 'hover:border-stone-400'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-stone-900">{farm.name}</h3>
                  {farm.owner_name && (
                    <p className="text-xs text-stone-500">{farm.owner_name}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(t(language, 'farms.deleteConfirm'))) deleteFarmMutation.mutate(farm.id);
                  }}
                  className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                  title={t(language, 'farms.deleteFarm')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                {farm.location && (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" /> {farm.location}
                  </p>
                )}
                {farm.area_acres && (
                  <p className="flex items-center gap-1.5">
                    <Tractor className="w-3.5 h-3.5 text-stone-400" /> {farm.area_acres} {t(language, 'farms.acres')}
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-stone-400" /> {t(language, 'farms.soil')}: {translateSoil(farm.soil_type, language)}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <Button
                  size="sm"
                  variant={selectedFarmId === farm.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedFarmId(farm.id)}
                  className="w-full text-xs"
                >
                  {selectedFarmId === farm.id ? t(language, 'farms.activeFarm') : t(language, 'farms.selectFarm')}
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {farms.length === 0 && !isLoading && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
            <Tractor className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-700">{t(language, 'farms.noFarms')}</p>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto mb-4">
              {t(language, 'farms.noFarmsDesc')}
            </p>
            <Button size="sm" onClick={() => setShowAddModal(true)} icon={<Plus className="w-4 h-4" />}>
              {t(language, 'farms.addFarm')}
            </Button>
          </div>
        )}
      </div>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-bold text-lg text-stone-900">{t(language, 'farms.addFarm')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t(language, 'farms.farmName')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t(language, 'farms.farmNamePlaceholder')}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t(language, 'farms.owner')}
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder={t(language, 'farms.ownerPlaceholder')}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t(language, 'farms.location')}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t(language, 'farms.locationPlaceholder')}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t(language, 'farms.area')}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder={t(language, 'farms.areaPlaceholder')}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t(language, 'farms.soilType')}
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-emerald-600"
                  >
                    <option value="loamy">{t(language, 'farms.soilLoamy')}</option>
                    <option value="clay">{t(language, 'farms.soilClay')}</option>
                    <option value="sandy">{t(language, 'farms.soilSandy')}</option>
                    <option value="silt">{t(language, 'farms.soilSilt')}</option>
                    <option value="peat">{t(language, 'farms.soilPeat')}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  {t(language, 'farms.cancel')}
                </Button>
                <Button
                  type="submit"
                  loading={createFarmMutation.isPending}
                  className="flex-1"
                >
                  {t(language, 'farms.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmManagement;
