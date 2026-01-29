'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { infantQuestionnaireSchema, type InfantQuestionnaire } from '@/lib/questionnaire-schemas';
import { FormField } from '@/components/FormField';
import { FileUpload } from '@/components/FileUpload';
import { useLocale } from '@/lib/locale';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';
import { motion } from 'framer-motion';

export default function InfantQuestionnairePage() {
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Личные данные</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Имя" required error={errors.firstName?.message}>
            <input {...register('firstName')} />
          </FormField>
          <FormField label="Возраст (в месяцах)" required error={errors.ageMonths?.message}>
            <input type="number" {...register('ageMonths')} />
          </FormField>
          <FormField label="Вес (кг)" required error={errors.weight?.message}>
            <input type="number" step="0.1" {...register('weight')} />
          </FormField>
          <FormField label="Страна" required error={errors.country?.message}>
            <input {...register('country')} />
          </FormField>
          <FormField label="Город" required error={errors.city?.message}>
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Здоровье</h2>
        <div className="space-y-4">
          <FormField label="Пищеварение" error={errors.digestion?.message}>
            <select {...register('digestion')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Боли в животе">Боли в животе</option>
              <option value="Диарея">Диарея</option>
              <option value="Запор">Запор</option>
            </select>
          </FormField>
          <FormField label="Потеет во сне" error={errors.nightSweating?.message}>
            <select {...register('nightSweating')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Есть ли неприятный запах изо рта" error={errors.badBreath?.message}>
            <select {...register('badBreath')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Родинки / папилломы / красные точки / высыпания / экзема / псориаз" error={errors.skinIssues?.message}>
            <select {...register('skinIssues')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Родинки">Родинки</option>
              <option value="Папилломы">Папилломы</option>
              <option value="Красные точки">Красные точки</option>
              <option value="Высыпания">Высыпания</option>
              <option value="Экзема">Экзема</option>
              <option value="Псориаз">Псориаз</option>
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
              <option value="Другое">Другое</option>
            </select>
          </FormField>
          <FormField label="Сколько воды в день пьёт ребенок (миллилитров)" error={errors.waterIntake?.message}>
            <input type="number" {...register('waterIntake')} placeholder="Чай, кофе, компоты, супы — НЕ считаются водой" />
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Травмы и здоровье</h2>
        <div className="space-y-4">
          <FormField label="Травмы / операции / удары по голове / переломы" error={errors.injuries?.message}>
            <select {...register('injuries')}>
              <option value="">Выберите...</option>
              <option value="Все в порядке">Все в порядке</option>
              <option value="Травмы">Травмы</option>
              <option value="Операции">Операции</option>
              <option value="Удары по голове">Удары по голове</option>
              <option value="Переломы">Переломы</option>
              <option value="Сильные падения">Сильные падения</option>
            </select>
          </FormField>
          <FormField label="Дополнительно о травмах" error={errors.injuriesDetails?.message}>
            <textarea {...register('injuriesDetails')} rows={3} />
          </FormField>
          <FormField label="Хорошо ли спит" error={errors.sleep?.message}>
            <select {...register('sleep')}>
              <option value="">Выберите...</option>
              <option value="Хорошо">Хорошо</option>
              <option value="Плохо">Плохо</option>
              <option value="Иногда проблемно">Иногда проблемно</option>
            </select>
          </FormField>
          <FormField label="Часто ли болеет / принимал ли антибиотики" error={errors.illnesses?.message}>
            <select {...register('illnesses')}>
              <option value="">Выберите...</option>
              <option value="Редко болеет">Редко болеет</option>
              <option value="Часто болеет">Часто болеет</option>
              <option value="Принимал антибиотики">Принимал антибиотики</option>
              <option value="И часто болеет, и принимал антибиотики">И часто болеет, и принимал антибиотики</option>
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Роды и беременность</h2>
        <div className="space-y-4">
          <FormField label="Как прошли роды" error={errors.birthType?.message}>
            <select {...register('birthType')}>
              <option value="">Выберите...</option>
              <option value="Естественно">Естественно</option>
              <option value="Кесарево">Кесарево</option>
            </select>
          </FormField>
          <FormField label="Был ли у мамы сильный токсикоз при беременности" error={errors.toxemia?.message}>
            <select {...register('toxemia')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Была ли у мамы аллергия до или во время беременности" error={errors.motherAllergies?.message}>
            <select {...register('motherAllergies')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Был ли у мамы запор" error={errors.motherConstipation?.message}>
            <select {...register('motherConstipation')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Пила ли мама антибиотики во время беременности" error={errors.motherAntibiotics?.message}>
            <select {...register('motherAntibiotics')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Была ли анемия у мамы" error={errors.motherAnemia?.message}>
            <select {...register('motherAnemia')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>
          </FormField>
          <FormField label="Были ли проблемы во время беременности" error={errors.pregnancyProblems?.message}>
            <select {...register('pregnancyProblems')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Завершение</h2>
        <div className="space-y-4">
          <FormField label="Что ещё нужно знать о здоровье ребёнка" error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label="Ваша основная проблема, которую хотелось бы решить?" error={errors.mainProblem?.message}>
            <textarea {...register('mainProblem')} rows={3} />
          </FormField>
          <FormField label="Как вы обо мне узнали?" error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">Выберите...</option>
              <option value="Инстаграм">Инстаграм</option>
              <option value="Телеграмм канал">Телеграмм канал</option>
              <option value="По рекомендации">По рекомендации</option>
            </select>
          </FormField>
          <FormField label="Есть ли анализы / УЗИ за последние 2–3 месяца?" error={errors.hasTests?.message}>
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
        transition={{ duration: 0.3, delay: 0.5 }}
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
