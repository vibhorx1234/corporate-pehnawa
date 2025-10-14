// File: ./frontend/src/components/products/SizeChart.jsx

import React, { useState, useEffect } from 'react';
import sizeChartData from '../../data/sizeChart.json';
import './SizeChart.css';

const SizeChart = ({ isOpen, onClose }) => {
  const [sizeChart, setSizeChart] = useState(null);

  useEffect(() => {
    setSizeChart(sizeChartData);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !sizeChart) return null;

  return (
    <div className="size-chart-modal" onClick={onClose}>
      <div className="size-chart-content" onClick={(e) => e.stopPropagation()}>
        <div className="size-chart-header">
          <h2>{sizeChart.title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="size-chart-description">{sizeChart.description}</p>

        <div className="size-chart-table-container">
          <table className="size-chart-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Bust (inches)</th>
                <th>Length (inches)</th>
                <th>Waist (inches)</th>
                <th>Shoulder (inches)</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.sizes.map((size) => (
                <tr key={size.size}>
                  <td className="size-name">{size.size}</td>
                  <td>{size.bust}</td>
                  <td>{size.length}</td>
                  <td>{size.waist}</td>
                  <td>{size.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="size-chart-notes">
          <h3>Measurement Guidelines:</h3>
          <ul>
            {sizeChart.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="size-chart-custom-info">
          <p><strong>Note:</strong> {sizeChart.customMeasurementInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default SizeChart;