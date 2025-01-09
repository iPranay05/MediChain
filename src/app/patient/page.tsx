'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/context/Web3Context';

interface Prescription {
  diagnosis: string;
  medication: string;
  dosage: string;
  notes: string;
  timestamp: number;
  hospital: string;
}

export default function Patient() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [healthCoins, setHealthCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { contract, connectWallet, isConnected, account } = useWeb3();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isConnected) {
        await connectWallet();
      }

      if (!contract) {
        throw new Error('Contract not initialized');
      }

      console.log('Contract address:', await contract.address);
      console.log('Current account:', account);
      console.log('Fetching prescriptions for:', aadharNumber);

      try {
        // Try to add a test prescription first
        const tx = await contract.addPrescription(
          aadharNumber,
          "Test Diagnosis",
          "Test Medication",
          "Test Dosage",
          "Test Notes"
        );
        console.log('Add prescription tx:', tx.hash);
        await tx.wait();
        console.log('Prescription added successfully');
      } catch (addError: any) {
        console.error('Error adding prescription:', addError);
        setError(`Error adding prescription: ${addError.message}`);
      }

      // Fetch prescriptions from blockchain
      const records = await contract.getPrescriptions(aadharNumber);
      console.log('Fetched records:', records);
      setPrescriptions(records);

      // Fetch health coins balance
      const coins = await contract.getHealthCoins(aadharNumber);
      console.log('Health coins:', coins.toString());
      setHealthCoins(Number(coins));
    } catch (err: any) {
      console.error('Error fetching records:', err);
      setError(err.message || 'Error fetching records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Patient Portal</h2>

          {!isConnected && (
            <div className="text-center mb-8">
              <button
                onClick={connectWallet}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {isConnected && (
            <div className="text-center mb-4 text-sm text-gray-600">
              Connected Account: {account}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                pattern="[0-9]{12}"
                required
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                placeholder="Enter your 12-digit Aadhar number"
              />
              <button
                type="submit"
                disabled={loading || !isConnected}
                className={`px-6 py-2 text-white rounded-md ${
                  isConnected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Loading...' : 'View Records'}
              </button>
            </div>
          </form>

          {error && (
            <div className="text-red-600 text-center mb-4 p-4 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Health Records</h2>
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <span className="font-medium">Health Coins Balance:</span>
                <span className="text-lg font-bold">{healthCoins}</span>
              </div>
            </div>

            <div className="grid gap-6">
              {prescriptions.map((prescription: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prescription.diagnosis}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(prescription.timestamp * 1000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {prescription.medication}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          {prescription.dosage}
                        </span>
                      </div>
                    </div>

                    {prescription.notes && (
                      <div className="mt-4 space-y-3">
                        {prescription.notes.split(', ').map((note: string, i: number) => {
                          const [label, value] = note.split(': ');
                          if (!value) return null;
                          
                          let bgColor = 'bg-gray-50';
                          let textColor = 'text-gray-700';
                          
                          if (label === 'BP') {
                            bgColor = 'bg-red-50';
                            textColor = 'text-red-700';
                          } else if (label === 'Sugar') {
                            bgColor = 'bg-purple-50';
                            textColor = 'text-purple-700';
                          } else if (label === 'Temp') {
                            bgColor = 'bg-orange-50';
                            textColor = 'text-orange-700';
                          } else if (label === 'Weight') {
                            bgColor = 'bg-green-50';
                            textColor = 'text-green-700';
                          } else if (label === 'Frequency') {
                            bgColor = 'bg-blue-50';
                            textColor = 'text-blue-700';
                          }

                          return (
                            <div
                              key={i}
                              className={`inline-block mr-3 px-3 py-1 rounded-lg ${bgColor} ${textColor} text-sm`}
                            >
                              <span className="font-medium">{label}:</span> {value}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                          />
                        </svg>
                        <span className="font-medium">Hospital:</span>
                        <span className="ml-1 font-mono text-xs">
                          {prescription.hospital.slice(0, 6)}...{prescription.hospital.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {prescriptions.length === 0 && (
              <div className="text-center py-12">
                <div className="rounded-full bg-gray-50 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Health Records</h3>
                <p className="mt-1 text-gray-500">No health records have been added yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
