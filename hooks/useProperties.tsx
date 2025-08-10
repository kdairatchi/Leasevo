import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Property, Unit } from '@/types';
import { mockProperties, mockUnits } from '@/mocks/data';


interface PropertiesState {
  properties: Property[];
  units: Unit[];
  isLoading: boolean;
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<void>;
  addUnit: (unit: Omit<Unit, 'id'>) => Promise<void>;
  updateUnit: (unitId: string, updates: Partial<Unit>) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
  getPropertyUnits: (propertyId: string) => Unit[];
  getTenantUnit: (tenantId: string) => Unit | undefined;
}

export const [PropertiesProvider, useProperties] = createContextHook<PropertiesState>(() => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedProperties = await AsyncStorage.getItem('properties');
      const storedUnits = await AsyncStorage.getItem('units');
      
      if (storedProperties) {
        setProperties(JSON.parse(storedProperties));
      } else {
        setProperties(mockProperties);
        await AsyncStorage.setItem('properties', JSON.stringify(mockProperties));
      }
      
      if (storedUnits) {
        setUnits(JSON.parse(storedUnits));
      } else {
        setUnits(mockUnits);
        await AsyncStorage.setItem('units', JSON.stringify(mockUnits));
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      setProperties(mockProperties);
      setUnits(mockUnits);
    } finally {
      setIsLoading(false);
    }
  };

  const addProperty = useCallback(async (property: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date(),
      units: [],
    };
    
    const updated = [...properties, newProperty];
    setProperties(updated);
    await AsyncStorage.setItem('properties', JSON.stringify(updated));
  }, [properties]);

  const addUnit = useCallback(async (unit: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unit,
      id: Date.now().toString(),
    };
    
    const updated = [...units, newUnit];
    setUnits(updated);
    await AsyncStorage.setItem('units', JSON.stringify(updated));
  }, [units]);

  const updateUnit = useCallback(async (unitId: string, updates: Partial<Unit>) => {
    const updated = units.map(unit => 
      unit.id === unitId ? { ...unit, ...updates } : unit
    );
    setUnits(updated);
    await AsyncStorage.setItem('units', JSON.stringify(updated));
  }, [units]);

  const deleteProperty = useCallback(async (propertyId: string) => {
    const updated = properties.filter(p => p.id !== propertyId);
    setProperties(updated);
    await AsyncStorage.setItem('properties', JSON.stringify(updated));
    
    // Also remove associated units
    const updatedUnits = units.filter(u => u.propertyId !== propertyId);
    setUnits(updatedUnits);
    await AsyncStorage.setItem('units', JSON.stringify(updatedUnits));
  }, [properties, units]);

  const getPropertyUnits = useCallback((propertyId: string) => {
    return units.filter(unit => unit.propertyId === propertyId);
  }, [units]);

  const getTenantUnit = useCallback((tenantId: string) => {
    return units.find(unit => unit.tenantId === tenantId);
  }, [units]);

  return useMemo(() => ({
    properties,
    units,
    isLoading,
    addProperty,
    addUnit,
    updateUnit,
    deleteProperty,
    getPropertyUnits,
    getTenantUnit,
  }), [properties, units, isLoading, addProperty, addUnit, updateUnit, deleteProperty, getPropertyUnits, getTenantUnit]);
});