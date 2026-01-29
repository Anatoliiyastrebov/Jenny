'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { childQuestionnaireSchema, type ChildQuestionnaire } from '@/lib/questionnaire-schemas';
import { FormField } from '@/components/FormField';
import { FileUpload } from '@/components/FileUpload';
import { useLocale } from '@/lib/locale';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';
import { motion } from 'framer-motion';

export default function ChildQuestionnairePage() {
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Основная информация</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Возраст ребенка" required error={errors.age?.message}>
            <input type="number" {...register('age')} />
          </FormField>
          <FormField label="Вес ребенка (кг)" required error={errors.weight?.message}>
            <input type="number" step="0.1" {...register('weight')} />
          </FormField>
        </div>
        <div className="space-y-4 mt-4">
          <FormField label="Пищеварение" error={errors.digestion?.message}>
            <textarea {...register('digestion')} placeholder="Боли в животе (особенно ночью), диарея, запор" rows={3} />
          </FormField>
          <FormField label="Зубы" error={errors.teeth?.message}>
            <textarea {...register('teeth')} placeholder="Быстро портятся, неприятный запах изо рта" rows={2} />
          </FormField>
          <FormField label="Потеет во сне, скрипит зубами" error={errors.nightSweating?.message}>
            <select {...register('nightSweating')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Поведение и здоровье</h2>
        <div className="space-y-4">
          <FormField label="Просит постоянно сладкое, вплоть до истерик. Живет на перекусах, при этом отказывается от домашней еды" error={errors.sweets?.message}>
            <select {...register('sweets')}>
              <option value="">Выберите...</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
              <option value="Иногда">Иногда</option>
            </select>
          </FormField>
          <FormField label="Высыпания на коже, экзема, дерматит" error={errors.skinIssues?.message}>
            <select {...register('skinIssues')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Высыпания">Высыпания</option>
              <option value="Экзема">Экзема</option>
              <option value="Дерматит">Дерматит</option>
            </select>
          </FormField>
          <FormField label="Аллергия" error={errors.allergies?.message}>
            <textarea {...register('allergies')} placeholder="На цветение, животных, пыль, еду, лекарства" rows={2} />
          </FormField>
          <FormField label="Гиперактивный или часто жалуется на усталость" error={errors.hyperactivity?.message}>
            <select {...register('hyperactivity')}>
              <option value="">Выберите...</option>
              <option value="Гиперактивный">Гиперактивный</option>
              <option value="Часто жалуется на усталость">Часто жалуется на усталость</option>
              <option value="Нет проблем">Нет проблем</option>
            </select>
          </FormField>
          <FormField label="Сколько воды в день пьет (миллилитров)" error={errors.waterIntake?.message}>
            <input type="number" {...register('waterIntake')} placeholder="Чай, кофе, компоты, супы — НЕ считаются водой" />
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Травмы и заболевания</h2>
        <div className="space-y-4">
          <FormField label="Травмы, операции, удары по голове, сильные падения, переломы" error={errors.injuries?.message}>
            <textarea {...register('injuries')} rows={3} />
          </FormField>
          <FormField label="Жалобы на головную боль, плохой сон" error={errors.headaches?.message}>
            <select {...register('headaches')}>
              <option value="">Выберите...</option>
              <option value="Нет проблем">Нет проблем</option>
              <option value="Головные боли">Головные боли</option>
              <option value="Плохой сон">Плохой сон</option>
              <option value="И головные боли, и плохой сон">И головные боли, и плохой сон</option>
            </select>
          </FormField>
          <FormField label="Сколько раз в году болеет, даете ли антибиотики и другие лекарства" error={errors.illnesses?.message}>
            <textarea {...register('illnesses')} rows={3} />
          </FormField>
          <FormField label="Суставы" error={errors.joints?.message}>
            <textarea {...register('joints')} placeholder="Жалобы на боли в ножках, просит сделать массаж ножек, часто просится на руки во время прогулки" rows={3} />
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
        <h2 className="text-2xl font-semibold mb-6 text-medical-900">Завершение</h2>
        <div className="space-y-4">
          <FormField label="Что еще Вы хотите добавить о здоровье ребенка" error={errors.additional?.message}>
            <textarea {...register('additional')} rows={4} />
          </FormField>
          <FormField label="Как вы обо мне узнали" error={errors.source?.message}>
            <select {...register('source')}>
              <option value="">Выберите...</option>
              <option value="Телеграмм">Телеграмм</option>
              <option value="Инстаграм">Инстаграм</option>
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
