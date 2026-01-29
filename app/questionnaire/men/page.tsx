'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menQuestionnaireSchema, type MenQuestionnaire } from '@/lib/questionnaire-schemas';
import { FormField } from '@/components/FormField';
import { FileUpload } from '@/components/FileUpload';
import { useLocale } from '@/lib/locale';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';
import { motion } from 'framer-motion';

export default function MenQuestionnairePage() {
  const { locale } = useLocale();
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

      {/* Здоровье часть 1 */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Здоровье</h2>
        <div className="space-y-4">
          <FormField label="Устраивает ли вас ваш вес?" error={errors.weightSatisfaction?.message}>
            <select {...register('weightSatisfaction')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Хотели бы вы изменить вес?" error={errors.weightChange?.message}>
            <select {...register('weightChange')}>
              <option value="">Выберите...</option>
              <option value="Нет">Нет</option>
              <option value="Да, хотелось бы похудеть">Да, хотелось бы похудеть</option>
              <option value="Да, хотелось бы набрать">Да, хотелось бы набрать</option>
            </select>
          </FormField>
          <FormField label="Был ли ковид или вакцина" error={errors.covid?.message}>
            <select {...register('covid')}>
              <option value="">Выберите...</option>
              <option value="Нет">Нет</option>
              <option value="Болел">Болел</option>
              <option value="Вакцинирован">Вакцинирован</option>
              <option value="Болел и вакцинирован">Болел и вакцинирован</option>
            </select>
          </FormField>
          <FormField label="Пищеварение" error={errors.digestion?.message}>
            <select {...register('digestion')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Изжога">Изжога</option>
              <option value="Вздутие">Вздутие</option>
              <option value="Диарея">Диарея</option>
              <option value="Запор">Запор</option>
            </select>
          </FormField>
          <FormField label="Варикоз или геморрой" error={errors.varicose?.message}>
            <select {...register('varicose')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Варикоз">Варикоз</option>
              <option value="Геморрой">Геморрой</option>
              <option value="Оба">Оба</option>
            </select>
          </FormField>
          <FormField label="Зубы" error={errors.teeth?.message}>
            <select {...register('teeth')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Крошатся">Крошатся</option>
              <option value="Часто портятся">Часто портятся</option>
              <option value="Запах изо рта">Запах изо рта</option>
              <option value="Кровоточивость">Кровоточивость</option>
            </select>
          </FormField>
          <FormField label="Суставы" error={errors.joints?.message}>
            <select {...register('joints')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Хруст">Хруст</option>
              <option value="Скрип">Скрип</option>
              <option value="Воспаление">Воспаление</option>
            </select>
          </FormField>
          <FormField label="Руки-ноги холодные даже летом" error={errors.coldLimbs?.message}>
            <select {...register('coldLimbs')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Здоровье (продолжение)</h2>
        <div className="space-y-4">
          <FormField label="Головные боли, мигрени, травмы/сотрясение" error={errors.headaches?.message}>
            <select {...register('headaches')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Головные боли">Головные боли</option>
              <option value="Мигрени">Мигрени</option>
              <option value="Травмы">Травмы</option>
              <option value="Сотрясение">Сотрясение</option>
            </select>
          </FormField>
          <FormField label="Операции" error={errors.operations?.message}>
            <select {...register('operations')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Кисты, песок или камни в почках/желчном" error={errors.stones?.message}>
            <select {...register('stones')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Кисты">Кисты</option>
              <option value="Песок">Песок</option>
              <option value="Камни в почках">Камни в почках</option>
              <option value="Камни в желчном">Камни в желчном</option>
            </select>
          </FormField>
          <FormField label="Давление. Пьете ли таблетки?" error={errors.pressure?.message}>
            <select {...register('pressure')}>
              <option value="">Выберите...</option>
              <option value="Низкое">Низкое</option>
              <option value="Высокое">Высокое</option>
              <option value="Нормальное">Нормальное</option>
            </select>
          </FormField>
          <FormField label="Сколько воды в день (литров)" error={errors.waterIntake?.message}>
            <select {...register('waterIntake')}>
              <option value="">Выберите...</option>
              <option value="1 литр">1 литр</option>
              <option value="1.5 литра">1.5 литра</option>
              <option value="2 литра">2 литра</option>
              <option value="2.5 литра">2.5 литра</option>
              <option value="3 литра">3 литра</option>
              <option value="3.5 литра">3.5 литра</option>
            </select>
          </FormField>
          <FormField label="Родинки, бородавки, герпес" error={errors.moles?.message}>
            <select {...register('moles')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Родинки">Родинки</option>
              <option value="Папилломы">Папилломы</option>
              <option value="Красные точки">Красные точки</option>
              <option value="Герпес">Герпес</option>
            </select>
          </FormField>
          <FormField label="Аллергия" error={errors.allergies?.message}>
            <select {...register('allergies')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Цветение">Цветение</option>
              <option value="Животные">Животные</option>
              <option value="Пыль">Пыль</option>
              <option value="Еда">Еда</option>
              <option value="Лекарства">Лекарства</option>
              <option value="Другое">Другое</option>
            </select>
          </FormField>
          <FormField label="Кожа" error={errors.skin?.message}>
            <select {...register('skin')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Сухая">Сухая</option>
              <option value="Высыпания">Высыпания</option>
              <option value="Раздражение">Раздражение</option>
              <option value="Прыщи">Прыщи</option>
              <option value="Другое">Другое</option>
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Здоровье (продолжение)</h2>
        <div className="space-y-4">
          <FormField label="Сон" error={errors.sleep?.message}>
            <select {...register('sleep')}>
              <option value="">Выберите...</option>
              <option value="Хороший">Хороший</option>
              <option value="Трудно заснуть">Трудно заснуть</option>
              <option value="Часто просыпаюсь">Часто просыпаюсь</option>
            </select>
          </FormField>
          <FormField label="Энергия" error={errors.energy?.message}>
            <select {...register('energy')}>
              <option value="">Выберите...</option>
              <option value="Нормальная">Нормальная</option>
              <option value="Сниженная">Сниженная</option>
              <option value="Очень низкая">Очень низкая</option>
            </select>
          </FormField>
          <FormField label="Память и концентрация" error={errors.memory?.message}>
            <select {...register('memory')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Плохая память">Плохая память</option>
              <option value="Плохая концентрация">Плохая концентрация</option>
              <option value="И память, и концентрация">И память, и концентрация</option>
            </select>
          </FormField>
          <FormField label="Делали ли вы ранее что-то для очищения организма?" error={errors.cleansing?.message}>
            <textarea {...register('cleansing')} placeholder="Если да, то что?" rows={3} />
          </FormField>
          <FormField label="Ваша основная проблема, которую хотелось бы решить?" error={errors.mainProblem?.message}>
            <textarea {...register('mainProblem')} rows={3} />
          </FormField>
          <FormField label="Что ещё нужно знать о вашем здоровье" error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label="Как вы обо мне узнали?" error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">Выберите...</option>
              <option value="Инстаграм">Инстаграм</option>
              <option value="Телеграмм канал">Телеграмм канал</option>
              <option value="По рекомендации">По рекомендации</option>
            </select>
          </FormField>
          <FormField label="Если есть анализы и узи за последние 3 месяца - приложите" error={errors.hasTests?.message}>
            <select {...register('hasTests')}>
              <option value="">Выберите...</option>
              <option value="Да, есть анализы / УЗИ за последние 2–3 месяца">Да, есть анализы / УЗИ за последние 2–3 месяца</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>

          {hasTests === 'Да, есть анализы / УЗИ за последние 2–3 месяца' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FileUpload
                files={files}
                onChange={(newFiles) => setValue('files', newFiles)}
                label="Приложите файлы"
              />
            </motion.div>
          )}

          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-medical-700">
              <strong>Конфиденциальность:</strong> Ваши данные будут отправлены в защищённую группу Telegram. Мы не храним ваши персональные данные на сервере.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Кнопка отправки */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="sticky bottom-4 z-10"
      >
        <button
          type="submit"
          disabled={isSubmitting}
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
