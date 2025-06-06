import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Droplets, Thermometer, Wind, Eye } from 'lucide-react';
import useWeatherData from '@/hooks/useWeatherData';

interface WeatherChartProps {
  latitude?: number;
  longitude?: number;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ 
  latitude = -23.5505, 
  longitude = -46.6333 
}) => {
  const { forecast, currentWeather, loading, error } = useWeatherData(latitude, longitude);

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      '01d': <Sun className="w-5 h-5 text-yellow-500" />,
      '01n': <Sun className="w-5 h-5 text-yellow-300" />,
      '02d': <Cloud className="w-5 h-5 text-gray-400" />,
      '02n': <Cloud className="w-5 h-5 text-gray-500" />,
      '03d': <Cloud className="w-5 h-5 text-gray-500" />,
      '03n': <Cloud className="w-5 h-5 text-gray-600" />,
      '04d': <Cloud className="w-5 h-5 text-gray-600" />,
      '04n': <Cloud className="w-5 h-5 text-gray-700" />,
      '09d': <CloudRain className="w-5 h-5 text-blue-500" />,
      '09n': <CloudRain className="w-5 h-5 text-blue-600" />,
      '10d': <CloudRain className="w-5 h-5 text-blue-400" />,
      '10n': <CloudRain className="w-5 h-5 text-blue-500" />,
      '11d': <CloudRain className="w-5 h-5 text-purple-500" />,
      '11n': <CloudRain className="w-5 h-5 text-purple-600" />,
      '13d': <Cloud className="w-5 h-5 text-blue-200" />,
      '13n': <Cloud className="w-5 h-5 text-blue-300" />,
      '50d': <Cloud className="w-5 h-5 text-gray-400" />,
      '50n': <Cloud className="w-5 h-5 text-gray-500" />,
    };
    return iconMap[iconCode] || <Cloud className="w-5 h-5 text-gray-400" />;
  };

  const getRiskLevel = (precipitation: number) => {
    if (precipitation >= 40) return { level: 'Alto', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (precipitation >= 20) return { level: 'Médio', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Baixo', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Clima Atual */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            Clima Atual
          </CardTitle>
          <p className="text-sm text-gray-600">
            {currentWeather?.cityName || 'São Paulo'}
          </p>
        </CardHeader>
        <CardContent>
          {currentWeather && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{currentWeather.temperature}°C</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {currentWeather.description}
                  </p>
                </div>
                <div className="text-4xl">
                  {getWeatherIcon(currentWeather.icon)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Umidade</p>
                    <p className="text-sm font-medium">{currentWeather.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Vento</p>
                    <p className="text-sm font-medium">{currentWeather.windSpeed} km/h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">Pressão</p>
                    <p className="text-sm font-medium">{currentWeather.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">Dados simulados</p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previsão de Precipitação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            Previsão de Chuva
          </CardTitle>
          <p className="text-sm text-gray-600">Próximos 7 dias</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-4">Precipitação (mm)</p>
            <div className="flex items-end justify-between h-32 gap-1">
              {forecast.map((data, index) => {
                const maxPrecipitation = Math.max(...forecast.map(d => d.precipitation));
                const height = maxPrecipitation > 0 
                  ? Math.max((data.precipitation / maxPrecipitation) * 100, 5)
                  : 20;
                const risk = getRiskLevel(data.precipitation);
                
                return (
                  <div key={index} className="flex flex-col items-center gap-1 flex-1">
                    <div className="relative group">
                      <div 
                        className={`${
                          data.precipitation >= 40 ? 'bg-red-500' :
                          data.precipitation >= 20 ? 'bg-yellow-500' :
                          data.precipitation >= 10 ? 'bg-blue-400' :
                          'bg-green-400'
                        } rounded-t transition-all duration-200 group-hover:opacity-80 w-full min-h-[20px]`}
                        style={{ height: `${height}%` }}
                      ></div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          <p>{data.precipitation}mm</p>
                          <p>{data.temperature}°C</p>
                          <p className="capitalize">{data.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <span className="text-xs text-gray-600 font-medium">
                      {data.day}
                    </span>
                    
                    {/* Ícone do clima */}
                    <div className="mt-1">
                      {getWeatherIcon(data.icon)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legenda de risco */}
            <div className="flex items-center justify-center gap-4 pt-3 border-t text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span>Baixo (0-10mm)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span>Moderado (10-20mm)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Alto (20-40mm)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Crítico (+40mm)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Risco */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-red-500" />
            Alertas de Enchente
          </CardTitle>
          <p className="text-sm text-gray-600">Baseado na previsão</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.slice(0, 4).map((data, index) => {
              const risk = getRiskLevel(data.precipitation);
              return (
                <div key={index} className={`p-3 rounded-lg ${risk.bgColor} border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(data.icon)}
                      <div>
                        <p className="font-medium text-sm">{data.day}</p>
                        <p className="text-xs text-gray-600 capitalize">
                          {data.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${risk.color} bg-white`}>
                        {risk.level}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        {data.precipitation}mm
                      </p>
                    </div>
                  </div>
                  
                  {data.precipitation >= 30 && (
                    <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                      <p className="font-medium text-red-700">
                        ⚠️ Risco elevado de alagamento
                      </p>
                      <p className="text-red-600">
                        Evite áreas baixas e próximas a rios
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Dados atualizados a cada hora
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherChart; 