import React from 'react';
import { MapStyle } from '../types/game';

interface MapStyleToggleProps {
  mapStyle: MapStyle;
  onToggle: () => void;
}

const MapStyleToggle: React.FC<MapStyleToggleProps> = ({ mapStyle, onToggle }) => {
  return (
    <div className="map-style-toggle-container">
      <label className="map-style-toggle">
        <span className="toggle-label">Satellite View</span>
        <div className="toggle-switch">
          <input
            type="checkbox"
            checked={mapStyle === 'satellite'}
            onChange={onToggle}
            className="toggle-input"
          />
          <span className="toggle-slider"></span>
        </div>
      </label>
    </div>
  );
};

export default MapStyleToggle;