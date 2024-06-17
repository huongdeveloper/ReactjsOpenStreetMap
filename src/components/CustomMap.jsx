import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { pdfjs } from 'pdfjs-dist';
import './Map.css'; 
import pdfFile from '../img/quy-hoach-dong-anh.pdf';

const containerStyle = {
  width: '100%',
  height: '90vh'
};

const center = [21.1389, 105.8350];

function PdfOverlay({ opacity }) {
  const map = useMap();
  const pdfCanvasRef = useRef(null);

  useEffect(() => {
    const overlayBounds = [
      [21.213, 105.7255],
      [21.0575, 105.934],
    ];

    const renderPDF = async () => {
      const pdf = await pdfjs.getDocument(pdfFile).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageUrl = canvas.toDataURL();
      const overlay = L.imageOverlay(imageUrl, overlayBounds, { opacity });
      overlay.addTo(map);

      pdfCanvasRef.current = overlay;
    };

    renderPDF();

    return () => {
      if (pdfCanvasRef.current) {
        map.removeLayer(pdfCanvasRef.current);
        pdfCanvasRef.current = null;
      }
    };
  }, [map, opacity]);

  useEffect(() => {
    if (pdfCanvasRef.current) {
      pdfCanvasRef.current.setOpacity(opacity);
    }
  }, [opacity]);

  return null;
}

function Map() {
  const [opacity, setOpacity] = useState(0.5);

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
        <PdfOverlay opacity={opacity} />
      </MapContainer>
      <Box sx={{ position: 'absolute', top: 10, right: 10, height: 300, background: 'white', padding: '10px', borderRadius: '8px' }} className="slider-container">
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
