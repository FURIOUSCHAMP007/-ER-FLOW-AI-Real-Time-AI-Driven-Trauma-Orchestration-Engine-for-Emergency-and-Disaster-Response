export interface MCIScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  patientCount: number;
  injuryDistribution: {
    [key: string]: number; // percentage
  };
  resourcePressure: string[];
  severityMix: {
    red: number;
    yellow: number;
    green: number;
    black: number;
  };
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const MCI_SCENARIOS: MCIScenario[] = [
  {
    id: "MCI_001",
    name: "Industrial Chemical Explosion",
    category: "Explosion",
    description: "A massive explosion at a local chemical plant has resulted in multiple casualties with chemical burns and blast injuries.",
    patientCount: 35,
    injuryDistribution: {
      "Chemical Burns": 0.4,
      "Blast Lung": 0.2,
      "Fractures": 0.2,
      "Head Injury": 0.2
    },
    resourcePressure: ["ICU", "Ventilator", "Burn Unit"],
    severityMix: {
      red: 0.4,
      yellow: 0.3,
      green: 0.2,
      black: 0.1
    },
    difficulty: 'Hard'
  },
  {
    id: "MCI_002",
    name: "Major Earthquake (Urban Collapse)",
    category: "Natural Disaster",
    description: "A 7.2 magnitude earthquake has caused several high-rise buildings to collapse in the city center.",
    patientCount: 50,
    injuryDistribution: {
      "Crush Syndrome": 0.5,
      "Polytrauma": 0.3,
      "Head Injury": 0.2
    },
    resourcePressure: ["Dialysis", "OR", "Trauma Bay"],
    severityMix: {
      red: 0.5,
      yellow: 0.2,
      green: 0.1,
      black: 0.2
    },
    difficulty: 'Hard'
  },
  {
    id: "MCI_003",
    name: "Multi-Vehicle Highway Pile-up",
    category: "Transportation",
    description: "Dense fog led to a 40-car pile-up on the main highway, involving several passenger buses.",
    patientCount: 25,
    injuryDistribution: {
      "Blunt Force Trauma": 0.6,
      "Internal Bleeding": 0.2,
      "Fractures": 0.2
    },
    resourcePressure: ["OR", "Trauma Surgeons", "Blood Bank"],
    severityMix: {
      red: 0.3,
      yellow: 0.4,
      green: 0.3,
      black: 0.0
    },
    difficulty: 'Medium'
  },
  {
    id: "MCI_004",
    name: "Mass Shooting (Public Mall)",
    category: "Violence",
    description: "An active shooter event at a crowded shopping mall with multiple gunshot victims.",
    patientCount: 20,
    injuryDistribution: {
      "Gunshot Wound": 0.8,
      "Hemorrhage": 0.2
    },
    resourcePressure: ["OR", "Blood Bank", "ICU"],
    severityMix: {
      red: 0.6,
      yellow: 0.2,
      green: 0.1,
      black: 0.1
    },
    difficulty: 'Hard'
  },
  {
    id: "MCI_005",
    name: "Flash Flood Surge",
    category: "Natural Disaster",
    description: "Sudden flash flooding in a low-lying residential area has trapped many residents.",
    patientCount: 30,
    injuryDistribution: {
      "Drowning/Aspiration": 0.4,
      "Hypothermia": 0.4,
      "Lacerations": 0.2
    },
    resourcePressure: ["ER Beds", "Ventilators"],
    severityMix: {
      red: 0.2,
      yellow: 0.5,
      green: 0.3,
      black: 0.0
    },
    difficulty: 'Medium'
  }
];
