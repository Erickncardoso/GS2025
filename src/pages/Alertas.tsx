
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Smartphone, MessageSquare, Mail, MapPin, Shield } from 'lucide-react';
import Header from '@/components/Header';

const Alertas = () => {
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    whatsapp: false,
    app: true
  });

  const [locationAlerts, setLocationAlerts] = useState(false);

  const handleNotificationChange = (type: string, enabled: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: enabled }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Alertas</h1>
          <p className="text-gray-600">
            Configure como e quando você quer receber alertas sobre enchentes na sua região.
          </p>
        </div>

        {/* Status atual */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Sua região está segura</h3>
                <p className="text-sm text-green-700">Nenhum alerta ativo para sua localização atual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Localização */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Alertas por Localização</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Ativar alertas de localização</h4>
                  <p className="text-sm text-gray-600">
                    Receba alertas quando houver riscos de enchente na sua região
                  </p>
                </div>
                <Switch
                  checked={locationAlerts}
                  onCheckedChange={setLocationAlerts}
                />
              </div>
              
              {locationAlerts && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Configuração de Raio</h5>
                  <p className="text-sm text-blue-700 mb-3">
                    Você será notificado sobre alertas em um raio de <strong>5km</strong> da sua localização atual.
                  </p>
                  <Button variant="outline" size="sm">
                    Ajustar Raio
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Notificação */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Como você quer ser notificado</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* App Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Notificações do App</h4>
                    <p className="text-sm text-gray-600">Receba alertas diretamente no aplicativo</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.app}
                  onCheckedChange={(checked) => handleNotificationChange('app', checked)}
                />
              </div>

              {/* Email */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-sm text-gray-600">Receba resumos e alertas importantes por email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>

              {/* WhatsApp */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                    <p className="text-sm text-gray-600">Integração futura com bot do WhatsApp</p>
                    <span className="text-xs text-orange-600 font-medium">Em breve</span>
                  </div>
                </div>
                <Switch
                  checked={notifications.whatsapp}
                  onCheckedChange={(checked) => handleNotificationChange('whatsapp', checked)}
                  disabled
                />
              </div>

              {/* SMS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">SMS</h4>
                    <p className="text-sm text-gray-600">Alertas via mensagem de texto</p>
                    <span className="text-xs text-orange-600 font-medium">Em breve</span>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Alerta */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tipos de Alerta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Alerta Amarelo</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Possibilidade de alagamentos pontuais
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Alerta Laranja</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Risco de alagamentos significativos
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Alerta Vermelho</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Risco extremo - evacuação recomendada
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>Como funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Monitoramento Contínuo</h4>
                  <p className="text-sm text-gray-600">
                    Nosso sistema monitora relatos da comunidade e dados meteorológicos 24/7
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Análise Inteligente</h4>
                  <p className="text-sm text-gray-600">
                    Cruzamos informações de múltiplas fontes para validar alertas
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Notificação Rápida</h4>
                  <p className="text-sm text-gray-600">
                    Você recebe alertas instantâneos pelos canais que escolheu
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alertas;
