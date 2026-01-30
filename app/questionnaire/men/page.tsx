'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menQuestionnaireSchema, type MenQuestionnaire } from '@/lib/questionnaire-schemas';
import { FormField } from '@/components/FormField';
import { FileUpload } from '@/components/FileUpload';
import { useLocale } from '@/lib/locale';
import { useTranslation } from '@/lib/useTranslation';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';
import { motion } from 'framer-motion';

export default function MenQuestionnairePage() {
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
  } = useForm<MenQuestionnaire>({
    resolver: zodResolver(menQuestionnaireSchema),
    mode: 'onChange',
  });

  const hasTests = watch('hasTests');
  const files = watch('files') || [];

  const onSubmit = async (data: MenQuestionnaire) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', locale === 'ru' ? 'Мужская анкета' : "Men's Questionnaire");
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.women.personalData}</h2>
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

      {/* Здоровье часть 1 */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.men.health}</h2>
        <div className="space-y-4">
          <FormField label={q.men.weightSatisfaction} required error={errors.weightSatisfaction?.message}>
            <select {...register('weightSatisfaction')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.men.weightChange} required error={errors.weightChange?.message}>
            <select {...register('weightChange')}>
              <option value="">{q.select}</option>
              <option value={q.no}>{q.no}</option>
              <option value={locale === 'ru' ? 'Да, хотелось бы похудеть' : 'Yes, would like to lose weight'}>{q.men.weightChangeOptions.lose}</option>
              <option value={locale === 'ru' ? 'Да, хотелось бы набрать' : 'Yes, would like to gain weight'}>{q.men.weightChangeOptions.gain}</option>
            </select>
          </FormField>
          <FormField label={q.men.covid} required error={errors.covid?.message}>
            <select {...register('covid')}>
              <option value="">{q.select}</option>
              <option value={q.no}>{q.men.covidOptions.no}</option>
              <option value={locale === 'ru' ? 'Болел' : 'Had COVID'}>{q.men.covidOptions.sick}</option>
              <option value={locale === 'ru' ? 'Вакцинирован' : 'Vaccinated'}>{q.men.covidOptions.vaccinated}</option>
              <option value={locale === 'ru' ? 'Болел и вакцинирован' : 'Had COVID and vaccinated'}>{q.men.covidOptions.both}</option>
            </select>
          </FormField>
          <FormField label={q.women.digestion} required error={errors.digestion?.message}>
            <select {...register('digestion')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.digestionOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Изжога' : 'Heartburn'}>{q.men.digestionOptions.heartburn}</option>
              <option value={locale === 'ru' ? 'Вздутие' : 'Bloating'}>{q.men.digestionOptions.bloating}</option>
              <option value={locale === 'ru' ? 'Диарея' : 'Diarrhea'}>{q.men.digestionOptions.diarrhea}</option>
              <option value={locale === 'ru' ? 'Запор' : 'Constipation'}>{q.men.digestionOptions.constipation}</option>
            </select>
          </FormField>
          <FormField label={q.men.varicose} required error={errors.varicose?.message}>
            <select {...register('varicose')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.varicoseOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Варикоз' : 'Varicose veins'}>{q.men.varicoseOptions.varicose}</option>
              <option value={locale === 'ru' ? 'Геморрой' : 'Hemorrhoids'}>{q.men.varicoseOptions.hemorrhoids}</option>
              <option value={locale === 'ru' ? 'Оба' : 'Both'}>{q.men.varicoseOptions.both}</option>
            </select>
          </FormField>
          <FormField label={q.women.teeth} required error={errors.teeth?.message}>
            <select {...register('teeth')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.teethOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Крошатся' : 'Crumbling'}>{q.men.teethOptions.crumbling}</option>
              <option value={locale === 'ru' ? 'Часто портятся' : 'Deteriorating frequently'}>{q.men.teethOptions.deteriorating}</option>
              <option value={locale === 'ru' ? 'Запах изо рта' : 'Bad breath'}>{q.men.teethOptions.badBreath}</option>
              <option value={locale === 'ru' ? 'Кровоточивость' : 'Bleeding'}>{q.men.teethOptions.bleeding}</option>
            </select>
          </FormField>
          <FormField label={q.women.joints} required error={errors.joints?.message}>
            <select {...register('joints')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.jointsOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Хруст' : 'Crunching'}>{q.men.jointsOptions.crunch}</option>
              <option value={locale === 'ru' ? 'Скрип' : 'Creaking'}>{q.men.jointsOptions.creak}</option>
              <option value={locale === 'ru' ? 'Воспаление' : 'Inflammation'}>{q.men.jointsOptions.inflammation}</option>
            </select>
          </FormField>
          <FormField label={q.men.coldLimbs} required error={errors.coldLimbs?.message}>
            <select {...register('coldLimbs')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Здоровье часть 2 */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.men.healthCont}</h2>
        <div className="space-y-4">
          <FormField label={q.men.headaches} required error={errors.headaches?.message}>
            <select {...register('headaches')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.headachesOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Головные боли' : 'Headaches'}>{q.men.headachesOptions.headaches}</option>
              <option value={locale === 'ru' ? 'Мигрени' : 'Migraines'}>{q.men.headachesOptions.migraines}</option>
              <option value={locale === 'ru' ? 'Травмы' : 'Injuries'}>{q.men.headachesOptions.injuries}</option>
              <option value={locale === 'ru' ? 'Сотрясение' : 'Concussion'}>{q.men.headachesOptions.concussion}</option>
            </select>
          </FormField>
          <FormField label={q.men.operations} required error={errors.operations?.message}>
            <select {...register('operations')}>
              <option value="">{q.select}</option>
              <option value={q.yes}>{q.yes}</option>
              <option value={q.no}>{q.no}</option>
            </select>
          </FormField>
          <FormField label={q.men.stones} required error={errors.stones?.message}>
            <select {...register('stones')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.stonesOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Кисты' : 'Cysts'}>{q.men.stonesOptions.cysts}</option>
              <option value={locale === 'ru' ? 'Песок' : 'Sand'}>{q.men.stonesOptions.sand}</option>
              <option value={locale === 'ru' ? 'Камни в почках' : 'Kidney stones'}>{q.men.stonesOptions.kidneyStones}</option>
              <option value={locale === 'ru' ? 'Камни в желчном' : 'Gallbladder stones'}>{q.men.stonesOptions.gallbladderStones}</option>
            </select>
          </FormField>
          <FormField label={q.men.pressure} required error={errors.pressure?.message}>
            <select {...register('pressure')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Низкое' : 'Low'}>{q.men.pressureOptions.low}</option>
              <option value={locale === 'ru' ? 'Высокое' : 'High'}>{q.men.pressureOptions.high}</option>
              <option value={locale === 'ru' ? 'Нормальное' : 'Normal'}>{q.men.pressureOptions.normal}</option>
            </select>
          </FormField>
          <FormField label={q.men.waterIntake} required error={errors.waterIntake?.message}>
            <select {...register('waterIntake')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? '1 литр' : '1 liter'}>{q.men.waterIntakeOptions.one}</option>
              <option value={locale === 'ru' ? '1.5 литра' : '1.5 liters'}>{q.men.waterIntakeOptions.oneHalf}</option>
              <option value={locale === 'ru' ? '2 литра' : '2 liters'}>{q.men.waterIntakeOptions.two}</option>
              <option value={locale === 'ru' ? '2.5 литра' : '2.5 liters'}>{q.men.waterIntakeOptions.twoHalf}</option>
              <option value={locale === 'ru' ? '3 литра' : '3 liters'}>{q.men.waterIntakeOptions.three}</option>
              <option value={locale === 'ru' ? '3.5 литра' : '3.5 liters'}>{q.men.waterIntakeOptions.threeHalf}</option>
            </select>
          </FormField>
          <FormField label={q.men.moles} required error={errors.moles?.message}>
            <select {...register('moles')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.molesOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Родинки' : 'Moles'}>{q.men.molesOptions.moles}</option>
              <option value={locale === 'ru' ? 'Папилломы' : 'Papillomas'}>{q.men.molesOptions.papillomas}</option>
              <option value={locale === 'ru' ? 'Красные точки' : 'Red spots'}>{q.men.molesOptions.redSpots}</option>
              <option value={locale === 'ru' ? 'Герпес' : 'Herpes'}>{q.men.molesOptions.herpes}</option>
            </select>
          </FormField>
          <FormField label={q.women.allergies} required error={errors.allergies?.message}>
            <select {...register('allergies')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.allergiesOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Цветение' : 'Pollen'}>{q.men.allergiesOptions.pollen}</option>
              <option value={locale === 'ru' ? 'Животные' : 'Animals'}>{q.men.allergiesOptions.animals}</option>
              <option value={locale === 'ru' ? 'Пыль' : 'Dust'}>{q.men.allergiesOptions.dust}</option>
              <option value={locale === 'ru' ? 'Еда' : 'Food'}>{q.men.allergiesOptions.food}</option>
              <option value={locale === 'ru' ? 'Лекарства' : 'Medications'}>{q.men.allergiesOptions.medications}</option>
              <option value={locale === 'ru' ? 'Другое' : 'Other'}>{q.men.allergiesOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.women.skin} required error={errors.skin?.message}>
            <select {...register('skin')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.skinOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Сухая' : 'Dry'}>{q.men.skinOptions.dry}</option>
              <option value={locale === 'ru' ? 'Высыпания' : 'Rashes'}>{q.men.skinOptions.rashes}</option>
              <option value={locale === 'ru' ? 'Раздражение' : 'Irritation'}>{q.men.skinOptions.irritation}</option>
              <option value={locale === 'ru' ? 'Прыщи' : 'Acne'}>{q.men.skinOptions.acne}</option>
              <option value={locale === 'ru' ? 'Другое' : 'Other'}>{q.men.skinOptions.other}</option>
            </select>
          </FormField>
        </div>
      </motion.section>

      {/* Здоровье часть 3 */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">{q.men.healthCont}</h2>
        <div className="space-y-4">
          <FormField label={q.women.sleep} required error={errors.sleep?.message}>
            <select {...register('sleep')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Хороший' : 'Good'}>{q.men.sleepOptions.good}</option>
              <option value={locale === 'ru' ? 'Трудно заснуть' : 'Hard to fall asleep'}>{q.men.sleepOptions.hardToFallAsleep}</option>
              <option value={locale === 'ru' ? 'Часто просыпаюсь' : 'Wake up often'}>{q.men.sleepOptions.wakeUpOften}</option>
            </select>
          </FormField>
          <FormField label={q.women.energy} required error={errors.energy?.message}>
            <select {...register('energy')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нормальная' : 'Normal'}>{q.men.energyOptions.normal}</option>
              <option value={locale === 'ru' ? 'Сниженная' : 'Reduced'}>{q.men.energyOptions.reduced}</option>
              <option value={locale === 'ru' ? 'Очень низкая' : 'Very low'}>{q.men.energyOptions.veryLow}</option>
            </select>
          </FormField>
          <FormField label={q.men.memory} required error={errors.memory?.message}>
            <select {...register('memory')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Нет проблем' : 'No problems'}>{q.men.memoryOptions.noProblems}</option>
              <option value={locale === 'ru' ? 'Плохая память' : 'Bad memory'}>{q.men.memoryOptions.badMemory}</option>
              <option value={locale === 'ru' ? 'Плохая концентрация' : 'Bad concentration'}>{q.men.memoryOptions.badConcentration}</option>
              <option value={locale === 'ru' ? 'И память, и концентрация' : 'Both memory and concentration'}>{q.men.memoryOptions.both}</option>
            </select>
          </FormField>
          <FormField label={q.men.cleansing} required error={errors.cleansing?.message}>
            <select {...register('cleansing')}>
              <option value="">{q.select}</option>
              <option value={q.men.cleansingOptions.no}>{q.men.cleansingOptions.no}</option>
              <option value={q.men.cleansingOptions.yes}>{q.men.cleansingOptions.yes}</option>
              <option value={q.men.cleansingOptions.detox}>{q.men.cleansingOptions.detox}</option>
              <option value={q.men.cleansingOptions.fasting}>{q.men.cleansingOptions.fasting}</option>
              <option value={q.men.cleansingOptions.enemas}>{q.men.cleansingOptions.enemas}</option>
              <option value={q.men.cleansingOptions.herbs}>{q.men.cleansingOptions.herbs}</option>
              <option value={q.men.cleansingOptions.other}>{q.men.cleansingOptions.other}</option>
            </select>
          </FormField>
          <FormField label={q.men.mainProblem} required error={errors.mainProblem?.message}>
            <textarea {...register('mainProblem')} rows={3} />
          </FormField>
          <FormField label={q.men.additional} required error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label={q.men.source} required error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Инстаграм' : 'Instagram'}>{q.men.sourceOptions.instagram}</option>
              <option value={locale === 'ru' ? 'Телеграмм канал' : 'Telegram channel'}>{q.men.sourceOptions.telegram}</option>
              <option value={locale === 'ru' ? 'По рекомендации' : 'By recommendation'}>{q.men.sourceOptions.recommendation}</option>
            </select>
          </FormField>
          <FormField label={q.men.hasTests} required error={errors.hasTests?.message}>
            <select {...register('hasTests')}>
              <option value="">{q.select}</option>
              <option value={locale === 'ru' ? 'Да, есть анализы / УЗИ за последние 2–3 месяца' : 'Yes, I have tests / ultrasound from the last 2-3 months'}>{q.men.hasTestsOptions.yes}</option>
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
