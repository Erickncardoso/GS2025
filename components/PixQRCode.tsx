import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, X, QrCode, Download, Share2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixQRCodeProps {
  amount: string;
  pixKey: string;
  onClose: () => void;
}

const PixQRCode: React.FC<PixQRCodeProps> = ({ amount, pixKey, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos
  const { toast } = useToast();

  useEffect(() => {
    // Animação de fade-in
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  useEffect(() => {
    // Timer de expiração do QR code
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Formatear tempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Gerar código PIX fictício baseado nos dados
  const generatePixCode = (key: string, value: string) => {
    const timestamp = Date.now().toString(36);
    const hash = btoa(`${key}-${value}-${timestamp}`).replace(/[^A-Z0-9]/g, '').substring(0, 32);
    return `00020126580014BR.GOV.BCB.PIX0136${key}52040000530398654${value.padStart(10, '0')}5925ALERTA COMUNITARIO LTDA6009SAO PAULO62070503***6304${hash}`;
  };

  // Criar padrão visual de QR code (simplificado)
  const generateQRPattern = (data: string) => {
    const size = 21; // QR code padrão 21x21
    const pattern = [];
    
    // Usar hash simples do código PIX para gerar pattern consistente
    const hash = data.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < size * size; i++) {
      pattern.push(random(hash + i) > 0.5);
    }

    return pattern;
  };

  const pixCode = generatePixCode(pixKey, amount);
  const qrPattern = generateQRPattern(pixCode);

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({
      title: "Código PIX copiado!",
      description: "O código PIX foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQRCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Doação Alerta Comunitário',
        text: `Faça uma doação de R$ ${amount} via PIX`,
        url: window.location.href
      });
    } else {
      toast({
        title: "Compartilhamento não suportado",
        description: "Use o código PIX copiado para compartilhar manualmente.",
      });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Aguardar animação
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <Card 
        className={`w-full max-w-md mx-auto transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="text-center relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              Doação PIX
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Escaneie o QR Code ou copie o código PIX
          </p>
          
          {/* Timer de expiração */}
          <div className="flex items-center justify-center gap-1 mt-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className={`text-sm font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-orange-600'}`}>
              Expira em: {formatTime(timeLeft)}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* QR Code Visual */}
          <div className="flex justify-center">
            <div className={`bg-white p-4 rounded-lg border-2 shadow-lg transition-all duration-300 ${
              timeLeft < 60 ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}>
              <div className={`relative ${timeLeft === 0 ? 'opacity-50' : ''}`}>
                <svg
                  width="200"
                  height="200"
                  className="border border-gray-300"
                  style={{ imageRendering: 'pixelated' }}
                >
                  {qrPattern.map((filled, index) => {
                    const row = Math.floor(index / 21);
                    const col = index % 21;
                    const cellSize = 200 / 21;
                    
                    return (
                      <rect
                        key={index}
                        x={col * cellSize}
                        y={row * cellSize}
                        width={cellSize}
                        height={cellSize}
                        fill={filled ? '#000000' : '#ffffff'}
                      />
                    );
                  })}
                  
                  {/* Cantos de posicionamento típicos de QR codes */}
                  {/* Canto superior esquerdo */}
                  <rect x="0" y="0" width="60" height="60" fill="#000000"/>
                  <rect x="10" y="10" width="40" height="40" fill="#ffffff"/>
                  <rect x="20" y="20" width="20" height="20" fill="#000000"/>
                  
                  {/* Canto superior direito */}
                  <rect x="140" y="0" width="60" height="60" fill="#000000"/>
                  <rect x="150" y="10" width="40" height="40" fill="#ffffff"/>
                  <rect x="160" y="20" width="20" height="20" fill="#000000"/>
                  
                  {/* Canto inferior esquerdo */}
                  <rect x="0" y="140" width="60" height="60" fill="#000000"/>
                  <rect x="10" y="150" width="40" height="40" fill="#ffffff"/>
                  <rect x="20" y="160" width="20" height="20" fill="#000000"/>
                </svg>
                
                {timeLeft === 0 && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded">
                    <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">
                      Expirado
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações da doação */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg space-y-2 border border-blue-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Valor:</span>
              <span className="text-xl font-bold text-blue-600">R$ {parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Destinatário:</span>
              <span className="text-sm text-gray-600 font-medium">Alerta Comunitário</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Chave PIX:</span>
              <span className="text-sm text-gray-600 truncate max-w-[150px]">{pixKey}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">ID Transação:</span>
              <span className="text-xs text-gray-500 font-mono">
                {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Código PIX para cópia manual */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Código PIX (Copia e Cola):
            </label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg border text-xs font-mono break-all max-h-20 overflow-y-auto">
                {pixCode}
              </div>
              <Button
                onClick={copyPixCode}
                variant="outline"
                size="sm"
                className="shrink-0"
                disabled={timeLeft === 0}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              📱 Como usar:
            </p>
            <ol className="text-xs text-yellow-700 space-y-1">
              <li>1. Abra o app do seu banco</li>
              <li>2. Escaneie o QR Code ou cole o código PIX</li>
              <li>3. Confirme o valor e dados</li>
              <li>4. Finalize a doação</li>
            </ol>
          </div>

          {/* Alerta de expiração */}
          {timeLeft < 60 && timeLeft > 0 && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 font-medium">
                ⏰ QR Code expirando em breve!
              </p>
              <p className="text-xs text-red-600 mt-1">
                Complete sua doação nos próximos {formatTime(timeLeft)}
              </p>
            </div>
          )}

          {/* Aviso sobre dados fictícios */}
          <div className="bg-gray-100 p-3 rounded-lg border-l-4 border-gray-400">
            <p className="text-xs text-gray-600">
              ⚠️ <strong>Demonstração:</strong> Este é um QR Code fictício para fins de demonstração. 
              Em uma aplicação real, seria gerado um código PIX válido conectado a uma conta real.
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button 
              onClick={copyPixCode}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={timeLeft === 0}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copiar Código
            </Button>
            <Button 
              variant="outline" 
              onClick={shareQRCode}
              className="px-3"
              disabled={timeLeft === 0}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={handleClose} className="px-3">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PixQRCode; 