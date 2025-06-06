import { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface GeolocationState {
  position: Position | null;
  isLoading: boolean;
  error: string | null;
  isWatching: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

interface LocationAlert {
  id: string;
  type: 'flood' | 'weather' | 'evacuation' | 'safe_zone';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  message: string;
  distance: number; // em metros
  coordinates: [number, number];
  radius: number; // raio de alerta em metros
  timestamp: string;
  isActive: boolean;
}

interface GeofenceZone {
  id: string;
  name: string;
  coordinates: [number, number];
  radius: number; // em metros
  type: 'danger' | 'safe' | 'watch';
  alertOnEnter: boolean;
  alertOnExit: boolean;
  isInside: boolean;
}

const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    isLoading: false,
    error: null,
    isWatching: false,
    permission: 'unknown'
  });

  const [locationAlerts, setLocationAlerts] = useState<LocationAlert[]>([]);
  const [geofences, setGeofences] = useState<GeofenceZone[]>([]);
  const [locationHistory, setLocationHistory] = useState<Position[]>([]);
  
  const watchIdRef = useRef<number | null>(null);
  const lastNotificationRef = useRef<number>(0);

  // Configurações de alta precisão
  const highAccuracyOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000 // Cache por 1 minuto
  };

  // Verifica permissões de geolocalização
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setState(prev => ({ ...prev, permission: result.state as any }));
        
        result.addEventListener('change', () => {
          setState(prev => ({ ...prev, permission: result.state as any }));
        });
      });
    }
  }, []);

  // Calcula distância entre dois pontos (Haversine formula)
  const calculateDistance = useCallback((
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371000; // Raio da Terra em metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Obtém posição atual
  const getCurrentPosition = useCallback((): Promise<Position> => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            timestamp: position.timestamp
          };

          setState(prev => ({ 
            ...prev, 
            position: pos, 
            isLoading: false, 
            error: null 
          }));

          // Adiciona ao histórico
          setLocationHistory(prev => [pos, ...prev.slice(0, 99)]); // Mantém 100 posições

          resolve(pos);
        },
        (error) => {
          const errorMessage = {
            [error.PERMISSION_DENIED]: 'Permissão negada para acessar localização',
            [error.POSITION_UNAVAILABLE]: 'Localização indisponível',
            [error.TIMEOUT]: 'Timeout ao obter localização'
          }[error.code] || 'Erro desconhecido de geolocalização';

          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: errorMessage 
          }));

          reject(new Error(errorMessage));
        },
        highAccuracyOptions
      );
    });
  }, []);

  // Inicia monitoramento contínuo
  const startWatching = useCallback(() => {
    if (!('geolocation' in navigator) || state.isWatching) return;

    setState(prev => ({ ...prev, isWatching: true }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const pos: Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
          timestamp: position.timestamp
        };

        setState(prev => ({ ...prev, position: pos }));
        setLocationHistory(prev => [pos, ...prev.slice(0, 99)]);
        
        // Verifica geofences e alertas
        checkLocationAlerts(pos);
        checkGeofences(pos);
      },
      (error) => {
        console.error('Erro no monitoramento de localização:', error);
      },
      highAccuracyOptions
    );
  }, [state.isWatching]);

  // Para monitoramento
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setState(prev => ({ ...prev, isWatching: false }));
    }
  }, []);

  // Verifica alertas baseados na localização
  const checkLocationAlerts = useCallback((position: Position) => {
    locationAlerts.forEach(alert => {
      if (!alert.isActive) return;

      const distance = calculateDistance(
        position.latitude,
        position.longitude,
        alert.coordinates[1],
        alert.coordinates[0]
      );

      // Se entrou na zona de alerta
      if (distance <= alert.radius) {
        const now = Date.now();
        
        // Evita spam de notificações (mínimo 5 minutos entre alertas)
        if (now - lastNotificationRef.current > 300000) {
          // Aqui você integraria com o sistema de notificações
          console.log(`🚨 ALERTA: ${alert.title} - ${alert.message}`);
          lastNotificationRef.current = now;
          
          // Dispara evento customizado para outros componentes
          window.dispatchEvent(new CustomEvent('locationAlert', {
            detail: { alert, distance, position }
          }));
        }
      }
    });
  }, [locationAlerts, calculateDistance]);

  // Verifica geofences
  const checkGeofences = useCallback((position: Position) => {
    setGeofences(prev => prev.map(fence => {
      const distance = calculateDistance(
        position.latitude,
        position.longitude,
        fence.coordinates[1],
        fence.coordinates[0]
      );

      const isInside = distance <= fence.radius;
      const wasInside = fence.isInside;

      // Detecta entrada na zona
      if (!wasInside && isInside && fence.alertOnEnter) {
        window.dispatchEvent(new CustomEvent('geofenceEnter', {
          detail: { fence, position }
        }));
      }

      // Detecta saída da zona
      if (wasInside && !isInside && fence.alertOnExit) {
        window.dispatchEvent(new CustomEvent('geofenceExit', {
          detail: { fence, position }
        }));
      }

      return { ...fence, isInside };
    }));
  }, [calculateDistance]);

  // Adiciona alerta de localização
  const addLocationAlert = useCallback((alert: Omit<LocationAlert, 'id' | 'timestamp' | 'isActive'>) => {
    const newAlert: LocationAlert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isActive: true
    };

    setLocationAlerts(prev => [...prev, newAlert]);
    return newAlert;
  }, []);

  // Adiciona geofence
  const addGeofence = useCallback((fence: Omit<GeofenceZone, 'id' | 'isInside'>) => {
    const newFence: GeofenceZone = {
      ...fence,
      id: Date.now().toString(),
      isInside: false
    };

    setGeofences(prev => [...prev, newFence]);
    return newFence;
  }, []);

  // Obtém alertas próximos
  const getNearbyAlerts = useCallback((radiusKm: number = 5) => {
    if (!state.position) return [];

    return locationAlerts.filter(alert => {
      const distance = calculateDistance(
        state.position!.latitude,
        state.position!.longitude,
        alert.coordinates[1],
        alert.coordinates[0]
      );

      return distance <= radiusKm * 1000; // Converte para metros
    }).sort((a, b) => {
      const distA = calculateDistance(
        state.position!.latitude,
        state.position!.longitude,
        a.coordinates[1],
        a.coordinates[0]
      );
      const distB = calculateDistance(
        state.position!.latitude,
        state.position!.longitude,
        b.coordinates[1],
        b.coordinates[0]
      );
      return distA - distB;
    });
  }, [state.position, locationAlerts, calculateDistance]);

  // Verifica se está em área de risco
  const isInDangerZone = useCallback(() => {
    if (!state.position) return false;

    return geofences.some(fence => 
      fence.type === 'danger' && 
      fence.isInside
    );
  }, [state.position, geofences]);

  // Encontra zona segura mais próxima
  const findNearestSafeZone = useCallback(() => {
    if (!state.position) return null;

    const safeZones = geofences.filter(fence => fence.type === 'safe');
    
    if (safeZones.length === 0) return null;

    return safeZones.reduce((nearest, zone) => {
      const distance = calculateDistance(
        state.position!.latitude,
        state.position!.longitude,
        zone.coordinates[1],
        zone.coordinates[0]
      );

      if (!nearest) return { zone, distance };

      const nearestDistance = calculateDistance(
        state.position!.latitude,
        state.position!.longitude,
        nearest.zone.coordinates[1],
        nearest.zone.coordinates[0]
      );

      return distance < nearestDistance ? { zone, distance } : nearest;
    }, null as { zone: GeofenceZone; distance: number } | null);
  }, [state.position, geofences, calculateDistance]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    // Estado
    ...state,
    locationAlerts,
    geofences,
    locationHistory,

    // Ações
    getCurrentPosition,
    startWatching,
    stopWatching,
    addLocationAlert,
    addGeofence,

    // Utilitários
    calculateDistance,
    getNearbyAlerts,
    isInDangerZone,
    findNearestSafeZone,

    // Status
    hasLocation: !!state.position,
    isHighAccuracy: state.position?.accuracy ? state.position.accuracy < 50 : false
  };
};

export default useGeolocation; 