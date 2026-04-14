import React, { useState } from 'react';
import { Card, Badge, Button } from './UI';
import { MCI_SCENARIOS, MCIScenario } from '../constants/mciScenarios';
import { MCIGenerator } from '../lib/mci-generator';
import { AIOrchestrator, ChainedResult } from '../lib/ai-orchestrator';
import { 
  ShieldAlert, 
  Flame, 
  Wind, 
  Truck, 
  Skull, 
  Activity, 
  Loader2, 
  ChevronRight,
  AlertTriangle,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function DisasterSimulation() {
  const [selectedScenario, setSelectedScenario] = useState<MCIScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{ patient: any, result: ChainedResult }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isWaiting, setIsWaiting] = useState(false);

  const startMCI = async (scenario: MCIScenario) => {
    setSelectedScenario(scenario);
    setIsRunning(true);
    setResults([]);
    setIsWaiting(false);
    
    const patients = MCIGenerator.generatePatients(scenario);
    
    for (let i = 0; i < patients.length; i++) {
      setCurrentIndex(i);
      try {
        const chainedResult = await AIOrchestrator.executeFullPipeline(patients[i]);
        setResults(prev => [...prev, { patient: patients[i], result: chainedResult }]);
        setIsWaiting(false);
      } catch (error: any) {
        console.error(`MCI Simulation failed for patient ${i}:`, error);
        if (error?.message?.includes('429') || error?.status === 429) {
          setIsWaiting(true);
          // Wait longer if rate limited
          await new Promise(r => setTimeout(r, 5000));
          i--; // Retry this patient
          continue;
        }
      }
      
      // Delay to respect rate limits and make it visual
      await new Promise(r => setTimeout(r, 1500));
    }
    
    setIsRunning(false);
    setCurrentIndex(-1);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Explosion': return <Flame className="w-5 h-5" />;
      case 'Natural Disaster': return <Wind className="w-5 h-5" />;
      case 'Transportation': return <Truck className="w-5 h-5" />;
      case 'Violence': return <ShieldAlert className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const stats = {
    total: results.length,
    critical: results.filter(r => r.result.triage.severity === 'critical').length,
    orActivations: results.filter(r => r.result.triage.activate_or).length,
    blackTags: results.filter(r => r.result.triage.esi_level === 1 && r.result.triage.confidence < 0.6).length, // Simulated Black Tag logic
  };

  const chartData = [
    { name: 'Critical (Red)', value: stats.critical, color: '#FF4444' },
    { name: 'Urgent (Yellow)', value: results.filter(r => r.result.triage.severity === 'moderate').length, color: '#F27D26' },
    { name: 'Stable (Green)', value: results.filter(r => r.result.triage.severity === 'mild').length, color: '#00FF00' },
    { name: 'Expectant (Black)', value: stats.blackTags, color: '#4a4b4e' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF4444]/10 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-[#FF4444]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Disaster Preparedness & MCI Mode</h2>
            <p className="text-sm text-[#8E9299]">Stress testing hospital response for Mass Casualty Incidents.</p>
          </div>
        </div>
        {isRunning && (
          <div className="flex items-center gap-3">
            {isWaiting && (
              <Badge variant="urgent" className="animate-pulse">Rate Limit Recovery...</Badge>
            )}
            <Badge variant="urgent" className="px-4 py-1">
              <Loader2 className="w-3 h-3 mr-2 animate-spin inline" />
              SIMULATING: {selectedScenario?.name}
            </Badge>
          </div>
        )}
      </div>

      {!selectedScenario || !isRunning ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MCI_SCENARIOS.map((scenario) => (
            <Card 
              key={scenario.id} 
              className="p-6 glass-panel hover:border-[#FF4444]/50 transition-all group cursor-pointer"
              onClick={() => startMCI(scenario)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#FF4444]/10 rounded-xl flex items-center justify-center text-[#FF4444] group-hover:scale-110 transition-transform">
                  {getCategoryIcon(scenario.category)}
                </div>
                <Badge variant={scenario.difficulty === 'Hard' ? 'urgent' : 'warning'}>
                  {scenario.difficulty}
                </Badge>
              </div>
              <h3 className="text-lg font-bold mb-2">{scenario.name}</h3>
              <p className="text-xs text-[#8E9299] mb-4 line-clamp-2">{scenario.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono uppercase text-[#4a4b4e]">
                  <span>Est. Casualties</span>
                  <span className="text-white font-bold">{scenario.patientCount}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase text-[#4a4b4e]">
                  <span>Primary Stress</span>
                  <span className="text-[#FF4444] font-bold">{scenario.resourcePressure[0]}</span>
                </div>
              </div>

              <Button className="w-full mt-6 bg-[#151619] border border-[#2a2b2e] group-hover:bg-[#FF4444] group-hover:border-[#FF4444] transition-all">
                Initialize MCI Response
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Simulation Feed */}
          <Card className="lg:col-span-2 p-8 glass-panel space-y-6">
            <div className="flex items-center justify-between border-b border-[#2a2b2e] pb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF4444]" />
                Live Triage Stream
              </h3>
              <span className="text-xs font-mono text-[#4a4b4e]">
                PROCESSED: {results.length} / {selectedScenario.patientCount}
              </span>
            </div>

            <div className="h-[500px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {[...results].reverse().map((res, i) => (
                  <motion.div
                    key={res.patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-[#0D0E10] border border-[#2a2b2e] rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-10 rounded-full",
                        res.result.triage.severity === 'critical' ? 'bg-[#FF4444]' : 
                        res.result.triage.severity === 'moderate' ? 'bg-[#F27D26]' : 'bg-[#00FF00]'
                      )} />
                      <div>
                        <p className="text-xs font-bold">{res.patient.id} • {res.patient.age}y {res.patient.gender}</p>
                        <p className="text-[10px] text-[#8E9299]">{res.result.triage.trauma_type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={res.result.triage.activate_or ? 'urgent' : 'default'}>
                        {res.result.triage.activate_or ? 'OR ACTIVATED' : res.result.triage.next_step}
                      </Badge>
                      <p className="text-[9px] font-mono text-[#4a4b4e] mt-1">CONF: {(res.result.triage.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isRunning && (
                <div className="p-4 border border-dashed border-[#2a2b2e] rounded-xl flex items-center justify-center gap-3">
                  <Loader2 className="w-4 h-4 text-[#FF4444] animate-spin" />
                  <span className="text-xs font-mono text-[#4a4b4e] uppercase">AI Analyzing Victim {currentIndex + 1}...</span>
                </div>
              )}
            </div>
          </Card>

          {/* Real-time Analytics */}
          <div className="space-y-6">
            <Card className="p-6 glass-panel">
              <h3 className="text-sm font-mono text-[#8E9299] uppercase tracking-widest mb-6">MCI Impact Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0D0E10] rounded-xl border border-[#2a2b2e]">
                  <p className="text-[10px] text-[#4a4b4e] uppercase mb-1">Critical (Red)</p>
                  <p className="text-2xl font-bold text-[#FF4444]">{stats.critical}</p>
                </div>
                <div className="p-4 bg-[#0D0E10] rounded-xl border border-[#2a2b2e]">
                  <p className="text-[10px] text-[#4a4b4e] uppercase mb-1">OR Required</p>
                  <p className="text-2xl font-bold text-[#00FF00]">{stats.orActivations}</p>
                </div>
                <div className="p-4 bg-[#0D0E10] rounded-xl border border-[#2a2b2e]">
                  <p className="text-[10px] text-[#4a4b4e] uppercase mb-1">Expectant</p>
                  <p className="text-2xl font-bold text-[#8E9299]">{stats.blackTags}</p>
                </div>
                <div className="p-4 bg-[#0D0E10] rounded-xl border border-[#2a2b2e]">
                  <p className="text-[10px] text-[#4a4b4e] uppercase mb-1">Total Victims</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-panel h-[300px]">
              <h3 className="text-sm font-mono text-[#8E9299] uppercase tracking-widest mb-6">Triage Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2b2e" vertical={false} />
                  <XAxis dataKey="name" stroke="#4a4b4e" fontSize={10} />
                  <YAxis stroke="#4a4b4e" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151619', border: '1px solid #2a2b2e', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {!isRunning && (
              <Button 
                className="w-full h-14 bg-[#FF4444] hover:bg-[#CC0000] font-bold"
                onClick={() => setSelectedScenario(null)}
              >
                Reset Simulation
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
