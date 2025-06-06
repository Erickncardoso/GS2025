import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, Shirt, UtensilsCrossed, Copy, Check, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PixQRCode from '@/components/PixQRCode';

const Doacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [pixAmount, setPixAmount] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();

  const pixKey = "pix@alertacomunitario.com.br";

  const donationPlaces = [
    {
      id: 1,
      name: "Centro de Doações São Vicente",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 1234-5678",
      types: ["roupas", "alimentos"],
      hours: "Seg-Sex: 8h-17h",
      urgency: "alta",
      description: "Necessita urgentemente de roupas de inverno e alimentos não perecíveis",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Abrigo Esperança",
      address: "Av. Principal, 456 - Bairro Alto",
      phone: "(11) 2345-6789",
      types: ["roupas"],
      hours: "Todos os dias: 9h-18h",
      urgency: "media",
      description: "Aceita doações de roupas em bom estado para famílias carentes",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Banco de Alimentos Solidário",
      address: "Rua da Solidariedade, 789 - Vila Nova",
      phone: "(11) 3456-7890",
      types: ["alimentos"],
      hours: "Seg-Sab: 7h-16h",
      urgency: "alta",
      description: "Distribuição de alimentos para comunidades em situação de vulnerabilidade",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Casa do Idoso",
      address: "Rua do Cuidado, 321 - Jardim Paz",
      phone: "(11) 4567-8901",
      types: ["roupas", "alimentos"],
      hours: "Seg-Dom: 8h-20h",
      urgency: "media",
      description: "Cuidados e assistência para idosos em situação de vulnerabilidade",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop"
    }
  ];

  const filteredPlaces = donationPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || place.types.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    toast({
      title: "Chave PIX copiada!",
      description: "A chave PIX foi copiada para a área de transferência.",
    });
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handlePixDonation = () => {
    if (!pixAmount || parseFloat(pixAmount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para doação.",
        variant: "destructive"
      });
      return;
    }
    
    // Mostrar o QR Code PIX
    setShowQRCode(true);
    
    toast({
      title: "QR Code PIX gerado!",
      description: `QR Code criado para doação de R$ ${pixAmount}`,
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'roupas': return <Shirt className="w-4 h-4" />;
      case 'alimentos': return <UtensilsCrossed className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Doações Solidárias</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ajude comunidades em situação de vulnerabilidade através de doações de roupas, 
            alimentos ou contribuições financeiras via PIX.
          </p>
        </div>

        {/* PIX Donation Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Heart className="w-6 h-6 mr-2" />
              Doação via PIX
            </CardTitle>
            <CardDescription>
              Contribua financeiramente para ajudar comunidades afetadas por emergências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pix-amount" className="text-sm font-medium text-gray-700">
                  Valor da doação (R$)
                </Label>
                <Input
                  id="pix-amount"
                  type="number"
                  placeholder="0,00"
                  value={pixAmount}
                  onChange={(e) => setPixAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Chave PIX</Label>
                <div className="flex mt-1">
                  <Input
                    value={pixKey}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Button
                    onClick={copyPixKey}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <Button 
              onClick={handlePixDonation}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Iniciar Doação via PIX
            </Button>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos
              </Button>
              <Button
                variant={filterType === 'roupas' ? 'default' : 'outline'}
                onClick={() => setFilterType('roupas')}
                size="sm"
              >
                <Shirt className="w-4 h-4 mr-2" />
                Roupas
              </Button>
              <Button
                variant={filterType === 'alimentos' ? 'default' : 'outline'}
                onClick={() => setFilterType('alimentos')}
                size="sm"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Alimentos
              </Button>
            </div>
          </div>
        </div>

        {/* Donation Places Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <Badge 
                  className={`absolute top-3 right-3 ${getUrgencyColor(place.urgency)}`}
                >
                  {place.urgency === 'alta' ? 'Urgente' : 
                   place.urgency === 'media' ? 'Moderado' : 'Normal'}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{place.name}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {place.address}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{place.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Aceita doações de:</p>
                    <div className="flex gap-2">
                      {place.types.map((type) => (
                        <Badge key={type} variant="outline" className="flex items-center gap-1">
                          {getTypeIcon(type)}
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Horário:</strong> {place.hours}</p>
                    <p><strong>Telefone:</strong> {place.phone}</p>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Quero Doar Aqui
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum local encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termo de busca para encontrar locais de doação.
            </p>
          </div>
        )}

        {/* Emergency Contact */}
        <Card className="mt-12 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Emergência ou Situação Crítica?</CardTitle>
            <CardDescription className="text-red-600">
              Se você conhece alguma comunidade em situação crítica que precisa de ajuda urgente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="mr-4">
              Relatar Emergência
            </Button>
            <Button variant="outline" className="border-red-300 text-red-700">
              WhatsApp: (11) 99999-9999
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modal do QR Code PIX */}
      {showQRCode && (
        <PixQRCode
          amount={pixAmount}
          pixKey={pixKey}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  );
};

export default Doacoes;
