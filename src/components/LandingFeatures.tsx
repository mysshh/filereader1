import React from 'react';
import { Camera, MapPin, FileText, Music } from 'lucide-react';
import { StarField } from './StarField';

interface FeatureCard {
  icon: React.ReactNode;
  category: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const FEATURES: FeatureCard[] = [
  {
    icon: <Camera className="w-5 h-5" />,
    category: 'Deep Analysis',
    title: 'EXIF Extraction',
    description: 'Camera make, model, lens, aperture, ISO, shutter speed, focal length, and timestamps.',
    image: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Camera', 'Exposure', 'Dates'],
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    category: 'Location',
    title: 'GPS Mapping',
    description: 'Interactive Leaflet map with dark tiles, exact coordinates, altitude, and one-click Maps links.',
    image: 'https://images.pexels.com/photos/2901581/pexels-photo-2901581.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Latitude', 'Longitude', 'Altitude'],
  },
  {
    icon: <FileText className="w-5 h-5" />,
    category: 'Documents',
    title: 'PDF Inspection',
    description: 'Author, creator, producer, page count, PDF version, encryption status, and permissions.',
    image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Security', 'Author', 'Permissions'],
  },
  {
    icon: <Music className="w-5 h-5" />,
    category: 'Media',
    title: 'Audio & Video',
    description: 'Duration, bitrate, sample rate, channel count, resolution, and codec information.',
    image: 'https://images.pexels.com/photos/164697/pexels-photo-164697.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Duration', 'Bitrate', 'Codec'],
  },
];

