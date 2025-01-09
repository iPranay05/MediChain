'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/context/Web3Context';

interface Medicine {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionRecord {
  aadharNumber: string;
  diagnosis: string;
  medicines: string;
  notes: string;
  hospitalAddress: string;
  hospitalName: string;
  timestamp: string;
}

export default function Patient() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [healthCoins, setHealthCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { contract, isConnected, connectWallet, account } = useWeb3();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isConnected) {
        await connectWallet();
        return;
      }

      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const records = await contract.getPrescriptions(aadharNumber);
      setPrescriptions(records);

      const coins = await contract.getHealthCoins(aadharNumber);
      setHealthCoins(Number(coins));
    } catch (err: any) {
      console.error('Error fetching prescriptions:', err);
      setError(err.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Medical Records Portal</h1>
            <div className="text-sm text-gray-600">
              Connected: <span className="font-mono">{account}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              placeholder="Enter Aadhar Number"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Retrieve Records'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {prescriptions.map((record, index) => {
            let medicines: Medicine[] = [];
            try {
              if (record.medicines) {
                medicines = JSON.parse(record.medicines);
                if (!Array.isArray(medicines)) {
                  medicines = [medicines];
                }
              }
            } catch (e) {
              console.error('Error parsing medicines:', e);
              medicines = [{
                medication: record.medicines || 'Unknown',
                dosage: '',
                frequency: '',
                duration: '',
                instructions: ''
              }];
            }

            const { date, time } = formatDate(record.timestamp);

            return (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Header with hospital logo and date */}
                <div className="bg-blue-600 text-white px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{record.hospitalName || "MediChain Healthcare"}</div>
                        <div className="text-sm font-medium opacity-75">Medical Record #{index + 1}</div>
                        <div className="text-sm opacity-75">Patient ID: {record.aadharNumber}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-75">Date & Time</div>
                      <div className="font-bold">{date}</div>
                      <div className="text-sm opacity-75">{time}</div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  {/* Diagnosis Section */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M7 5h6v2H7V5zm0 4h6v2H7V9zm0 4h6v2H7v-2z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-bold text-blue-900">Diagnosis</h3>
                    </div>
                    <p className="text-blue-800">{record.diagnosis}</p>
                  </div>

                  {/* Medications Section */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.649 3.351a8 8 0 10-11.298 11.298 8 8 0 0011.298-11.298zm-1.414 1.414a6 6 0 11-8.47 8.47 6 6 0 018.47-8.47zM10 6a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V7a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-bold text-gray-900">Prescribed Medications</h3>
                    </div>
                    <div className="space-y-3">
                      {medicines.map((medicine, medIndex) => (
                        <div key={medIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <div className="text-lg font-semibold text-gray-900">{medicine.medication}</div>
                              {medicine.instructions && (
                                <div className="mt-1 text-sm text-gray-600 italic">"{medicine.instructions}"</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {medicine.dosage && (
                                <div className="flex items-center text-sm">
                                  <span className="w-20 text-gray-500">Dosage:</span>
                                  <span className="font-medium text-gray-900">{medicine.dosage}</span>
                                </div>
                              )}
                              {medicine.frequency && (
                                <div className="flex items-center text-sm">
                                  <span className="w-20 text-gray-500">Frequency:</span>
                                  <span className="font-medium text-gray-900">{medicine.frequency}</span>
                                </div>
                              )}
                              {medicine.duration && (
                                <div className="flex items-center text-sm">
                                  <span className="w-20 text-gray-500">Duration:</span>
                                  <span className="font-medium text-gray-900">{medicine.duration}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes Section */}
                  {record.notes && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-bold text-yellow-900">Additional Notes</h3>
                      </div>
                      <p className="text-yellow-800">{record.notes}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500">Record ID:</div>
                      <div className="font-mono text-sm font-medium text-gray-900">#{index + 1}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Blockchain Verified
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {prescriptions.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
              <div className="text-sm text-blue-700">
                Total Records: <span className="font-medium">{prescriptions.length}</span>
              </div>
              <div className="text-sm text-blue-700">
                Health Coins: <span className="font-medium">{healthCoins}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
