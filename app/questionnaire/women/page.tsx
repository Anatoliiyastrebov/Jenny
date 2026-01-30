'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { womenQuestionnaireSchema, type WomenQuestionnaire } from '@/lib/questionnaire-schemas';
import { FormField } from '@/components/FormField';
import { FileUpload } from '@/components/FileUpload';
import { useLocale } from '@/lib/locale';
import { useTranslation } from '@/lib/useTranslation';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';
import { motion } from 'framer-motion';

export default function WomenQuestionnairePage() {
  const { locale } = useLocale();
  const t = useTranslation();
  const q = questionnaireTranslations[locale];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WomenQuestionnaire>({
    resolver: zodResolver(womenQuestionnaireSchema),
    mode: 'onChange',
  });

  const hasTests = watch('hasTests');
  const files = watch('files') || [];

  const onSubmit = async (data: WomenQuestionnaire) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', locale === 'ru' ? 'Женская анкета' : "Women's Questionnaire");
      formData.append('locale', locale);
      formData.append('data', JSON.stringify(data));
      formData.append('fileCount', files.length.toString());

      console.log(`Preparing to send ${files.length} file(s)`);
      files.forEach((file, index) => {
        console.log(`Adding file ${index}: ${file.name}, size: ${file.size}, type: ${file.type}`);
        formData.append(`file_${index}`, file, file.name);
      });

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorMessage = result.error || q.error;
        alert(errorMessage);
        console.error('Submission failed:', result);
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : q.error;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <div className="bg-success-50 border border-success-200 rounded-lg p-8 max-w-lg mx-auto shadow-sm">
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-success-800 mb-2">{q.successTitle}</h2>
            <p className="text-success-700">{q.successMessage}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Личные данные */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">
          {q.women.personalData}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label={q.firstName} required error={errors.firstName?.message}>
            <input {...register('firstName')} />
          </FormField>
          <FormField label={q.lastName} required error={errors.lastName?.message}>
            <input {...register('lastName')} />
          </FormField>
          <FormField label={q.age} required error={errors.age?.message}>
            <input type="number" {...register('age')} />
          </FormField>
          <FormField label={q.weight} required error={errors.weight?.message}>
            <input type="number" step="0.1" {...register('weight')} />
          </FormField>
          <FormField label={q.country} required error={errors.country?.message}>
            <input {...register('country')} />
          </FormField>
          <FormField label={q.city} required error={errors.city?.message}>
            <input {...register('city')} />
          </FormField>
        </div>
      </motion.section>

      {/* Основные вопросы */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">
          {q.women.mainQuestions}
        </h2>
        <div className="space-y-4">
          <FormField label={q.women.waterIntake} required error={errors.waterIntake?.message}>
            <select {...register('waterIntake')}>
              <option value="">{q.select}</option>
              <option value={q.women.waterIntakeOptions.lessThanOne}>{q.women.waterIntakeOptions.lessThanOne}</option>
              <option value={q.women.waterIntakeOptions.one}>{q.women.waterIntakeOptions.one}</option>
              <option value={q.women.waterIntakeOptions.oneHalf}>{q.women.waterIntakeOptions.oneHalf}</option>
              <option value={q.women.waterIntakeOptions.two}>{q.women.waterIntakeOptions.two}</option>
              <option value={q.women.waterIntakeOptions.twoHalf}>{q.women.waterIntakeOptions.twoHalf}</option>
              <option value={q.women.waterIntakeOptions.three}>{q.women.waterIntakeOptions.three}</option>
              <option value={q.women.waterIntakeOptions.moreThanThree}>{q.women.waterIntakeOptions.moreThanThree}</option>
            </select>
          </FormField>
          <FormField label={q.women.covid} required error={errors.covid?.message}>
            <select {...register('covid')}>
              <option value="">{q.select}</option>
              <option value={q.women.covidOptions.no}>{q.women.covidOptions.no}</option>
              <option value={q.women.covidOptions.sick}>{q.women.covidOptions.sick}</option>
              <option value={q.women.covidOptions.vaccinated}>{q.women.covidOptions.vaccinated}</option>
              <option value={q.women.covidOptions.both}>{q.women.covidOptions.both}</option>
            </select>
          </FormField>
          <FormField label={q.women.covidComplications} required error={errors.covidComplications?.message}>
            <select {...register('covidComplications')}>
              <option value="">{q.select}</option>
              <option value={q.women.covidComplicationsOptions.no}>{q.women.covidComplicationsOptions.no}</option>
              <option value={q.women.covidComplicationsOptions.hairLoss}>{q.women.covidComplicationsOptions.hairLoss}</option>
              <option value={q.women.covidComplicationsOptions.heartProblems}>{q.women.covidComplicationsOptions.heartProblems}</option>
              <option value={q.women.covidComplicationsOptions.joints}>{q.women.covidComplicationsOptions.joints}</option>
              <option value={q.women.covidComplicationsOptions.memoryLoss}>{q.women.covidComplicationsOptions.memoryLoss}</option>
              <option value={q.women.covidComplicationsOptions.panicAttacks}>{q.women.covidComplicationsOptions.panicAttacks}</option>
              <option value={q.women.covidComplicationsOptions.sleepProblems}>{q.women.covidComplicationsOptions.sleepProblems}</option>
              <option value={q.women.covidComplicationsOptions.other}>{q.women.covidComplicationsOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.hair} required error={errors.hair?.message}>
            <select {...register('hair')}>
              <option value="">{q.select}</option>
              <option value={q.women.hairOptions.satisfied}>{q.women.hairOptions.satisfied}</option>
              <option value={q.women.hairOptions.falling}>{q.women.hairOptions.falling}</option>
              <option value={q.women.hairOptions.dry}>{q.women.hairOptions.dry}</option>
              <option value={q.women.hairOptions.oily}>{q.women.hairOptions.oily}</option>
              <option value={q.women.hairOptions.brittle}>{q.women.hairOptions.brittle}</option>
            </select>
          </FormField>
          <FormField label={q.women.teeth} required error={errors.teeth?.message}>
            <select {...register('teeth')}>
              <option value="">{q.select}</option>
              <option value={q.women.teethOptions.noProblems}>{q.women.teethOptions.noProblems}</option>
              <option value={q.women.teethOptions.crumbling}>{q.women.teethOptions.crumbling}</option>
              <option value={q.women.teethOptions.deteriorating}>{q.women.teethOptions.deteriorating}</option>
              <option value={q.women.teethOptions.badBreath}>{q.women.teethOptions.badBreath}</option>
              <option value={q.women.teethOptions.bleedingGums}>{q.women.teethOptions.bleedingGums}</option>
            </select>
          </FormField>
          <FormField label={q.women.digestion} required error={errors.digestion?.message}>
            <select {...register('digestion')}>
              <option value="">{q.select}</option>
              <option value={q.women.digestionOptions.noProblems}>{q.women.digestionOptions.noProblems}</option>
              <option value={q.women.digestionOptions.heartburn}>{q.women.digestionOptions.heartburn}</option>
              <option value={q.women.digestionOptions.bitterness}>{q.women.digestionOptions.bitterness}</option>
              <option value={q.women.digestionOptions.bloating}>{q.women.digestionOptions.bloating}</option>
              <option value={q.women.digestionOptions.heaviness}>{q.women.digestionOptions.heaviness}</option>
              <option value={q.women.digestionOptions.gas}>{q.women.digestionOptions.gas}</option>
              <option value={q.women.digestionOptions.diarrhea}>{q.women.digestionOptions.diarrhea}</option>
              <option value={q.women.digestionOptions.constipation}>{q.women.digestionOptions.constipation}</option>
              <option value={q.women.digestionOptions.pancreatitis}>{q.women.digestionOptions.pancreatitis}</option>
              <option value={q.women.digestionOptions.other}>{q.women.digestionOptions.other}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Здоровье часть 1 */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">
          {q.women.health}
        </h2>
        <div className="space-y-4">
          <FormField label={q.women.stones} required error={errors.stones?.message}>
            <select {...register('stones')}>
              <option value="">{q.select}</option>
              <option value={q.women.stonesOptions.no}>{q.women.stonesOptions.no}</option>
              <option value={q.women.stonesOptions.sand}>{q.women.stonesOptions.sand}</option>
              <option value={q.women.stonesOptions.smallStones}>{q.women.stonesOptions.smallStones}</option>
              <option value={q.women.stonesOptions.mediumStones}>{q.women.stonesOptions.mediumStones}</option>
              <option value={q.women.stonesOptions.largeStones}>{q.women.stonesOptions.largeStones}</option>
              <option value={q.women.stonesOptions.other}>{q.women.stonesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.operations} required error={errors.operations?.message}>
            <select {...register('operations')}>
              <option value="">{q.select}</option>
              <option value={q.women.operationsOptions.no}>{q.women.operationsOptions.no}</option>
              <option value={q.women.operationsOptions.yes}>{q.women.operationsOptions.yes}</option>
              <option value={q.women.operationsOptions.organRemoved}>{q.women.operationsOptions.organRemoved}</option>
              <option value={q.women.operationsOptions.injuries}>{q.women.operationsOptions.injuries}</option>
              <option value={q.women.operationsOptions.other}>{q.women.operationsOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.pressure} required error={errors.pressure?.message}>
            <select {...register('pressure')}>
              <option value="">{q.select}</option>
              <option value={q.women.pressureOptions.normal}>{q.women.pressureOptions.normal}</option>
              <option value={q.women.pressureOptions.low}>{q.women.pressureOptions.low}</option>
              <option value={q.women.pressureOptions.high}>{q.women.pressureOptions.high}</option>
              <option value={q.women.pressureOptions.highWithMedication}>{q.women.pressureOptions.highWithMedication}</option>
              <option value={q.women.pressureOptions.highWithoutMedication}>{q.women.pressureOptions.highWithoutMedication}</option>
              <option value={q.women.pressureOptions.other}>{q.women.pressureOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.chronicDiseases} required error={errors.chronicDiseases?.message}>
            <select {...register('chronicDiseases')}>
              <option value="">{q.select}</option>
              <option value={q.women.chronicDiseasesOptions.no}>{q.women.chronicDiseasesOptions.no}</option>
              <option value={q.women.chronicDiseasesOptions.diabetes}>{q.women.chronicDiseasesOptions.diabetes}</option>
              <option value={q.women.chronicDiseasesOptions.thyroiditis}>{q.women.chronicDiseasesOptions.thyroiditis}</option>
              <option value={q.women.chronicDiseasesOptions.arthritis}>{q.women.chronicDiseasesOptions.arthritis}</option>
              <option value={q.women.chronicDiseasesOptions.psoriasis}>{q.women.chronicDiseasesOptions.psoriasis}</option>
              <option value={q.women.chronicDiseasesOptions.other}>{q.women.chronicDiseasesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.headaches} required error={errors.headaches?.message}>
            <select {...register('headaches')}>
              <option value="">{q.select}</option>
              <option value={q.women.headachesOptions.no}>{q.women.headachesOptions.no}</option>
              <option value={q.women.headachesOptions.headaches}>{q.women.headachesOptions.headaches}</option>
              <option value={q.women.headachesOptions.migraines}>{q.women.headachesOptions.migraines}</option>
              <option value={q.women.headachesOptions.weatherDependent}>{q.women.headachesOptions.weatherDependent}</option>
              <option value={q.women.headachesOptions.concussion}>{q.women.headachesOptions.concussion}</option>
              <option value={q.women.headachesOptions.headInjuries}>{q.women.headachesOptions.headInjuries}</option>
              <option value={q.women.headachesOptions.tinnitus}>{q.women.headachesOptions.tinnitus}</option>
              <option value={q.women.headachesOptions.floaters}>{q.women.headachesOptions.floaters}</option>
              <option value={q.women.headachesOptions.dizziness}>{q.women.headachesOptions.dizziness}</option>
              <option value={q.women.headachesOptions.other}>{q.women.headachesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.numbness} required error={errors.numbness?.message}>
            <select {...register('numbness')}>
              <option value="">{q.select}</option>
              <option value={q.no}>{q.no}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.women.numbnessOptions.coldLimbs}>{q.women.numbnessOptions.coldLimbs}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Здоровье часть 2 */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">
          {q.women.healthCont}
        </h2>
        <div className="space-y-4">
          <FormField label={q.women.varicose} required error={errors.varicose?.message}>
            <select {...register('varicose')}>
              <option value="">{q.select}</option>
              <option value={q.women.varicoseOptions.noProblems}>{q.women.varicoseOptions.noProblems}</option>
              <option value={q.women.varicoseOptions.varicoseMild}>{q.women.varicoseOptions.varicoseMild}</option>
              <option value={q.women.varicoseOptions.varicoseSevere}>{q.women.varicoseOptions.varicoseSevere}</option>
              <option value={q.women.varicoseOptions.hemorrhoidsBleeding}>{q.women.varicoseOptions.hemorrhoidsBleeding}</option>
              <option value={q.women.varicoseOptions.hemorrhoidsNoBleeding}>{q.women.varicoseOptions.hemorrhoidsNoBleeding}</option>
              <option value={q.women.varicoseOptions.pigmentation}>{q.women.varicoseOptions.pigmentation}</option>
            </select>
          </FormField>
          <FormField label={q.women.joints} required error={errors.joints?.message}>
            <select {...register('joints')}>
              <option value="">{q.select}</option>
              <option value={q.women.jointsOptions.noProblems}>{q.women.jointsOptions.noProblems}</option>
              <option value={q.women.jointsOptions.creaking}>{q.women.jointsOptions.creaking}</option>
              <option value={q.women.jointsOptions.crunching}>{q.women.jointsOptions.crunching}</option>
              <option value={q.women.jointsOptions.inflammation}>{q.women.jointsOptions.inflammation}</option>
              <option value={q.women.jointsOptions.arthrosis1}>{q.women.jointsOptions.arthrosis1}</option>
              <option value={q.women.jointsOptions.arthrosis2}>{q.women.jointsOptions.arthrosis2}</option>
              <option value={q.women.jointsOptions.arthrosis3}>{q.women.jointsOptions.arthrosis3}</option>
              <option value={q.women.jointsOptions.backPain}>{q.women.jointsOptions.backPain}</option>
              <option value={q.women.jointsOptions.lowerBackPain}>{q.women.jointsOptions.lowerBackPain}</option>
              <option value={q.women.jointsOptions.kneePain}>{q.women.jointsOptions.kneePain}</option>
              <option value={q.women.jointsOptions.other}>{q.women.jointsOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.cysts} required error={errors.cysts?.message}>
            <select {...register('cysts')}>
              <option value="">{q.select}</option>
              <option value={q.women.cystsOptions.no}>{q.women.cystsOptions.no}</option>
              <option value={q.women.cystsOptions.cysts}>{q.women.cystsOptions.cysts}</option>
              <option value={q.women.cystsOptions.polyps}>{q.women.cystsOptions.polyps}</option>
              <option value={q.women.cystsOptions.fibroids}>{q.women.cystsOptions.fibroids}</option>
              <option value={q.women.cystsOptions.tumors}>{q.women.cystsOptions.tumors}</option>
              <option value={q.women.cystsOptions.hernias}>{q.women.cystsOptions.hernias}</option>
              <option value={q.women.cystsOptions.other}>{q.women.cystsOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.herpes} required error={errors.herpes?.message}>
            <select {...register('herpes')}>
              <option value="">{q.select}</option>
              <option value={q.women.herpesOptions.no}>{q.women.herpesOptions.no}</option>
              <option value={q.women.herpesOptions.herpes}>{q.women.herpesOptions.herpes}</option>
              <option value={q.women.herpesOptions.papillomas}>{q.women.herpesOptions.papillomas}</option>
              <option value={q.women.herpesOptions.moles}>{q.women.herpesOptions.moles}</option>
              <option value={q.women.herpesOptions.warts}>{q.women.herpesOptions.warts}</option>
              <option value={q.women.herpesOptions.redSpots}>{q.women.herpesOptions.redSpots}</option>
              <option value={q.women.herpesOptions.discharge}>{q.women.herpesOptions.discharge}</option>
              <option value={q.women.herpesOptions.cystitis}>{q.women.herpesOptions.cystitis}</option>
              <option value={q.women.herpesOptions.other}>{q.women.herpesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.menstruation} required error={errors.menstruation?.message}>
            <select {...register('menstruation')}>
              <option value="">{q.select}</option>
              <option value={q.women.menstruationOptions.irregular}>{q.women.menstruationOptions.irregular}</option>
              <option value={q.women.menstruationOptions.painful}>{q.women.menstruationOptions.painful}</option>
              <option value={q.women.menstruationOptions.prolonged}>{q.women.menstruationOptions.prolonged}</option>
              <option value={q.women.menstruationOptions.heavy}>{q.women.menstruationOptions.heavy}</option>
              <option value={q.women.menstruationOptions.normal}>{q.women.menstruationOptions.normal}</option>
            </select>
          </FormField>
          <FormField label={q.women.lifestyle} required error={errors.lifestyle?.message}>
            <select {...register('lifestyle')}>
              <option value="">{q.select}</option>
              <option value={q.women.lifestyleOptions.sedentary}>{q.women.lifestyleOptions.sedentary}</option>
              <option value={q.women.lifestyleOptions.regularSport}>{q.women.lifestyleOptions.regularSport}</option>
              <option value={q.women.lifestyleOptions.homeGymnastics}>{q.women.lifestyleOptions.homeGymnastics}</option>
              <option value={q.women.lifestyleOptions.coldWater}>{q.women.lifestyleOptions.coldWater}</option>
              <option value={q.women.lifestyleOptions.stressfulWork}>{q.women.lifestyleOptions.stressfulWork}</option>
              <option value={q.women.lifestyleOptions.physicalWork}>{q.women.lifestyleOptions.physicalWork}</option>
              <option value={q.women.lifestyleOptions.toxicSubstances}>{q.women.lifestyleOptions.toxicSubstances}</option>
              <option value={q.women.lifestyleOptions.other}>{q.women.lifestyleOptions.other}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Здоровье часть 3 */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">
          {q.women.healthCont}
        </h2>
        <div className="space-y-4">
          <FormField label={q.women.skin} required error={errors.skin?.message}>
            <select {...register('skin')}>
              <option value="">{q.select}</option>
              <option value={q.women.skinOptions.noProblems}>{q.women.skinOptions.noProblems}</option>
              <option value={q.women.skinOptions.acne}>{q.women.skinOptions.acne}</option>
              <option value={q.women.skinOptions.boils}>{q.women.skinOptions.boils}</option>
              <option value={q.women.skinOptions.acneCondition}>{q.women.skinOptions.acneCondition}</option>
              <option value={q.women.skinOptions.irritation}>{q.women.skinOptions.irritation}</option>
              <option value={q.women.skinOptions.rosacea}>{q.women.skinOptions.rosacea}</option>
              <option value={q.women.skinOptions.psoriasis}>{q.women.skinOptions.psoriasis}</option>
              <option value={q.women.skinOptions.dermatitis}>{q.women.skinOptions.dermatitis}</option>
              <option value={q.women.skinOptions.eczema}>{q.women.skinOptions.eczema}</option>
              <option value={q.women.skinOptions.other}>{q.women.skinOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.allergies} required error={errors.allergies?.message}>
            <select {...register('allergies')}>
              <option value="">{q.select}</option>
              <option value={q.women.allergiesOptions.no}>{q.women.allergiesOptions.no}</option>
              <option value={q.women.allergiesOptions.pollen}>{q.women.allergiesOptions.pollen}</option>
              <option value={q.women.allergiesOptions.food}>{q.women.allergiesOptions.food}</option>
              <option value={q.women.allergiesOptions.animals}>{q.women.allergiesOptions.animals}</option>
              <option value={q.women.allergiesOptions.dust}>{q.women.allergiesOptions.dust}</option>
              <option value={q.women.allergiesOptions.medications}>{q.women.allergiesOptions.medications}</option>
              <option value={q.women.allergiesOptions.other}>{q.women.allergiesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.colds} required error={errors.colds?.message}>
            <select {...register('colds')}>
              <option value="">{q.select}</option>
              <option value={q.women.coldsOptions.rarely}>{q.women.coldsOptions.rarely}</option>
              <option value={q.women.coldsOptions.sometimes}>{q.women.coldsOptions.sometimes}</option>
              <option value={q.women.coldsOptions.often}>{q.women.coldsOptions.often}</option>
              <option value={q.women.coldsOptions.veryOften}>{q.women.coldsOptions.veryOften}</option>
              <option value={q.women.coldsOptions.antibiotics}>{q.women.coldsOptions.antibiotics}</option>
              <option value={q.women.coldsOptions.antipyretics}>{q.women.coldsOptions.antipyretics}</option>
              <option value={q.women.coldsOptions.both}>{q.women.coldsOptions.both}</option>
              <option value={q.women.coldsOptions.other}>{q.women.coldsOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.sleep} required error={errors.sleep?.message}>
            <select {...register('sleep')}>
              <option value="">{q.select}</option>
              <option value={q.women.sleepOptions.good}>{q.women.sleepOptions.good}</option>
              <option value={q.women.sleepOptions.hardToFallAsleep}>{q.women.sleepOptions.hardToFallAsleep}</option>
              <option value={q.women.sleepOptions.wakeUpOften}>{q.women.sleepOptions.wakeUpOften}</option>
            </select>
          </FormField>
          <FormField label={q.women.energy} required error={errors.energy?.message}>
            <select {...register('energy')}>
              <option value="">{q.select}</option>
              <option value={q.women.energyOptions.normal}>{q.women.energyOptions.normal}</option>
              <option value={q.women.energyOptions.morningPieces}>{q.women.energyOptions.morningPieces}</option>
              <option value={q.women.energyOptions.hardToWake}>{q.women.energyOptions.hardToWake}</option>
              <option value={q.women.energyOptions.notRested}>{q.women.energyOptions.notRested}</option>
              <option value={q.women.energyOptions.needCoffee}>{q.women.energyOptions.needCoffee}</option>
            </select>
          </FormField>
          <FormField label={q.women.memory} required error={errors.memory?.message}>
            <select {...register('memory')}>
              <option value="">{q.select}</option>
              <option value={q.women.memoryOptions.noProblems}>{q.women.memoryOptions.noProblems}</option>
              <option value={q.women.memoryOptions.slowing}>{q.women.memoryOptions.slowing}</option>
              <option value={q.women.memoryOptions.concentration}>{q.women.memoryOptions.concentration}</option>
              <option value={q.women.memoryOptions.rememberNames}>{q.women.memoryOptions.rememberNames}</option>
              <option value={q.women.memoryOptions.rememberEvents}>{q.women.memoryOptions.rememberEvents}</option>
              <option value={q.women.memoryOptions.rememberInfo}>{q.women.memoryOptions.rememberInfo}</option>
              <option value={q.women.memoryOptions.other}>{q.women.memoryOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.medications} required error={errors.medications?.message}>
            <select {...register('medications')}>
              <option value="">{q.select}</option>
              <option value={q.women.medicationsOptions.no}>{q.women.medicationsOptions.no}</option>
              <option value={q.women.medicationsOptions.yes}>{q.women.medicationsOptions.yes}</option>
              <option value={q.women.medicationsOptions.specify}>{q.women.medicationsOptions.specify}</option>
              <option value={q.women.medicationsOptions.other}>{q.women.medicationsOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.cleansing} required error={errors.cleansing?.message}>
            <select {...register('cleansing')}>
              <option value="">{q.select}</option>
              <option value={q.women.cleansingOptions.no}>{q.women.cleansingOptions.no}</option>
              <option value={q.women.cleansingOptions.yes}>{q.women.cleansingOptions.yes}</option>
              <option value={q.women.cleansingOptions.detox}>{q.women.cleansingOptions.detox}</option>
              <option value={q.women.cleansingOptions.fasting}>{q.women.cleansingOptions.fasting}</option>
              <option value={q.women.cleansingOptions.enemas}>{q.women.cleansingOptions.enemas}</option>
              <option value={q.women.cleansingOptions.herbs}>{q.women.cleansingOptions.herbs}</option>
              <option value={q.women.cleansingOptions.other}>{q.women.cleansingOptions.other}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Завершение */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">
          {q.women.completion}
        </h2>
        <div className="space-y-4">
          <FormField label={q.women.hasTests} required error={errors.hasTests?.message}>
            <select {...register('hasTests')}>
              <option value="">{q.select}</option>
              <option value={q.women.hasTestsOptions.yes}>{q.women.hasTestsOptions.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>

          {hasTests === q.women.hasTestsOptions.yes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FileUpload
                files={files}
                onChange={(newFiles) => setValue('files', newFiles)}
                label={q.attachFiles}
              />
            </motion.div>
          )}

          <FormField label={q.women.additional} required error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label={q.women.mainProblem} required error={errors.mainProblem?.message}>
            <textarea {...register('mainProblem')} rows={3} />
          </FormField>
          <FormField label={q.women.source} required error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">{q.select}</option>
              <option value={q.women.sourceOptions.telegram}>{q.women.sourceOptions.telegram}</option>
              <option value={q.women.sourceOptions.instagram}>{q.women.sourceOptions.instagram}</option>
              <option value={q.women.sourceOptions.recommendation}>{q.women.sourceOptions.recommendation}</option>
            </select>
          </FormField>

          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <h3 className="text-base font-semibold text-medical-900 mb-3">
              {t.common.gdprTitle}
            </h3>
            <p className="text-sm text-medical-700 mb-4 leading-relaxed">
              {t.common.gdprText}
            </p>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="gdprConsent"
                {...register('gdprConsent')}
                className="mt-1 w-5 h-5 border-medical-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="gdprConsent" className="text-sm text-medical-900 cursor-pointer flex-1">
                {t.common.gdprConsent} <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.gdprConsent && (
              <p className="text-sm text-red-600 mt-2">
                {t.common.gdprRequired}
              </p>
            )}
            <p className="text-xs text-medical-600 mt-4 leading-relaxed">
              <strong>{q.privacy}:</strong> {q.privacyText}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Кнопка отправки */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="sticky bottom-4 z-10 px-4 sm:px-0"
      >
        <button
          type="submit"
          disabled={isSubmitting || !watch('gdprConsent')}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium shadow-sm hover:bg-primary-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span>{q.submitting}</span>
            </>
          ) : (
            <span>{q.submitQuestionnaire}</span>
          )}
        </button>
      </motion.div>
    </form>
  );
}
