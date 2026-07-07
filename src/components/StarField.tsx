import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface SparkleProps {
  x: number;
  y: number;
  size: number;
}

const Sparkle: React.FC<SparkleProps> = ({ x, y, size }) => (
  <svg
    style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: size, height: size }}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
      fill="white"
      fillOpacity="0.5"
    />
  </svg>
);

export const StarField: React.FC<{ dense?: boolean }> = ({ dense = false }) => {
  const stars = useMemo<Star[]>(() => {
    const count = dense ? 80 : 45;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      duration: Math.random() * 5 + 2,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.5 + 0.15,
    }));
  }, [dense]);

  const sparkles = useMemo(() => {
    const positions = [
      { x: 8, y: 12, size: 10 },
      { x: 92, y: 8, size: 8 },
      { x: 15, y: 78, size: 12 },
      { x: 85, y: 65, size: 9 },
      { x: 50, y: 5, size: 7 },
      { x: 75, y: 88, size: 11 },
      { x: 30, y: 95, size: 8 },
    ];
    return positions;
  }, []);

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
          }}
        />
      ))}
      {sparkles.map((sp, i) => (
        <Sparkle key={i} {...sp} />
      ))}
    </div>
  );
};

export const ConstellationSVG: React.FC<{ side?: 'left' | 'right' }> = ({ side = 'left' }) => {
  const isLeft = side === 'left';
  return (
    <svg
      className="constellation-svg"
      viewBox="0 0 300 600"
      preserveAspectRatio="xMidYMid meet"
      style={{ transform: isLeft ? 'none' : 'scaleX(-1)' }}
    >
      {/* Constellation lines */}
      <g stroke="rgba(201,169,110,0.6)" strokeWidth="0.5" fill="none">
        <line x1="50" y1="80" x2="120" y2="40" />
        <line x1="120" y1="40" x2="200" y2="90" />
        <line x1="200" y1="90" x2="170" y2="160" />
        <line x1="170" y1="160" x2="100" y2="200" />
        <line x1="100" y1="200" x2="50" y2="80" />

        <line x1="60" y1="350" x2="140" y2="310" />
        <line x1="140" y1="310" x2="180" y2="380" />
        <line x1="180" y1="380" x2="110" y2="440" />
        <line x1="110" y1="440" x2="60" y2="350" />

        <line x1="30" y1="500" x2="90" y2="470" />
        <line x1="90" y1="470" x2="130" y2="530" />
        <line x1="130" y1="530" x2="70" y2="560" />
        <line x1="70" y1="560" x2="30" y2="500" />
      </g>
      {/* Stars at vertices */}
      <g fill="rgba(201,169,110,0.9)">
        {[
          [50, 80], [120, 40], [200, 90], [170, 160], [100, 200],
          [60, 350], [140, 310], [180, 380], [110, 440],
          [30, 500], [90, 470], [130, 530], [70, 560],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" />
        ))}
      </g>
    </svg>
  );
};
