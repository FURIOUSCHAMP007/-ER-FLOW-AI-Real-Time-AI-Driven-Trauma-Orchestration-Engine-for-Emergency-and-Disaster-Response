export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';

export interface Vitals {
  bp: string;
  hr: string;
  spo2: string;
  temp?: string;
  rr?: string;
}

export interface PatientData {
  id: string;
  age: number;
  gender: string;
  vitals: Vitals;
  symptoms: string;
  injuryMechanism: string;
  gcs?: number;
  timestamp: string;
  status: 'triaged' | 'pending' | 'critical' | 'discharged';
}

export interface TriageResult {
  esi_level: number;
  trauma_type: string;
  severity: Severity;
  confidence: number;
  immediate_actions: string[];
  next_step: string;
  required_team: string[];
  justification: string;
  activate_or: boolean;
  surgical_protocol?: string;
}

export interface AmbulanceReport {
  age: number;
  gender: string;
  injury_type: string;
  consciousness: string;
  bleeding: string;
  vitals: Vitals;
  risk_level: string;
  notes: string;
}

export interface CriticalActions {
  airway: string[];
  breathing: string[];
  circulation: string[];
  disability: string[];
  exposure: string[];
  priority_order: string[];
  pre_op_labs?: string[];
  pre_op_imaging?: string[];
  pre_op_meds?: string[];
}

export interface TeamAssignment {
  er_lead: string;
  or_lead: string;
  anesthesiologist: string;
  surgeons: string[];
  nurses: {
    er: string[];
    or: string[];
  };
  support_staff: string[];
  or_booking: {
    room_id: string;
    status: 'booked' | 'preparing' | 'ready';
    estimated_start: string;
  };
  estimated_response_time: string;
}

export interface HospitalRouting {
  selected_hospital: string;
  eta: string;
  reason: string;
}

export interface EMRRecord {
  summary: string;
  diagnosis: string;
  procedures: string[];
  medications: string[];
  doctor_notes: string;
}
