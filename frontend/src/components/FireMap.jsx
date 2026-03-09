import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom fire marker
const fireIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9InJnYigyNTUsIDMyLCAzMikvIG9wYWNpdHk9IjAuMiIgcng9IjgiLz48cGF0aCBkPSJNMTYgMkMxNiAyIDE2IDggMTYgOEM4IDEz IDE4IDE1IDE4IDE4QzE4IDIwIDE3IDI2IDE2IDI2QzE1IDI2IDE0IDIwIDE0IDE4QzE0IDE1IDI0IDEzIDE2IDhDMTYgOCAxNiAyIDE2IDIiIGZpbGw9InJnYigyNTUsIDk2LCAzMikiIHN0cm9rZT0icmdiKDI1NSwgMzIsIDMyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const FireMap = ({ fires = [] }) => {
  const defaultCenter = [45.4215, -75.6972]; // Ottawa, Canada default
  const center = fires.length > 0
    ? [fires[0].latitude || defaultCenter[0], fires[0].longitude || defaultCenter[1]]
    : defaultCenter;
  
  // Use higher zoom if we have specific fire location
  const zoom = fires.length > 0 && fires[0].latitude ? 10 : 6;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border-2 border-fire-400">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Fire Markers */}
        {fires.map((fire, idx) => (
          fire.latitude && fire.longitude && (
            <Marker
              key={idx}
              position={[fire.latitude, fire.longitude]}
              icon={fireIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-fire-600 text-lg">🔥 Fire Alert</p>
                  <hr className="my-2" />
                  <p className="text-sm"><strong>Confidence:</strong> {(fire.confidence * 100).toFixed(2)}%</p>
                  <p className="text-sm"><strong>Location:</strong></p>
                  <p className="text-xs font-mono">{fire.latitude.toFixed(6)}, {fire.longitude.toFixed(6)}</p>
                  <p className="text-xs mt-2"><strong>Time:</strong> {new Date(fire.timestamp).toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default FireMap;
