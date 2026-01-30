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
            <textarea {...register('digestion')} placeholder={q.child.digestionPlaceholder} rows={3} />
          </FormField>
          <FormField label={q.women.teeth} required error={errors.teeth?.message}>
            <textarea {...register('teeth')} placeholder={q.child.teethPlaceholder} rows={2} />
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
            <textarea {...register('allergies')} placeholder={q.child.allergiesPlaceholder} rows={2} />
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
            <input type="number" {...register('waterIntake')} placeholder={q.child.waterIntakePlaceholder} />
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
            <textarea {...register('injuries')} rows={3} />
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
            <textarea {...register('illnesses')} rows={3} />
          </FormField>
          <FormField label={q.women.joints} required error={errors.joints?.message}>
            <textarea {...register('joints')} placeholder={q.child.jointsPlaceholder} rows={3} />
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
