import { useState, useEffect, useCallback } from 'react';

interface OfflineData {
  alerts: any[];
  weatherData: any;
  mapData: any[];
  userReports: any[];
  lastSync: string;
}

interface QueuedAction {
  id: string;
  type: 'report' | 'update' | 'delete';
  data: any;
  timestamp: string;
  retryCount: number;
}

interface OfflineState {
  isOnline: boolean;
  isOfflineMode: boolean;
  hasOfflineData: boolean;
  queuedActions: QueuedAction[];
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  lastSyncError: string | null;
}

const STORAGE_KEYS = {
  OFFLINE_DATA: 'flood-watch-offline-data',
  QUEUED_ACTIONS: 'flood-watch-queued-actions',
  OFFLINE_SETTINGS: 'flood-watch-offline-settings'
} as const;

const useOfflineMode = () => {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isOfflineMode: false,
    hasOfflineData: false,
    queuedActions: [],
    syncStatus: 'idle',
    lastSyncError: null
  });

  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);

  // Monitora status de conexão
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      // Auto-sync quando voltar online
      if (state.queuedActions.length > 0) {
        syncQueuedActions();
      }
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false, isOfflineMode: true }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.queuedActions.length]);

  // Carrega dados offline do localStorage
  useEffect(() => {
    loadOfflineData();
    loadQueuedActions();
  }, []);

  // Salva dados para uso offline
  const saveOfflineData = useCallback((data: Partial<OfflineData>) => {
    const existingData = getStoredData<OfflineData>(STORAGE_KEYS.OFFLINE_DATA) || {
      alerts: [],
      weatherData: null,
      mapData: [],
      userReports: [],
      lastSync: new Date().toISOString()
    };

    const updatedData = {
      ...existingData,
      ...data,
      lastSync: new Date().toISOString()
    };

    setStoredData(STORAGE_KEYS.OFFLINE_DATA, updatedData);
    setOfflineData(updatedData);
    setState(prev => ({ ...prev, hasOfflineData: true }));
  }, []);

  // Carrega dados offline
  const loadOfflineData = useCallback(() => {
    const data = getStoredData<OfflineData>(STORAGE_KEYS.OFFLINE_DATA);
    if (data) {
      setOfflineData(data);
      setState(prev => ({ ...prev, hasOfflineData: true }));
    }
  }, []);

  // Adiciona ação à fila para sincronização posterior
  const queueAction = useCallback((action: Omit<QueuedAction, 'id' | 'timestamp' | 'retryCount'>) => {
    const queuedAction: QueuedAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    setState(prev => {
      const updatedActions = [...prev.queuedActions, queuedAction];
      setStoredData(STORAGE_KEYS.QUEUED_ACTIONS, updatedActions);
      return { ...prev, queuedActions: updatedActions };
    });

    return queuedAction.id;
  }, []);

  // Carrega ações em fila
  const loadQueuedActions = useCallback(() => {
    const actions = getStoredData<QueuedAction[]>(STORAGE_KEYS.QUEUED_ACTIONS) || [];
    setState(prev => ({ ...prev, queuedActions: actions }));
  }, []);

  // Sincroniza ações em fila quando voltar online
  const syncQueuedActions = useCallback(async () => {
    if (!state.isOnline || state.queuedActions.length === 0) return;

    setState(prev => ({ ...prev, syncStatus: 'syncing' }));

    try {
      const successfulActions: string[] = [];
      const failedActions: QueuedAction[] = [];

      for (const action of state.queuedActions) {
        try {
          // Simula sincronização com backend
          await simulateApiCall(action);
          successfulActions.push(action.id);
          
          console.log(`✅ Ação sincronizada: ${action.type}`, action.data);
        } catch (error) {
          console.error(`❌ Erro ao sincronizar ação ${action.id}:`, error);
          
          // Tenta novamente até 3 vezes
          if (action.retryCount < 3) {
            failedActions.push({
              ...action,
              retryCount: action.retryCount + 1
            });
          } else {
            console.error(`🔴 Ação ${action.id} falhou definitivamente após 3 tentativas`);
          }
        }
      }

      // Remove ações bem-sucedidas e mantém as que falharam
      const remainingActions = failedActions;
      
      setState(prev => ({
        ...prev,
        queuedActions: remainingActions,
        syncStatus: remainingActions.length > 0 ? 'error' : 'success',
        lastSyncError: remainingActions.length > 0 ? 'Algumas ações falharam na sincronização' : null
      }));

      setStoredData(STORAGE_KEYS.QUEUED_ACTIONS, remainingActions);

      // Dispara evento de sincronização completa
      if (remainingActions.length === 0) {
        window.dispatchEvent(new CustomEvent('offlineSyncComplete', {
          detail: { syncedActions: successfulActions.length }
        }));
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        syncStatus: 'error',
        lastSyncError: 'Erro geral na sincronização'
      }));
    }
  }, [state.isOnline, state.queuedActions]);

  // Força download de dados para modo offline
  const downloadOfflineData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, syncStatus: 'syncing' }));

      // Simula download de dados essenciais
      const [alerts, weather, mapData] = await Promise.all([
        simulateApiCall({ type: 'fetch', data: 'alerts' }),
        simulateApiCall({ type: 'fetch', data: 'weather' }),
        simulateApiCall({ type: 'fetch', data: 'mapData' })
      ]);

      await saveOfflineData({
        alerts: alerts || [],
        weatherData: weather,
        mapData: mapData || [],
        userReports: offlineData?.userReports || []
      });

      setState(prev => ({ ...prev, syncStatus: 'success' }));
      
      console.log('📱 Dados offline baixados com sucesso');
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        syncStatus: 'error',
        lastSyncError: 'Erro ao baixar dados offline'
      }));
    }
  }, [saveOfflineData, offlineData]);

  // Ativa/desativa modo offline manual
  const toggleOfflineMode = useCallback((enabled?: boolean) => {
    const newState = enabled ?? !state.isOfflineMode;
    setState(prev => ({ ...prev, isOfflineMode: newState }));
    
    const settings = { offlineModeEnabled: newState };
    setStoredData(STORAGE_KEYS.OFFLINE_SETTINGS, settings);
  }, [state.isOfflineMode]);

  // Limpa dados offline
  const clearOfflineData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA);
    localStorage.removeItem(STORAGE_KEYS.QUEUED_ACTIONS);
    
    setOfflineData(null);
    setState(prev => ({
      ...prev,
      hasOfflineData: false,
      queuedActions: []
    }));
  }, []);

  // Salva reporte offline
  const saveOfflineReport = useCallback((report: any) => {
    const reportWithId = {
      ...report,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      offline: true
    };

    // Salva localmente
    const currentData = offlineData || {
      alerts: [],
      weatherData: null,
      mapData: [],
      userReports: [],
      lastSync: new Date().toISOString()
    };

    const updatedData = {
      ...currentData,
      userReports: [...currentData.userReports, reportWithId]
    };

    saveOfflineData(updatedData);

    // Adiciona à fila para sincronização
    queueAction({
      type: 'report',
      data: reportWithId
    });

    return reportWithId;
  }, [offlineData, saveOfflineData, queueAction]);

  // Obtém dados específicos (com fallback offline)
  const getData = useCallback((type: keyof OfflineData) => {
    if (state.isOnline && !state.isOfflineMode) {
      // Em modo online, tentaria buscar dados frescos da API
      return null; // Aqui retornaria dados da API
    }
    
    // Em modo offline, retorna dados armazenados
    return offlineData?.[type] || null;
  }, [state.isOnline, state.isOfflineMode, offlineData]);

  return {
    // Estado
    ...state,
    offlineData,

    // Ações
    saveOfflineData,
    downloadOfflineData,
    queueAction,
    syncQueuedActions,
    toggleOfflineMode,
    clearOfflineData,
    saveOfflineReport,
    getData,

    // Status
    canUseOffline: state.hasOfflineData,
    needsSync: state.queuedActions.length > 0,
    isFullyOffline: !state.isOnline || state.isOfflineMode
  };
};

// Utilitários para localStorage
const getStoredData = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Erro ao ler ${key} do localStorage:`, error);
    return null;
  }
};

const setStoredData = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
  }
};

// Simula chamadas de API (substitua por chamadas reais)
const simulateApiCall = async (action: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simula 90% de sucesso
      if (Math.random() > 0.1) {
        resolve({ success: true, data: `Processado: ${action.type}` });
      } else {
        reject(new Error('Erro simulado de rede'));
      }
    }, 1000 + Math.random() * 2000); // 1-3 segundos
  });
};

export default useOfflineMode; 