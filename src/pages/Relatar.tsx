
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useFloodReports } from '@/hooks/useFloodReports';
import { useToast } from '@/hooks/use-toast';

const Relatar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createReport } = useFloodReports();
  
  const [formData, setFormData] = useState({
    location: '',
    severity: '',
    description: '',
    image: null as File | null,
    title: '',
    neighborhood: '',
    waterLevel: '',
    affectedPeople: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ 
            ...prev, 
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
          }));
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          toast({
            title: "Erro de Localização",
            description: "Não foi possível obter sua localização. Por favor, insira manualmente.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const [lat, lng] = formData.location.split(',').map(coord => parseFloat(coord.trim()));
      
      await createReport({
        title: formData.title || 'Relato de Enchente',
        message: formData.description,
        severity: formData.severity as 'low' | 'moderate' | 'high' | 'critical',
        latitude: lat,
        longitude: lng,
        neighborhood: formData.neighborhood,
        water_level: formData.waterLevel ? parseInt(formData.waterLevel) : undefined,
        affected_people: formData.affectedPeople ? parseInt(formData.affectedPeople) : 0
      });

      setIsSuccess(true);
      
      toast({
        title: "Relato Enviado!",
        description: "Seu relato foi registrado com sucesso e está aguardando aprovação.",
      });

      // Reset after showing success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          location: '',
          severity: '',
          description: '',
          image: null,
          title: '',
          neighborhood: '',
          waterLevel: '',
          affectedPeople: ''
        });
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar relato:', error);
      toast({
        title: "Erro ao Enviar",
        description: "Ocorreu um erro ao enviar seu relato. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Relato Enviado!</h2>
              <p className="text-gray-600">
                Obrigado por contribuir com a comunidade. Seu relato foi registrado com sucesso.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatar Enchente</h1>
          <p className="text-gray-600">
            Ajude sua comunidade relatando situações de alagamento em sua região.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Informações do Relato</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título do Relato</Label>
                <Input
                  id="title"
                  placeholder="Ex: Alagamento na Rua Principal"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              {/* Bairro */}
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  placeholder="Digite o nome do bairro"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  required
                />
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    placeholder="Digite o endereço ou coordenadas"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="shrink-0"
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Clique no ícone de localização para usar sua posição atual
                </p>
              </div>

              {/* Grau de Alagamento */}
              <div className="space-y-2">
                <Label htmlFor="severity">Grau de Alagamento</Label>
                <Select onValueChange={(value) => handleInputChange('severity', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a gravidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span>Leve - Poças d'água, trânsito lento</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="moderate">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span>Moderado - Ruas alagadas, carros presos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span>Alto - Enchente, risco às pessoas</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-800 rounded-full" />
                        <span>Crítico - Situação de emergência</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nível da Água */}
              <div className="space-y-2">
                <Label htmlFor="waterLevel">Nível da Água (cm)</Label>
                <Input
                  id="waterLevel"
                  type="number"
                  placeholder="Ex: 30"
                  value={formData.waterLevel}
                  onChange={(e) => handleInputChange('waterLevel', e.target.value)}
                />
              </div>

              {/* Pessoas Afetadas */}
              <div className="space-y-2">
                <Label htmlFor="affectedPeople">Pessoas Afetadas</Label>
                <Input
                  id="affectedPeople"
                  type="number"
                  placeholder="Ex: 5"
                  value={formData.affectedPeople}
                  onChange={(e) => handleInputChange('affectedPeople', e.target.value)}
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva a situação... (ex: Rua alagada na altura da calçada, trânsito parado)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <Label htmlFor="image">Foto (opcional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Camera className="w-5 h-5 text-gray-400" />
                </div>
                {formData.image && (
                  <p className="text-sm text-green-600">
                    Arquivo selecionado: {formData.image.name}
                  </p>
                )}
              </div>

              {/* Botão de Envio */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Relato'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Importante</h3>
                <p className="text-sm text-blue-800">
                  Em casos de emergência, ligue 193 (Bombeiros) ou 199 (Defesa Civil). 
                  Este sistema é para relatórios informativos da comunidade.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relatar;
