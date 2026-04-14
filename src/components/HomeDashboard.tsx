import React from 'react';
import { Card, Button } from './UI';
import { 
  Activity, 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  FileText, 
  ChevronRight, 
  Play,
  ArrowRight,
  Sparkles,
  Database,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeDashboardProps {
  onNavigate: (view: string) => void;
}

export default function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const features = [
    {
      title: "Disaster Mode",
      desc: "Mass Casualty Incident (MCI) simulation. Stress test response for explosions, earthquakes, and more.",
      icon: ShieldAlert,
      color: "text-[#FF4444]",
      bg: "bg-[#FF4444]/10",
      view: "disaster"
    },
    {
      title: "Single Pipeline",
      desc: "The core engine. Link Ambulance, Triage, Critical Care, and EMR into a single automated flow.",
      icon: Activity,
      color: "text-[#00FF00]",
      bg: "bg-[#00FF00]/10",
      view: "pipeline"
    },
    {
      title: "AI Clinical Triage",
      desc: "Advanced trauma classification using Gemini 3.1 Pro. Processes vitals and symptoms in real-time.",
      icon: Brain,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      view: "triage"
    },
    {
      title: "Automated EMR",
      desc: "Instant generation of structured medical records from clinical session data.",
      icon: FileText,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      view: "emr"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF4444]/10 border border-[#FF4444]/20 rounded-full"
        >
          <Sparkles className="w-4 h-4 text-[#FF4444]" />
          <span className="text-[10px] font-mono font-bold text-[#FF4444] uppercase tracking-widest">Next-Gen Trauma Intelligence</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black tracking-tighter leading-tight"
        >
          ER-FLOW <span className="text-[#FF4444]">AI</span> SYSTEM
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-[#9499A1] max-w-2xl mx-auto leading-relaxed"
        >
          A high-performance clinical decision support engine designed to orchestrate 
          trauma response from the field to the operating room.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 pt-4"
        >
          <Button 
            onClick={() => onNavigate('pipeline')}
            className="px-8 py-6 bg-[#FF4444] hover:bg-[#CC0000] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#FF4444]/20 flex items-center gap-3"
          >
            <Zap className="w-5 h-5 fill-current" /> Launch Patient Pipeline
          </Button>
          <Button 
            onClick={() => onNavigate('dashboard')}
            variant="secondary"
            className="px-8 py-6 bg-[#151619] border-[#2a2b2e] text-white font-bold text-lg rounded-2xl flex items-center gap-3"
          >
            Enter Live Dashboard <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      {/* Core Architecture */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
          >
            <Card 
              className="p-8 h-full glass-panel hover:border-[#FF4444]/30 transition-all group cursor-pointer"
              onClick={() => onNavigate(f.view)}
            >
              <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-[#9499A1] leading-relaxed">
                {f.desc}
              </p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* System Specs */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
        <Card className="lg:col-span-2 p-10 glass-panel border-dashed">
          <div className="flex items-center gap-4 mb-8">
            <Database className="w-6 h-6 text-[#FF4444]" />
            <h3 className="text-xl font-bold">Pipeline Orchestration Flow</h3>
          </div>
          <div className="space-y-8">
            <div className="flex items-start gap-6 relative">
              <div className="absolute left-4 top-10 bottom-0 w-[1px] bg-[#2a2b2e]" />
              <div className="w-8 h-8 rounded-full bg-[#FF4444] flex items-center justify-center text-[10px] font-bold z-10">01</div>
              <div>
                <h4 className="font-bold text-white">Data Ingestion</h4>
                <p className="text-sm text-[#9499A1]">Paramedic voice reports or manual ER entry are normalized into clinical JSON structures.</p>
              </div>
            </div>
            <div className="flex items-start gap-6 relative">
              <div className="absolute left-4 top-10 bottom-0 w-[1px] bg-[#2a2b2e]" />
              <div className="w-8 h-8 rounded-full bg-[#FF4444] flex items-center justify-center text-[10px] font-bold z-10">02</div>
              <div>
                <h4 className="font-bold text-white">AI Reasoning (Gemini)</h4>
                <p className="text-sm text-[#9499A1]">The engine performs ESI triage, predicts severity, and suggests immediate life-saving interventions.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-8 h-8 rounded-full bg-[#FF4444] flex items-center justify-center text-[10px] font-bold z-10">03</div>
              <div>
                <h4 className="font-bold text-white">Resource Lock</h4>
                <p className="text-sm text-[#9499A1]">Teams are assigned, ORs are booked, and the EMR is finalized automatically.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-10 bg-gradient-to-br from-[#FF4444]/5 to-transparent border-[#FF4444]/10">
          <div className="flex items-center gap-4 mb-8">
            <Lock className="w-6 h-6 text-[#FF4444]" />
            <h3 className="text-xl font-bold">Security & Compliance</h3>
          </div>
          <ul className="space-y-6">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF4444] mt-1.5" />
              <p className="text-sm text-[#9499A1]"><strong className="text-white">HIPAA Ready:</strong> All PII is redacted before AI processing.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF4444] mt-1.5" />
              <p className="text-sm text-[#9499A1]"><strong className="text-white">Audit Log:</strong> Every AI decision is traced with a unique execution ID.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF4444] mt-1.5" />
              <p className="text-sm text-[#9499A1]"><strong className="text-white">Human-in-the-Loop:</strong> AI suggestions require clinician confirmation for critical actions.</p>
            </li>
          </ul>
        </Card>
      </section>

      {/* Tech Stack Section */}
      <section className="pt-10 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-sm font-mono text-[#FF4444] uppercase tracking-[0.4em] font-bold">Engine_Architecture</h3>
          <h2 className="text-3xl font-black tracking-tighter">THE TECH STACK</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: "Gemini 3.1 Pro", icon: Brain, desc: "AI Reasoning" },
            { name: "React 18", icon: Activity, desc: "UI Framework" },
            { name: "TypeScript", icon: Shield, desc: "Type Safety" },
            { name: "Tailwind CSS", icon: Zap, desc: "Utility Styling" },
            { name: "Motion", icon: Play, desc: "Animations" },
            { name: "Recharts", icon: FileText, desc: "Data Viz" },
            { name: "Lucide", icon: Sparkles, desc: "Iconography" }
          ].map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (i * 0.05) }}
            >
              <Card className="p-4 glass-panel border-[#2a2b2e] flex flex-col items-center text-center group hover:border-[#FF4444]/30 transition-all">
                <div className="w-10 h-10 bg-[#151619] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <tech.icon className="w-5 h-5 text-[#8E9299] group-hover:text-[#FF4444]" />
                </div>
                <p className="text-[11px] font-bold text-white mb-1">{tech.name}</p>
                <p className="text-[9px] font-mono text-[#4a4b4e] uppercase tracking-wider">{tech.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
