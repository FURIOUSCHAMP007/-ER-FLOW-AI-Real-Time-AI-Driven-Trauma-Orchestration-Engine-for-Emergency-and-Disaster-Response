import { geminiService } from "../services/gemini";
import { PatientData, TriageResult, CriticalActions, TeamAssignment, EMRRecord } from "../types";

export interface ChainedResult {
  triage: TriageResult;
  actions?: CriticalActions;
  team?: TeamAssignment;
  emr?: EMRRecord;
}

export class AIOrchestrator {
  static gemini = geminiService;

  /**
   * Rule engine to detect immediate surgical triggers based on vitals and trauma type.
   */
  static evaluateSurgicalTriggers(patient: PatientData): { activate_or: boolean, reason: string } {
    const { vitals, gcs, injuryMechanism } = patient;
    const bpValue = parseInt(vitals.bp.split('/')[0]);
    const hrValue = parseInt(vitals.hr);

    // Absolute Indications (Keywords in injury mechanism or symptoms)
    const absoluteKeywords = [
      'internal bleeding', 'penetrating', 'stab', 'gunshot', 
      'hematoma', 'ruptured', 'vascular injury', 'tamponade'
    ];
    
    const hasAbsoluteIndication = absoluteKeywords.some(kw => 
      injuryMechanism.toLowerCase().includes(kw) || 
      patient.symptoms.toLowerCase().includes(kw)
    );

    if (hasAbsoluteIndication) {
      return { activate_or: true, reason: "Absolute surgical indication detected (Penetrating/Internal Bleeding)" };
    }

    // Conditional Triggers
    if (bpValue < 90) return { activate_or: true, reason: "Hypotension (BP < 90) - High risk of shock" };
    if (hrValue > 120) return { activate_or: true, reason: "Tachycardia (HR > 120) - Potential internal hemorrhage" };
    if (gcs && gcs < 8) return { activate_or: true, reason: "Severe Neurological Impairment (GCS < 8)" };

    return { activate_or: false, reason: "No immediate surgical triggers detected" };
  }

  /**
   * Executes a full clinical pipeline for a patient.
   * Chaining: Triage -> (if critical) Critical Actions -> Team Assignment -> EMR Summary
   */
  static async executeFullPipeline(patient: PatientData): Promise<ChainedResult> {
    console.log(`[Orchestrator] Starting pipeline for ${patient.id}`);
    
    // Step 0: Rule Engine Pre-check
    const ruleCheck = this.evaluateSurgicalTriggers(patient);
    if (ruleCheck.activate_or) {
      console.log(`[Orchestrator] Rule Engine Triggered: ${ruleCheck.reason}`);
    }

    // Step 1: Triage (Always required)
    const triage = await geminiService.triagePatient(patient);
    
    // Override with rule engine if needed
    if (ruleCheck.activate_or) {
      triage.activate_or = true;
      triage.severity = 'critical';
      triage.esi_level = 1;
      triage.justification = `${ruleCheck.reason}. ${triage.justification}`;
    }

    const result: ChainedResult = { triage };

    // Step 2: Conditional Chaining for Critical Cases
    if (triage.severity === 'critical' || triage.esi_level <= 2 || triage.activate_or) {
      console.log(`[Orchestrator] Critical severity detected. Chaining advanced protocols.`);
      
      const [actions, team] = await Promise.all([
        geminiService.getCriticalActions(triage.trauma_type, patient.vitals, triage.severity),
        geminiService.assignTeam(
          triage.trauma_type, 
          triage.severity, 
          triage.surgical_protocol || triage.next_step, 
          "Dr. Miller (Trauma Surgeon), Dr. Chen (Neurosurgeon), Dr. Sarah (Anesthetist), Nurse Alex (Scrub), Nurse Sam (Circulating), Tech Riley"
        )
      ]);
      
      result.actions = actions;
      result.team = team;
    }

    // Step 3: Final EMR Generation
    const fullContext = JSON.stringify({
      patient,
      triage,
      actions: result.actions,
      team: result.team
    });
    
    result.emr = await geminiService.generateEMR(fullContext);
    
    console.log(`[Orchestrator] Pipeline complete for ${patient.id}`);
    return result;
  }
}
