'use client';

import { useState, useEffect } from 'react';

// SET YOUR SECRET ADMIN KEY HERE
const SECRET_ADMIN_KEY = 'admin1234'; 

export default function AdminPage() {
  const [accessKey, setAccessKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form state for creating new user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [fullName, setFullName] = useState('');
  const [creating, setCreating] = useState(false);

  // State for listing and managing users
  const [userList, setUserList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  // Handle PIN verification
  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === SECRET_ADMIN_KEY) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Admin Security Key!');
    }
  };

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUserList(data.users);
      } else if (data.error) {
        alert(`Failed to load users: ${data.error}`);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Handle creating a new customer
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, handle, fullName }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Success! Customer "${handle}" created.`);
        setEmail('');
        setPassword('');
        setHandle('');
        setFullName('');
        fetchUsers();
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  // Handle resetting a customer's password
  const handleResetPassword = async (userId: string) => {
    if (!newPassword || newPassword.length < 8) {
      alert('Please enter a new password with at least 8 characters.');
      return;
    }

    setResetting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Password updated successfully!');
        setNewPassword('');
        setSelectedUserId('');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  // 1. Show Security Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-center">
        <form onSubmit={handleVerifyKey} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl text-center">
          <div className="text-3xl">🔒</div>
          <h1 className="text-xl font-bold">Admin Restricted Access</h1>
          <p className="text-xs text-slate-400">Enter the master admin key to access this panel.</p>
          
          <input
            type="password"
            required
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="Enter Admin Key"
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm text-center focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition text-sm"
          >
            Unlock Admin Panel
          </button>
        </form>
      </div>
    );
  }

  // 2. Render Full Admin Panel once unlocked
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center space-y-8">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <h1 className="text-xl font-bold">Admin Control Center</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs text-red-400 hover:underline px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20"
        >
          🔒 Lock Panel
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CREATE CUSTOMER FORM */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-lg font-bold border-b border-slate-800 pb-2">Add New Customer</h2>

          <form onSubmit={handleCreateCustomer} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400">Customer Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@email.com"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Handle / Custom URL</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. mishab"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Customer Full Name"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Set 8-Letter Password</label>
              <input
                type="text"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 mt-1 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition text-sm mt-2"
            >
              {creating ? 'Creating Customer...' : 'Create Customer Account'}
            </button>
          </form>
        </div>

        {/* CUSTOMER LIST & PASSWORD RESET */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-lg font-bold">Existing Customers ({userList.length})</h2>
              <button onClick={fetchUsers} className="text-xs text-blue-400 hover:underline">
                🔄 Refresh
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {loadingUsers ? (
                <p className="text-xs text-slate-400 text-center py-4">Loading customer list...</p>
              ) : userList.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No customers registered yet.</p>
              ) : (
                userList.map((usr) => (
                  <div
                    key={usr.id}
                    className={`p-3 rounded-xl border transition text-xs flex flex-col gap-2 ${
                      selectedUserId === usr.id
                        ? 'bg-slate-800 border-blue-500'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-400 text-sm">@{usr.handle}</span>
                          {usr.handle !== 'no-handle' && (
                            <a
                              href={`https://nexxconnect.vercel.app/${usr.handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                            >
                              🔗 View
                            </a>
                          )}
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{usr.email}</p>
                        {usr.fullName && <p className="text-slate-300 text-[11px]">👤 {usr.fullName}</p>}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedUserId(selectedUserId === usr.id ? '' : usr.id);
                          setNewPassword('');
                        }}
                        className="text-xs text-blue-400 hover:underline shrink-0"
                      >
                        {selectedUserId === usr.id ? 'Cancel' : 'Reset Pass'}
                      </button>
                    </div>

                    {selectedUserId === usr.id && (
                      <div className="mt-2 pt-2 border-t border-slate-800 space-y-2">
                        <input
                          type="text"
                          minLength={8}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new 8-char password"
                          className="w-full p-2 bg-slate-900 rounded-lg border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleResetPassword(usr.id)}
                          disabled={resetting}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-lg text-white transition text-xs"
                        >
                          {resetting ? 'Updating...' : 'Save New Password'}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}