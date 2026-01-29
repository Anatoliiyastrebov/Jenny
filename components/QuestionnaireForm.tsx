'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';

interface QuestionnaireFormProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export function QuestionnaireForm({
  currentStep,
  totalSteps,
  children,
  onBack,
  onNext,
  onSubmit,
  isLastStep = false,
  isSubmitting = false,
}: QuestionnaireFormProps) {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProgressBar current={currentStep} total={totalSteps} />
      
      <motion.div 
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-primary-200/50"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={{ boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
      >
        {children}
      </motion.div>

      <div className="flex justify-between items-center pt-6">
        {onBack && (
          <motion.button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-medical-200 to-medical-300 text-medical-700 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span>←</span>
            <span>Назад</span>
          </motion.button>
        )}
        
        <div className="ml-auto">
          {isLastStep ? (
            <motion.button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isSubmitting ? {} : {
                boxShadow: [
                  "0 0 20px rgba(244, 63, 94, 0.4)",
                  "0 0 40px rgba(244, 63, 94, 0.6)",
                  "0 0 20px rgba(244, 63, 94, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center gap-2 text-lg"
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⏳
                  </motion.span>
                  <span>Отправка...</span>
                </>
              ) : (
                <>
                  <span>Отправить</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🚀
                  </motion.span>
                </>
              )}
            </motion.button>
          ) : (
            onNext && (
              <motion.button
                type="button"
                onClick={onNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 text-lg"
              >
                <span>Далее</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

