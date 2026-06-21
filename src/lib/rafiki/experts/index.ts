// experts/index.ts — registers all 14 Rafiki experts in priority order.

import { activeListeningExpert } from './activeListening';
import { clinicalReasonerExpert } from './clinicalReasoner';
import { renalReasonerExpert } from './renalReasoner';
import { medsReasonerExpert } from './medsReasoner';
import { perinatalReasonerExpert } from './perinatalReasoner';
import { bibliotherapyExpert } from './bibliotherapy';
import { cbtReframeExpert } from './cbtReframe';
import { crisisExpert } from './crisis';
import { faithInformedExpert } from './faithInformed';
import { familyRelationshipExpert } from './familyRelationship';
import { goalsValuesExpert } from './goalsValues';
import { jumlaExpert } from './jumla';
import { labsInterpreter } from './labsInterpreter';
import { medicationLiteracyExpert } from './medicationLiteracy';
import { motivationalInterviewingExpert } from './motivationalInterviewing';
import { psychoEducationExpert } from './psychoEducation';
import { pumziCoach } from './pumziCoach';
import { remindersExpert } from './reminders';
import { sleepHygieneExpert } from './sleepHygiene';
import { substanceUseExpert } from './substanceUse';
import { triageExpert } from './triage';
import type { RafikiExpert } from '../types';

/** Order matters only for ties (router breaks equal scores by registration order).
 *  Crisis sits first so any tied safety-critical hit lands there. Jumla last. */
export const allExperts: RafikiExpert[] = [
  crisisExpert,                       // safety-critical first
  triageExpert,                       // assessment-driven
  // Federated sister engines (sovereign Laetoli stack)
  renalReasonerExpert,                // TibaFigo — renal
  perinatalReasonerExpert,            // TibaMama — perinatal
  clinicalReasonerExpert,             // TibaAI  — clinical reasoning
  medsReasonerExpert,                 // TibaAfya — meds/pharmacy
  activeListeningExpert,              // emotion-led
  cbtReframeExpert,                   // distortion-led
  motivationalInterviewingExpert,     // ambivalence-led
  substanceUseExpert,                 // substance-led
  familyRelationshipExpert,           // relational
  medicationLiteracyExpert,           // med questions
  sleepHygieneExpert,                 // sleep
  pumziCoach,                         // breathing coach (routes to /pumzi)
  labsInterpreter,                    // lab values → plain-Swahili interp
  psychoEducationExpert,              // topic education
  goalsValuesExpert,                  // values
  bibliotherapyExpert,                // books
  faithInformedExpert,                // opt-in faith
  remindersExpert,                    // scheduling
  jumlaExpert,                        // fallback — must stay last
];

export {
  clinicalReasonerExpert,
  renalReasonerExpert,
  medsReasonerExpert,
  perinatalReasonerExpert,
  activeListeningExpert,
  bibliotherapyExpert,
  cbtReframeExpert,
  crisisExpert,
  faithInformedExpert,
  familyRelationshipExpert,
  goalsValuesExpert,
  jumlaExpert,
  labsInterpreter,
  medicationLiteracyExpert,
  motivationalInterviewingExpert,
  psychoEducationExpert,
  pumziCoach,
  remindersExpert,
  sleepHygieneExpert,
  substanceUseExpert,
  triageExpert,
};
