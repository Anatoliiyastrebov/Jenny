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

      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(q.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(q.error);
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
      {/* Основная информация */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.child.mainInfo}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label={q.child.childAge} required error={errors.age?.message}>
            <input type="number" {...register('age')} />
          </FormField>
          <FormField label={q.child.childWeight} required error={errors.weight?.message}>
            <input type="number" step="0.1" {...register('weight')} />
          </FormField>
        </div>
        <div className="space-y-4 mt-4">
          <FormField label={q.women.digestion} error={errors.digestion?.message}>
            <textarea {...register('digestion')} placeholder={q.child.digestionPlaceholder} rows={3} />
          </FormField>
          <FormField label={q.women.teeth} error={errors.teeth?.message}>
            <textarea {...register('teeth')} placeholder={q.child.teethPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.child.nightSweating} error={errors.nightSweating?.message}>
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
          <FormField label={q.child.sweets} error={errors.sweets?.message}>
            <select {...register('sweets')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
              <option value={locale === 'ru' ? 'Иногда' : 'Sometimes'}>{q.child.sweetsOptions.sometimes}</option>
            </select>
          </FormField>
          <FormField label={q.child.skinIssues} error={errors.skinIssues?.message}>
            <select {...register('skinIssues')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.child.skinIssuesOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Высыпания' : 'Rashes'}>{q.child.skinIssuesOptions.rashes}</option>
              <option value={locale === 'ru' ? 'Экзема' : 'Eczema'}>{q.child.skinIssuesOptions.eczema}</option>
              <option value={locale === 'ru' ? 'Дерматит' : 'Dermatitis'}>{q.child.skinIssuesOptions.dermatitis}</option>
            </select>
          </FormField>
          <FormField label={q.women.allergies} error={errors.allergies?.message}>
            <textarea {...register('allergies')} placeholder={q.child.allergiesPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.child.hyperactivity} error={errors.hyperactivity?.message}>
            <select {...register('hyperactivity')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Гиперактивный' : 'Hyperactive'}>{q.child.hyperactivityOptions.hyperactive}</option>
              <option value={locale === 'ru' ? 'Часто жалуется на усталость' : 'Often complains of fatigue'}>{q.child.hyperactivityOptions.tired}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.child.hyperactivityOptions.noProblems}</option>
            </select>
          </FormField>
          <FormField label={q.child.waterIntake} error={errors.waterIntake?.message}>
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
          <FormField label={q.child.injuriesLabel} error={errors.injuries?.message}>
            <textarea {...register('injuries')} rows={3} />
          </FormField>
          <FormField label={q.child.headaches} error={errors.headaches?.message}>
            <select {...register('headaches')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.child.headachesOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Головные боли' : 'Headaches'}>{q.child.headachesOptions.headaches}</option>
              <option value={locale === 'ru' ? 'Плохой сон' : 'Poor sleep'}>{q.child.headachesOptions.badSleep}</option>
              <option value={locale === 'ru' ? 'И головные боли, и плохой сон' : 'Both headaches and poor sleep'}>{q.child.headachesOptions.both}</option>
            </select>
          </FormField>
          <FormField label={q.child.illnesses} error={errors.illnesses?.message}>
            <textarea {...register('illnesses')} rows={3} />
          </FormField>
          <FormField label={q.women.joints} error={errors.joints?.message}>
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
          <FormField label={q.child.additional} error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label={q.child.source} error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Телеграмм' : 'Telegram'}>{q.child.sourceOptions.telegram}</option>
              <option value={locale === 'ru' ? 'Инстаграм' : 'Instagram'}>{q.child.sourceOptions.instagram}</option>
              <option value={locale === 'ru' ? 'По рекомендации' : 'By recommendation'}>{q.child.sourceOptions.recommendation}</option>
            </select>
          </FormField>
          <FormField label={q.child.hasTests} error={errors.hasTests?.message}>
            <select {...register('hasTests')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Да, есть анализы / УЗИ за последние 2–3 месяца' : 'Yes, I have tests / ultrasound from the last 2-3 months'}>{q.child.hasTestsOptions.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>

          {hasTests === (locale === 'ru' ? 'Да, есть анализы / УЗИ за последние 2–3 месяца' : 'Yes, I have tests / ultrasound from the last 2-3 months') && (
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
