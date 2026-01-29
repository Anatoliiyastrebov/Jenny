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
          <FormField label={q.lastName} error={errors.lastName?.message}>
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
            <input {...register('waterIntake')} placeholder={q.women.waterIntakePlaceholder} />
          </FormField>
          <FormField label={q.women.covid} error={errors.covid?.message}>
            <select {...register('covid')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет' : 'No'}>{q.women.covidOptions.no}</option>
              <option value={locale === 'ru' ? 'Болел' : 'Had COVID'}>{q.women.covidOptions.sick}</option>
              <option value={locale === 'ru' ? 'Вакцинирован' : 'Vaccinated'}>{q.women.covidOptions.vaccinated}</option>
              <option value={locale === 'ru' ? 'Болел и вакцинирован' : 'Had COVID and vaccinated'}>{q.women.covidOptions.both}</option>
            </select>
          </FormField>
          <FormField label={q.women.covidComplications} error={errors.covidComplications?.message}>
            <textarea {...register('covidComplications')} placeholder={q.women.covidComplicationsPlaceholder} rows={3} />
          </FormField>
          <FormField label={q.women.hair} error={errors.hair?.message}>
            <select {...register('hair')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Довольна качеством' : 'Satisfied with quality'}>{q.women.hairOptions.satisfied}</option>
              <option value={locale === 'ru' ? 'Выпадают' : 'Falling out'}>{q.women.hairOptions.falling}</option>
              <option value={locale === 'ru' ? 'Сухие' : 'Dry'}>{q.women.hairOptions.dry}</option>
              <option value={locale === 'ru' ? 'Жирные' : 'Oily'}>{q.women.hairOptions.oily}</option>
              <option value={locale === 'ru' ? 'Ломкие' : 'Brittle'}>{q.women.hairOptions.brittle}</option>
            </select>
          </FormField>
          <FormField label={q.women.teeth} error={errors.teeth?.message}>
            <select {...register('teeth')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.women.teethOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Быстро крошатся' : 'Crumbling quickly'}>{q.women.teethOptions.crumbling}</option>
              <option value={locale === 'ru' ? 'Часто портятся' : 'Deteriorating frequently'}>{q.women.teethOptions.deteriorating}</option>
              <option value={locale === 'ru' ? 'Неприятный запах изо рта' : 'Bad breath'}>{q.women.teethOptions.badBreath}</option>
              <option value={locale === 'ru' ? 'Кровоточат десны' : 'Bleeding gums'}>{q.women.teethOptions.bleedingGums}</option>
            </select>
          </FormField>
          <FormField label={q.women.digestion} error={errors.digestion?.message}>
            <textarea {...register('digestion')} placeholder={q.women.digestionPlaceholder} rows={3} />
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
          <FormField label={q.women.stones} error={errors.stones?.message}>
            <textarea {...register('stones')} placeholder={q.women.stonesPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.operations} error={errors.operations?.message}>
            <textarea {...register('operations')} placeholder={q.women.operationsPlaceholder} rows={3} />
          </FormField>
          <FormField label={q.women.pressure} error={errors.pressure?.message}>
            <textarea {...register('pressure')} placeholder={q.women.pressurePlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.chronicDiseases} error={errors.chronicDiseases?.message}>
            <textarea {...register('chronicDiseases')} placeholder={q.women.chronicDiseasesPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.headaches} error={errors.headaches?.message}>
            <textarea {...register('headaches')} placeholder={q.women.headachesPlaceholder} rows={3} />
          </FormField>
          <FormField label={q.women.numbness} error={errors.numbness?.message}>
            <select {...register('numbness')}>
              <option value="">{q.select}</option>
              <option value={q.no}>{q.no}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={locale === 'ru' ? 'Руки-ноги холодные даже летом' : 'Hands and feet cold even in summer'}>{q.women.numbnessOptions.coldLimbs}</option>
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
          <FormField label={q.women.varicose} error={errors.varicose?.message}>
            <select {...register('varicose')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.women.varicoseOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Варикоз (сеточка)' : 'Varicose veins (mild)'}>{q.women.varicoseOptions.varicoseMild}</option>
              <option value={locale === 'ru' ? 'Варикоз (выраженные вены)' : 'Varicose veins (severe)'}>{q.women.varicoseOptions.varicoseSevere}</option>
              <option value={locale === 'ru' ? 'Геморрой (кровоточит)' : 'Hemorrhoids (bleeding)'}>{q.women.varicoseOptions.hemorrhoidsBleeding}</option>
              <option value={locale === 'ru' ? 'Геморрой (не кровоточит)' : 'Hemorrhoids (no bleeding)'}>{q.women.varicoseOptions.hemorrhoidsNoBleeding}</option>
              <option value={locale === 'ru' ? 'Пигментные пятна' : 'Pigmentation spots'}>{q.women.varicoseOptions.pigmentation}</option>
            </select>
          </FormField>
          <FormField label={q.women.joints} error={errors.joints?.message}>
            <textarea {...register('joints')} placeholder={q.women.jointsPlaceholder} rows={3} />
          </FormField>
          <FormField label={q.women.cysts} error={errors.cysts?.message}>
            <textarea {...register('cysts')} placeholder={q.women.cystsPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.herpes} error={errors.herpes?.message}>
            <textarea {...register('herpes')} placeholder={q.women.herpesPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.menstruation} error={errors.menstruation?.message}>
            <select {...register('menstruation')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нерегулярные' : 'Irregular'}>{q.women.menstruationOptions.irregular}</option>
              <option value={locale === 'ru' ? 'Болезненные' : 'Painful'}>{q.women.menstruationOptions.painful}</option>
              <option value={locale === 'ru' ? 'Затяжные' : 'Prolonged'}>{q.women.menstruationOptions.prolonged}</option>
              <option value={locale === 'ru' ? 'Обильные кровотечения' : 'Heavy bleeding'}>{q.women.menstruationOptions.heavy}</option>
              <option value={locale === 'ru' ? 'Нормальные' : 'Normal'}>{q.women.menstruationOptions.normal}</option>
            </select>
          </FormField>
          <FormField label={q.women.lifestyle} error={errors.lifestyle?.message}>
            <textarea {...register('lifestyle')} placeholder={q.women.lifestylePlaceholder} rows={3} />
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
          <FormField label={q.women.skin} error={errors.skin?.message}>
            <textarea {...register('skin')} placeholder={q.women.skinPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.allergies} error={errors.allergies?.message}>
            <textarea {...register('allergies')} placeholder={q.women.allergiesPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.colds} error={errors.colds?.message}>
            <textarea {...register('colds')} placeholder={q.women.coldsPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.sleep} error={errors.sleep?.message}>
            <select {...register('sleep')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Хороший' : 'Good'}>{q.women.sleepOptions.good}</option>
              <option value={locale === 'ru' ? 'Трудно заснуть' : 'Hard to fall asleep'}>{q.women.sleepOptions.hardToFallAsleep}</option>
              <option value={locale === 'ru' ? 'Часто просыпаюсь ночью' : 'Wake up often at night'}>{q.women.sleepOptions.wakeUpOften}</option>
            </select>
          </FormField>
          <FormField label={q.women.energy} error={errors.energy?.message}>
            <select {...register('energy')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нормальная' : 'Normal'}>{q.women.energyOptions.normal}</option>
              <option value={locale === 'ru' ? 'С утра нужно собрать себя по кусочкам' : 'Need to pull yourself together in the morning'}>{q.women.energyOptions.morningPieces}</option>
              <option value={locale === 'ru' ? 'Очень тяжело просыпаться' : 'Very hard to wake up'}>{q.women.energyOptions.hardToWake}</option>
              <option value={locale === 'ru' ? 'Утром чувствуете себя неотдохнувшим' : 'Feel unrested in the morning'}>{q.women.energyOptions.notRested}</option>
              <option value={locale === 'ru' ? 'Нужно стимулировать себя кофе' : 'Need coffee to stimulate yourself'}>{q.women.energyOptions.needCoffee}</option>
            </select>
          </FormField>
          <FormField label={q.women.memory} error={errors.memory?.message}>
            <textarea {...register('memory')} placeholder={q.women.memoryPlaceholder} rows={3} />
          </FormField>
          <FormField label={q.women.medications} error={errors.medications?.message}>
            <textarea {...register('medications')} placeholder={q.women.medicationsPlaceholder} rows={2} />
          </FormField>
          <FormField label={q.women.cleansing} error={errors.cleansing?.message}>
            <textarea {...register('cleansing')} placeholder={q.women.cleansingPlaceholder} rows={2} />
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
          <FormField label={q.women.hasTests} error={errors.hasTests?.message}>
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

          <FormField label={q.women.additional} error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label={q.women.mainProblem} error={errors.mainProblem?.message}>
            <textarea {...register('mainProblem')} rows={3} />
          </FormField>
          <FormField label={q.women.source} error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Телеграмм' : 'Telegram'}>{q.women.sourceOptions.telegram}</option>
              <option value={locale === 'ru' ? 'Инстаграм' : 'Instagram'}>{q.women.sourceOptions.instagram}</option>
              <option value={locale === 'ru' ? 'По рекомендации' : 'By recommendation'}>{q.women.sourceOptions.recommendation}</option>
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
