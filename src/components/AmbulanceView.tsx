import React, { useState } from 'react';
import { AmbulanceReport, PatientData } from '../types';
import { Card, Badge, Button, TextArea } from './UI';
import { geminiService } from '../services/gemini';
import { Ambulance, Mic, MicOff, Loader2, MapPin, Radio, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AmbulanceViewProps {
  setPatients: React.Dispatch<React.SetStateAction<PatientData[]>>;
}

export default function AmbulanceView({ setPatients }: AmbulanceViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AmbulanceReport | null>(null);

  const handleProcess = async () => {
    if (!voiceText) return;
    setLoading(true);
    try {
      const result = await geminiService.processAmbulanceVoice(voiceText);
      setReport(result);
    } catch (error) {
      console.error("Processing failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (!report) return;
    const newPatient: PatientData = {
      id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
      age: report.age,
      gender: report.gender,
      vitals: report.vitals,
      symptoms: report.notes,
      injuryMechanism: report.injury_type,
      status: report.risk_level.toLowerCase().includes('high') ? 'critical' : 'pending',
      timestamp: new Date().toISOString(),
    };
    setPatients(prev => [newPatient, ...prev]);
    setReport(null);
    setVoiceText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Radio className="w-6 h-6 text-[#FF4444]" />
          <h2 className="text-xl font-bold">Ambulance Field Link</h2>
        </div>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded border border-[#2a2b2e]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF4444]/10 rounded-full flex items-center justify-center">
                <Ambulance className="w-5 h-5 text-[#FF4444]" />
              </div>
              <div>
                <p className="text-sm font-medium">Unit 402 - Inbound</p>
                <p className="text-[10px] font-mono text-[#8E9299]">ETA: 8 MINS • TRAUMA CENTER</p>
              </div>
            </div>
            <Badge variant="urgent">Priority 1</Badge>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <TextArea 
                placeholder="Transcribing paramedic field report..." 
                className="min-h-[200px] pt-12"
                value={voiceText}
                onChange={e => setVoiceText(e.target.value)}
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-[#FF4444] animate-pulse" : "bg-[#4a4b4e]")} />
                <span className="text-[10px] font-mono text-[#8E9299] uppercase">Voice Input</span>
              </div>
              <Button 
                variant={isRecording ? 'primary' : 'secondary'}
                className="absolute top-3 right-3 p-2 rounded-full"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setVoiceText("45 year old male, high speed MVA, driver side impact. GCS 12, BP 90/60, HR 120. Obvious deformity to left femur, active bleeding controlled with tourniquet. Shortness of breath, decreased breath sounds on left.")}
              >
                Load Sample Report
              </Button>
              <Button 
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleProcess}
                disabled={loading || !voiceText}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Process Report
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {report ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="p-6 border-l-4 border-l-[#FF4444]">
                <h3 className="text-sm font-mono text-[#8E9299] uppercase tracking-widest mb-6">Structured Field Report</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase">Patient Info</p>
                      <p className="text-sm font-medium">{report.age}y {report.gender}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase">Injury Type</p>
                      <p className="text-sm font-medium">{report.injury_type}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase">Consciousness</p>
                      <p className="text-sm font-medium">{report.consciousness}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase">Vitals</p>
                      <p className="text-sm font-mono">BP: {report.vitals.bp}</p>
                      <p className="text-sm font-mono">HR: {report.vitals.hr}</p>
                      <p className="text-sm font-mono">SpO2: {report.vitals.spo2}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase">Risk Level</p>
                      <Badge variant={report.risk_level.toLowerCase().includes('high') ? 'urgent' : 'warning'}>
                        {report.risk_level}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#0a0a0a] rounded border border-[#2a2b2e] mb-6">
                  <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">Clinical Notes</p>
                  <p className="text-xs text-[#8E9299] leading-relaxed">{report.notes}</p>
                </div>

                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setReport(null)}>Reject</Button>
                  <Button className="flex-1" onClick={handleAccept}>Accept & Pre-Triage</Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[#2a2b2e] rounded-xl">
              <div className="w-16 h-16 bg-[#151619] rounded-full flex items-center justify-center mb-4">
                <Radio className="w-8 h-8 text-[#2a2b2e]" />
              </div>
              <h3 className="text-lg font-medium text-[#8E9299]">Awaiting Field Data</h3>
              <p className="text-sm text-[#4a4b4e] mt-2 max-w-xs">
                Incoming ambulance reports will be structured here for rapid review.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
