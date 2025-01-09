'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/context/Web3Context';
import Link from 'next/link';

interface Appointment {
  id: number;
  patientAadhar: string;
  date: number;
  time: string;
  symptoms: string;
  status: number;
}

export default function Hospital() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Prescription form states
  const [aadharNumber, setAadharNumber] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');

  const { contract, connectWallet, isConnected, account } = useWeb3();

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isConnected) {
      await connectWallet();
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Adding prescription for:', aadharNumber);
      const tx = await contract.addPrescription(
        aadharNumber,
        diagnosis,
        medication,
        dosage,
        notes
      );
      await tx.wait();

      setSuccess('Prescription added successfully!');
      // Reset form
      setAadharNumber('');
      setDiagnosis('');
      setMedication('');
      setDosage('');
      setNotes('');
    } catch (err: any) {
      console.error('Error adding prescription:', err);
      setError(err.message || 'Error adding prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Hospital Portal</h2>
            <Link
              href="/hospital/appointments"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              View Appointments
            </Link>
          </div>

          {!isConnected ? (
            <div className="text-center mb-8">
              <button
                onClick={connectWallet}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-4 text-sm text-gray-600">
                Connected Hospital: {account}
              </div>

              {error && (
                <div className="text-red-600 text-center mb-4 p-4 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-center mb-4 p-4 bg-green-50 rounded-md">
                  {success}
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold mb-4">Add Prescription</h3>
                <form onSubmit={handleAddPrescription} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Patient Aadhar Number
                    </label>
                    <input
                      type="text"
                      pattern="\d{12}"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Diagnosis
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Medication
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dosage
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Add Prescription'}
                  </button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
