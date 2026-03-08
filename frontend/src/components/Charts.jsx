import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const ConfidenceChart = ({ alerts = [] }) => {
  const data = {
    labels: alerts.slice(0, 10).map((_, i) => `Alert ${i + 1}`),
    datasets: [
      {
        label: 'Confidence Score',
        data: alerts.slice(0, 10).map(a => (a.confidence * 100).toFixed(2)),
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Fire Confidence Over Time' },
    },
    scales: {
      y: { min: 0, max: 100 },
    },
  };

  return <Line data={data} options={options} />;
};

export const StatisticsChart = ({ stats = {} }) => {
  const data = {
    labels: ['Fire', 'No Fire'],
    datasets: [
      {
        data: [stats.fire_predictions || 0, stats.no_fire_predictions || 0],
        backgroundColor: ['rgb(220, 38, 38)', 'rgb(34, 197, 94)'],
        borderColor: ['rgb(200, 20, 20)', 'rgb(20, 170, 70)'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Prediction Distribution' },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export const PredictionTrendChart = ({ stats = {} }) => {
  const data = {
    labels: ['Predictions', 'Fire', 'No Fire', 'Alerts'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats.total_predictions || 0,
          stats.fire_predictions || 0,
          stats.no_fire_predictions || 0,
          stats.total_alerts || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(220, 38, 38, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(251, 146, 60, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(220, 38, 38)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexed: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'System Statistics' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default {
  ConfidenceChart,
  StatisticsChart,
  PredictionTrendChart,
};
