import React, { useState } from 'react';
import { PatientData } from '../types';
import { Card, Badge, Button, Input, TextArea } from './UI';
import { AIOrchestrator, ChainedResult } from '../lib/ai-orchestrator';
import { ER_CASES } from '../constants/erCases';
import { 
  Brain, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Shield, 
  Users, 
  FileText,
  ChevronRight,
  MapPin,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface TriageProps {
  patients: PatientData[];
  setPatients: React.Dispatch<React.SetStateAction<PatientData[]>>;
}

export default function Triage({ patients, setPatients }: TriageProps) {
  const [loading, setLoading] = useState(false);
  const [chainedResult, setChainedResult] = useState<ChainedResult | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    bp: '',
    hr: '',
    spo2: '',
    symptoms: '',
    injury: '',
    gcs: ''
  });

  const loadTestCase = () => {
    setFormData({
      age: '32',
      gender: 'Male',
      bp: '85/50',
      hr: '135',
      spo2: '89%',
      symptoms: 'Gunshot wound to right upper quadrant. Profuse bleeding, pale, diaphoretic. Decreased breath sounds on right side. GCS 13.',
      injury: 'Penetrating Trauma - GSW',
      gcs: '13'
    });
  };

  const loadRandomCase = () => {
    const randomCase = ER_CASES[Math.floor(Math.random() * ER_CASES.length)];
    setFormData({
      age: (Math.floor(Math.random() * 60) + 18).toString(),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      bp: randomCase.esi_level === 1 ? '85/50' : '120/80',
      hr: randomCase.esi_level === 1 ? '130' : '80',
      spo2: randomCase.esi_level === 1 ? '88%' : '98%',
      symptoms: randomCase.key_symptoms.join(', '),
      injury: randomCase.case_name,
      gcs: randomCase.esi_level === 1 ? '10' : '15'
    });
  };

  const loadEliteDemo = () => {
    setChainedResult({
      triage: {
        esi_level: 1,
        severity: 'critical',
        trauma_type: 'Penetrating Trauma - GSW',
        confidence: 0.99,
        immediate_actions: [
          'Massive Transfusion Protocol (MTP) Activation',
          'Immediate Intubation & Mechanical Ventilation',
          'Right-sided Needle Decompression / Chest Tube',
          'Direct Pressure & Hemostatic Dressing'
        ],
        next_step: 'Immediate OR - Exploratory Laparotomy',
        required_team: ['Trauma Surgery', 'Anesthesiology', 'Blood Bank'],
        justification: 'Patient presents with unstable vitals (BP 85/50, HR 135) and penetrating trauma to RUQ. High risk of solid organ injury and hemorrhagic shock. Requires immediate surgical intervention.',
        activate_or: true,
        surgical_protocol: 'Exploratory Laparotomy'
      },
      actions: {
        airway: ['Rapid Sequence Intubation (RSI)', 'C-Spine Stabilization'],
        breathing: ['Right-sided Needle Decompression', 'Chest Tube Insertion'],
        circulation: ['Level-1 Rapid Infuser', 'MTP Activation', 'Pelvic Binder'],
        disability: ['GCS Monitoring', 'Pupillary Reflex Check'],
        exposure: ['Full Body Scan', 'Exit Wound Search'],
        priority_order: [
          'Airway: Rapid Sequence Intubation (RSI)',
          'Breathing: Right Chest Tube Insertion',
          'Circulation: Level-1 Rapid Infuser / MTP',
          'Disability: GCS Assessment (Current 13)',
          'Exposure: Full Body Scan for Exit Wounds'
        ]
      },
      team: {
        er_lead: 'Dr. Sarah Miller (Trauma)',
        or_lead: 'Dr. James Chen (Chief Surgeon)',
        anesthesiologist: 'Dr. Robert Vance',
        surgeons: ['Dr. Elena Rodriguez', 'Dr. Kevin Park'],
        nurses: {
          er: ['Nurse Alex Reed', 'Nurse Sam Wilson'],
          or: ['Nurse Lisa Wong (Scrub)', 'Nurse David Smith (Circ)']
        },
        support_staff: ['Tech Riley (Radiology)', 'Porter Marcus'],
        or_booking: {
          room_id: 'OR-04 (Hybrid Suite)',
          status: 'ready',
          estimated_start: 'T+0 mins (Immediate)'
        },
        estimated_response_time: 'Immediate'
      },
      emr: {
        summary: '32M GSW to RUQ. Hemodynamically unstable. Positive FAST exam. Transitioning to OR for emergency laparotomy.',
        diagnosis: 'Penetrating Abdominal Trauma / Hemorrhagic Shock',
        procedures: ['Intubation', 'Chest Tube', 'MTP', 'Exploratory Laparotomy (Pending)'],
        medications: ['TXA 1g', 'Fentanyl', 'Rocuronium', 'PRBC/FFP/Plt (1:1:1)'],
        doctor_notes: '### Clinical Impression\nCritical trauma patient with active hemorrhage. \n\n### Plan\n1. **STAT** to OR-04\n2. Continue MTP\n3. Surgical control of bleeding'
      }
    });
  };

  const handleTriage = async () => {
    setLoading(true);
    try {
      const patient: PatientData = {
        id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
        age: parseInt(formData.age),
        gender: formData.gender,
        vitals: {
          bp: formData.bp,
          hr: formData.hr,
          spo2: formData.spo2
        },
        symptoms: formData.symptoms,
        injuryMechanism: formData.injury,
        gcs: formData.gcs ? parseInt(formData.gcs) : undefined,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      const result = await AIOrchestrator.executeFullPipeline(patient);
      setChainedResult(result);
      
      const updatedPatient = {
        ...patient,
        status: result.triage.severity === 'critical' ? 'critical' : 'triaged' as any
      };
      
      setPatients(prev => [updatedPatient, ...prev]);
    } catch (error) {
      console.error("Orchestration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
      {/* Input Section */}
      <div className="space-y-8 overflow-y-auto pr-4 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF4444]/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#FF4444]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Clinical Triage</h2>
              <p className="text-xs text-[#9499A1] font-mono uppercase tracking-wider">AI Decision Support System</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="text-[10px] h-7 px-3 flex items-center justify-center gap-2 border-[#2a2b2e] hover:bg-[#2a2b2e]" onClick={loadTestCase}>
              <Zap className="w-3 h-3 text-[#F27D26]" /> Load Case
            </Button>
            <Button variant="secondary" className="text-[10px] h-7 px-3 flex items-center justify-center gap-2 border-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/10" onClick={loadRandomCase}>
              <Activity className="w-3 h-3" /> Random Case
            </Button>
            <Button variant="secondary" className="text-[10px] h-7 px-3 flex items-center justify-center gap-2 border-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/10" onClick={loadEliteDemo}>
              <Sparkles className="w-3 h-3" /> Elite Demo
            </Button>
          </div>
        </div>

        <Card className="p-8 space-y-6 glass-panel">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label>Patient Age</label>
              <Input 
                type="number" 
                placeholder="Years" 
                className="h-11 bg-[#0D0E10]"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label>Gender</label>
              <select 
                className="w-full h-11 bg-[#0D0E10] border border-[#2a2b2e] rounded-lg px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF4444]/50 transition-all"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label>Blood Pressure</label>
              <Input 
                placeholder="120/80" 
                className="h-11 bg-[#0D0E10]"
                value={formData.bp}
                onChange={e => setFormData({...formData, bp: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label>Heart Rate</label>
              <Input 
                placeholder="bpm" 
                className="h-11 bg-[#0D0E10]"
                value={formData.hr}
                onChange={e => setFormData({...formData, hr: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label>SpO2 Level</label>
              <Input 
                placeholder="%" 
                className="h-11 bg-[#0D0E10]"
                value={formData.spo2}
                onChange={e => setFormData({...formData, spo2: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label>Injury Mechanism</label>
            <Input 
              placeholder="e.g. MVA, Fall from height, Gunshot" 
              className="h-11 bg-[#0D0E10]"
              value={formData.injury}
              onChange={e => setFormData({...formData, injury: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label>Symptoms & Presentation</label>
            <TextArea 
              placeholder="Describe patient symptoms and physical findings..." 
              className="min-h-[120px] bg-[#0D0E10] resize-none"
              value={formData.symptoms}
              onChange={e => setFormData({...formData, symptoms: e.target.value})}
            />
          </div>

          <Button 
            className="w-full h-14 flex items-center justify-center gap-3 text-base font-bold bg-[#FF4444] hover:bg-[#FF5555] shadow-lg shadow-[#FF4444]/20" 
            onClick={handleTriage}
            disabled={loading || !formData.age || !formData.symptoms}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Orchestrating Pipeline...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Run AI Pipeline
              </>
            )}
          </Button>

          {/* OR Resource Map & Staff Stats */}
          <AnimatePresence>
            {chainedResult?.team && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-8 border-t border-[#2a2b2e] mt-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00FF00]/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#00FF00]" />
                    </div>
                    <h3 className="text-sm font-bold tracking-tight">Live OR Resource Map</h3>
                  </div>
                  <Badge variant="success" className="px-3 py-1 font-mono text-[10px]">{chainedResult.team.or_booking.room_id}</Badge>
                </div>

                <div className="relative aspect-[16/10] bg-[#08090A] rounded-xl border border-[#2a2b2e] overflow-hidden p-6">
                  {/* OR Table Schematic */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <div className="w-2/3 h-8 bg-[#00FF00] rounded-full blur-3xl" />
                  </div>
                  
                  <div className="relative h-full w-full border border-dashed border-[#2a2b2e]/50 rounded-lg flex items-center justify-center">
                    <div className="w-28 h-56 bg-[#151619] border border-[#2a2b2e] rounded shadow-2xl flex items-center justify-center">
                      <span className="text-[10px] font-mono text-[#4a4b4e] rotate-90 tracking-[0.2em] uppercase">Surgical Field</span>
                    </div>

                    {/* Staff Positions */}
                    {/* Anesthesia - Head of Bed */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-mono text-blue-400 uppercase font-bold">Anesthesia</p>
                        <p className="text-[11px] text-white font-bold">{chainedResult.team.anesthesiologist.split(' ')[1]}</p>
                      </div>
                    </div>

                    {/* Surgeons - Sides */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-10 flex flex-col items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-[#00FF00]/10 border-2 border-[#00FF00] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                        <Users className="w-4 h-4 text-[#00FF00]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-mono text-[#00FF00] uppercase font-bold">Lead_Surg</p>
                        <p className="text-[11px] text-white font-bold">{chainedResult.team.surgeons[0]?.split(' ')[1]}</p>
                      </div>
                    </div>

                    <div className="absolute top-1/2 -translate-y-1/2 right-10 flex flex-col items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-[#00FF00]/10 border-2 border-[#00FF00] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                        <Users className="w-4 h-4 text-[#00FF00]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-mono text-[#00FF00] uppercase font-bold">Asst_Surg</p>
                        <p className="text-[11px] text-white font-bold">{chainedResult.team.surgeons[1]?.split(' ')[1]}</p>
                      </div>
                    </div>

                    {/* Nurses - Corners */}
                    <div className="absolute bottom-6 left-12 flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 border-2 border-purple-500 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <p className="text-[9px] font-mono text-purple-400 uppercase font-bold">Scrub</p>
                    </div>

                    <div className="absolute bottom-6 right-12 flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 border-2 border-purple-500 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <p className="text-[9px] font-mono text-purple-400 uppercase font-bold">Circ</p>
                    </div>
                  </div>
                </div>

                {/* Staff Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#151619] rounded-xl border border-[#2a2b2e] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-[#9499A1] uppercase mb-1">Lead Surgeon Status</p>
                      <p className="text-sm font-bold text-white">{chainedResult.team.or_lead.split(' ')[1]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-mono text-[#00FF00] font-bold">NOMINAL</p>
                      <div className="w-16 h-1.5 bg-[#2a2b2e] rounded-full mt-2 overflow-hidden">
                        <div className="w-1/3 h-full bg-[#00FF00]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#151619] rounded-xl border border-[#2a2b2e] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-[#9499A1] uppercase mb-1">Anesthesia Monitor</p>
                      <p className="text-sm font-bold text-white">{chainedResult.team.anesthesiologist.split(' ')[1]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-mono text-blue-400 font-bold">STABLE</p>
                      <div className="w-16 h-1.5 bg-[#2a2b2e] rounded-full mt-2 overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Result Section */}
      <div className="space-y-8 overflow-y-auto pr-4 pb-10">
        <AnimatePresence mode="wait">
          {chainedResult ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Triage Result */}
              <Card className={cn(
                "p-8 border-t-4 glass-panel",
                chainedResult.triage.severity === 'critical' ? "border-t-[#FF4444]" : "border-t-[#00FF00]"
              )}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-bold tracking-tight">ESI {chainedResult.triage.esi_level}</h3>
                      <Badge variant={chainedResult.triage.severity === 'critical' ? 'urgent' : 'success'} className="px-3 py-1 text-xs uppercase font-bold">
                        {chainedResult.triage.severity}
                      </Badge>
                    </div>
                    <p className="text-lg text-[#9499A1] font-medium">{chainedResult.triage.trauma_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-mono text-[#4a4b4e] uppercase font-bold tracking-wider">AI Confidence</p>
                    <p className="text-2xl font-bold text-[#00FF00]">{(chainedResult.triage.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[11px] font-mono text-[#9499A1] uppercase mb-3 font-bold tracking-wider">Immediate Life-Saving Actions</p>
                    <div className="grid grid-cols-1 gap-3">
                      {chainedResult.triage.immediate_actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm bg-[#0D0E10] p-4 rounded-xl border border-[#2a2b2e] hover:border-[#00FF00]/30 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-[#00FF00] mt-0.5 shrink-0" />
                          <span className="leading-relaxed font-medium">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Chained Critical Actions */}
              {chainedResult.actions && (
                <Card className="p-8 glass-panel border-l-4 border-l-[#FF4444]">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-[#FF4444]" />
                    <h3 className="text-sm font-mono text-[#9499A1] uppercase tracking-widest font-bold">ATLS Chained Protocol</h3>
                  </div>
                  <div className="space-y-4">
                    {chainedResult.actions.priority_order.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 text-sm group">
                        <span className="w-6 h-6 rounded bg-[#FF4444]/10 text-[#FF4444] font-mono text-xs flex items-center justify-center font-bold">{i+1}</span>
                        <span className="text-white font-medium group-hover:text-[#FF4444] transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Chained Team Allocation */}
              {chainedResult.team && (
                <Card className="p-8 glass-panel border-l-4 border-l-[#00FF00]">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-5 h-5 text-[#00FF00]" />
                    <h3 className="text-sm font-mono text-[#9499A1] uppercase tracking-widest font-bold">Resource Orchestration</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[11px] font-mono text-[#4a4b4e] uppercase font-bold tracking-wider">ER Lead Physician</p>
                      <p className="text-lg font-bold text-white">{chainedResult.team.er_lead}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-mono text-[#4a4b4e] uppercase font-bold tracking-wider">OR Lead Surgeon</p>
                      <p className="text-lg font-bold text-white">{chainedResult.team.or_lead}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Chained EMR Summary */}
              {chainedResult.emr && (
                <Card className="paper-emr p-10 rounded-none relative overflow-hidden">
                  {/* Watermark/Texture */}
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FileText className="w-20 h-20" />
                  </div>
                  
                  <div className="space-y-8 font-serif relative z-10">
                    <div className="flex justify-between items-end border-b-2 border-[#1A1C1E] pb-4">
                      <div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter">Clinical Encounter Record</h4>
                        <p className="text-[10px] font-mono text-gray-500 uppercase mt-1">Generated by ER-Flow AI v2.1</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono font-bold">DATE: {new Date().toLocaleDateString()}</p>
                        <p className="text-[10px] font-mono font-bold text-[#FF4444]">URGENT / STAT</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-sans font-bold uppercase text-gray-500 tracking-widest">Primary Diagnosis</p>
                        <h5 className="text-xl font-bold leading-tight">{chainedResult.emr.diagnosis}</h5>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-sans font-bold uppercase text-gray-500 tracking-widest">Clinical Summary</p>
                        <p className="text-sm leading-relaxed text-[#1A1C1E] font-medium">{chainedResult.emr.summary}</p>
                      </div>

                      <div className="bg-gray-100/50 p-6 rounded-lg border-l-4 border-gray-300">
                        <p className="text-[10px] font-sans font-bold uppercase text-gray-500 tracking-widest mb-3">Physician Directives</p>
                        <div className="text-xs leading-relaxed prose prose-sm max-w-none">
                          <ReactMarkdown>{chainedResult.emr.doctor_notes}</ReactMarkdown>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Shield className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[9px] font-sans font-bold uppercase text-gray-400">Digital Signature</p>
                          <p className="text-xs font-mono font-bold">ER-FLOW-ORCHESTRATOR-SIG-0x4F2</p>
                        </div>
                      </div>
                      <div className="w-24 h-24 opacity-20 grayscale">
                         {/* QR Code Placeholder */}
                         <div className="w-full h-full border-2 border-black p-1">
                            <div className="w-full h-full bg-black" />
                         </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="flex gap-4 pt-6">
                <Button variant="secondary" className="flex-1 h-12 border-[#2a2b2e] hover:bg-[#2a2b2e]" onClick={() => setChainedResult(null)}>Clear Result</Button>
                <Button className="flex-1 h-12 bg-[#FF4444] hover:bg-[#FF5555] font-bold shadow-lg shadow-[#FF4444]/20">Confirm & Dispatch</Button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-16 border-2 border-dashed border-[#2a2b2e] rounded-3xl bg-[#151619]/30">
              <div className="w-20 h-20 bg-[#151619] rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-[#2a2b2e]">
                <Brain className="w-10 h-10 text-[#2a2b2e]" />
              </div>
              <h3 className="text-xl font-bold text-[#E2E4E9]">Awaiting Clinical Input</h3>
              <p className="text-sm text-[#9499A1] mt-3 max-w-xs leading-relaxed">
                Use the form on the left or load a test case to see the full AI orchestration pipeline in action.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


