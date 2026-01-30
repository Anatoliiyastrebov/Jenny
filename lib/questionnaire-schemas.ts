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
  covid: z.string().min(1, 'Обязательное поле'),
  covidComplications: z.string().min(1, 'Обязательное поле'),
  hair: z.string().min(1, 'Обязательное поле'),
  teeth: z.string().min(1, 'Обязательное поле'),
  digestion: z.string().min(1, 'Обязательное поле'),
  stones: z.string().min(1, 'Обязательное поле'),
  operations: z.string().min(1, 'Обязательное поле'),
  pressure: z.string().min(1, 'Обязательное поле'),
  chronicDiseases: z.string().min(1, 'Обязательное поле'),
  headaches: z.string().min(1, 'Обязательное поле'),
  numbness: z.string().min(1, 'Обязательное поле'),
  varicose: z.string().min(1, 'Обязательное поле'),
  joints: z.string().min(1, 'Обязательное поле'),
  cysts: z.string().min(1, 'Обязательное поле'),
  herpes: z.string().min(1, 'Обязательное поле'),
  menstruation: z.string().min(1, 'Обязательное поле'),
  lifestyle: z.string().min(1, 'Обязательное поле'),
  skin: z.string().min(1, 'Обязательное поле'),
  allergies: z.string().min(1, 'Обязательное поле'),
  colds: z.string().min(1, 'Обязательное поле'),
  sleep: z.string().min(1, 'Обязательное поле'),
  energy: z.string().min(1, 'Обязательное поле'),
  memory: z.string().min(1, 'Обязательное поле'),
  hasTests: z.string().min(1, 'Обязательное поле'),
  medications: z.string().min(1, 'Обязательное поле'),
  cleansing: z.string().min(1, 'Обязательное поле'),
  additional: z.string().min(1, 'Обязательное поле'),
  mainProblem: z.string().min(1, 'Обязательное поле'),
  source: z.string().min(1, 'Обязательное поле'),
  files: z.array(z.instanceof(File)).optional(),
});

// Men's questionnaire schema
export const menQuestionnaireSchema = personalDataSchema.extend({
  weightSatisfaction: z.string().min(1, 'Обязательное поле'),
  weightChange: z.string().min(1, 'Обязательное поле'),
  covid: z.string().min(1, 'Обязательное поле'),
  digestion: z.string().min(1, 'Обязательное поле'),
  varicose: z.string().min(1, 'Обязательное поле'),
  teeth: z.string().min(1, 'Обязательное поле'),
  joints: z.string().min(1, 'Обязательное поле'),
  coldLimbs: z.string().min(1, 'Обязательное поле'),
  headaches: z.string().min(1, 'Обязательное поле'),
  operations: z.string().min(1, 'Обязательное поле'),
  stones: z.string().min(1, 'Обязательное поле'),
  pressure: z.string().min(1, 'Обязательное поле'),
  waterIntake: z.string().min(1, 'Обязательное поле'),
  moles: z.string().min(1, 'Обязательное поле'),
  allergies: z.string().min(1, 'Обязательное поле'),
  skin: z.string().min(1, 'Обязательное поле'),
  sleep: z.string().min(1, 'Обязательное поле'),
  energy: z.string().min(1, 'Обязательное поле'),
  memory: z.string().min(1, 'Обязательное поле'),
  cleansing: z.string().min(1, 'Обязательное поле'),
  mainProblem: z.string().min(1, 'Обязательное поле'),
  additional: z.string().min(1, 'Обязательное поле'),
  source: z.string().min(1, 'Обязательное поле'),
  hasTests: z.string().min(1, 'Обязательное поле'),
  files: z.array(z.instanceof(File)).optional(),
});

// Infant questionnaire schema
export const infantQuestionnaireSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  ageMonths: z.string().min(1, 'Возраст обязателен'),
  weight: z.string().min(1, 'Вес обязателен'),
  country: z.string().min(1, 'Страна обязательна'),
  city: z.string().min(1, 'Город обязателен'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие на обработку персональных данных',
  }),
  digestion: z.string().min(1, 'Обязательное поле'),
  nightSweating: z.string().min(1, 'Обязательное поле'),
  badBreath: z.string().min(1, 'Обязательное поле'),
  skinIssues: z.string().min(1, 'Обязательное поле'),
  allergies: z.string().min(1, 'Обязательное поле'),
  waterIntake: z.string().min(1, 'Обязательное поле'),
  injuries: z.string().min(1, 'Обязательное поле'),
  injuriesDetails: z.string().min(1, 'Обязательное поле'),
  sleep: z.string().min(1, 'Обязательное поле'),
  illnesses: z.string().min(1, 'Обязательное поле'),
  birthType: z.string().min(1, 'Обязательное поле'),
  toxemia: z.string().min(1, 'Обязательное поле'),
  motherAllergies: z.string().min(1, 'Обязательное поле'),
  motherConstipation: z.string().min(1, 'Обязательное поле'),
  motherAntibiotics: z.string().min(1, 'Обязательное поле'),
  motherAnemia: z.string().min(1, 'Обязательное поле'),
  pregnancyProblems: z.string().min(1, 'Обязательное поле'),
  additional: z.string().min(1, 'Обязательное поле'),
  mainProblem: z.string().min(1, 'Обязательное поле'),
  source: z.string().min(1, 'Обязательное поле'),
  hasTests: z.string().min(1, 'Обязательное поле'),
  files: z.array(z.instanceof(File)).optional(),
});

// Child questionnaire schema
export const childQuestionnaireSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  age: z.string().min(1, 'Возраст обязателен'),
  weight: z.string().min(1, 'Вес обязателен'),
  country: z.string().min(1, 'Страна обязательна'),
  city: z.string().min(1, 'Город обязателен'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие на обработку персональных данных',
  }),
  digestion: z.string().min(1, 'Обязательное поле'),
  teeth: z.string().min(1, 'Обязательное поле'),
  nightSweating: z.string().min(1, 'Обязательное поле'),
  sweets: z.string().min(1, 'Обязательное поле'),
  skinIssues: z.string().min(1, 'Обязательное поле'),
  allergies: z.string().min(1, 'Обязательное поле'),
  hyperactivity: z.string().min(1, 'Обязательное поле'),
  waterIntake: z.string().min(1, 'Обязательное поле'),
  injuries: z.string().min(1, 'Обязательное поле'),
  headaches: z.string().min(1, 'Обязательное поле'),
  illnesses: z.string().min(1, 'Обязательное поле'),
  joints: z.string().min(1, 'Обязательное поле'),
  mainProblem: z.string().min(1, 'Обязательное поле'),
  additional: z.string().min(1, 'Обязательное поле'),
  source: z.string().min(1, 'Обязательное поле'),
  hasTests: z.string().min(1, 'Обязательное поле'),
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

