import React from 'react';

interface FloodZoneOverlayProps {
  coordinates: [number, number][];
  severity: 'warning' | 'danger';
  opacity?: number;
}

const FloodZoneOverlay: React.FC<FloodZoneOverlayProps> = ({ 
  coordinates, 
  severity, 
  opacity = 0.6 
}) => {
  const getWaterColor = () => {
    return severity === 'danger' ? '#1e40af' : '#3b82f6';
  };

  const getWaterDarkColor = () => {
    return severity === 'danger' ? '#1e3a8a' : '#2563eb';
  };

  // Converter coordenadas geográficas para pontos SVG (simplificado para demonstração)
  const convertToSVGPoints = (coords: [number, number][]) => {
    return coords.map(([lng, lat], index) => 
      `${index * 100},${index * 50}`
    ).join(' ');
  };

  return (
    <div className="flood-zone-overlay">
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <defs>
          {/* Gradiente principal da água */}
          <linearGradient id={`floodGradient-${severity}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: getWaterColor(), stopOpacity: opacity }} />
            <stop offset="50%" style={{ stopColor: getWaterDarkColor(), stopOpacity: opacity * 0.8 }} />
            <stop offset="100%" style={{ stopColor: getWaterColor(), stopOpacity: opacity * 0.6 }} />
          </linearGradient>

          {/* Padrão de ondas */}
          <pattern 
            id={`waterWaves-${severity}`} 
            x="0" 
            y="0" 
            width="40" 
            height="20" 
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 10 Q 10 5 20 10 Q 30 15 40 10"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              fill="none"
              className="wave-pattern"
            />
            <path
              d="M 0 15 Q 10 10 20 15 Q 30 20 40 15"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              fill="none"
              className="wave-pattern-secondary"
            />
          </pattern>

          {/* Filtro para efeito de água */}
          <filter id={`waterFilter-${severity}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
            <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.3  0 0 0 0 0.7  0 0 0 1 0"/>
          </filter>

          {/* Animação de deslocamento das ondas */}
          <animateTransform
            attributeName="patternTransform"
            attributeType="XML"
            type="translate"
            values="0 0; 40 0; 0 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </defs>

        {/* Área alagada principal */}
        <polygon
          points={convertToSVGPoints(coordinates)}
          fill={`url(#floodGradient-${severity})`}
          filter={`url(#waterFilter-${severity})`}
          className="flood-area"
        />

        {/* Overlay com padrão de ondas */}
        <polygon
          points={convertToSVGPoints(coordinates)}
          fill={`url(#waterWaves-${severity})`}
          opacity="0.8"
          className="wave-overlay"
        />

        {/* Efeitos de brilho simulando refluxo */}
        {severity === 'danger' && (
          <>
            <ellipse
              cx="25%"
              cy="25%"
              rx="30"
              ry="8"
              fill="rgba(255, 255, 255, 0.2)"
              className="water-highlight"
            />
            <ellipse
              cx="75%"
              cy="60%"
              rx="25"
              ry="6"
              fill="rgba(255, 255, 255, 0.15)"
              className="water-highlight-secondary"
            />
          </>
        )}
      </svg>

      <style jsx>{`
        .flood-area {
          animation: waterPulse 3s ease-in-out infinite;
        }

        .wave-overlay {
          animation: waveFlow 5s linear infinite;
        }

        .wave-pattern {
          animation: waveMove 3s linear infinite;
        }

        .wave-pattern-secondary {
          animation: waveMove 4s linear infinite reverse;
        }

        .water-highlight {
          animation: shimmer 2s ease-in-out infinite;
        }

        .water-highlight-secondary {
          animation: shimmer 2.5s ease-in-out infinite reverse;
        }

        @keyframes waterPulse {
          0%, 100% {
            opacity: ${opacity};
          }
          50% {
            opacity: ${opacity * 1.2};
          }
        }

        @keyframes waveFlow {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(40px);
          }
        }

        @keyframes waveMove {
          0% {
            transform: translateX(-40px);
          }
          100% {
            transform: translateX(40px);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default FloodZoneOverlay; 