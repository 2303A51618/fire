import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { formatToUserTime } from '../utils/time';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/** Return a confidence-coloured fire divIcon */
const getFireIcon = (confidence) => {
  const color =
    confidence >= 0.9 ? '#dc2626'
    : confidence >= 0.8 ? '#ea580c'
    : confidence >= 0.7 ? '#d97706'
    : '#2563eb';
  const bg =
    confidence >= 0.9 ? 'rgba(220,38,38,0.15)'
    : confidence >= 0.8 ? 'rgba(234,88,12,0.15)'
    : confidence >= 0.7 ? 'rgba(217,119,6,0.15)'
    : 'rgba(37,99,235,0.15)';
  return L.divIcon({
    html: `<div style="background:${bg};border:2px solid ${color};border-radius:50%;
             width:34px;height:34px;display:flex;align-items:center;
             justify-content:center;font-size:18px;box-shadow:0 2px 6px rgba(0,0,0,.35);">🔥</div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
};

/** Detect whether a filename looks like "lat,lon.ext" */
const isCoordinateFilename = (name) =>
  name != null && /^-?\d/.test(name) && name.includes(',');

export const FireMap = ({ fires = [] }) => {
  const defaultCenter = [45.4215, -75.6972]; // Ottawa, Canada default
  const validFires = useMemo(
    () => fires.filter(
      (fire) => Number.isFinite(fire?.latitude) && Number.isFinite(fire?.longitude)
    ),
    [fires]
  );

  const center = validFires.length > 0
    ? [validFires[0].latitude, validFires[0].longitude]
    : defaultCenter;

  const zoom = validFires.length > 0 ? 10 : 6;
  const mapKey = `${center[0]}-${center[1]}-${zoom}-${validFires.length}`;

  return (
    <div className="space-y-2">
      {/* No-location notice */}
      {fires.length > 0 && validFires.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
          <span>⚠️</span>
          <span>
            {fires.length} alert{fires.length > 1 ? 's' : ''} recorded — no GPS coordinates
            available yet. Upload an image named{' '}
            <code className="font-mono bg-yellow-100 px-1 rounded">lat,lon.jpg</code> to pin
            fires on the map.
          </span>
        </div>
      )}

      {validFires.length > 0 && (
        <p className="text-xs text-gray-500">
          Showing {validFires.length} fire location{validFires.length > 1 ? 's' : ''}
          {fires.length > validFires.length
            ? ` (${fires.length - validFires.length} without coordinates hidden)`
            : ''}
        </p>
      )}

      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border-2 border-fire-400">
        <MapContainer
          key={mapKey}
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {validFires.map((fire, idx) => (
            <Marker
              key={idx}
              position={[fire.latitude, fire.longitude]}
              icon={getFireIcon(fire.confidence)}
            >
              <Popup>
                <div className="text-center min-w-[200px]">
                  <p className="font-bold text-fire-600 text-base">🔥 Fire Alert</p>
                  <hr className="my-2" />

                  {/* Confidence */}
                  <p className="text-sm">
                    <strong>Confidence:</strong>{' '}
                    <span
                      className={`font-bold ${
                        fire.confidence >= 0.9 ? 'text-red-600'
                        : fire.confidence >= 0.8 ? 'text-orange-600'
                        : fire.confidence >= 0.7 ? 'text-yellow-600'
                        : 'text-blue-600'
                      }`}
                    >
                      {(fire.confidence * 100).toFixed(1)}%
                    </span>
                  </p>

                  {/* Coordinates */}
                  <p className="text-sm mt-1"><strong>Coordinates:</strong></p>
                  <p className="text-xs font-mono text-gray-700">
                    {fire.latitude.toFixed(6)}, {fire.longitude.toFixed(6)}
                  </p>

                  {/* Coordinate source badge */}
                  <p className="text-xs mt-1 text-gray-500">
                    {isCoordinateFilename(fire.image_name)
                      ? '📁 Source: filename'
                      : '📷 Source: EXIF metadata'}
                  </p>

                  {/* Image name */}
                  {fire.image_name && (
                    <p className="text-xs mt-1 text-gray-500 truncate max-w-[180px] mx-auto">
                      🖼 {fire.image_name}
                    </p>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs mt-2 text-gray-600">
                    <strong>Time:</strong> {formatToUserTime(fire.timestamp)}
                  </p>

                  {/* Google Maps link */}
                  {(fire.map_url || (fire.latitude && fire.longitude)) && (
                    <a
                      href={
                        fire.map_url ||
                        `https://maps.google.com/?q=${fire.latitude},${fire.longitude}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition"
                    >
                      🗺️ Open in Google Maps
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default FireMap;
