'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/context/Web3Context';
import { motion } from 'framer-motion';

// Common diagnoses
const commonDiagnoses = [
  "Common Cold",
  "Influenza",
  "Hypertension",
  "Type 2 Diabetes",
  "Asthma",
  "Bronchitis",
  "Migraine",
  "Gastritis",
  "Allergic Rhinitis",
  "Urinary Tract Infection"
];

// Common medications with their standard dosages
const medicationOptions = {
  "Paracetamol": ["500mg", "650mg", "1000mg"],
  "Amoxicillin": ["250mg", "500mg", "875mg"],
  "Omeprazole": ["20mg", "40mg"],
  "Metformin": ["500mg", "850mg", "1000mg"],
  "Amlodipine": ["2.5mg", "5mg", "10mg"],
  "Cetirizine": ["5mg", "10mg"],
  "Salbutamol": ["2mg", "4mg"],
  "Azithromycin": ["250mg", "500mg"],
  "Ibuprofen": ["200mg", "400mg", "600mg"],
  "Montelukast": ["4mg", "5mg", "10mg"]
};

// Dosage frequencies
const frequencies = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "As needed",
  "Before meals",
  "After meals"
];

// Duration options
const durations = [
  "3 days",
  "5 days",
  "7 days",
  "10 days",
  "14 days",
  "1 month",
  "2 months",
  "3 months",
  "6 months",
  "Continuous"
];

// Interface for medicine entry
interface MedicineEntry {
  id: string;
  medication: string;
  customMedication: string;
  dosageAmount: string;
  customDosageAmount: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function Hospital() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [customDiagnosis, setCustomDiagnosis] = useState('');
  const [medicines, setMedicines] = useState<MedicineEntry[]>([
    {
      id: '1',
      medication: '',
      customMedication: '',
      dosageAmount: '',
      customDosageAmount: '',
      frequency: '',
      duration: '',
      instructions: ''
    }
  ]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hospitalName, setHospitalName] = useState('');

  const router = useRouter();
  const { contract, account, isConnected, connectWallet } = useWeb3();

