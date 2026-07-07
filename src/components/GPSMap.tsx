import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, ExternalLink } from 'lucide-react';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createMarker = () => L.divIcon({
  className: '',
  html: `<div style="
    width:12px;height:12px;border-radius:50%;
    background:linear-gradient(135deg,#c9a96e,#f0d9a8);
    border:2px solid rgba(255,255,255,0.8);
    box-shadow:0 0 12px rgba(201,169,110,0.6);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface GPSMapProps {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export const GPSMap: React.FC<GPSMapProps> = ({ latitude, longitude, altitude }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap · CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapRef.current);

    markerRef.current = L.marker([latitude, longitude], { icon: createMarker() })
      .addTo(mapRef.current)
      .bindPopup(`<div style="color:#c9a96e;font-size:11px;text-align:center;padding:4px">
        ${latitude.toFixed(5)}° / ${longitude.toFixed(5)}°
        ${altitude ? `<br><span style="opacity:.6">${altitude.toFixed(0)}m alt</span>` : ''}
      </div>`);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    markerRef.current?.setLatLng([latitude, longitude]);
    mapRef.current?.setView([latitude, longitude], 14);
  }, [latitude, longitude]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="label-track text-gold/70 flex items-center gap-2">
          <MapPin className="w-3 h-3" /> Location
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`https://maps.apple.com/?q=${latitude},${longitude}`, '_blank', 'noopener')}
            className="btn-ghost-gold"
          >
            <ExternalLink className="w-3 h-3" /> Apple Maps
          </button>
          <button
            onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank', 'noopener')}
            className="btn-ghost-gold"
          >
            <ExternalLink className="w-3 h-3" /> Google Maps
          </button>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-48" style={{ borderRadius: 2 }} />

      <div className="grid grid-cols-2 gap-2">
        {[
          ['Latitude',  `${latitude.toFixed(6)}°`],
          ['Longitude', `${longitude.toFixed(6)}°`],
          ...(altitude != null ? [['Altitude', `${altitude.toFixed(1)} m`]] : []),
        ].map(([k, v]) => (
          <div key={k} className="p-3 bg-white/[0.03] border border-white/5">
            <p className="text-[10px] tracking-widest text-cream/35 mb-1">{k}</p>
            <p className="text-sm text-gold font-mono">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