export const LandingFeatures: React.FC = () => {
  return (
    <section className="relative bg-white py-20 px-4">
      {/* Section header */}
      <div className="text-center mb-12">
        <p className="label-track text-ink-600 mb-3">What we reveal</p>
        <div className="ornament-divider max-w-xs mx-auto">
          <span className="heading-serif text-sm text-ink-800 tracking-widest uppercase px-4 whitespace-nowrap">
            REVEAL THE UNSEEN
          </span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feat, i) => (
          <div
            key={i}
            className="group flex flex-col items-center text-center"
            style={{ animation: `fadeUp 0.5s ease-out ${i * 0.1}s both` }}
          >
            {/* Image */}
            <div className="w-full aspect-square overflow-hidden mb-4 bg-ink-100">
              <img
                src={feat.image}
                alt={feat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'saturate(0.7)' }}
              />
            </div>

            {/* Info */}
            <p className="label-track text-ink-400 mb-1">{feat.category}</p>
            <h3 className="heading-serif text-ink-900 text-base mb-2">{feat.title}</h3>
            <p className="text-xs text-ink-500 leading-relaxed">{feat.description}</p>

            {/* Tags */}
            <div className="flex gap-1.5 mt-3 flex-wrap justify-center">
              {feat.tags.map(tag => (
                <span key={tag} className="text-[9px] tracking-widest uppercase px-2 py-0.5 bg-ink-100 text-ink-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Dark mid-band section (like the dark "NEW PRODUCTS" section in the reference)
export const LandingShowcaseBand: React.FC<{ onAnalyze: () => void }> = ({ onAnalyze }) => {
  return (
    <section className="relative bg-ink-900 py-20 px-4 overflow-hidden">
      <StarField />

      {/* Side constellation lines */}
      <svg className="absolute left-0 top-0 h-full w-32 opacity-10" viewBox="0 0 150 600" preserveAspectRatio="xMidYMid meet">
        <g stroke="#c9a96e" strokeWidth="0.5" fill="none">
          <line x1="20" y1="80" x2="80" y2="40" />
          <line x1="80" y1="40" x2="130" y2="100" />
          <line x1="130" y1="100" x2="90" y2="180" />
          <line x1="40" y1="300" x2="110" y2="260" />
          <line x1="110" y1="260" x2="140" y2="340" />
          <line x1="140" y1="340" x2="60" y2="400" />
        </g>
        <g fill="#c9a96e">
          {[[20,80],[80,40],[130,100],[90,180],[40,300],[110,260],[140,340],[60,400]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="2" />
          ))}
        </g>
      </svg>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Arch image */}
        <div className="flex-shrink-0 relative">
          {/* Arch frame */}
          <div
            className="arch-frame overflow-hidden shadow-arch"
            style={{ width: 280, height: 380 }}
          >
            <img
              src="https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="File analysis"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.7) saturate(0.6)' }}
            />
            {/* Inner arch overlay */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.5) 100%)',
            }} />
          </div>

          {/* Decorative border (arch shape) */}
          <div
            className="absolute -inset-3 border border-gold/20"
            style={{ borderRadius: '210px 210px 4px 4px', pointerEvents: 'none' }}
          />

          {/* Floating stats */}
          <div
            className="absolute -right-6 bottom-12 glass-dark px-4 py-3 text-center border-gold/20 shadow-gold"
            style={{ minWidth: 110 }}
          >
            <p className="text-2xl font-display font-light text-gold">50+</p>
            <p className="text-[9px] tracking-widest text-cream/40 mt-0.5">EXIF FIELDS</p>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center lg:text-left">
          <p className="label-track text-gold/60 mb-4">Complete Forensics Suite</p>
          <h2 className="heading-display text-4xl sm:text-5xl text-cream mb-3 leading-tight">
            ANALYZE ANY FILE
          </h2>
          <p className="label-track text-cream/40 mb-8">
            UNCOVER THE TRUTH WITHIN
          </p>

          <p className="text-sm text-cream/50 leading-relaxed max-w-md mb-10 font-sans">
            From hidden GPS coordinates in vacation photos to author metadata in corporate
            PDFs — every digital file carries secrets. EXIF PULSE reads them all, instantly,
            with zero data ever leaving your browser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button onClick={onAnalyze} className="btn-gold">
              Begin Analysis
            </button>
            <div className="flex items-center gap-6 text-center">
              {[['100%', 'Private'], ['∞', 'Files'], ['50+', 'Fields']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-xl font-display font-light text-gold">{val}</p>
                  <p className="text-[9px] tracking-widest text-cream/35">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Supported formats collection grid (like the collections section)
export const LandingFormats: React.FC<{ onAnalyze: () => void }> = ({ onAnalyze }) => {
  const formats = [
    {
      label: 'IMAGES',
      sub: 'EXIF · GPS · Colors',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      label: 'DOCUMENTS',
      sub: 'PDF · Security · Meta',
      image: 'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      label: 'MEDIA',
      sub: 'Audio · Video · Duration',
      image: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  return (
    <section className="relative bg-white py-20 px-4">
      <div className="text-center mb-12">
        <div className="ornament-divider max-w-xs mx-auto">
          <span className="heading-serif text-sm text-ink-800 tracking-widest uppercase px-4 whitespace-nowrap">
            SUPPORTED FORMATS
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {formats.map((fmt, i) => (
          <div
            key={i}
            className="collection-card group cursor-pointer"
            onClick={onAnalyze}
          >
            <img src={fmt.image} alt={fmt.label} />
            <div className="collection-card-overlay">
              <div className="text-center">
                <h3 className="heading-display text-3xl text-cream mb-1">{fmt.label}</h3>
                <p className="label-track text-cream/60">{fmt.sub}</p>
                <div className="mt-3 w-8 h-px bg-gold/60 mx-auto" />
                <p className="label-track text-gold/70 mt-3">ANALYZE NOW</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Privacy / color palette features section
export const LandingPrivacyBand: React.FC = () => {
  const tools = [
    {
      title: 'STRIP METADATA',
      description: 'Remove all EXIF and GPS data from images. Download a clean, privacy-safe copy instantly.',
      icon: '🛡',
      tag: 'Privacy Tool',
    },
    {
      title: 'COLOR PALETTE',
      description: 'Extract dominant color swatches with copyable HEX codes from any uploaded image.',
      icon: '◈',
      tag: 'Image Analysis',
    },
    {
      title: 'EXPORT REPORTS',
      description: 'Export extracted metadata as JSON, CSV, or a professionally typeset PDF report.',
      icon: '↓',
      tag: 'Export Suite',
    },
  ];

  return (
    <section className="relative bg-ink-950 py-20 px-4 overflow-hidden">
      <StarField />

      {/* Center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        <p className="label-track text-gold/60 mb-3">Standout Features</p>
        <h2 className="heading-display text-4xl text-cream mb-3">POWERFUL TOOLS</h2>
        <div className="h-px w-20 bg-gold/30 mx-auto mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5">
          {tools.map((tool, i) => (
            <div key={i} className="bg-ink-950 p-10 text-center hover:bg-white/[0.02] transition-colors duration-300">
              <div className="text-3xl mb-4 text-gold font-display">{tool.icon}</div>
              <p className="label-track text-gold/60 mb-3">{tool.tag}</p>
              <h3 className="heading-serif text-cream text-lg mb-3">{tool.title}</h3>
              <p className="text-xs text-cream/40 leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
