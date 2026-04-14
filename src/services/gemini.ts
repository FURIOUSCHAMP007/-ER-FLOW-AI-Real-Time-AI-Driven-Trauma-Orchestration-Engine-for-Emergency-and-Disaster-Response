import { GoogleGenAI, Type } from "@google/genai";
import { 
  TriageResult, 
  AmbulanceReport, 
  CriticalActions, 
  TeamAssignment, 
  HospitalRouting, 
  EMRRecord,
  PatientData,
  Vitals,
  Severity
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429 || JSON.stringify(error).includes('429');
    if (isRateLimit && retries > 0) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

const TRAUMA_DATASET = `
- Penetrating Trauma (Gunshot, Stab)
- Blunt Force Trauma (MVA, Fall, Assault)
- Thermal Injury (Burns)
- Blast Injury
- Crush Injury
- Orthopedic Trauma
- Neurotrauma (TBI, Spinal)
- Multi-system Trauma
`;

export const geminiService = {
  async triagePatient(patient: PatientData): Promise<TriageResult> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an advanced Emergency Room AI Clinical Decision Support System.
STRICT INSTRUCTIONS:
- You MUST respond only in valid JSON.
- No explanations, no extra text.
- Base decisions on emergency medicine protocols (ESI triage, ATLS principles).

INPUT:
Patient Data:
- Vitals: ${JSON.stringify(patient.vitals)}
- Symptoms: ${patient.symptoms}
- Injury Mechanism: ${patient.injuryMechanism}
- Age: ${patient.age}
- GCS (if available): ${patient.gcs || 'N/A'}

AVAILABLE TRAUMA TYPES:
${TRAUMA_DATASET}

SURGICAL TRIGGERS (ACTIVATE OR IMMEDIATELY IF):
- Absolute: Uncontrolled internal bleeding, Penetrating abdominal trauma, Epidural/subdural hematoma, Ruptured spleen/liver, Open fractures with vascular injury, Cardiac tamponade.
- Conditional: BP < 90 mmHg, HR > 120, GCS < 8, FAST scan positive.

TASK:
1. Classify trauma type (must match dataset)
2. Assign ESI level (1–5)
3. Predict severity (mild/moderate/severe/critical)
4. Suggest immediate life-saving actions
5. Recommend next routing (Trauma Bay / CT / OT / ICU)
6. Suggest required medical team
7. Determine if immediate OR activation is required (activate_or: true/false)
8. If activate_or is true, specify the surgical protocol (e.g., Craniotomy, Exploratory Laparotomy, Thoracotomy, ORIF, Skin Graft)

OUTPUT FORMAT (STRICT JSON):
{
  "esi_level": int,
  "trauma_type": "",
  "severity": "",
  "confidence": float,
  "immediate_actions": [],
  "next_step": "",
  "required_team": [],
  "justification": "",
  "activate_or": boolean,
  "surgical_protocol": ""
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      return JSON.parse(response.text || "{}");
    });
  },

  async processAmbulanceVoice(voiceText: string): Promise<AmbulanceReport> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an emergency AI assisting paramedics in an ambulance.
Convert the following unstructured field report into structured clinical data.

INPUT:
"${voiceText}"

OUTPUT JSON:
{
  "age": int,
  "gender": "",
  "injury_type": "",
  "consciousness": "",
  "bleeding": "",
  "vitals": {
    "bp": "",
    "hr": "",
    "spo2": ""
  },
  "risk_level": "",
  "notes": ""
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      return JSON.parse(response.text || "{}");
    });
  },

  async getCriticalActions(traumaType: string, vitals: Vitals, severity: Severity): Promise<CriticalActions> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are a trauma emergency expert.
Given:
- Trauma Type: ${traumaType}
- Vitals: ${JSON.stringify(vitals)}
- Severity: ${severity}

Decide ONLY immediate life-saving interventions.
Follow ATLS protocol: Airway → Breathing → Circulation → Disability → Exposure

PRE-OPERATIVE ER PROTOCOL (IF SURGERY LIKELY):
- Airway: Intubate if needed, Oxygen support.
- Breathing: Fix pneumothorax before surgery.
- Circulation: 2 large-bore IV lines, Start fluids/blood, Control bleeding.
- Labs: CBC, Blood group & crossmatch, Coagulation profile.
- Imaging: FAST scan, CT (if stable).
- Medication: Antibiotics, Pain control.

OUTPUT JSON:
{
  "airway": [],
  "breathing": [],
  "circulation": [],
  "disability": [],
  "exposure": [],
  "priority_order": [],
  "pre_op_labs": [],
  "pre_op_imaging": [],
  "pre_op_meds": []
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      return JSON.parse(response.text || "{}");
    });
  },

  async assignTeam(traumaType: string, severity: Severity, procedure: string, staffList: string): Promise<TeamAssignment> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an ER and OR resource allocation AI.
INPUT:
- Trauma Type: ${traumaType}
- Severity: ${severity}
- Required Procedure: ${procedure}

Available Staff:
${staffList}

TASK:
Select optimal team based on specialization and urgency. Map the transition from ER to OR.
REQUIRED OR TEAM: Surgeon (specialized), Anesthetist, Scrub nurse, Circulating nurse.
TIME TARGET: Decision → Incision < 30 mins.

OUTPUT JSON:
{
  "er_lead": "Name of ER Lead Physician",
  "or_lead": "Name of OR Lead Surgeon",
  "anesthesiologist": "Name of Anesthesiologist",
  "surgeons": ["Surgeon 1", "Surgeon 2"],
  "nurses": {
    "er": ["ER Nurse 1", "ER Nurse 2"],
    "or": ["OR Nurse 1", "OR Nurse 2"]
  },
  "support_staff": ["Tech 1", "Porter 1"],
  "or_booking": {
    "room_id": "OR-01",
    "status": "booked | preparing | ready",
    "estimated_start": "T+15 mins"
  },
  "estimated_response_time": "Immediate | 5 mins | etc"
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      return JSON.parse(response.text || "{}");
    });
  },

  async routeHospital(severity: Severity, careType: string, hospitalData: string): Promise<HospitalRouting> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an emergency routing AI.
INPUT:
Patient Severity: ${severity}
Required Care: ${careType}

Hospitals:
${hospitalData}

TASK:
Select the best hospital based on:
- Distance
- Load
- Specialist availability

OUTPUT JSON:
{
  "selected_hospital": "",
  "eta": "",
  "reason": ""
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      return JSON.parse(response.text || "{}");
    });
  },

  async generateEMR(fullPatientData: string): Promise<EMRRecord> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are a clinical documentation AI.
Generate a structured ER medical record.

INPUT:
${fullPatientData}

OUTPUT:
{
  "summary": "",
  "diagnosis": "",
  "procedures": [],
  "medications": [],
  "doctor_notes": ""
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        }
      });

      return JSON.parse(response.text || "{}");
    });
  }
};
