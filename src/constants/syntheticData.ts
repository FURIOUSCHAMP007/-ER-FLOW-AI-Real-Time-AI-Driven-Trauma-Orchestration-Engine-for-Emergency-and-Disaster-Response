import { PatientData } from "../types";

export const SYNTHETIC_PATIENTS: Partial<PatientData>[] = [
  {
    age: 62,
    gender: "Male",
    vitals: { bp: "80/40", hr: "140", spo2: "85%" },
    symptoms: "Crushing chest pain, cold sweat, cyanosis",
    injuryMechanism: "Non-traumatic - Suspected MI",
    gcs: 13
  },
  {
    age: 19,
    gender: "Female",
    vitals: { bp: "110/70", hr: "95", spo2: "98%" },
    symptoms: "Right lower quadrant pain, nausea, fever",
    injuryMechanism: "Non-traumatic - Suspected Appendicitis",
    gcs: 15
  },
  {
    age: 34,
    gender: "Male",
    vitals: { bp: "100/60", hr: "125", spo2: "92%" },
    symptoms: "Open femur fracture, significant blood loss",
    injuryMechanism: "MVA - Motorcycle vs Wall",
    gcs: 14
  },
  {
    age: 8,
    gender: "Female",
    vitals: { bp: "105/70", hr: "110", spo2: "94%" },
    symptoms: "Wheezing, accessory muscle use, unable to speak in full sentences",
    injuryMechanism: "Asthma Exacerbation",
    gcs: 15
  },
  {
    age: 75,
    gender: "Male",
    vitals: { bp: "190/110", hr: "88", spo2: "96%" },
    symptoms: "Left sided weakness, facial droop, slurred speech",
    injuryMechanism: "Suspected Stroke - Last seen normal 45 mins ago",
    gcs: 14
  },
  {
    age: 25,
    gender: "Female",
    vitals: { bp: "120/80", hr: "80", spo2: "99%" },
    symptoms: "Minor laceration to right hand from kitchen knife",
    injuryMechanism: "Home accident",
    gcs: 15
  },
  {
    age: 42,
    gender: "Male",
    vitals: { bp: "85/50", hr: "135", spo2: "89%" },
    symptoms: "Penetrating abdominal trauma, active evisceration",
    injuryMechanism: "Stab wound to RUQ",
    gcs: 11
  },
  {
    age: 31,
    gender: "Female",
    vitals: { bp: "100/60", hr: "110", spo2: "95%" },
    symptoms: "Severe headache, blown right pupil, rapid decline in consciousness",
    injuryMechanism: "Fall from 15ft - Suspected Epidural Hematoma",
    gcs: 7
  },
  {
    age: 55,
    gender: "Male",
    vitals: { bp: "70/40", hr: "150", spo2: "82%" },
    symptoms: "Blunt chest trauma, muffled heart sounds, distended neck veins",
    injuryMechanism: "Crush injury - Suspected Cardiac Tamponade",
    gcs: 9
  }
];
