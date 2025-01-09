'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/context/Web3Context';
import Link from 'next/link';

enum AppointmentStatus {
  SCHEDULED = 0,
  CONFIRMED = 1,
  CANCELLED = 2,
  COMPLETED = 3
}

interface Appointment {
  id: number;
  patientAadhar: string;
  timestamp: number;
  status: AppointmentStatus;
  contactEmail: string;
  contactPhone: string;
  notes: string;
  department: string;
}

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { contract, connectWallet, isConnected, account } = useWeb3();

  const fetchAppointments = async () => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setLoading(true);
      console.log('Fetching appointments...');
      const hospitalAddress = account;
      console.log('Hospital address:', hospitalAddress);

      const allAppointments = await contract.getHospitalAppointments(hospitalAddress);
      console.log('Fetched appointments:', allAppointments);
      setAppointments(allAppointments);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && contract) {
      fetchAppointments();
    }
  }, [isConnected, contract]);

  const handleStatusChange = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setLoading(true);
      console.log('Updating appointment status:', { appointmentId, newStatus });
      const tx = await contract.updateAppointmentStatus(appointmentId, newStatus);
      await tx.wait();
      
      setSuccess('Appointment status updated successfully');
      await fetchAppointments();
    } catch (err: any) {
      console.error('Error updating appointment status:', err);
      setError(err.message || 'Error updating appointment status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'Scheduled';
      case AppointmentStatus.CONFIRMED:
        return 'Confirmed';
      case AppointmentStatus.CANCELLED:
        return 'Cancelled';
      case AppointmentStatus.COMPLETED:
        return 'Completed';
      default:
        return 'Unknown';
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
            <h2 className="text-3xl font-bold text-gray-900">Hospital Appointments</h2>
            <Link
              href="/hospital"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Hospital Portal
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
                <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                  {success}
                </div>
              )}

              <div className="mt-8">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : appointments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {appointments.map((appointment, index) => (
                      <div 
                        key={index}
                        className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                          getStatusText(appointment.status) === 'Confirmed' 
                            ? 'border-green-500' 
                            : getStatusText(appointment.status) === 'Cancelled'
                            ? 'border-red-500'
                            : 'border-yellow-500'
                        }`}
                      >
                        <div className="mb-4">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Patient Aadhar:</span>
                            <span>{appointment.patientAadhar}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-semibold">Department:</span>
                            <span>{appointment.department}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-semibold">Date & Time:</span>
                            <span>{new Date(appointment.timestamp * 1000).toLocaleString()}</span>
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold">Contact:</span>
                            <div className="ml-4">
                              <div>Email: {appointment.contactEmail}</div>
                              <div>Phone: {appointment.contactPhone}</div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold">Notes:</span>
                            <p className="ml-4 text-gray-600">{appointment.notes}</p>
                          </div>
                          <div className="mt-3 flex items-center">
                            <span className="font-semibold mr-2">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              getStatusText(appointment.status) === 'Confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : getStatusText(appointment.status) === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleStatusChange(appointment.id, AppointmentStatus.CONFIRMED)}
                            disabled={getStatusText(appointment.status) !== 'Scheduled'}
                            className={`px-4 py-2 rounded-md ${
                              getStatusText(appointment.status) === 'Scheduled'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment.id, AppointmentStatus.CANCELLED)}
                            disabled={getStatusText(appointment.status) !== 'Scheduled'}
                            className={`px-4 py-2 rounded-md ${
                              getStatusText(appointment.status) === 'Scheduled'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">No appointments found</div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
