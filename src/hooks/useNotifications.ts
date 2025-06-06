import { useState, useEffect, useCallback } from 'react';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  urgency: 'low' | 'normal' | 'critical';
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface NotificationHistory {
  id: string;
  timestamp: string;
  title: string;
  body: string;
  urgency: 'low' | 'normal' | 'critical';
  read: boolean;
  actionTaken?: string;
}

const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  
  const [isSupported, setIsSupported] = useState(false);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Verifica suporte a notificações
  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      updatePermissionState();
    }
  }, []);

  const updatePermissionState = () => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        default: currentPermission === 'default'
      });
    }
  };

  // Solicita permissão para notificações
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notificações não são suportadas neste navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      updatePermissionState();
      
      if (result === 'granted') {
        // Mostra notificação de boas-vindas
        await showNotification({
          title: '🌊 Flood Watch Community',
          body: 'Notificações ativadas! Você receberá alertas sobre enchentes em tempo real.',
          icon: '/favicon.ico',
          urgency: 'low',
          tag: 'welcome'
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  }, [isSupported]);

  // Envia notificação
  const showNotification = useCallback(async (options: NotificationOptions): Promise<string | null> => {
    if (!permission.granted) {
      console.warn('Permissão para notificações não concedida');
      return null;
    }

    try {
      const notificationId = Date.now().toString();
      
      // Configurações baseadas na urgência
      const urgencyConfig = {
        low: { 
          silent: true, 
          requireInteraction: false,
          icon: '/icons/info.png'
        },
        normal: { 
          silent: false, 
          requireInteraction: false,
          icon: '/icons/warning.png'
        },
        critical: { 
          silent: false, 
          requireInteraction: true,
          icon: '/icons/critical.png',
          actions: [
            { action: 'view', title: 'Ver Detalhes', icon: '/icons/view.png' },
            { action: 'route', title: 'Rota Segura', icon: '/icons/route.png' }
          ]
        }
      };

      const config = urgencyConfig[options.urgency];
      
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || config.icon,
        badge: options.badge || '/icons/badge.png',
        tag: options.tag || `flood-alert-${notificationId}`,
        requireInteraction: options.requireInteraction ?? config.requireInteraction,
        silent: options.silent ?? config.silent,
        actions: options.actions || config.actions,
        data: {
          id: notificationId,
          urgency: options.urgency,
          timestamp: new Date().toISOString()
        }
      });

      // Adiciona ao histórico
      const historyItem: NotificationHistory = {
        id: notificationId,
        timestamp: new Date().toISOString(),
        title: options.title,
        body: options.body,
        urgency: options.urgency,
        read: false
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Mantém 50 notificações
      setUnreadCount(prev => prev + 1);

      // Eventos da notificação
      notification.onclick = () => {
        window.focus();
        markAsRead(notificationId);
        notification.close();
        
        // Pode navegar para página específica baseado no tipo
        if (options.urgency === 'critical') {
          window.location.href = '/alertas';
        }
      };

      notification.onclose = () => {
        markAsRead(notificationId);
      };

      // Auto-close para notificações não críticas
      if (options.urgency !== 'critical') {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notificationId;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return null;
    }
  }, [permission.granted]);

  // Marca notificação como lida
  const markAsRead = useCallback((notificationId: string) => {
    setHistory(prev => 
      prev.map(item => 
        item.id === notificationId 
          ? { ...item, read: true }
          : item
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Marca todas como lidas
  const markAllAsRead = useCallback(() => {
    setHistory(prev => prev.map(item => ({ ...item, read: true })));
    setUnreadCount(0);
  }, []);

  // Limpa histórico
  const clearHistory = useCallback(() => {
    setHistory([]);
    setUnreadCount(0);
  }, []);

  // Notificações específicas para alertas de enchente
  const sendFloodAlert = useCallback((severity: 'low' | 'moderate' | 'high', location: string, details: string) => {
    const alertConfigs = {
      low: {
        title: '🌧️ Alerta de Chuva',
        urgency: 'low' as const,
        icon: '/icons/rain.png'
      },
      moderate: {
        title: '⚠️ Risco de Alagamento',
        urgency: 'normal' as const,
        icon: '/icons/flood.png'
      },
      high: {
        title: '🚨 ENCHENTE CRÍTICA',
        urgency: 'critical' as const,
        icon: '/icons/emergency.png'
      }
    };

    const config = alertConfigs[severity];
    
    return showNotification({
      title: config.title,
      body: `${location}: ${details}`,
      icon: config.icon,
      urgency: config.urgency,
      tag: `flood-${severity}-${Date.now()}`,
      actions: severity === 'high' ? [
        { action: 'evacuate', title: 'Rota de Evacuação' },
        { action: 'share', title: 'Compartilhar' }
      ] : undefined
    });
  }, [showNotification]);

  // Agenda notificações baseadas na previsão do tempo
  const scheduleWeatherAlerts = useCallback((weatherData: any) => {
    // Analisa dados meteorológicos e agenda alertas preventivos
    const highRainProbability = weatherData?.daily?.some((day: any) => 
      day.precipitationProbability > 70 && day.precipitationAmount > 20
    );

    if (highRainProbability) {
      // Agenda alerta preventivo para 1 hora antes da chuva prevista
      setTimeout(() => {
        sendFloodAlert('moderate', 'Sua região', 'Chuva forte prevista. Monitore áreas de risco.');
      }, 3600000); // 1 hora
    }
  }, [sendFloodAlert]);

  return {
    // Estado
    permission,
    isSupported,
    history,
    unreadCount,
    
    // Ações
    requestPermission,
    showNotification,
    sendFloodAlert,
    scheduleWeatherAlerts,
    markAsRead,
    markAllAsRead,
    clearHistory,
    
    // Utilitários
    canSendNotifications: permission.granted && isSupported
  };
};

export default useNotifications; 