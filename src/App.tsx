import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Settings as SettingsIcon, MessageSquare } from 'lucide-react';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  <SettingsIcon className="w-5 h-5 mr-2" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;