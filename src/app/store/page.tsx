'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StoreItem {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  coinsRequired: number;
  image: string;
}

export default function Store() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [healthCoins, setHealthCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const storeItems: StoreItem[] = [
    {
      id: 1,
      name: 'Premium Health Checkup',
      description: 'Comprehensive health screening with advanced diagnostics and specialist consultation',
      originalPrice: 8000,
      discountPrice: 6000,
      coinsRequired: 150,
      image: '🏥'
    },
    {
      id: 2,
      name: 'Dental Care Package',
      description: 'Complete dental checkup with cleaning, X-rays, and cavity treatment',
      originalPrice: 5000,
      discountPrice: 3500,
      coinsRequired: 100,
      image: '🦷'
    },
    {
      id: 3,
      name: 'Vision Care Bundle',
      description: 'Eye examination, prescription glasses, and contact lens fitting',
      originalPrice: 4000,
      discountPrice: 3000,
      coinsRequired: 80,
      image: '👁️'
    },
    {
      id: 4,
      name: 'Pharmacy Discount Card',
      description: '25% off on all medications for 3 months',
      originalPrice: 2000,
      discountPrice: 1500,
      coinsRequired: 50,
      image: '💊'
    },
    {
      id: 5,
      name: 'Wellness Package',
      description: 'Yoga classes, nutrition consultation, and fitness assessment',
      originalPrice: 6000,
      discountPrice: 4500,
      coinsRequired: 120,
      image: '🧘'
    },
    {
      id: 6,
      name: 'Lab Test Bundle',
      description: 'Complete blood work, thyroid, vitamin, and hormone panel',
      originalPrice: 4500,
      discountPrice: 3200,
      coinsRequired: 90,
      image: '🔬'
    },
    {
      id: 7,
      name: 'Physiotherapy Sessions',
      description: '5 sessions with certified physiotherapist',
      originalPrice: 3500,
      discountPrice: 2500,
      coinsRequired: 70,
      image: '💆'
    },
    {
      id: 8,
      name: 'Mental Health Care',
      description: '3 counseling sessions with professional therapist',
      originalPrice: 4500,
      discountPrice: 3500,
      coinsRequired: 100,
      image: '🧠'
    },
    {
      id: 9,
      name: 'Vaccination Package',
      description: 'Essential vaccinations including flu shots',
      originalPrice: 3000,
      discountPrice: 2200,
      coinsRequired: 60,
      image: '💉'
    },
    {
      id: 10,
      name: 'Nutrition Consultation',
      description: 'Personalized diet plan and 2 follow-up sessions',
      originalPrice: 2500,
      discountPrice: 1800,
      coinsRequired: 45,
      image: '🥗'
    },
    {
      id: 11,
      name: 'Diagnostic Imaging',
      description: 'MRI or CT scan with specialist consultation',
      originalPrice: 7000,
      discountPrice: 5500,
      coinsRequired: 140,
      image: '📷'
    },
    {
      id: 12,
      name: 'Emergency Care Card',
      description: '20% discount on emergency room visits for 6 months',
      originalPrice: 5000,
      discountPrice: 3800,
      coinsRequired: 110,
      image: '🚑'
    }
  ];

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Here we'll add the logic to fetch health coins balance from blockchain
      // This will be implemented once we deploy the smart contract
      setHealthCoins(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (item: StoreItem) => {
    if (healthCoins < item.coinsRequired) {
      setError('Insufficient health coins');
      return;
    }

    try {
      // Here we'll add the logic to redeem health coins
      // This will be implemented once we deploy the smart contract
      alert('Successfully redeemed! Your discount code will be sent to your registered mobile number.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Health Store</h2>
            <p className="mt-2 text-gray-600">Redeem your Health Coins for exclusive healthcare benefits</p>
          </div>

          <form onSubmit={handleCheckBalance} className="max-w-md mx-auto mb-8">
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
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Checking...' : 'Check Balance'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 max-w-md mx-auto">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {healthCoins > 0 && (
            <div className="bg-green-50 p-4 rounded-md mb-6 max-w-md mx-auto">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-green-700 font-medium">Your Health Coins Balance:</p>
                  <p className="text-green-800 text-xl font-bold">{healthCoins} coins</p>
                </div>
              </div>
            </div>
          )}

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">
              All Items
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
              Health Checkups
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
              Dental Care
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
              Pharmacy
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
              Wellness
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storeItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.id * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-4 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center">
                  {item.image}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 h-20">{item.description}</p>
                <div className="space-y-2">
                  <p className="text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</p>
                  <p className="text-xl font-bold text-green-600">₹{item.discountPrice.toLocaleString()}</p>
                  <div className="flex items-center text-blue-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 12.5l-2-2 1.4-1.4 2 2 3.6-3.6 1.4 1.4-5 5z" />
                    </svg>
                    <p className="text-sm">{item.coinsRequired} Health Coins required</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem(item)}
                  disabled={healthCoins < item.coinsRequired}
                  className={`mt-4 w-full py-2 px-4 rounded-md transition-all duration-300 ${
                    healthCoins >= item.coinsRequired
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {healthCoins >= item.coinsRequired ? 'Redeem Now' : `Need ${item.coinsRequired - healthCoins} more coins`}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
