import React, { useState, useEffect } from 'react';
import { PatientData, EMRRecord } from '../types';
import { Card, Badge, Button } from './UI';
import { geminiService } from '../services/gemini';
import { FileText, Download, Share2, Loader2, CheckCircle2, History } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface EMRViewProps {
  patient?: PatientData;
  initialRecord?: EMRRecord | null;
}

export default function EMRView({ patient, initialRecord }: EMRViewProps) {
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<EMRRecord | null>(initialRecord || null);

  useEffect(() => {
    if (initialRecord) setRecord(initialRecord);
  }, [initialRecord]);

  useEffect(() => {
    if (patient && !initialRecord) {
      handleGenerate();
    }
  }, [patient]);

  const handleGenerate = async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const result = await geminiService.generateEMR(JSON.stringify(patient));
      setRecord(result);
    } catch (error) {
      console.error("EMR generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <FileText className="w-12 h-12 text-[#2a2b2e] mb-4" />
        <h3 className="text-lg font-medium text-[#8E9299]">No Patient Selected</h3>
        <p className="text-sm text-[#4a4b4e] mt-2">Select a patient to view or generate their medical record.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#2a2b2e] rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#8E9299]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Electronic Medical Record</h2>
            <p className="text-sm text-[#8E9299]">ID: {patient.id} • Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-[#FF4444] animate-spin" />
          <p className="text-sm font-mono text-[#8E9299] animate-pulse">COMPILING CLINICAL DATA...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="p-8 bg-white text-black font-serif">
            <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">ER-Flow Medical Center</h1>
                <p className="text-xs font-sans text-gray-500 uppercase">Emergency Department • Level 1 Trauma</p>
              </div>
              <div className="text-right font-sans">
                <p className="text-xs font-bold uppercase">Record #: {patient.id}</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 font-sans">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Patient Information</p>
                <p className="text-sm font-bold">NAME: [CONFIDENTIAL]</p>
                <p className="text-sm">AGE: {patient.age} | GENDER: {patient.gender}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Admission Vitals</p>
                <p className="text-sm font-mono">BP: {patient.vitals.bp} | HR: {patient.vitals.hr} | SpO2: {patient.vitals.spo2}</p>
              </div>
            </div>

            {record && (
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold uppercase border-b border-gray-200 pb-1 mb-3">Clinical Summary</h3>
                  <p className="text-sm leading-relaxed">{record.summary}</p>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase border-b border-gray-200 pb-1 mb-3">Primary Diagnosis</h3>
                  <p className="text-sm font-bold">{record.diagnosis}</p>
                </section>

                <div className="grid grid-cols-2 gap-8">
                  <section>
                    <h3 className="text-xs font-bold uppercase border-b border-gray-200 pb-1 mb-3">Procedures Performed</h3>
                    <ul className="text-sm space-y-1">
                      {record.procedures.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 bg-black rounded-full shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-xs font-bold uppercase border-b border-gray-200 pb-1 mb-3">Medications Administered</h3>
                    <ul className="text-sm space-y-1">
                      {record.medications.map((m, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 bg-black rounded-full shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className="bg-gray-50 p-4 rounded border border-gray-100">
                  <h3 className="text-xs font-bold uppercase mb-2">Physician Notes</h3>
                  <div className="text-xs italic text-gray-600 leading-relaxed">
                    <ReactMarkdown>{record.doctor_notes}</ReactMarkdown>
                  </div>
                </section>
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-end font-sans">
              <div>
                <div className="w-32 h-8 border-b border-black mb-1" />
                <p className="text-[10px] font-bold uppercase">Attending Physician Signature</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400">GENERATED BY ER-FLOW AI ENGINE</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-[#8E9299]" />
              <h3 className="text-sm font-medium">Audit Trail</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8E9299]">Record Created</span>
                <span className="font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8E9299]">AI Triage Completed</span>
                <span className="font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8E9299]">Trauma Alert Activated</span>
                <span className="font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
