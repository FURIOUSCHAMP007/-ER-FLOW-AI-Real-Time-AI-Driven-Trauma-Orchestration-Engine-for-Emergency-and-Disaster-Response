import React from 'react';
import { PatientData } from '../types';
import { Card, Badge, Button } from './UI';
import { Activity, Clock, User, AlertTriangle, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface DashboardProps {
  patients: PatientData[];
  onSelectPatient: (id: string) => void;
}

const data = [
  { time: '08:00', load: 12 },
  { time: '10:00', load: 18 },
  { time: '12:00', load: 25 },
  { time: '14:00', load: 22 },
  { time: '16:00', load: 30 },
  { time: '18:00', load: 28 },
];

export default function Dashboard({ patients, onSelectPatient }: DashboardProps) {
  const criticalCount = patients.filter(p => p.status === 'critical').length;
  const pendingCount = patients.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-8 border-l-4 border-l-[#FF4444] glass-panel hover:translate-y-[-4px] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-mono text-[#9499A1] uppercase tracking-widest mb-2 font-bold">Critical Cases</p>
              <h3 className="text-4xl font-black tracking-tighter">{criticalCount}</h3>
            </div>
            <div className="w-12 h-12 bg-[#FF4444]/10 rounded-xl flex items-center justify-center shadow-lg shadow-[#FF4444]/10">
              <AlertTriangle className="w-6 h-6 text-[#FF4444]" />
            </div>
          </div>
        </Card>

        <Card className="p-8 border-l-4 border-l-[#F27D26] glass-panel hover:translate-y-[-4px] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-mono text-[#9499A1] uppercase tracking-widest mb-2 font-bold">Pending Triage</p>
              <h3 className="text-4xl font-black tracking-tighter">{pendingCount}</h3>
            </div>
            <div className="w-12 h-12 bg-[#F27D26]/10 rounded-xl flex items-center justify-center shadow-lg shadow-[#F27D26]/10">
              <Clock className="w-6 h-6 text-[#F27D26]" />
            </div>
          </div>
        </Card>

        <Card className="p-8 border-l-4 border-l-[#00FF00] glass-panel hover:translate-y-[-4px] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-mono text-[#9499A1] uppercase tracking-widest mb-2 font-bold">Total Active</p>
              <h3 className="text-4xl font-black tracking-tighter">{patients.length}</h3>
            </div>
            <div className="w-12 h-12 bg-[#00FF00]/10 rounded-xl flex items-center justify-center shadow-lg shadow-[#00FF00]/10">
              <Activity className="w-6 h-6 text-[#00FF00]" />
            </div>
          </div>
        </Card>

        <Card className="p-8 border-l-4 border-l-[#9499A1] glass-panel hover:translate-y-[-4px] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-mono text-[#9499A1] uppercase tracking-widest mb-2 font-bold">Avg Wait Time</p>
              <h3 className="text-4xl font-black tracking-tighter">14<span className="text-lg font-bold text-[#9499A1] ml-1">min</span></h3>
            </div>
            <div className="w-12 h-12 bg-[#2a2b2e] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#9499A1]" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Patient List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-[#FF4444] rounded-full" />
              <h3 className="text-xl font-bold">Active Patient Feed</h3>
            </div>
            <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-[#9499A1] hover:text-white">View Full Registry</Button>
          </div>
          <div className="space-y-4">
            {patients.map((patient) => (
              <Card 
                key={patient.id} 
                className="p-6 glass-panel hover:border-[#FF4444]/50 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => onSelectPatient(patient.id)}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner",
                      patient.status === 'critical' ? "bg-[#FF4444]/10 text-[#FF4444]" : "bg-[#0D0E10] text-[#4a4b4e]"
                    )}>
                      {patient.id.split('-')[1]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold">{patient.id}</h4>
                        <Badge variant={patient.status === 'critical' ? 'urgent' : 'warning'} className="px-2 py-0.5 text-[10px] font-bold uppercase">
                          {patient.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#9499A1] font-medium">{patient.age}y • {patient.gender} • {patient.injuryMechanism}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase font-bold tracking-widest mb-1">Live Vitals</p>
                      <p className="text-sm font-mono font-bold text-white">BP: {patient.vitals.bp} <span className="text-[#4a4b4e] mx-1">|</span> HR: {patient.vitals.hr}</p>
                    </div>
                    <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 bg-[#FF4444] text-white border-none font-bold px-6">
                      Open File
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ER Load Chart */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-[#00FF00] rounded-full" />
            <h3 className="text-xl font-bold">ER Load Analysis</h3>
          </div>
          <Card className="p-8 glass-panel">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1b1e" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#4a4b4e" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#4a4b4e" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151619', border: '1px solid #2a2b2e', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#FF4444', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9499A1', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#FF4444" 
                    strokeWidth={3} 
                    dot={{ fill: '#FF4444', r: 5, strokeWidth: 2, stroke: '#0D0E10' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#FF4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 pt-8 border-t border-[#2a2b2e]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-[#9499A1] uppercase tracking-widest">Staffing Efficiency</span>
                <span className="text-xs font-mono text-[#00FF00] font-bold">OPTIMAL (85%)</span>
              </div>
              <div className="w-full bg-[#0D0E10] h-2 rounded-full overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-[#00FF00] to-[#00CC00] h-full w-[85%] shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
