import { z } from 'zod';

// Base personal data schema
const personalDataSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().optional(),
  age: z.string().min(1, 'Возраст обязателен'),
  weight: z.string().min(1, 'Вес обязателен'),
  country: z.string().min(1, 'Страна обязательна'),
  city: z.string().min(1, 'Город обязателен'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие на обработку персональных данных',
  }),
});

// Women's questionnaire schema
export const womenQuestionnaireSchema = personalDataSchema.extend({
  waterIntake: z.string().min(1, 'Обязательное поле'),
  covid: z.string().optional(),
  covidComplications: z.string().optional(),
  hair: z.string().optional(),
  teeth: z.string().optional(),
  digestion: z.string().optional(),
  stones: z.string().optional(),
  operations: z.string().optional(),
  pressure: z.string().optional(),
  chronicDiseases: z.string().optional(),
  headaches: z.string().optional(),
  numbness: z.string().optional(),
  varicose: z.string().optional(),
  joints: z.string().optional(),
  cysts: z.string().optional(),
  herpes: z.string().optional(),
  menstruation: z.string().optional(),
  lifestyle: z.string().optional(),
  skin: z.string().optional(),
  allergies: z.string().optional(),
  colds: z.string().optional(),
  sleep: z.string().optional(),
  energy: z.string().optional(),
  memory: z.string().optional(),
  hasTests: z.string().optional(),
  medications: z.string().optional(),
  cleansing: z.string().optional(),
  additional: z.string().optional(),
  mainProblem: z.string().optional(),
  source: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

// Men's questionnaire schema
export const menQuestionnaireSchema = personalDataSchema.extend({
  weightSatisfaction: z.string().optional(),
  weightChange: z.string().optional(),
  covid: z.string().optional(),
  digestion: z.string().optional(),
  varicose: z.string().optional(),
  teeth: z.string().optional(),
  joints: z.string().optional(),
  coldLimbs: z.string().optional(),
  headaches: z.string().optional(),
  operations: z.string().optional(),
  stones: z.string().optional(),
  pressure: z.string().optional(),
  waterIntake: z.string().optional(),
  moles: z.string().optional(),
  allergies: z.string().optional(),
  skin: z.string().optional(),
  sleep: z.string().optional(),
  energy: z.string().optional(),
  memory: z.string().optional(),
  cleansing: z.string().optional(),
  mainProblem: z.string().optional(),
  additional: z.string().optional(),
  source: z.string().optional(),
  hasTests: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

// Infant questionnaire schema
export const infantQuestionnaireSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  ageMonths: z.string().min(1, 'Возраст обязателен'),
  weight: z.string().min(1, 'Вес обязателен'),
  country: z.string().min(1, 'Страна обязательна'),
  city: z.string().min(1, 'Город обязателен'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие на обработку персональных данных',
  }),
  digestion: z.string().optional(),
  nightSweating: z.string().optional(),
  badBreath: z.string().optional(),
  skinIssues: z.string().optional(),
  allergies: z.string().optional(),
  waterIntake: z.string().optional(),
  injuries: z.string().optional(),
  injuriesDetails: z.string().optional(),
  sleep: z.string().optional(),
  illnesses: z.string().optional(),
  birthType: z.string().optional(),
  toxemia: z.string().optional(),
  motherAllergies: z.string().optional(),
  motherConstipation: z.string().optional(),
  motherAntibiotics: z.string().optional(),
  motherAnemia: z.string().optional(),
  pregnancyProblems: z.string().optional(),
  additional: z.string().optional(),
  mainProblem: z.string().optional(),
  source: z.string().optional(),
  hasTests: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

// Child questionnaire schema
export const childQuestionnaireSchema = z.object({
  age: z.string().min(1, 'Возраст обязателен'),
  weight: z.string().min(1, 'Вес обязателен'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие на обработку персональных данных',
  }),
  digestion: z.string().optional(),
  teeth: z.string().optional(),
  nightSweating: z.string().optional(),
  sweets: z.string().optional(),
  skinIssues: z.string().optional(),
  allergies: z.string().optional(),
  hyperactivity: z.string().optional(),
  waterIntake: z.string().optional(),
  injuries: z.string().optional(),
  headaches: z.string().optional(),
  illnesses: z.string().optional(),
  joints: z.string().optional(),
  additional: z.string().optional(),
  source: z.string().optional(),
  hasTests: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

// Recommendation questionnaire schema (simplified for now)
export const recommendationQuestionnaireSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  contact: z.string().min(1, 'Контакт обязателен'),
  message: z.string().min(1, 'Сообщение обязательно'),
  source: z.string().optional(),
});

export type WomenQuestionnaire = z.infer<typeof womenQuestionnaireSchema>;
export type MenQuestionnaire = z.infer<typeof menQuestionnaireSchema>;
export type InfantQuestionnaire = z.infer<typeof infantQuestionnaireSchema>;
export type ChildQuestionnaire = z.infer<typeof childQuestionnaireSchema>;
export type RecommendationQuestionnaire = z.infer<typeof recommendationQuestionnaireSchema>;

