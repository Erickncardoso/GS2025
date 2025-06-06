import { useState, useEffect } from 'react';

interface WeatherData {
  day: string;
  precipitation: number;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
}

interface CurrentWeather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  icon: string;
  cityName: string;
}

interface WeatherHookReturn {
  forecast: WeatherData[];
  currentWeather: CurrentWeather | null;
  loading: boolean;
  error: string | null;
}

const useWeatherData = (lat: number = -23.5505, lon: number = -46.6333): WeatherHookReturn => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chave da API OpenWeatherMap (gratuita)
  // Para obter uma chave gratuita:
  // 1. Acesse: https://openweathermap.org/api
  // 2. Crie uma conta gratuita
  // 3. Copie sua API key
  // 4. Crie um arquivo .env na raiz do projeto com: VITE_OPENWEATHER_API_KEY=sua_chave
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Se não há chave da API válida, usar dados mockados
        if (API_KEY === 'demo_key' || !API_KEY) {
          throw new Error('Chave da API não configurada. Configure VITE_OPENWEATHER_API_KEY no arquivo .env');
        }

        // Buscar clima atual
        const currentResponse = await fetch(
          `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
        );

        if (!currentResponse.ok) {
          throw new Error(`Erro ${currentResponse.status}: Verifique sua chave da API`);
        }

        const currentData = await currentResponse.json();

        setCurrentWeather({
          temperature: Math.round(currentData.main.temp),
          description: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Converter m/s para km/h
          pressure: currentData.main.pressure,
          icon: currentData.weather[0].icon,
          cityName: currentData.name
        });

        // Buscar previsão de 5 dias
        const forecastResponse = await fetch(
          `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
        );

        if (!forecastResponse.ok) {
          throw new Error(`Erro ${forecastResponse.status}: Falha ao buscar previsão`);
        }

        const forecastData = await forecastResponse.json();

        // Processar dados da previsão (agrupar por dia)
        const dailyData: { [key: string]: any[] } = {};
        
        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toLocaleDateString('pt-BR', { weekday: 'short' });
          
          if (!dailyData[dayKey]) {
            dailyData[dayKey] = [];
          }
          dailyData[dayKey].push(item);
        });

        // Calcular médias diárias
        const processedForecast: WeatherData[] = Object.entries(dailyData)
          .slice(0, 7) // Próximos 7 dias
          .map(([day, dayData]) => {
            const avgTemp = dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length;
            const totalRain = dayData.reduce((sum, item) => {
              return sum + (item.rain?.['3h'] || 0);
            }, 0);
            
            return {
              day: day.charAt(0).toUpperCase() + day.slice(1, 3),
              precipitation: Math.round(totalRain),
              temperature: Math.round(avgTemp),
              humidity: Math.round(dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length),
              description: dayData[0].weather[0].description,
              icon: dayData[0].weather[0].icon
            };
          });

        setForecast(processedForecast);

      } catch (err) {
        console.error('Erro ao buscar dados do clima:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        
        // Fallback para dados mockados em caso de erro
        setForecast([
          { day: 'Seg', precipitation: 15, temperature: 22, humidity: 65, description: 'Parcialmente nublado', icon: '02d' },
          { day: 'Ter', precipitation: 32, temperature: 19, humidity: 78, description: 'Chuva moderada', icon: '10d' },
          { day: 'Qua', precipitation: 48, temperature: 17, humidity: 85, description: 'Chuva forte', icon: '09d' },
          { day: 'Qui', precipitation: 35, temperature: 20, humidity: 72, description: 'Chuva leve', icon: '10d' },
          { day: 'Sex', precipitation: 22, temperature: 24, humidity: 58, description: 'Parcialmente nublado', icon: '02d' },
          { day: 'Sáb', precipitation: 8, temperature: 26, humidity: 52, description: 'Ensolarado', icon: '01d' },
          { day: 'Dom', precipitation: 12, temperature: 25, humidity: 55, description: 'Poucas nuvens', icon: '02d' },
        ]);

        setCurrentWeather({
          temperature: 23,
          description: 'Parcialmente nublado',
          humidity: 65,
          windSpeed: 12,
          pressure: 1013,
          icon: '02d',
          cityName: 'São Paulo'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [lat, lon, API_KEY]);

  return { forecast, currentWeather, loading, error };
};

export default useWeatherData; 