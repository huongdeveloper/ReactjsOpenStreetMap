import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import './Map.css'; 
import overlayImage from '../img/quy-hoach-dong-anh.jpg';

const containerStyle = {
  width: '100%',
  height: '90vh'
};

const center = [21.1389, 105.8350];

function MapOverlay({ opacity }) {
  const map = useMap();
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlayBounds = [
      [21.2265, 105.6855], // B , T
      [21.042, 105.9685],  // N , Đ
    ];

    const loadImageOverlay = async () => {
      try {
        const image = new Image();
        image.src = overlayImage;

        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const imgData = canvas.toDataURL('image/jpeg', 1.0); // Convert image to JPEG with quality 1.0 (100%)

          if (overlayRef.current) {
            map.removeLayer(overlayRef.current);
          }

          const overlay = L.imageOverlay(imgData, overlayBounds, {
            opacity: opacity
          }).addTo(map);

          overlayRef.current = overlay;
        };
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    if (opacity > 0) {
      loadImageOverlay();
    } else if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
      overlayRef.current = null;
    }

    return () => {
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
        overlayRef.current = null;
      }
    };
  }, [map, opacity]);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setOpacity(opacity);
    }
  }, [opacity]);

  return null;
}

function Map() {
  const [opacity, setOpacity] = useState(0);

  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue / 100);
  };

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={12}
        style={containerStyle}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapOverlay opacity={opacity} />
      </MapContainer>
      <Box sx={{ position: 'absolute', top: 10, right: 10, height: 300 }} className="slider-container">
        <Slider
          orientation="vertical"
          value={opacity * 100}
          min={0}
          max={100}
          step={1}
          onChange={handleOpacityChange}
          valueLabelDisplay="auto"
          aria-labelledby="opacity-slider"
        />
      </Box>
    </div>
  );
}

export default React.memo(Map);
