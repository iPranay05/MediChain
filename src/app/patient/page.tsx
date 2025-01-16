'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { SignedIn } from '@clerk/nextjs';
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

export default function PatientPortalPage() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [healthCoins, setHealthCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { contract, isConnected, connectWallet, account } = useWeb3();

  const handleRetrieveRecords = async (e: React.FormEvent) => {
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
    <SignedIn>
      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Medical Records Portal
            </h1>
            <p className="mt-2 text-gray-600">
              Connected: {aadharNumber || 'Not connected'}
            </p>
          </div>

          <form onSubmit={handleRetrieveRecords} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                placeholder="Enter Aadhar Number"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={12}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Retrieving Records...' : 'Retrieve Records'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {prescriptions.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
              <div className="grid grid-cols-1 gap-4">
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="text-lg font-semibold text-gray-900">
                            Medical Record #{index + 1}
                          </div>
                          <div className="text-sm text-gray-500">
                            {date} {time}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500">Hospital</div>
                            <div className="text-gray-900">{record.hospitalName}</div>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-gray-500">Address</div>
                            <div className="text-gray-900">{record.hospitalAddress}</div>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-gray-500">Diagnosis</div>
                            <div className="text-gray-900">{record.diagnosis}</div>
                          </div>

                          {medicines.map((medicine, medIndex) => (
                            <div key={medIndex}>
                              <div className="text-sm font-medium text-gray-500">Medication</div>
                              <div className="text-gray-900">{medicine.medication}</div>
                            </div>
                          ))}
                        </div>

                        {record.notes && (
                          <div>
                            <div className="text-sm font-medium text-gray-500">Notes</div>
                            <div className="text-gray-600 mt-1">{record.notes}</div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Download Report
                          </button>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Share
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </Layout>
    </SignedIn>
  );
}
