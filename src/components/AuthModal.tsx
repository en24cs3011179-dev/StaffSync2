import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, KeyRound, Shield, CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';
import { createSimulatedJWT } from '../services/hrmDataService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  users: User[];
  onRegisterUser: (data: Partial<User>) => User;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  users,
  onRegisterUser,
}) => {
  const [activeTab, setActiveTab] = useState<'persona' | 'login' | 'register'>('persona');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('employee');
  const [regDept, setRegDept] = useState('Engineering');
  const [regDesignation, setRegDesignation] = useState('Software Engineer');

  // Token inspector
  const [inspectToken, setInspectToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPersona = (u: User) => {
    const token = createSimulatedJWT(u);
    setInspectToken(token);
    setTimeout(() => {
      onLoginSuccess(u);
      onClose();
    }, 300);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const found = users.find((u) => u.email.toLowerCase() === emailInput.trim().toLowerCase());
    if (!found) {
      setErrorMsg('No user record matches this email address. Please select a demo persona or register.');
      return;
    }
    const token = createSimulatedJWT(found);
    setInspectToken(token);
    setTimeout(() => {
      onLoginSuccess(found);
      onClose();
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Name and email are required.');
      return;
    }
    const newUser = onRegisterUser({
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      department: regDept,
      designation: regDesignation,
    });
    const token = createSimulatedJWT(newUser);
    setInspectToken(token);
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Enterprise Access & Authentication</h2>
              <p className="text-xs text-slate-500">JWT Token Simulation with Role-Based Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Mode Selector */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => {
                setActiveTab('persona');
                setErrorMsg('');
              }}
              className={`py-1.5 rounded-md transition-colors ${
                activeTab === 'persona' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demo Personas
            </button>
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`py-1.5 rounded-md transition-colors ${
                activeTab === 'login' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In (Email)
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
              className={`py-1.5 rounded-md transition-colors ${
                activeTab === 'register' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register New
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        {/* Tab 1: Demo Personas */}
        {activeTab === 'persona' && (
          <div className="p-6 space-y-3">
            <div className="text-xs text-slate-600">
              Select an authorized organization role to log in with pre-configured permissions:
            </div>

            {users.slice(0, 3).map((u) => (
              <button
                key={u.id}
                onClick={() => handleSelectPersona(u)}
                className="w-full flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {u.name.substring(0, 2)}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                      <span>{u.name}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {u.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{u.designation} · {u.department}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        )}

        {/* Tab 2: Standard Sign In */}
        {activeTab === 'login' && (
          <form onSubmit={handleEmailLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. sophia.chen@korehr.internal"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                (Demo environment accepts any password for existing directory emails)
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                Sign In with JWT Auth
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Liam Martinez"
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. liam.martinez@korehr.internal"
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR Personnel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                value={regDesignation}
                onChange={(e) => setRegDesignation(e.target.value)}
                placeholder="e.g. Cloud Engineer"
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account & Issue JWT</span>
              </button>
            </div>
          </form>
        )}

        {/* Security & Token Inspector Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure SHA-256 HMAC Signatures</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Claims: sub, role, iat, exp</span>
        </div>
      </div>
    </div>
  );
};
