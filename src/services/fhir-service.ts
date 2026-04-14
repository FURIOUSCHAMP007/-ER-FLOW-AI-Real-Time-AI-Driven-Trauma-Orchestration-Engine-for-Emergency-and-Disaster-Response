import { Vitals } from '../types';

/**
 * Mock FHIR Observation Resource Structure
 */
export interface FHIRObservation {
  resourceType: "Observation";
  id: string;
  status: "final" | "preliminary";
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
  };
  effectiveDateTime: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  component?: Array<{
    code: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
      text: string;
    };
    valueQuantity: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
  }>;
}

export class FHIRService {
  /**
   * Simulates fetching a FHIR Observation bundle for a patient
   */
  static async getLatestVitals(patientId: string): Promise<Vitals> {
    // In a real app, this would be:
    // const response = await fetch(`https://fhir-server.com/Observation?patient=${patientId}&_sort=-date&_count=5`);
    // const bundle = await response.json();
    
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mocking a FHIR response for BP (LOINC 85354-9), HR (LOINC 8867-4), SpO2 (LOINC 2708-6)
    return {
      bp: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 60}`,
      hr: `${Math.floor(Math.random() * 40) + 70}`,
      spo2: `${Math.floor(Math.random() * 5) + 94}%`,
      temp: `${(Math.random() * 2 + 36.5).toFixed(1)}°C`,
      rr: `${Math.floor(Math.random() * 8) + 12}`
    };
  }

  /**
   * Converts a standard Vitals object to a FHIR Observation resource (for EMR export)
   */
  static convertToFHIR(patientId: string, vitals: Vitals): FHIRObservation[] {
    const timestamp = new Date().toISOString();
    const observations: FHIRObservation[] = [];

    // Blood Pressure (Component Observation)
    if (vitals.bp) {
      const [sys, dia] = vitals.bp.split('/').map(Number);
      observations.push({
        resourceType: "Observation",
        id: `bp-${Date.now()}`,
        status: "final",
        code: {
          coding: [{ system: "http://loinc.org", code: "85354-9", display: "Blood pressure panel with all children" }],
          text: "Blood Pressure"
        },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: timestamp,
        component: [
          {
            code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }], text: "Systolic" },
            valueQuantity: { value: sys, unit: "mmHg", system: "http://unitsofmeasure.org", code: "mm[Hg]" }
          },
          {
            code: { coding: [{ system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }], text: "Diastolic" },
            valueQuantity: { value: dia, unit: "mmHg", system: "http://unitsofmeasure.org", code: "mm[Hg]" }
          }
        ]
      });
    }

    // Heart Rate
    if (vitals.hr) {
      observations.push({
        resourceType: "Observation",
        id: `hr-${Date.now()}`,
        status: "final",
        code: {
          coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }],
          text: "Heart Rate"
        },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: timestamp,
        valueQuantity: { value: Number(vitals.hr), unit: "bpm", system: "http://unitsofmeasure.org", code: "/min" }
      });
    }

    return observations;
  }
}
