import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, MapPin, AlertTriangle, 
  Calendar, Download, Filter, RefreshCw, Droplets, Clock,
  Shield, Activity, Zap, Eye
} from 'lucide-react';

interface AnalyticsData {
  alerts: {
    total: number;
    byType: { type: string; count: number; color: string }[];
    byTime: { time: string; count: number; critical: number }[];
    byLocation: { region: string; count: number; severity: number }[];
  };
  users: {
    total: number;
    active: number;
    growth: number;
    byHour: { hour: string; count: number }[];
    engagement: { metric: string; value: number; change: number }[];
  };
  weather: {
    riskLevel: number;
    predictions: { date: string; risk: number; precipitation: number }[];
    accuracy: number;
  };
  system: {
    responseTime: number;
    uptime: number;
    notifications: number;
    syncSuccess: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | '3m'>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - em produção viria de APIs
  const analyticsData: AnalyticsData = useMemo(() => ({
    alerts: {
      total: 1247,
      byType: [
        { type: 'Crítico', count: 89, color: '#ef4444' },
        { type: 'Moderado', count: 234, color: '#f59e0b' },
        { type: 'Informativo', count: 567, color: '#3b82f6' },
        { type: 'Resolvido', count: 357, color: '#10b981' }
      ],
      byTime: [
        { time: 'Seg', count: 45, critical: 8 },
        { time: 'Ter', count: 67, critical: 12 },
        { time: 'Qua', count: 89, critical: 15 },
        { time: 'Qui', count: 78, critical: 9 },
        { time: 'Sex', count: 56, critical: 7 },
        { time: 'Sáb', count: 34, critical: 4 },
        { time: 'Dom', count: 23, critical: 2 }
      ],
      byLocation: [
        { region: 'Centro', count: 234, severity: 7.8 },
        { region: 'Norte', count: 189, severity: 6.2 },
        { region: 'Sul', count: 156, severity: 5.9 },
        { region: 'Leste', count: 298, severity: 8.5 },
        { region: 'Oeste', count: 167, severity: 6.7 }
      ]
    },
    users: {
      total: 15847,
      active: 3241,
      growth: 23.5,
      byHour: [
        { hour: '00', count: 45 }, { hour: '01', count: 32 }, { hour: '02', count: 28 },
        { hour: '03', count: 25 }, { hour: '04', count: 31 }, { hour: '05', count: 47 },
        { hour: '06', count: 89 }, { hour: '07', count: 156 }, { hour: '08', count: 234 },
        { hour: '09', count: 198 }, { hour: '10', count: 167 }, { hour: '11', count: 145 },
        { hour: '12', count: 189 }, { hour: '13', count: 201 }, { hour: '14', count: 178 },
        { hour: '15', count: 156 }, { hour: '16', count: 134 }, { hour: '17', count: 167 },
        { hour: '18', count: 189 }, { hour: '19', count: 156 }, { hour: '20', count: 123 },
        { hour: '21', count: 98 }, { hour: '22', count: 76 }, { hour: '23', count: 54 }
      ],
      engagement: [
        { metric: 'Tempo médio', value: 8.5, change: 12.3 },
        { metric: 'Reportes/usuário', value: 2.8, change: -5.2 },
        { metric: 'Taxa de retorno', value: 76.4, change: 8.1 }
      ]
    },
    weather: {
      riskLevel: 7.2,
      predictions: [
        { date: 'Hoje', risk: 7.2, precipitation: 45 },
        { date: 'Amanhã', risk: 8.1, precipitation: 62 },
        { date: 'Qua', risk: 6.8, precipitation: 38 },
        { date: 'Qui', risk: 5.4, precipitation: 22 },
        { date: 'Sex', risk: 4.9, precipitation: 18 },
        { date: 'Sáb', risk: 6.2, precipitation: 35 },
        { date: 'Dom', risk: 7.5, precipitation: 51 }
      ],
      accuracy: 87.3
    },
    system: {
      responseTime: 234,
      uptime: 99.7,
      notifications: 2847,
      syncSuccess: 94.2
    }
  }), []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simula carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleExportData = () => {
    // Implementaria exportação de dados
    console.log('Exportando dados...', { period: selectedPeriod, data: analyticsData });
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color?: string;
  }> = ({ title, value, change, icon, color = 'blue' }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(change)}% vs período anterior
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Análise</h1>
          <p className="text-gray-600">Métricas e insights do sistema de alertas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border bg-white">
            {(['24h', '7d', '30d', '3m'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="rounded-none first:rounded-l-lg last:rounded-r-lg"
              >
                {period}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Alertas"
          value={analyticsData.alerts.total.toLocaleString()}
          change={15.3}
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          color="red"
        />
        
        <MetricCard
          title="Usuários Ativos"
          value={analyticsData.users.active.toLocaleString()}
          change={analyticsData.users.growth}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        
        <MetricCard
          title="Nível de Risco"
          value={`${analyticsData.weather.riskLevel}/10`}
          change={-8.2}
          icon={<Droplets className="w-5 h-5 text-yellow-600" />}
          color="yellow"
        />
        
        <MetricCard
          title="Tempo de Resposta"
          value={`${analyticsData.system.responseTime}ms`}
          change={-12.5}
          icon={<Zap className="w-5 h-5 text-green-600" />}
          color="green"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas por Tempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Alertas por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.alerts.byTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="count" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Total" />
                <Area type="monotone" dataKey="critical" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} name="Críticos" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Distribuição de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.alerts.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.alerts.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade de Usuários */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividade por Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData.users.byHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métricas do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="font-semibold text-green-600">{analyticsData.system.uptime}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Notificações</span>
              <span className="font-semibold">{analyticsData.system.notifications.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sync Success</span>
              <span className="font-semibold text-blue-600">{analyticsData.system.syncSuccess}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Precisão Previsão</span>
              <span className="font-semibold text-purple-600">{analyticsData.weather.accuracy}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previsão de Risco */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Previsão de Risco - Próximos 7 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.weather.predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" domain={[0, 10]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="risk"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Nível de Risco (0-10)"
              />
              <Bar
                yAxisId="right"
                dataKey="precipitation"
                fill="#3b82f6"
                fillOpacity={0.4}
                name="Precipitação (mm)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alertas por Região */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Distribuição Regional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.alerts.byLocation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Quantidade de Alertas" />
              <Line yAxisId="right" type="monotone" dataKey="severity" stroke="#ef4444" strokeWidth={3} name="Severidade Média" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">📈 Pico de Atividade</h4>
              <p className="text-sm text-blue-700">
                Maior atividade entre 8h-18h. Considere reforçar monitoramento durante horário comercial.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Região de Atenção</h4>
              <p className="text-sm text-yellow-700">
                Zona Leste apresenta maior severidade média. Recomenda-se monitoramento especial.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">✅ Performance</h4>
              <p className="text-sm text-green-700">
                Sistema opera com 99.7% de uptime. Manter rotinas de manutenção preventiva.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard; 