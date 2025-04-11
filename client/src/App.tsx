import { useEffect, useState } from 'react';
import axios from 'axios';
import LogList from './components/LogList';
import LogFormModal from './components/LogFormModal';
import Overview from './components/Overview';
import { User } from './types';

axios.defaults.withCredentials = true;
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');
  const [refetchSignal, setRefetchSignal] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get<User>(`${API_BASE}/me`);
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await axios.post(`${API_BASE}/auth/logout`);
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 p-6">
      <div className="relative max-w-4xl mx-auto shadow-xl rounded-lg bg-white p-6">
        {user && (
          <button
            onClick={handleLogout}
            title="Logout"
            className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-red-600 transition"
          >
            <i className="fas fa-sign-out-alt text-xl"></i>
          </button>
        )}

        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-6">
          Mental Health Progress Tracker
        </h1>

        {!user ? (
          <div className="text-center mt-10">
            <a
              href={`${API_BASE}/auth/google`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
              <i className="fab fa-google text-xl"></i>
              &nbsp;Sign in with Google
            </a>
          </div>
        ) : (
          <>
            <h2 className="text-xl text-gray-700 mb-4">
              Welcome, {user.name}
            </h2>

            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'logs' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  Daily Logs
                </button>
              </div>

              <button
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                + Add Log
              </button>
            </div>

            {activeTab === 'overview' && <Overview refetchSignal={refetchSignal} />}
            {activeTab === 'logs' && (
              <LogList refetchSignal={refetchSignal} />
            )}

            <LogFormModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onSave={() => {
                setShowModal(false);
                setRefetchSignal((prev) => !prev);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