  useEffect(() => {
    // Check if hospital is logged in
    const storedHospitalName = localStorage.getItem('hospitalName');
    const storedHospitalAddress = localStorage.getItem('hospitalAddress');

    if (!storedHospitalName || !storedHospitalAddress) {
      router.push('/hospital/login');
      return;
    }

    setHospitalName(storedHospitalName);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('hospitalName');
    localStorage.removeItem('hospitalAddress');
    router.push('/hospital/login');
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: Date.now().toString(),
        medication: '',
        customMedication: '',
        dosageAmount: '',
        customDosageAmount: '',
        frequency: '',
        duration: '',
        instructions: ''
      }
    ]);
  };

  const removeMedicine = (id: string) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  const updateMedicine = (id: string, field: keyof MedicineEntry, value: string) => {
    setMedicines(medicines.map(med => {
      if (med.id === id) {
        return { ...med, [field]: value };
      }
      return med;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!isConnected) {
        await connectWallet();
        return;
      }

      if (!aadharNumber || !diagnosis || medicines.length === 0) {
        setError('Please fill in all required fields');
        return;
      }

      const finalDiagnosis = diagnosis === 'custom' ? customDiagnosis : diagnosis;
      
      // Format medicines data
      const medicinesData = medicines.map(med => ({
        medication: med.medication === 'custom' ? med.customMedication : med.medication,
        dosage: med.medication === 'custom' ? med.customDosageAmount : med.dosageAmount,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions
      }));

      // Convert medicines to string format for blockchain storage
      const medicinesString = JSON.stringify(medicinesData);

      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await contract.addPrescription(
        aadharNumber,
        finalDiagnosis,
        medicinesString,
        notes,
        hospitalName
      );

      await tx.wait();
      setSuccess('Prescription added successfully!');
      
      // Reset form
      setAadharNumber('');
      setDiagnosis('');
      setCustomDiagnosis('');
      setMedicines([{
        id: '1',
        medication: '',
        customMedication: '',
        dosageAmount: '',
        customDosageAmount: '',
        frequency: '',
        duration: '',
        instructions: ''
      }]);
      setNotes('');
    } catch (err: any) {
      console.error('Error adding prescription:', err);
      setError(err.message || 'Failed to add prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Hospital Portal</h1>
            <p className="text-gray-600 mb-6">Welcome, {hospitalName || 'Kalyan Special Hospital'}</p>
            <div className="flex justify-between items-center mb-8">
              <div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">Connected: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Aadhar Number */}
              <div>
                <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">
                  Aadhar Number *
                </label>
                <input
                  type="text"
                  id="aadhar"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  placeholder="Enter 12-digit Aadhar number"
                  className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  pattern="[0-9]{12}"
                />
              </div>

              {/* Diagnosis */}
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                  Diagnosis *
                </label>
                <div className="mt-1 flex gap-4">
                  <select
                    id="diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select diagnosis</option>
                    {commonDiagnoses.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                    <option value="custom">Other (specify)</option>
                  </select>
                  {diagnosis === 'custom' && (
                    <input
                      type="text"
                      value={customDiagnosis}
                      onChange={(e) => setCustomDiagnosis(e.target.value)}
                      placeholder="Enter diagnosis"
                      className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Medicines Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Medicines</h3>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Medicine
                  </button>
                </div>

                {medicines.map((medicine, index) => (
                  <div
                    key={medicine.id}
                    className="p-4 border-2 border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium text-gray-700">Medicine #{index + 1}</h4>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(medicine.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Medication Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Medication *
                        </label>
                        <div className="mt-1 flex gap-4">
                          <select
                            value={medicine.medication}
                            onChange={(e) => updateMedicine(medicine.id, 'medication', e.target.value)}
                            className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Select medication</option>
                            {Object.keys(medicationOptions).map((med) => (
                              <option key={med} value={med}>{med}</option>
                            ))}
                            <option value="custom">Other (specify)</option>
                          </select>
                          {medicine.medication === 'custom' && (
                            <input
                              type="text"
                              value={medicine.customMedication}
                              onChange={(e) => updateMedicine(medicine.id, 'customMedication', e.target.value)}
                              placeholder="Enter medication"
                              className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          )}
                        </div>
                      </div>

                      {/* Dosage Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Dosage Amount *
                        </label>
                        <div className="mt-1">
                          {medicine.medication && medicine.medication !== 'custom' ? (
                            <select
                              value={medicine.dosageAmount}
                              onChange={(e) => updateMedicine(medicine.id, 'dosageAmount', e.target.value)}
                              className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            >
                              <option value="">Select amount</option>
                              {medicationOptions[medicine.medication as keyof typeof medicationOptions].map((dose) => (
                                <option key={dose} value={dose}>{dose}</option>
                              ))}
                              <option value="custom">Other (specify)</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={medicine.customDosageAmount}
                              onChange={(e) => updateMedicine(medicine.id, 'customDosageAmount', e.target.value)}
                              placeholder="Enter dosage"
                              className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          )}
                        </div>
                      </div>

                      {/* Frequency */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Frequency *
                        </label>
                        <select
                          value={medicine.frequency}
                          onChange={(e) => updateMedicine(medicine.id, 'frequency', e.target.value)}
                          className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Select frequency</option>
                          {frequencies.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Duration *
                        </label>
                        <select
                          value={medicine.duration}
                          onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                          className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Select duration</option>
                          {durations.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Special Instructions
                      </label>
                      <input
                        type="text"
                        value={medicine.instructions}
                        onChange={(e) => updateMedicine(medicine.id, 'instructions', e.target.value)}
                        placeholder="E.g., Take after meals, Avoid alcohol, etc."
                        className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Any additional notes or observations"
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Success</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>{success}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !isConnected}
                  className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isConnected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Adding Prescription...' : 'Add Prescription'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
