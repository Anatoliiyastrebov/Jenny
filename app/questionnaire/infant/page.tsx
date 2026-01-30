'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { infantQuestionnaireSchema, type InfantQuestionnaire } from '@/lib/questionnaire-schemas';
import { FormField } from '@/components/FormField';
import { FileUpload } from '@/components/FileUpload';
import { useLocale } from '@/lib/locale';
import { useTranslation } from '@/lib/useTranslation';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';
import { motion } from 'framer-motion';

export default function InfantQuestionnairePage() {
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
  } = useForm<InfantQuestionnaire>({
    resolver: zodResolver(infantQuestionnaireSchema),
    mode: 'onChange',
  });

  const hasTests = watch('hasTests');
  const files = watch('files') || [];

  const onSubmit = async (data: InfantQuestionnaire) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', locale === 'ru' ? 'Анкета для младенца (до 1 года)' : 'Infant Questionnaire (up to 1 year)');
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
          <FormField label={q.infant.ageMonths} required error={errors.ageMonths?.message}>
            <input type="number" {...register('ageMonths')} />
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
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.infant.digestionOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Боли в животе' : 'Stomach pain'}>{q.infant.digestionOptions.stomachPain}</option>
              <option value={locale === 'ru' ? 'Диарея' : 'Diarrhea'}>{q.infant.digestionOptions.diarrhea}</option>
              <option value={locale === 'ru' ? 'Запор' : 'Constipation'}>{q.infant.digestionOptions.constipation}</option>
            </select>
          </FormField>
          <FormField label={q.infant.nightSweating} required error={errors.nightSweating?.message}>
            <select {...register('nightSweating')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.infant.badBreath} required error={errors.badBreath?.message}>
            <select {...register('badBreath')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.infant.skinIssues} required error={errors.skinIssues?.message}>
            <select {...register('skinIssues')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.infant.skinIssuesOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Родинки' : 'Moles'}>{q.infant.skinIssuesOptions.moles}</option>
              <option value={locale === 'ru' ? 'Папилломы' : 'Papillomas'}>{q.infant.skinIssuesOptions.papillomas}</option>
              <option value={locale === 'ru' ? 'Красные точки' : 'Red spots'}>{q.infant.skinIssuesOptions.redSpots}</option>
              <option value={locale === 'ru' ? 'Высыпания' : 'Rashes'}>{q.infant.skinIssuesOptions.rashes}</option>
              <option value={locale === 'ru' ? 'Экзема' : 'Eczema'}>{q.infant.skinIssuesOptions.eczema}</option>
              <option value={locale === 'ru' ? 'Псориаз' : 'Psoriasis'}>{q.infant.skinIssuesOptions.psoriasis}</option>
            </select>
          </FormField>
          <FormField label={q.women.allergies} required error={errors.allergies?.message}>
            <select {...register('allergies')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.infant.allergiesOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Цветение' : 'Pollen'}>{q.infant.allergiesOptions.pollen}</option>
              <option value={locale === 'ru' ? 'Животные' : 'Animals'}>{q.infant.allergiesOptions.animals}</option>
              <option value={locale === 'ru' ? 'Пыль' : 'Dust'}>{q.infant.allergiesOptions.dust}</option>
              <option value={locale === 'ru' ? 'Еда' : 'Food'}>{q.infant.allergiesOptions.food}</option>
              <option value={locale === 'ru' ? 'Другое' : 'Other'}>{q.infant.allergiesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.infant.waterIntake} required error={errors.waterIntake?.message}>
            <input type="number" {...register('waterIntake')} placeholder={q.infant.waterIntakePlaceholder} />
          </FormField>
        </div>
      </motion.section>

      {/* Травмы и здоровье */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.infant.injuries}</h2>
        <div className="space-y-4">
          <FormField label={q.infant.injuriesLabel} required error={errors.injuries?.message}>
            <select {...register('injuries')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Все в порядке' : 'All good'}>{q.infant.injuriesOptions.allGood}</option>
              <option value={locale === 'ru' ? 'Травмы' : 'Injuries'}>{q.infant.injuriesOptions.injuries}</option>
              <option value={locale === 'ru' ? 'Операции' : 'Operations'}>{q.infant.injuriesOptions.operations}</option>
              <option value={locale === 'ru' ? 'Удары по голове' : 'Head injuries'}>{q.infant.injuriesOptions.headInjuries}</option>
              <option value={locale === 'ru' ? 'Переломы' : 'Fractures'}>{q.infant.injuriesOptions.fractures}</option>
              <option value={locale === 'ru' ? 'Сильные падения' : 'Severe falls'}>{q.infant.injuriesOptions.falls}</option>
            </select>
          </FormField>
          <FormField label={q.infant.injuriesDetails} required error={errors.injuriesDetails?.message}>
            <textarea {...register('injuriesDetails')} rows={3} />
          </FormField>
          <FormField label={q.infant.sleep} required error={errors.sleep?.message}>
            <select {...register('sleep')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Хорошо' : 'Good'}>{q.infant.sleepOptions.good}</option>
              <option value={locale === 'ru' ? 'Плохо' : 'Bad'}>{q.infant.sleepOptions.bad}</option>
              <option value={locale === 'ru' ? 'Иногда проблемно' : 'Sometimes problematic'}>{q.infant.sleepOptions.sometimes}</option>
            </select>
          </FormField>
          <FormField label={q.infant.illnesses} required error={errors.illnesses?.message}>
            <select {...register('illnesses')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Редко болеет' : 'Rarely gets sick'}>{q.infant.illnessesOptions.rarely}</option>
              <option value={locale === 'ru' ? 'Часто болеет' : 'Often gets sick'}>{q.infant.illnessesOptions.often}</option>
              <option value={locale === 'ru' ? 'Принимал антибиотики' : 'Has taken antibiotics'}>{q.infant.illnessesOptions.antibiotics}</option>
              <option value={locale === 'ru' ? 'И часто болеет, и принимал антибиотики' : 'Both often gets sick and has taken antibiotics'}>{q.infant.illnessesOptions.both}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Роды и беременность */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.infant.birth}</h2>
        <div className="space-y-4">
          <FormField label={q.infant.birthType} required error={errors.birthType?.message}>
            <select {...register('birthType')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Естественно' : 'Natural'}>{q.infant.birthTypeOptions.natural}</option>
              <option value={locale === 'ru' ? 'Кесарево' : 'Cesarean'}>{q.infant.birthTypeOptions.cesarean}</option>
            </select>
          </FormField>
          <FormField label={q.infant.toxemia} required error={errors.toxemia?.message}>
            <select {...register('toxemia')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.infant.motherAllergies} required error={errors.motherAllergies?.message}>
            <select {...register('motherAllergies')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.infant.motherConstipation} required error={errors.motherConstipation?.message}>
            <select {...register('motherConstipation')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.infant.motherAntibiotics} required error={errors.motherAntibiotics?.message}>
            <select {...register('motherAntibiotics')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.infant.motherAnemia} required error={errors.motherAnemia?.message}>
            <select {...register('motherAnemia')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.infant.pregnancyProblems} required error={errors.pregnancyProblems?.message}>
            <select {...register('pregnancyProblems')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Завершение */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.infant.completion}</h2>
        <div className="space-y-4">
          <FormField label={q.infant.additional} required error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label={q.infant.mainProblem} required error={errors.mainProblem?.message}>
            <textarea {...register('mainProblem')} rows={3} />
          </FormField>
          <FormField label={q.infant.source} required error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Инстаграм' : 'Instagram'}>{q.infant.sourceOptions.instagram}</option>
              <option value={locale === 'ru' ? 'Телеграмм канал' : 'Telegram channel'}>{q.infant.sourceOptions.telegram}</option>
              <option value={locale === 'ru' ? 'По рекомендации' : 'By recommendation'}>{q.infant.sourceOptions.recommendation}</option>
            </select>
          </FormField>
          <FormField label={q.women.hasTests} required error={errors.hasTests?.message}>
            <select {...register('hasTests')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Да, есть анализы / УЗИ за последние 2–3 месяца' : 'Yes, I have tests / ultrasound from the last 2-3 months'}>{q.women.hasTestsOptions.yes}</option>
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
        transition={{ duration: 0.3, delay: 0.5 }}
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
