'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/context/Web3Context';
import Link from 'next/link';
import { Appointment } from '../../types/Appointment'; // Adjust the import path accordingly

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

export default function Appointments() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [department, setDepartment] = useState('General');

  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);

  const { contract, connectWallet, isConnected, account } = useWeb3();

  const departments = [
    'General',
    'Cardiology',
    'Dermatology',
    'ENT',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Urology'
  ];

  const validateAadhar = (aadhar: string) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const fetchAppointments = async () => {
    if (!contract || !aadharNumber) return;
    
    if (!validateAadhar(aadharNumber)) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const appointments = await contract.getPatientAppointments(aadharNumber);
      setAppointments(appointments);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isConnected) {
      await connectWallet();
      return;
    }

    if (!validateAadhar(aadharNumber)) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    if (!validateEmail(contactEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePhone(contactPhone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const timestamp = new Date(`${appointmentDate}T${appointmentTime}`).getTime() / 1000;

      const tx = await contract.scheduleAppointment(
        aadharNumber,
        timestamp,
        contactEmail,
        contactPhone,
        notes,
        department
      );
      await tx.wait();

      setSuccess('Appointment scheduled successfully! You will receive a confirmation email shortly.');
      await fetchAppointments();

      // Clear form
      setAppointmentDate('');
      setAppointmentTime('');
      setContactEmail('');
      setContactPhone('');
      setNotes('');
      setDepartment('General');
    } catch (err: any) {
      console.error('Error scheduling appointment:', err);
      setError(err.message || 'Error scheduling appointment');
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border-green-500';
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-500';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchMyAppointments();
    }
  }, [contract, account]);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const appointments = await contract.getAppointmentsByPatient(account);
      setMyAppointments(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <>
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          appointment.status === AppointmentStatus.CONFIRMED
            ? 'bg-green-100 text-green-800'
            : appointment.status === AppointmentStatus.CANCELLED
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {getStatusText(appointment.status)}
        </span>
      </div>

      {/* Department and Time */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-lg font-semibold">{appointment.department}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {new Date(appointment.timestamp * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center text-gray-600 mt-1">
          <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {new Date(appointment.timestamp * 1000).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{appointment.contactEmail}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{appointment.contactPhone}</span>
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600">{appointment.notes}</p>
          </div>
        </div>
      )}
    </>
  );

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
            <h2 className="text-3xl font-bold text-gray-900">Schedule an Appointment</h2>
            <Link
              href="/patient"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Patient Portal
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
                Connected Account: {account}
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Schedule Appointment Form */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Schedule an Appointment</h3>
                  <form onSubmit={handleScheduleAppointment} className="space-y-4">
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={aadharNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                            setAadharNumber(value);
                            setError('');
                          }}
                          onBlur={fetchAppointments}
                          placeholder="Enter 12-digit Aadhar number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <select
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        >
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Time
                        </label>
                        <input
                          type="time"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={appointmentTime}
                          onChange={(e) => setAppointmentTime(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          pattern="\d{10}"
                          maxLength={10}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={contactPhone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setContactPhone(value);
                          }}
                          placeholder="Enter 10-digit phone number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any notes or symptoms"
                          rows={3}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !isConnected}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      Schedule Appointment
                    </button>
                  </form>
                </div>

                {/* Appointments List */}
                {appointments.length > 0 && (
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {appointments.map((appointment, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <p><strong>Department:</strong> {appointment.department}</p>
                          <p><strong>Date & Time:</strong> {new Date(appointment.timestamp * 1000).toLocaleString()}</p>
                          <p><strong>Contact:</strong></p>
                          <p className="ml-4">Email: {appointment.contactEmail}</p>
                          <p className="ml-4">Phone: {appointment.contactPhone}</p>
                          <p><strong>Notes:</strong> {appointment.notes}</p>
                          <p><strong>Status:</strong> {getStatusText(appointment.status)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* My Appointments Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Appointments</h3>
                {loading ? (
                  <div className="text-center py-4">Loading your appointments...</div>
                ) : myAppointments.length > 0 ? (
                  <div className="space-y-8">
                    {/* Pending Appointments */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending Appointments
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myAppointments
                          .filter(appointment => appointment.status === AppointmentStatus.SCHEDULED)
                          .map((appointment, index) => (
                            <div 
                              key={`pending-${index}`}
                              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-yellow-500"
                            >
                              <AppointmentCard appointment={appointment} />
                            </div>
                          ))}
                        {myAppointments.filter(appointment => appointment.status === AppointmentStatus.SCHEDULED).length === 0 && (
                          <div className="col-span-2 text-center py-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No pending appointments</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Confirmed Appointments */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confirmed Appointments
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myAppointments
                          .filter(appointment => appointment.status === AppointmentStatus.CONFIRMED)
                          .map((appointment, index) => (
                            <div 
                              key={`confirmed-${index}`}
                              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500"
                            >
                              <AppointmentCard appointment={appointment} />
                            </div>
                          ))}
                        {myAppointments.filter(appointment => appointment.status === AppointmentStatus.CONFIRMED).length === 0 && (
                          <div className="col-span-2 text-center py-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No confirmed appointments</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cancelled Appointments - Optionally show these */}
                    {myAppointments.some(appointment => appointment.status === AppointmentStatus.CANCELLED) && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Cancelled Appointments
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {myAppointments
                            .filter(appointment => appointment.status === AppointmentStatus.CANCELLED)
                            .map((appointment, index) => (
                              <div 
                                key={`cancelled-${index}`}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500"
                              >
                                <AppointmentCard appointment={appointment} />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">You don't have any scheduled appointments yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
