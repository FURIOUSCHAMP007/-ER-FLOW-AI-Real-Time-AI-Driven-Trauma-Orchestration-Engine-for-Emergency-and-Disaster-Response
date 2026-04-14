/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Ambulance, 
  LayoutDashboard, 
  Stethoscope, 
  Users, 
  FileText, 
  AlertCircle,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Mic,
  MapPin,
  Beaker,
  Home,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { PatientData, Severity } from './types';
import { Card, Badge, Button, Input } from './components/UI';
import HomeDashboard from './components/HomeDashboard';
import Dashboard from './components/Dashboard';
import Triage from './components/Triage';
import AmbulanceView from './components/AmbulanceView';
import CriticalCare from './components/CriticalCare';
import EMRView from './components/EMRView';
import Simulation from './components/Simulation';
import Pipeline from './components/Pipeline';
import DisasterSimulation from './components/DisasterSimulation';

type View = 'home' | 'dashboard' | 'pipeline' | 'triage' | 'ambulance' | 'critical' | 'emr' | 'simulation' | 'disaster';

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');
  const [patients, setPatients] = useState<PatientData[]>([
    {
      id: 'P-1024',
      age: 45,
      gender: 'Male',
      vitals: { bp: '140/90', hr: '110', spo2: '94%' },
      symptoms: 'Chest pain, shortness of breath',
      injuryMechanism: 'Non-traumatic',
      status: 'pending',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'P-1025',
      age: 28,
      gender: 'Female',
      vitals: { bp: '90/60', hr: '130', spo2: '88%' },
      symptoms: 'Multiple lacerations, abdominal pain',
      injuryMechanism: 'MVA - High speed impact',
      status: 'critical',
      timestamp: new Date().toISOString(),
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Patient Pipeline', icon: Activity },
    { id: 'triage', label: 'AI Triage', icon: Stethoscope },
    { id: 'ambulance', label: 'Ambulance Link', icon: Ambulance },
    { id: 'critical', label: 'Critical Care', icon: AlertCircle },
    { id: 'emr', label: 'Medical Records', icon: FileText },
    { id: 'simulation', label: 'AI Evaluation', icon: Beaker },
    { id: 'disaster', label: 'Disaster Mode', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[#2a2b2e] flex flex-col bg-[#0D0E10] z-20">
        <div className="p-8 flex items-center gap-4 border-b border-[#2a2b2e]">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF4444] to-[#CC0000] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF4444]/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none">ER-FLOW <span className="text-[#FF4444]">AI</span></h1>
            <p className="text-[7px] font-mono text-[#4a4b4e] uppercase tracking-wider mt-1 font-bold leading-tight">
              Real-Time Trauma Orchestration Engine<br/>
              Emergency & Disaster Response
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
                activeView === item.id 
                  ? "bg-[#FF4444]/10 text-[#FF4444] shadow-[0_0_20px_rgba(255,68,68,0.1)]" 
                  : "text-[#9499A1] hover:bg-[#151619] hover:text-white"
              )}
            >
              {activeView === item.id && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-[#FF4444] rounded-r-full"
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                activeView === item.id ? "text-[#FF4444]" : "text-[#4a4b4e] group-hover:text-[#9499A1]"
              )} />
              <span className="text-sm font-semibold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-[#2a2b2e]">
          <div className="bg-[#151619] p-4 rounded-2xl border border-[#2a2b2e] shadow-inner">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-[#00FF00] rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 bg-[#00FF00] rounded-full animate-ping opacity-50" />
              </div>
              <span className="text-[10px] font-mono text-[#E2E4E9] uppercase tracking-widest font-bold">System Status</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#4a4b4e] uppercase">Core Engine</span>
                <span className="text-[9px] font-mono text-[#00FF00] font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#4a4b4e] uppercase">AI Model</span>
                <span className="text-[9px] font-mono text-white font-bold">GEMINI-3.1</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-[#2a2b2e] flex items-center justify-between px-10 bg-[#0D0E10]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h2 className="text-[10px] font-mono text-[#4a4b4e] uppercase tracking-[0.3em] font-bold">
                Current_Node
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg font-bold text-white">
                  {navItems.find(n => n.id === activeView)?.label}
                </span>
                <ChevronRight className="w-4 h-4 text-[#2a2b2e]" />
                <span className="text-sm font-medium text-[#9499A1]">Live Feed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-[#151619] rounded-xl border border-[#2a2b2e]">
              <Clock className="w-4 h-4 text-[#FF4444]" />
              <span className="text-sm font-mono font-bold text-white tracking-tight">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className="h-10 w-[1px] bg-[#2a2b2e]" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white">Dr. B. Tech</p>
                <p className="text-[10px] text-[#FF4444] font-mono uppercase font-bold tracking-widest">Trauma Lead</p>
              </div>
              <div className="w-10 h-10 bg-[#FF4444]/10 border border-[#FF4444]/20 rounded-xl flex items-center justify-center text-[#FF4444] font-black text-sm shadow-[0_0_15px_rgba(255,68,68,0.1)]">
                BT
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeView === 'home' && <HomeDashboard onNavigate={(view) => setActiveView(view as View)} />}
              {activeView === 'dashboard' && <Dashboard patients={patients} onSelectPatient={(id) => { setSelectedPatientId(id); setActiveView('critical'); }} />}
              {activeView === 'pipeline' && <Pipeline setPatients={setPatients} />}
              {activeView === 'triage' && <Triage patients={patients} setPatients={setPatients} />}
              {activeView === 'ambulance' && <AmbulanceView setPatients={setPatients} />}
              {activeView === 'critical' && <CriticalCare patient={selectedPatient} />}
              {activeView === 'emr' && <EMRView patient={selectedPatient} />}
              {activeView === 'simulation' && <Simulation />}
              {activeView === 'disaster' && <DisasterSimulation />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

