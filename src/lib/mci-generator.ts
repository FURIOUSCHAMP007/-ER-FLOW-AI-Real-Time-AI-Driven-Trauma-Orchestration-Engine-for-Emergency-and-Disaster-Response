import { MCIScenario } from '../constants/mciScenarios';
import { PatientData } from '../types';

export class MCIGenerator {
  static generatePatients(scenario: MCIScenario): PatientData[] {
    const patients: PatientData[] = [];
    
    for (let i = 0; i < scenario.patientCount; i++) {
      const id = `MCI-${scenario.id.split('_')[1]}-${100 + i}`;
      const age = Math.floor(Math.random() * 70) + 5;
      const gender = Math.random() > 0.5 ? 'Male' : 'Female';
      
      // Determine injury based on distribution
      const rand = Math.random();
      let cumulativeProb = 0;
      let injury = "Unknown";
      
      for (const [type, prob] of Object.entries(scenario.injuryDistribution)) {
        cumulativeProb += prob;
        if (rand <= cumulativeProb) {
          injury = type;
          break;
        }
      }

      // Determine vitals based on severity mix
      const sevRand = Math.random();
      let vitals = { bp: '120/80', hr: '80', spo2: '98%' };
      let symptoms = `Victim of ${scenario.name}. Presenting with ${injury}.`;
      let gcs = 15;

      if (sevRand < scenario.severityMix.red) {
        // Critical
        vitals = { 
          bp: `${Math.floor(Math.random() * 20) + 70}/${Math.floor(Math.random() * 10) + 40}`, 
          hr: `${Math.floor(Math.random() * 40) + 120}`, 
          spo2: `${Math.floor(Math.random() * 10) + 80}%` 
        };
        gcs = Math.floor(Math.random() * 5) + 3;
        symptoms += " Patient is unstable, showing signs of shock.";
      } else if (sevRand < scenario.severityMix.red + scenario.severityMix.yellow) {
        // Urgent
        vitals = { 
          bp: `${Math.floor(Math.random() * 20) + 100}/${Math.floor(Math.random() * 10) + 60}`, 
          hr: `${Math.floor(Math.random() * 20) + 100}`, 
          spo2: `${Math.floor(Math.random() * 5) + 92}%` 
        };
        gcs = Math.floor(Math.random() * 3) + 12;
      }

      patients.push({
        id,
        age,
        gender,
        vitals,
        symptoms,
        injuryMechanism: injury,
        gcs,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    }
    
    return patients;
  }
}
