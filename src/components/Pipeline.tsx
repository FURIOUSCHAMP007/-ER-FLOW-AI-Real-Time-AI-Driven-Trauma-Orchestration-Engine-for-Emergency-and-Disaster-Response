import React, { useState } from 'react';
import { Card, Badge, Button, Input, TextArea } from './UI';
import { AIOrchestrator, ChainedResult } from '../lib/ai-orchestrator';
import { PatientData } from '../types';
import { 
  Ambulance, 
  Stethoscope, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Zap,
  Mic,
  Brain,
  Shield,
  Clock,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import CriticalCare from './CriticalCare';
import EMRView from './EMRView';

interface PipelineProps {
  setPatients: React.Dispatch<React.SetStateAction<PatientData[]>>;
}

type PipelineStep = 'intake' | 'triage' | 'critical' | 'emr';

export default function Pipeline({ setPatients }: PipelineProps) {
  const [step, setStep] = useState<PipelineStep>('intake');
  const [loading, setLoading] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [chainedResult, setChainedResult] = useState<ChainedResult | null>(null);
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);

  const steps = [
    { id: 'intake', label: 'Ambulance Intake', icon: Ambulance },
    { id: 'triage', label: 'AI Triage', icon: Stethoscope },
    { id: 'critical', label: 'Critical Care', icon: AlertCircle },
    { id: 'emr', label: 'Medical Records', icon: FileText },
  ];

  const handleStartPipeline = async () => {
    if (!voiceText.trim()) return;
    
    setLoading(true);
    try {
      // 1. Process voice text to get structured patient data
      const ambulanceReport = await AIOrchestrator.gemini.processAmbulanceVoice(voiceText);
      
      const patient: PatientData = {
        id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
        age: ambulanceReport.age || 45,
        gender: ambulanceReport.gender || 'Male',
        vitals: ambulanceReport.vitals || { bp: '120/80', hr: '80', spo2: '98%' },
        symptoms: ambulanceReport.notes || voiceText,
        injuryMechanism: ambulanceReport.injury_type || 'Unknown',
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      setCurrentPatient(patient);
      
      // 2. Execute full pipeline
      const result = await AIOrchestrator.executeFullPipeline(patient);
      setChainedResult(result);
      
      // 3. Move to next step
      setStep('triage');
      
      // 4. Update global patients list
      setPatients(prev => [patient, ...prev]);
    } catch (error) {
      console.error('Pipeline failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPipeline = () => {
    setStep('intake');
    setVoiceText('');
    setChainedResult(null);
    setCurrentPatient(null);
  };

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Pipeline Stepper */}
      <div className="flex items-center justify-between px-12 relative">
        <div className="absolute top-1/2 left-12 right-12 h-[2px] bg-[#2a2b2e] -translate-y-1/2 z-0" />
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isCompleted = steps.findIndex(x => x.id === step) > i;
          const isActive = s.id === step;
          
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                isActive ? "bg-[#FF4444] border-[#FF4444] shadow-[0_0_30px_rgba(255,68,68,0.3)] scale-110" : 
                isCompleted ? "bg-[#00FF00]/10 border-[#00FF00] text-[#00FF00]" : 
                "bg-[#0D0E10] border-[#2a2b2e] text-[#4a4b4e]"
              )}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <span className={cn(
                "text-[10px] font-mono uppercase tracking-widest font-bold",
                isActive ? "text-white" : isCompleted ? "text-[#00FF00]" : "text-[#4a4b4e]"
              )}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stage Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'intake' && (
            <motion.div
              key="intake"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#FF4444]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#FF4444]/20 shadow-2xl">
                  <Ambulance className="w-10 h-10 text-[#FF4444]" />
                </div>
                <h2 className="text-4xl font-black tracking-tight">Emergency Intake</h2>
                <p className="text-[#9499A1] max-w-md mx-auto">
                  Provide the unstructured ambulance field report. The AI will structurize, triage, and orchestrate the entire hospital response.
                </p>
              </div>

              <Card className="w-full p-8 glass-panel space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[#4a4b4e] uppercase tracking-widest">Field Report Input</label>
                    <Badge variant="urgent" className="text-[9px] border-[#2a2b2e] text-[#FF4444]">
                      <Mic className="w-3 h-3 mr-1" /> Voice-to-Text Ready
                    </Badge>
                  </div>
                  <TextArea 
                    placeholder="e.g. 32-year-old male, GSW to RUQ, BP 85/50, HR 135, GCS 13. FAST positive. ETA 5 mins..."
                    className="min-h-[200px] bg-[#0D0E10] border-[#2a2b2e] text-lg leading-relaxed"
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="secondary" 
                    className="flex-1 h-14 border-[#2a2b2e] hover:bg-[#2a2b2e]"
                    onClick={() => setVoiceText("MVA victim, 28F, high speed impact. Unconscious, GCS 7. BP 90/60, HR 120. Obvious deformity to left femur and pelvic instability. ETA 3 minutes.")}
                  >
                    Load Sample Report
                  </Button>
                  <Button 
                    className="flex-[2] h-14 bg-[#FF4444] hover:bg-[#FF5555] font-bold text-lg shadow-lg shadow-[#FF4444]/20"
                    onClick={handleStartPipeline}
                    disabled={loading || !voiceText.trim()}
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                    {loading ? 'Orchestrating AI Pipeline...' : 'Activate Full AI Pipeline'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'triage' && chainedResult && (
            <motion.div
              key="triage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-[#FF4444]/10 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-[#FF4444]" />
                  </div>
                  <h3 className="text-2xl font-bold">AI Triage Assessment</h3>
                </div>
                
                <Card className="p-8 glass-panel space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase tracking-widest">Severity Level</p>
                      <h4 className={cn(
                        "text-5xl font-black tracking-tighter",
                        chainedResult.triage.severity === 'critical' ? 'text-[#FF4444]' : 'text-[#F27D26]'
                      )}>
                        {chainedResult.triage.severity.toUpperCase()}
                      </h4>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-[#FF4444] text-white px-4 py-1 text-lg font-bold">
                        ESI LEVEL {chainedResult.triage.esi_level}
                      </Badge>
                      <p className="text-[10px] font-mono text-[#4a4b4e] mt-2 uppercase">Confidence: {(chainedResult.triage.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-[#9499A1] leading-relaxed italic">"{chainedResult.triage.justification}"</p>
                    <div className="h-[1px] bg-[#2a2b2e]" />
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">Trauma Type</p>
                        <p className="font-bold text-white">{chainedResult.triage.trauma_type}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">Next Routing</p>
                        <p className="font-bold text-[#00FF00]">{chainedResult.triage.next_step}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-[#4a4b4e] uppercase tracking-widest">Immediate Actions Required</p>
                    <div className="grid grid-cols-1 gap-2">
                      {chainedResult.triage.immediate_actions.map((action, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#151619] border border-[#2a2b2e] rounded-xl">
                          <div className="w-6 h-6 bg-[#FF4444]/10 rounded-lg flex items-center justify-center text-[#FF4444] text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex flex-col justify-center space-y-8">
                <div className="bg-[#151619] p-8 rounded-3xl border border-[#2a2b2e] space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#00FF00]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">AI Orchestration Ready</h4>
                      <p className="text-sm text-[#9499A1]">Critical care protocols and team assignments generated.</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full h-16 bg-[#00FF00] hover:bg-[#00CC00] text-black font-black text-xl shadow-[0_0_30px_rgba(0,255,0,0.2)]"
                    onClick={() => setStep('critical')}
                  >
                    Proceed to Critical Care & OR
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-6 bg-[#0D0E10] border-[#2a2b2e]">
                    <Activity className="w-5 h-5 text-[#FF4444] mb-3" />
                    <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-1">Vital Signs</p>
                    <p className="text-lg font-bold">{currentPatient?.vitals.bp} | {currentPatient?.vitals.hr} bpm</p>
                  </Card>
                  <Card className="p-6 bg-[#0D0E10] border-[#2a2b2e]">
                    <Brain className="w-5 h-5 text-[#F27D26] mb-3" />
                    <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-1">Mental Status</p>
                    <p className="text-lg font-bold">GCS {currentPatient?.gcs || '15'}</p>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'critical' && chainedResult && (
            <motion.div
              key="critical"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#FF4444]/10 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-[#FF4444]" />
                  </div>
                  <h3 className="text-2xl font-bold">Critical Care & Surgical Orchestration</h3>
                </div>
                <Button 
                  className="bg-[#00FF00] hover:bg-[#00CC00] text-black font-bold"
                  onClick={() => setStep('emr')}
                >
                  Finalize EMR & Discharge
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                <CriticalCare 
                  patient={currentPatient} 
                  initialActions={chainedResult.actions}
                  initialTeam={chainedResult.team}
                />
              </div>
            </motion.div>
          )}

          {step === 'emr' && chainedResult && (
            <motion.div
              key="emr"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#FF4444]/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#FF4444]" />
                  </div>
                  <h3 className="text-2xl font-bold">Final Medical Documentation</h3>
                </div>
                <Button 
                  variant="secondary"
                  className="border-[#2a2b2e] hover:bg-[#2a2b2e]"
                  onClick={resetPipeline}
                >
                  Start New Pipeline
                  <Activity className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                <EMRView 
                  patient={currentPatient} 
                  initialRecord={chainedResult.emr}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
