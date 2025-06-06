import React from 'react';

interface WaterFloodMarkerProps {
  severity: 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const WaterFloodMarker: React.FC<WaterFloodMarkerProps> = ({ severity, size = 'medium' }) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { width: 30, height: 15, scale: 0.7 };
      case 'large':
        return { width: 60, height: 30, scale: 1.3 };
      default:
        return { width: 45, height: 20, scale: 1 };
    }
  };

  const getWaterIntensity = () => {
    return severity === 'danger' ? 3 : 1; // Número de camadas de água
  };

  const { width, height, scale } = getSizeConfig();
  const waterLayers = getWaterIntensity();

  const waterFlowKeyframes = `
    @keyframes waterFlow {
      0% { transform: translateX(-2px) scaleY(1); }
      50% { transform: translateX(1px) scaleY(1.1); }
      100% { transform: translateX(-1px) scaleY(0.95); }
    }
    @keyframes waterShimmer {
      0% { opacity: 0.2; transform: scaleX(0.8); }
      50% { opacity: 0.6; transform: scaleX(1.2); }
      100% { opacity: 0.2; transform: scaleX(0.8); }
    }
  `;

  return (
    <>
      <style>{waterFlowKeyframes}</style>
      <div 
        className="water-flood-marker"
        style={{
          transform: `scale(${scale}) translate(-50%, -100%)`,
          position: 'relative',
          pointerEvents: 'auto',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `scale(${scale * 1.1}) translate(-50%, -100%)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `scale(${scale}) translate(-50%, -100%)`;
        }}
      >
        {/* Múltiplas camadas de água para enchentes severas */}
        {Array.from({ length: waterLayers }).map((_, index) => (
          <svg
            key={index}
            width={width}
            height={height + (index * 5)}
            viewBox={`0 0 ${width} ${height + (index * 5)}`}
            style={{
              position: 'absolute',
              bottom: index * 3,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: waterLayers - index
            }}
          >
            <defs>
              <linearGradient id={`waterGradient-${index}-${severity}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop 
                  offset="0%" 
                  style={{
                    stopColor: severity === 'danger' ? '#1e40af' : '#3b82f6',
                    stopOpacity: 0.8 - (index * 0.1)
                  }} 
                />
                <stop 
                  offset="100%" 
                  style={{
                    stopColor: severity === 'danger' ? '#1e3a8a' : '#2563eb',
                    stopOpacity: 0.9 - (index * 0.1)
                  }} 
                />
              </linearGradient>
              
              <filter id={`ripple-${index}-${severity}`}>
                <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Forma da água ondulada */}
            <path
              d={`M 0 ${height/2 + index * 2} 
                  Q ${width/4} ${height/3 + index * 2} ${width/2} ${height/2 + index * 2}
                  Q ${3*width/4} ${2*height/3 + index * 2} ${width} ${height/2 + index * 2}
                  L ${width} ${height + index * 5}
                  L 0 ${height + index * 5}
                  Z`}
              fill={`url(#waterGradient-${index}-${severity})`}
              filter={`url(#ripple-${index}-${severity})`}
              style={{
                animation: `waterFlow ${3 + index}s ease-in-out infinite alternate`
              }}
            />
            
            {/* Efeito de brilho na água */}
            <ellipse
              cx={width * 0.3}
              cy={height/2 + index * 2}
              rx={width * 0.1}
              ry="2"
              fill="rgba(255, 255, 255, 0.4)"
              style={{
                animation: `waterShimmer ${2 + index * 0.5}s ease-in-out infinite`
              }}
            />
            
            <ellipse
              cx={width * 0.7}
              cy={height/2 + index * 2 + 2}
              rx={width * 0.08}
              ry="1.5"
              fill="rgba(255, 255, 255, 0.3)"
              style={{
                animation: `waterShimmer ${2.5 + index * 0.5}s ease-in-out infinite reverse`
              }}
            />
          </svg>
        ))}
      </div>
    </>
  );
};

export default WaterFloodMarker; 