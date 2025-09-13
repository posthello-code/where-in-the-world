import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { DeckGL } from '@deck.gl/react';
import { Location, MapStyle } from '../types/game';

interface GameMapProps {
  targetLocation: Location | null;
  zoom: number;
  gameActive: boolean;
  showLabels: boolean;
  mapStyle: MapStyle;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const GameMap: React.FC<GameMapProps> = ({ targetLocation, zoom, gameActive, showLabels, mapStyle, onZoomIn, onZoomOut }) => {
  const mapRef = useRef(null);

  const getMapStyleUrl = useCallback(() => {
    if (mapStyle === 'satellite') {
      // Create satellite style with optional label overlay
      const satelliteStyle = {
        "version": 8,
        "sources": {
          "satellite": {
            "type": "raster",
            "tiles": [
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            ],
            "tileSize": 256
          }
        },
        "layers": [
          {
            "id": "satellite",
            "type": "raster",
            "source": "satellite"
          }
        ]
      };

      // Add label overlay when labels are enabled
      if (showLabels) {
        satelliteStyle.sources.labels = {
          "type": "raster",
          "tiles": [
            "https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}.png"
          ],
          "tileSize": 256,
          "attribution": "© Stadia Maps © Stamen Design © OpenMapTiles © OpenStreetMap contributors"
        };

        satelliteStyle.layers.push({
          "id": "labels",
          "type": "raster",
          "source": "labels",
          "paint": {
            "raster-opacity": 0.9
          }
        });
      }

      return satelliteStyle;
    }

    // CartoDB street map
    return showLabels
      ? "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
  }, [mapStyle, showLabels]);
  const [viewState, setViewState] = useState({
    longitude: targetLocation?.lng || 0,
    latitude: targetLocation?.lat || 0,
    zoom: zoom,
    pitch: 0,
    bearing: 0
  });

  const onViewStateChange = useCallback((evt: any) => {
    const newViewState = { ...evt.viewState };

    // Only allow pan changes, not zoom changes
    newViewState.zoom = viewState.zoom;

    setViewState(newViewState);
  }, [viewState.zoom]);

  // Update view state when game zoom or target location changes
  useEffect(() => {
    if (targetLocation) {
      const randomOffset = 0.01;
      const offsetLat = targetLocation.lat + (Math.random() - 0.5) * randomOffset;
      const offsetLng = targetLocation.lng + (Math.random() - 0.5) * randomOffset;

      setViewState({
        longitude: offsetLng,
        latitude: offsetLat,
        zoom: zoom,
        pitch: 0,
        bearing: 0
      });
    }
  }, [targetLocation, zoom]);

  const handleZoomIn = () => {
    if (viewState.zoom < 20) {
      setViewState(prev => ({ ...prev, zoom: prev.zoom + 1 }));
      onZoomIn();
    }
  };

  const handleZoomOut = () => {
    if (viewState.zoom > zoom) {
      setViewState(prev => ({ ...prev, zoom: prev.zoom - 1 }));
      onZoomOut();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button
          className="zoom-btn"
          onClick={handleZoomIn}
          disabled={viewState.zoom >= 20}
          title="Zoom In"
        >
          +
        </button>
        <button
          className="zoom-btn"
          onClick={handleZoomOut}
          disabled={viewState.zoom <= zoom}
          title="Zoom Out"
        >
          −
        </button>
      </div>
      <DeckGL
        viewState={viewState}
        controller={{
          dragPan: false,
          dragRotate: false,
          scrollZoom: false,
          doubleClickZoom: false,
          keyboard: false,
          touchZoom: false,
          touchRotate: false
        }}
        onViewStateChange={onViewStateChange}
        layers={[]}
      >
        <Map
          ref={mapRef}
          mapStyle={getMapStyleUrl()}
          interactive={true}
          scrollZoom={false}
          doubleClickZoom={false}
          dragPan={false}
          dragRotate={false}
          touchZoom={false}
          touchRotate={false}
          attributionControl={true}
        />
      </DeckGL>
    </div>
  );
};

export default GameMap;