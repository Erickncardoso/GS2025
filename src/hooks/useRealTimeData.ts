import { useState, useEffect, useCallback } from 'react';

interface Alert {
  id: string;
  type: 'critical' | 'moderate' | 'info' | 'resolved';
  title: string;
  location: string;
  timestamp: string;
  reports: number;
  distance: string;
  coordinates: [number, number];
}

interface Statistics {
  usersOnline: number;
  activeAlerts: number;
  criticalAlerts: number;
  safeAreas: number;
  onlineGrowth: string;
}

interface RealTimeData {
  alerts: Alert[];
  statistics: Statistics;
  lastUpdate: string;
  isConnected: boolean;
}

// Simulação de WebSocket/API real
const useRealTimeData = () => {
  const [data, setData] = useState<RealTimeData>({
    alerts: [],
    statistics: {
      usersOnline: 1458,
      activeAlerts: 27,
      criticalAlerts: 3,
      safeAreas: 42,
      onlineGrowth: '+12%'
    },
    lastUpdate: new Date().toISOString(),
    isConnected: false
  });

  const [isLoading, setIsLoading] = useState(true);

  // Simula dados que seriam recebidos de um backend real
  const generateMockData = useCallback((): RealTimeData => {
    const now = new Date();
    const baseAlerts: Alert[] = [
      {
        id: '1',
        type: 'critical',
        title: 'Enchente na Av. Paulista',
        location: 'São Paulo - SP',
        timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
        reports: Math.floor(Math.random() * 50) + 100,
        distance: `${(Math.random() * 5 + 1).toFixed(1)}km de você`,
        coordinates: [-46.6333, -23.5505]
      },
      {
        id: '2',
        type: 'moderate',
        title: 'Risco no Rio Tietê',
        location: 'Marginal Tietê',
        timestamp: new Date(now.getTime() - 32 * 60000).toISOString(),
        reports: Math.floor(Math.random() * 30) + 20,
        distance: `${(Math.random() * 8 + 3).toFixed(1)}km de você`,
        coordinates: [-46.6565, -23.5615]
      },
      {
        id: '3',
        type: 'info',
        title: 'Chuva forte prevista',
        location: 'Região Sul',
        timestamp: new Date(now.getTime() - 60 * 60000).toISOString(),
        reports: Math.floor(Math.random() * 50) + 60,
        distance: `${(Math.random() * 3 + 0.5).toFixed(1)}km de você`,
        coordinates: [-46.6425, -23.5485]
      },
      {
        id: '4',
        type: 'resolved',
        title: 'Situação normalizada',
        location: 'Vila Madalena',
        timestamp: new Date(now.getTime() - 120 * 60000).toISOString(),
        reports: Math.floor(Math.random() * 100) + 100,
        distance: `${(Math.random() * 4 + 2).toFixed(1)}km de você`,
        coordinates: [-46.6275, -23.5445]
      }
    ];

    // Adiciona variação aos dados para simular tempo real
    const variation = Math.floor(Math.random() * 20) - 10; // -10 a +10
    const criticalCount = baseAlerts.filter(a => a.type === 'critical').length;
    
    return {
      alerts: baseAlerts,
      statistics: {
        usersOnline: 1458 + Math.floor(Math.random() * 100) - 50,
        activeAlerts: 27 + variation,
        criticalAlerts: criticalCount + Math.floor(Math.random() * 2),
        safeAreas: 42,
        onlineGrowth: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 20)}%`
      },
      lastUpdate: now.toISOString(),
      isConnected: true
    };
  }, []);

  // Simula conexão inicial
  useEffect(() => {
    const initializeConnection = async () => {
      setIsLoading(true);
      
      // Simula delay de conexão
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(generateMockData());
      setIsLoading(false);
    };

    initializeConnection();
  }, [generateMockData]);

  // Simula atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(interval);
  }, [generateMockData]);

  // Simula reconexão automática
  const reconnect = useCallback(() => {
    setData(prev => ({ ...prev, isConnected: false }));
    
    setTimeout(() => {
      setData(generateMockData());
    }, 2000);
  }, [generateMockData]);

  // Função para adicionar novo alerta (simula POST para backend)
  const addAlert = useCallback((newAlert: Omit<Alert, 'id' | 'timestamp'>) => {
    const alert: Alert = {
      ...newAlert,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      alerts: [alert, ...prev.alerts.slice(0, 9)], // Mantém apenas 10 alertas
      statistics: {
        ...prev.statistics,
        activeAlerts: prev.statistics.activeAlerts + 1,
        criticalAlerts: alert.type === 'critical' 
          ? prev.statistics.criticalAlerts + 1 
          : prev.statistics.criticalAlerts
      },
      lastUpdate: new Date().toISOString()
    }));

    return alert;
  }, []);

  // Função para atualizar estatísticas (simula PUT para backend)
  const updateStatistics = useCallback((updates: Partial<Statistics>) => {
    setData(prev => ({
      ...prev,
      statistics: { ...prev.statistics, ...updates },
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  return {
    data,
    isLoading,
    reconnect,
    addAlert,
    updateStatistics,
    // Métodos que seriam usados com backend real:
    // fetchAlerts: () => api.get('/alerts'),
    // subscribeToAlerts: () => websocket.connect('/alerts'),
    // reportAlert: (alert) => api.post('/alerts', alert)
  };
};

export default useRealTimeData; 