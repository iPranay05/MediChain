'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Security',
      description: 'Your medical records are secured by blockchain technology, making them tamper-proof and highly secure.',
      icon: '🔒'
    },
    {
      title: 'Privacy',
      description: 'Access to your records is controlled by your unique Aadhar number, ensuring complete privacy.',
      icon: '🛡️'
    },
    {
      title: 'Immutability',
      description: 'Once recorded, your medical history cannot be altered, ensuring accuracy and reliability.',
      icon: '📌'
    },
    {
      title: 'Transparency',
      description: 'All transactions are recorded on the blockchain, providing complete transparency.',
      icon: '👁️'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Healthcare on the <span className="text-blue-600">Blockchain</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Secure, transparent, and efficient healthcare record management powered by blockchain technology
          </p>
          <div className="space-x-4">
            <Link href="/patient" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition">
              Patient Portal
            </Link>
            <Link href="/hospital" className="bg-white text-blue-600 px-8 py-3 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition">
              Hospital Portal
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Blockchain Healthcare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Preview Section */}
      <section className="px-4 py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Earn Health Coins</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get rewarded with Health Coins for every medical record added. Redeem them for exclusive discounts and benefits.
          </p>
          <Link href="/store" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition">
            Visit Store
          </Link>
        </div>
      </section>
    </main>
  );
}
