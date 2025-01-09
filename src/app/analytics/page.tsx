'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { motion } from 'framer-motion';
import {
  HealthMetric,
  TrendAnalysis,
  HealthAlert,
  HealthPattern,
  HealthRecommendation,
  analyzeTrend,
  checkForAlerts,
  recognizePatterns,
  generateRecommendations,
  HEALTH_THRESHOLDS
} from '@/utils/healthAnalytics';

export default function Analytics() {
  const [aadharNumber, setAadharNumber] = useState<string | null>(null);
  const [metricType, setMetricType] = useState<string>('diagnosis');
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [medication, setMedication] = useState<string | null>(null);
  const [dosage, setDosage] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<string>('daily');
  const [bloodPressure, setBloodPressure] = useState<string | null>(null);
  const [bloodSugar, setBloodSugar] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<string | null>(null);
  const [weight, setWeight] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);
  const [patterns, setPatterns] = useState<HealthPattern[]>([]);
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const metricTypes = [
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'medication', label: 'Medication' },
    { value: 'dosage', label: 'Dosage' },
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'twice_daily', label: 'Twice Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'as_needed', label: 'As Needed' }
  ];

  const { contract, connectWallet, isConnected } = useWeb3();

  const validateAadhar = (aadhar: string | null) => {
    if (!aadhar) return false;
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isConnected) {
      await connectWallet();
      return;
    }

    if (!validateAadhar(aadharNumber)) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Format health metrics into notes
      const healthDetails = {
        bloodPressure: bloodPressure ? `BP: ${bloodPressure}` : '',
        bloodSugar: bloodSugar ? `Sugar: ${bloodSugar} mg/dL` : '',
        temperature: temperature ? `Temp: ${temperature}°F` : '',
        weight: weight ? `Weight: ${weight} kg` : '',
        symptoms: symptoms ? `Symptoms: ${symptoms}` : '',
        frequency: `Frequency: ${frequency}`,
      };

      const formattedNotes = Object.values(healthDetails)
        .filter(detail => detail)
        .join(', ');

      // Add prescription with detailed health metrics
      const tx = await contract.addPrescription(
        aadharNumber as string,
        diagnosis as string,
        medication as string,
        dosage as string,
        formattedNotes
      );
      await tx.wait();
      
      setSuccess('Health record added successfully!');
      setError(null);
      await fetchHealthData();

      // Reset form
      setDiagnosis(null);
      setMedication(null);
      setDosage(null);
      setBloodPressure(null);
      setBloodSugar(null);
      setTemperature(null);
      setWeight(null);
      setSymptoms(null);
    } catch (err: any) {
      console.error('Error adding health record:', err);
      setError(err.message || 'Error adding health record');
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthData = async () => {
    if (!contract || !aadharNumber || !validateAadhar(aadharNumber)) return;

    try {
      setLoading(true);
      setError(null);

      // Get prescriptions instead of health metrics
      const prescriptionsData = await contract.getPrescriptions(aadharNumber as string);
      
      // Transform prescription data into health metrics format
      const transformedMetrics = prescriptionsData.map((prescription: any) => ({
        type: 'prescription',
        value: 0, // Since prescriptions don't have numeric values
        timestamp: prescription.timestamp.toNumber(),
        notes: `Medication: ${prescription.medication}, Dosage: ${prescription.dosage}, Diagnosis: ${prescription.diagnosis}, Notes: ${prescription.notes}`,
        hospital: prescription.hospital
      }));

      setHealthMetrics(transformedMetrics);
    } catch (err: any) {
      console.error('Error fetching health data:', err);
      setError(err.message || 'Error fetching health data');
    } finally {
      setLoading(false);
    }
  };

  const analyzeHealthData = () => {
    if (!healthMetrics.length) return;

    // Group prescriptions by diagnosis
    const prescriptionsByDiagnosis = healthMetrics.reduce((acc: any, metric: any) => {
      const diagnosis = metric.notes.split(',')[0].split(':')[1].trim();
      if (!acc[diagnosis]) {
        acc[diagnosis] = [];
      }
      acc[diagnosis].push(metric);
      return acc;
    }, {});

    // Sort metrics by timestamp
    const sortedMetrics = [...healthMetrics].sort((a, b) => a.timestamp - b.timestamp);
    const firstDate = new Date(sortedMetrics[0].timestamp * 1000);
    const lastDate = new Date(sortedMetrics[sortedMetrics.length - 1].timestamp * 1000);
    
    // Calculate days between first and last prescription
    const daysDiff = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate prescriptions per day
    const prescriptionsPerDay = healthMetrics.length / daysDiff;

    // Analyze trends based on prescription frequency
    const trend = {
      direction: 'stable',
      rateOfChange: `${prescriptionsPerDay.toFixed(2)} per day`,
      recentValue: Object.keys(prescriptionsByDiagnosis).length, // Number of unique diagnoses
      averageValue: prescriptionsPerDay.toFixed(2) // Average prescriptions per day
    };
    setTrendAnalysis(trend);

    // Generate patterns based on prescription timing
    const patterns = Object.entries(prescriptionsByDiagnosis).map(([diagnosis, prescriptions]: [string, any[]]) => ({
      type: 'PRESCRIPTION',
      description: `${diagnosis}: ${prescriptions.length} prescriptions`,
      significance: prescriptions.length > 3 ? 'HIGH' : 'MEDIUM',
      details: `Last prescribed on ${new Date(prescriptions[prescriptions.length - 1].timestamp * 1000).toLocaleDateString()}`
    }));
    setPatterns(patterns);

    // Generate recommendations based on prescription history
    const recommendations = Object.entries(prescriptionsByDiagnosis).map(([diagnosis, prescriptions]: [string, any[]]) => ({
      type: 'PRESCRIPTION_MANAGEMENT',
      priority: prescriptions.length > 3 ? 'HIGH' : 'MEDIUM',
      description: `Monitor ${diagnosis} treatment closely`,
      details: `You have ${prescriptions.length} prescriptions over ${daysDiff} days. Average of ${(prescriptions.length / daysDiff).toFixed(2)} prescriptions per day for this condition.`
    }));
    setRecommendations(recommendations);
  };

  useEffect(() => {
    if (healthMetrics.length > 0) {
      analyzeHealthData();
    }
  }, [healthMetrics]);

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case 'HIGH_BLOOD_PRESSURE':
      case 'HIGH_BLOOD_SUGAR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getMedicationEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg space-y-8"
        >
          <h2 className="text-3xl font-bold text-gray-900">Health Analytics</h2>

          {/* Connection Status */}
          {!isConnected && (
            <div className="text-center">
              <button
                onClick={connectWallet}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md">
              {success}
            </div>
          )}

          {/* Updated Health Metrics Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleAddMetric} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    pattern="\d{12}"
                    maxLength={12}
                    required
                    value={aadharNumber || ''}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter 12-digit Aadhar number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    required
                    value={diagnosis || ''}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter diagnosis"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Medication
                  </label>
                  <input
                    type="text"
                    required
                    value={medication || ''}
                    onChange={(e) => setMedication(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter medication name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dosage
                  </label>
                  <input
                    type="text"
                    required
                    value={dosage || ''}
                    onChange={(e) => setDosage(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter dosage (e.g., 10mg)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    value={bloodPressure || ''}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Blood Sugar
                  </label>
                  <input
                    type="text"
                    value={bloodSugar || ''}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter blood sugar level"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Temperature
                  </label>
                  <input
                    type="text"
                    value={temperature || ''}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter temperature"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    value={weight || ''}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter weight in kg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Symptoms & Notes
                </label>
                <textarea
                  value={symptoms || ''}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter any symptoms or additional notes"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !isConnected || !validateAadhar(aadharNumber)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Add Health Record
              </button>
            </form>
          </div>

          {/* Analytics Dashboard */}
          {healthMetrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Trend Analysis */}
              {trendAnalysis && (
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Trend:</span>{' '}
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        trendAnalysis.direction === 'increasing' 
                          ? 'bg-red-100 text-red-800'
                          : trendAnalysis.direction === 'decreasing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trendAnalysis.direction.charAt(0).toUpperCase() + trendAnalysis.direction.slice(1)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Rate of Change:</span>{' '}
                      {trendAnalysis.rateOfChange}
                    </p>
                    <p>
                      <span className="font-medium">Recent Value:</span>{' '}
                      {trendAnalysis.recentValue}
                    </p>
                    <p>
                      <span className="font-medium">Average Value:</span>{' '}
                      {trendAnalysis.averageValue}
                    </p>
                  </div>
                </div>
              )}

              {/* Health Alerts */}
              {healthAlerts.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold mb-4">Health Alerts</h3>
                  <div className="space-y-3">
                    {healthAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md ${
                          alert.severity === 'high'
                            ? 'bg-red-50 text-red-700'
                            : alert.severity === 'medium'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {alert.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patterns */}
              {patterns.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold mb-4">Detected Patterns</h3>
                  <div className="space-y-3">
                    {patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border border-gray-200 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900">
                            {pattern.description}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              pattern.significance === 'HIGH'
                                ? 'bg-red-100 text-red-800'
                                : pattern.significance === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {pattern.significance} significance
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{pattern.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold mb-4">Health Recommendations</h3>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-md bg-gray-50"
                      >
                        <p className="font-medium">{rec.description}</p>
                        <p className="text-sm text-gray-600">{rec.details}</p>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {rec.priority.toUpperCase()} priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
