import React, { useState, useEffect } from 'react';
import { PatientData, CriticalActions, TeamAssignment } from '../types';
import { Card, Badge, Button } from './UI';
import FHIRMonitor from './FHIRMonitor';
import { geminiService } from '../services/gemini';
import { AlertCircle, Shield, Users, Activity, Loader2, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CriticalCareProps {
  patient?: PatientData;
  initialActions?: CriticalActions | null;
  initialTeam?: TeamAssignment | null;
}

export default function CriticalCare({ patient, initialActions, initialTeam }: CriticalCareProps) {
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState<CriticalActions | null>(initialActions || null);
  const [team, setTeam] = useState<TeamAssignment | null>(initialTeam || null);

  useEffect(() => {
    if (initialActions) setActions(initialActions);
    if (initialTeam) setTeam(initialTeam);
  }, [initialActions, initialTeam]);

  useEffect(() => {
    if (patient && patient.status === 'critical' && !initialActions) {
      handleAnalyze();
    }
  }, [patient]);

  const handleAnalyze = async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const [actionResult, teamResult] = await Promise.all([
        geminiService.getCriticalActions(patient.injuryMechanism, patient.vitals, 'critical'),
        geminiService.assignTeam(patient.injuryMechanism, 'critical', 'Emergency Stabilization', 'Dr. Smith (Trauma), Dr. Jones (Ortho), Nurse Sarah, Nurse Mike, Tech Dave')
      ]);
      setActions(actionResult);
      setTeam(teamResult);
    } catch (error) {
      console.error("Critical analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <AlertCircle className="w-12 h-12 text-[#2a2b2e] mb-4" />
        <h3 className="text-lg font-medium text-[#8E9299]">No Critical Patient Selected</h3>
        <p className="text-sm text-[#4a4b4e] mt-2">Select a patient from the dashboard to view critical care protocols.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF4444]/10 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-[#FF4444]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Critical Care Protocol</h2>
            <p className="text-sm text-[#8E9299]">Patient: {patient.id} • {patient.age}y {patient.gender}</p>
          </div>
        </div>
        <Badge variant="urgent" className="px-4 py-1 text-sm">CRITICAL STATUS</Badge>
      </div>

      <FHIRMonitor 
        patientId={patient.id} 
        onUpdate={(newVitals) => {
          console.log("Live Vitals Update:", newVitals);
        }}
      />

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-[#FF4444] animate-spin" />
          <p className="text-sm font-mono text-[#8E9299] animate-pulse">GENERATING ATLS PROTOCOL...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ATLS Protocol */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-[#FF4444]" />
                <h3 className="text-sm font-mono text-[#8E9299] uppercase tracking-widest">ATLS Primary Survey</h3>
              </div>

              <div className="space-y-6">
                {actions && (
                  <>
                    {[
                      { label: 'A - Airway', data: actions.airway, color: 'text-blue-400' },
                      { label: 'B - Breathing', data: actions.breathing, color: 'text-cyan-400' },
                      { label: 'C - Circulation', data: actions.circulation, color: 'text-red-400' },
                      { label: 'D - Disability', data: actions.disability, color: 'text-purple-400' },
                      { label: 'E - Exposure', data: actions.exposure, color: 'text-orange-400' },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-6">
                        <div className="w-32 shrink-0">
                          <p className={cn("text-xs font-bold uppercase tracking-wider", step.color)}>{step.label}</p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {step.data.map((item, j) => (
                            <div key={j} className="flex items-start gap-2 text-sm text-[#8E9299]">
                              <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-[#2a2b2e]" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Pre-Op Protocols */}
                    {(actions.pre_op_labs || actions.pre_op_imaging || actions.pre_op_meds) && (
                      <div className="pt-6 border-t border-[#2a2b2e] space-y-6">
                        <h4 className="text-xs font-mono text-[#FF4444] uppercase tracking-widest">Pre-Operative Preparation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {actions.pre_op_labs && (
                            <div>
                              <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">Required Labs</p>
                              <div className="space-y-1">
                                {actions.pre_op_labs.map((l, i) => (
                                  <p key={i} className="text-xs text-[#8E9299] flex items-center gap-2">
                                    <div className="w-1 h-1 bg-[#FF4444] rounded-full" /> {l}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          {actions.pre_op_imaging && (
                            <div>
                              <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">Imaging Suite</p>
                              <div className="space-y-1">
                                {actions.pre_op_imaging.map((im, i) => (
                                  <p key={i} className="text-xs text-[#8E9299] flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full" /> {im}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          {actions.pre_op_meds && (
                            <div>
                              <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">Medications</p>
                              <div className="space-y-1">
                                {actions.pre_op_meds.map((m, i) => (
                                  <p key={i} className="text-xs text-[#8E9299] flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full" /> {m}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-[#FF4444]/5 border-[#FF4444]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono text-[#FF4444] uppercase tracking-widest">Priority Intervention Order</h3>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF4444]" />
                  <span className="text-[10px] font-mono text-[#FF4444]">TARGET: DECISION → INCISION &lt; 30 MINS</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {actions?.priority_order.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#0a0a0a] border border-[#FF4444]/30 px-3 py-2 rounded text-sm font-medium">
                    <span className="text-[#FF4444] font-mono">{i + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Team Assignment & OR Mapping */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-[#00FF00]" />
                <h3 className="text-sm font-mono text-[#8E9299] uppercase tracking-widest">Resource Orchestration</h3>
              </div>

              {team && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">ER Lead</p>
                      <div className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded border border-[#2a2b2e]">
                        <div className="w-6 h-6 bg-[#FF4444] rounded flex items-center justify-center font-bold text-[10px]">ER</div>
                        <p className="text-xs font-medium">{team.er_lead}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">OR Lead</p>
                      <div className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded border border-[#2a2b2e]">
                        <div className="w-6 h-6 bg-[#00FF00] rounded flex items-center justify-center font-bold text-[10px]">OR</div>
                        <p className="text-xs font-medium">{team.or_lead}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">Anesthesiology</p>
                    <div className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded border border-[#2a2b2e]">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <p className="text-xs font-medium">{team.anesthesiologist}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">Surgical Team</p>
                    <div className="space-y-1">
                      {team.surgeons.map((s, i) => (
                        <p key={i} className="text-xs text-[#8E9299] flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-[#00FF00]" /> {s}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">ER Nurses</p>
                      <div className="space-y-1">
                        {team.nurses.er.map((n, i) => (
                          <p key={i} className="text-[10px] text-[#8E9299]">{n}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#4a4b4e] uppercase mb-2">OR Nurses</p>
                      <div className="space-y-1">
                        {team.nurses.or.map((n, i) => (
                          <p key={i} className="text-[10px] text-[#8E9299]">{n}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2a2b2e]">
                    <p className="text-[10px] font-mono text-[#8E9299] uppercase mb-3">OR Booking Status</p>
                    <div className="bg-[#0a0a0a] p-3 rounded border border-[#2a2b2e]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-white">{team.or_booking.room_id}</span>
                        <Badge variant={team.or_booking.status === 'ready' ? 'success' : 'warning'}>
                          {team.or_booking.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[#8E9299]">Est. Start</span>
                        <span className="text-[10px] font-mono text-white">{team.or_booking.estimated_start}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Button className="w-full py-4 bg-[#FF4444] hover:bg-[#FF6666] text-white font-bold tracking-widest uppercase text-xs">
              Confirm OR Transfer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
