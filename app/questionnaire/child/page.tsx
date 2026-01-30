'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { childQuestionnaireSchema, type ChildQuestionnaire } from '@/lib/questionnaire-schemas';
import { FormField } from '@/components/FormField';
import { FileUpload } from '@/components/FileUpload';
import { useLocale } from '@/lib/locale';
import { useTranslation } from '@/lib/useTranslation';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';
import { motion } from 'framer-motion';

export default function ChildQuestionnairePage() {
  const { locale } = useLocale();
  const t = useTranslation();
  const q = questionnaireTranslations[locale] as typeof questionnaireTranslations.ru;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChildQuestionnaire>({
    resolver: zodResolver(childQuestionnaireSchema),
    mode: 'onChange',
  });

  const hasTests = watch('hasTests');
  const files = watch('files') || [];

  const onSubmit = async (data: ChildQuestionnaire) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', locale === 'ru' ? 'Детская анкета' : "Children's Questionnaire");
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
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="text-center py-12"
      >
        <motion.div
          className="bg-success-50 border border-success-200 rounded-lg p-8 max-w-lg mx-auto shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-success-800 mb-2">{q.successTitle}</h2>
            <p className="text-success-700">{q.successMessage}</p>
          </div>
        </motion.div>
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.infant.personalData}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label={q.firstName} required error={errors.firstName?.message}>
            <input {...register('firstName')} />
          </FormField>
          <FormField label={q.lastName} required error={errors.lastName?.message}>
            <input {...register('lastName')} />
          </FormField>
          <FormField label={q.child.childAge} required error={errors.age?.message}>
            <input type="number" {...register('age')} />
          </FormField>
          <FormField label={q.child.childWeight} required error={errors.weight?.message}>
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

      {/* Здоровье */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.infant.health}</h2>
        <div className="space-y-4">
          <FormField label={q.women.digestion} required error={errors.digestion?.message}>
            <select {...register('digestion')}>
              <option value="">{q.select}</option>
              <option value={q.child.digestionOptions.noProblems}>{q.child.digestionOptions.noProblems}</option>
              <option value={q.child.digestionOptions.stomachPain}>{q.child.digestionOptions.stomachPain}</option>
              <option value={q.child.digestionOptions.diarrhea}>{q.child.digestionOptions.diarrhea}</option>
              <option value={q.child.digestionOptions.constipation}>{q.child.digestionOptions.constipation}</option>
              <option value={q.child.digestionOptions.other}>{q.child.digestionOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.teeth} required error={errors.teeth?.message}>
            <select {...register('teeth')}>
              <option value="">{q.select}</option>
              <option value={q.child.teethOptions.noProblems}>{q.child.teethOptions.noProblems}</option>
              <option value={q.child.teethOptions.deteriorating}>{q.child.teethOptions.deteriorating}</option>
              <option value={q.child.teethOptions.badBreath}>{q.child.teethOptions.badBreath}</option>
              <option value={q.child.teethOptions.other}>{q.child.teethOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.child.nightSweating} required error={errors.nightSweating?.message}>
            <select {...register('nightSweating')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Поведение и здоровье */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.child.behavior}</h2>
        <div className="space-y-4">
          <FormField label={q.child.sweets} required error={errors.sweets?.message}>
            <select {...register('sweets')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
              <option value={q.child.sweetsOptions.sometimes}>{q.child.sweetsOptions.sometimes}</option>
            </select>
          </FormField>
          <FormField label={q.child.skinIssues} required error={errors.skinIssues?.message}>
            <select {...register('skinIssues')}>
              <option value="">{q.select}</option>
              <option value={q.child.skinIssuesOptions.noProblems}>{q.child.skinIssuesOptions.noProblems}</option>
              <option value={q.child.skinIssuesOptions.rashes}>{q.child.skinIssuesOptions.rashes}</option>
              <option value={q.child.skinIssuesOptions.eczema}>{q.child.skinIssuesOptions.eczema}</option>
              <option value={q.child.skinIssuesOptions.dermatitis}>{q.child.skinIssuesOptions.dermatitis}</option>
            </select>
          </FormField>
          <FormField label={q.women.allergies} required error={errors.allergies?.message}>
            <select {...register('allergies')}>
              <option value="">{q.select}</option>
              <option value={q.child.allergiesOptions.no}>{q.child.allergiesOptions.no}</option>
              <option value={q.child.allergiesOptions.pollen}>{q.child.allergiesOptions.pollen}</option>
              <option value={q.child.allergiesOptions.animals}>{q.child.allergiesOptions.animals}</option>
              <option value={q.child.allergiesOptions.dust}>{q.child.allergiesOptions.dust}</option>
              <option value={q.child.allergiesOptions.food}>{q.child.allergiesOptions.food}</option>
              <option value={q.child.allergiesOptions.medications}>{q.child.allergiesOptions.medications}</option>
              <option value={q.child.allergiesOptions.other}>{q.child.allergiesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.child.hyperactivity} required error={errors.hyperactivity?.message}>
            <select {...register('hyperactivity')}>
              <option value="">{q.select}</option>
              <option value={q.child.hyperactivityOptions.hyperactive}>{q.child.hyperactivityOptions.hyperactive}</option>
              <option value={q.child.hyperactivityOptions.tired}>{q.child.hyperactivityOptions.tired}</option>
              <option value={q.child.hyperactivityOptions.noProblems}>{q.child.hyperactivityOptions.noProblems}</option>
            </select>
          </FormField>
          <FormField label={q.child.waterIntake} required error={errors.waterIntake?.message}>
            <select {...register('waterIntake')}>
              <option value="">{q.select}</option>
              <option value={q.child.waterIntakeOptions.lessThan200}>{q.child.waterIntakeOptions.lessThan200}</option>
              <option value={q.child.waterIntakeOptions.twoHundred}>{q.child.waterIntakeOptions.twoHundred}</option>
              <option value={q.child.waterIntakeOptions.threeHundred}>{q.child.waterIntakeOptions.threeHundred}</option>
              <option value={q.child.waterIntakeOptions.fiveHundred}>{q.child.waterIntakeOptions.fiveHundred}</option>
              <option value={q.child.waterIntakeOptions.sevenHundred}>{q.child.waterIntakeOptions.sevenHundred}</option>
              <option value={q.child.waterIntakeOptions.moreThanThousand}>{q.child.waterIntakeOptions.moreThanThousand}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Травмы и заболевания */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.child.injuries}</h2>
        <div className="space-y-4">
          <FormField label={q.child.injuriesLabel} required error={errors.injuries?.message}>
            <select {...register('injuries')}>
              <option value="">{q.select}</option>
              <option value={q.child.injuriesOptions.no}>{q.child.injuriesOptions.no}</option>
              <option value={q.child.injuriesOptions.injuries}>{q.child.injuriesOptions.injuries}</option>
              <option value={q.child.injuriesOptions.operations}>{q.child.injuriesOptions.operations}</option>
              <option value={q.child.injuriesOptions.headInjuries}>{q.child.injuriesOptions.headInjuries}</option>
              <option value={q.child.injuriesOptions.falls}>{q.child.injuriesOptions.falls}</option>
              <option value={q.child.injuriesOptions.fractures}>{q.child.injuriesOptions.fractures}</option>
              <option value={q.child.injuriesOptions.other}>{q.child.injuriesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.child.headaches} required error={errors.headaches?.message}>
            <select {...register('headaches')}>
              <option value="">{q.select}</option>
              <option value={q.child.headachesOptions.noProblems}>{q.child.headachesOptions.noProblems}</option>
              <option value={q.child.headachesOptions.headaches}>{q.child.headachesOptions.headaches}</option>
              <option value={q.child.headachesOptions.badSleep}>{q.child.headachesOptions.badSleep}</option>
              <option value={q.child.headachesOptions.both}>{q.child.headachesOptions.both}</option>
            </select>
          </FormField>
          <FormField label={q.child.illnesses} required error={errors.illnesses?.message}>
            <select {...register('illnesses')}>
              <option value="">{q.select}</option>
              <option value={q.child.illnessesOptions.rarely}>{q.child.illnessesOptions.rarely}</option>
              <option value={q.child.illnessesOptions.sometimes}>{q.child.illnessesOptions.sometimes}</option>
              <option value={q.child.illnessesOptions.often}>{q.child.illnessesOptions.often}</option>
              <option value={q.child.illnessesOptions.veryOften}>{q.child.illnessesOptions.veryOften}</option>
              <option value={q.child.illnessesOptions.antibiotics}>{q.child.illnessesOptions.antibiotics}</option>
              <option value={q.child.illnessesOptions.medications}>{q.child.illnessesOptions.medications}</option>
              <option value={q.child.illnessesOptions.both}>{q.child.illnessesOptions.both}</option>
              <option value={q.child.illnessesOptions.other}>{q.child.illnessesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.joints} required error={errors.joints?.message}>
            <select {...register('joints')}>
              <option value="">{q.select}</option>
              <option value={q.child.jointsOptions.noProblems}>{q.child.jointsOptions.noProblems}</option>
              <option value={q.child.jointsOptions.legPain}>{q.child.jointsOptions.legPain}</option>
              <option value={q.child.jointsOptions.massage}>{q.child.jointsOptions.massage}</option>
              <option value={q.child.jointsOptions.wantsToBeCarried}>{q.child.jointsOptions.wantsToBeCarried}</option>
              <option value={q.child.jointsOptions.other}>{q.child.jointsOptions.other}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Завершение */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.child.completion}</h2>
        <div className="space-y-4">
          <FormField label={q.men.mainProblem} required error={errors.mainProblem?.message}>
            <textarea {...register('mainProblem')} rows={3} />
          </FormField>
          <FormField label={q.child.additional} required error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label={q.child.source} required error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">{q.select}</option>
              <option value={q.child.sourceOptions.telegram}>{q.child.sourceOptions.telegram}</option>
              <option value={q.child.sourceOptions.instagram}>{q.child.sourceOptions.instagram}</option>
              <option value={q.child.sourceOptions.recommendation}>{q.child.sourceOptions.recommendation}</option>
            </select>
          </FormField>
          <FormField label={q.child.hasTests} required error={errors.hasTests?.message}>
            <select {...register('hasTests')}>
              <option value="">{q.select}</option>
              <option value={q.child.hasTestsOptions.yes}>{q.child.hasTestsOptions.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>

          {hasTests === q.child.hasTestsOptions.yes && (
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
        transition={{ duration: 0.3, delay: 0.4 }}
        className="sticky bottom-4 z-10 px-4 sm:px-0"
      >
        <button
          type="submit"
          disabled={isSubmitting || !watch('gdprConsent')}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium shadow-sm hover:bg-primary-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>{q.submitting}</span>
          ) : (
            <span>{q.submitQuestionnaire}</span>
          )}
        </button>
      </motion.div>
    </form>
  );
}
