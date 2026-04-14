import React, { useState, useEffect } from 'react';
import { Card, Badge } from './UI';
import { FHIRService } from '../services/fhir-service';
import { Vitals } from '../types';
import { Activity, Heart, Wind, Thermometer, Zap, Link2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface FHIRMonitorProps {
  patientId: string;
  onUpdate?: (vitals: Vitals) => void;
  className?: string;
}

export default function FHIRMonitor({ patientId, onUpdate, className }: FHIRMonitorProps) {
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isConnected) {
      // Simulate real-time FHIR polling (HL7/FHIR standard)
      interval = setInterval(async () => {
        setIsSyncing(true);
        try {
          const newVitals = await FHIRService.getLatestVitals(patientId);
          setVitals(newVitals);
          setLastUpdate(new Date());
          onUpdate?.(newVitals);
        } catch (error) {
          console.error("FHIR Sync Error:", error);
        } finally {
          setTimeout(() => setIsSyncing(false), 500);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => clearInterval(interval);
  }, [isConnected, patientId, onUpdate]);

  const getStatusColor = (val: string, type: 'hr' | 'spo2' | 'bp') => {
    const n = parseInt(val);
    if (type === 'hr') return n > 120 || n < 50 ? 'text-[#FF4444]' : 'text-[#00FF00]';
    if (type === 'spo2') return n < 92 ? 'text-[#FF4444]' : 'text-[#00FF00]';
    return 'text-white';
  };

  return (
    <Card className={cn("p-6 glass-panel border-[#2a2b2e] relative overflow-hidden", className)}>
      {/* Background Pulse Effect */}
      {isConnected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            isConnected ? "bg-[#00FF00]/10 text-[#00FF00]" : "bg-[#2a2b2e] text-[#4a4b4e]"
          )}>
            <Activity className={cn("w-6 h-6", isConnected && "animate-pulse")} />
          </div>
          <div>
            <h3 className="text-sm font-bold">Live Monitor Feed</h3>
            <p className="text-[10px] font-mono text-[#4a4b4e] uppercase tracking-widest">HL7/FHIR Protocol v4.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isSyncing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="success" className="bg-[#00FF00]/20 text-[#00FF00] border-none text-[9px]">
                  <Zap className="w-2 h-2 mr-1 fill-current" /> SYNCING
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsConnected(!isConnected)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
              isConnected 
                ? "bg-[#FF4444]/10 text-[#FF4444] border border-[#FF4444]/20 hover:bg-[#FF4444]/20" 
                : "bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 hover:bg-[#00FF00]/20"
            )}
          >
            <Link2 className="w-3 h-3" />
            {isConnected ? "DISCONNECT MONITOR" : "LINK PATIENT MONITOR"}
          </button>
        </div>
      </div>

      {!isConnected ? (
        <div className="h-40 flex flex-col items-center justify-center text-center space-y-3 border border-dashed border-[#2a2b2e] rounded-xl bg-[#0a0a0a]/50">
          <AlertCircle className="w-8 h-8 text-[#4a4b4e]" />
          <div>
            <p className="text-xs font-bold text-[#8E9299]">No Active FHIR Link</p>
            <p className="text-[10px] text-[#4a4b4e]">Connect to bedside monitor via HL7/FHIR interface</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div className="p-4 bg-[#0a0a0a] border border-[#2a2b2e] rounded-xl group hover:border-[#00FF00]/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-3 h-3 text-[#FF4444]" />
              <span className="text-[9px] font-mono text-[#4a4b4e] uppercase">Heart Rate</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-2xl font-black", vitals ? getStatusColor(vitals.hr, 'hr') : 'text-white')}>
                {vitals?.hr || '--'}
              </span>
              <span className="text-[10px] text-[#4a4b4e]">BPM</span>
            </div>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-[#2a2b2e] rounded-xl group hover:border-[#00FF00]/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-[9px] font-mono text-[#4a4b4e] uppercase">SpO2</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-2xl font-black", vitals ? getStatusColor(vitals.spo2, 'spo2') : 'text-white')}>
                {vitals?.spo2 || '--'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-[#2a2b2e] rounded-xl group hover:border-[#00FF00]/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3 h-3 text-[#FF4444]" />
              <span className="text-[9px] font-mono text-[#4a4b4e] uppercase">Blood Pressure</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">
                {vitals?.bp || '--/--'}
              </span>
              <span className="text-[10px] text-[#4a4b4e]">mmHg</span>
            </div>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-[#2a2b2e] rounded-xl group hover:border-[#00FF00]/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-3 h-3 text-purple-400" />
              <span className="text-[9px] font-mono text-[#4a4b4e] uppercase">Resp Rate</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">
                {vitals?.rr || '--'}
              </span>
              <span className="text-[10px] text-[#4a4b4e]">/min</span>
            </div>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-[#4a4b4e]">
          <span>SOURCE: BEDSIDE_MONITOR_04</span>
          <span>LAST_SYNC: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      )}
    </Card>
  );
}
