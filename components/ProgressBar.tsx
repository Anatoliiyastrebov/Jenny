'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-3">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Уровень {current}
          </span>
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-xl"
          >
            ⭐
          </motion.span>
        </motion.div>
        <motion.span 
          className="text-lg font-bold text-primary-600"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {Math.round(percentage)}%
        </motion.span>
      </div>
      <div className="relative w-full bg-gradient-to-r from-medical-200 via-medical-100 to-medical-200 rounded-full h-6 overflow-hidden shadow-inner">
        <motion.div
          className="relative h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "spring",
            stiffness: 50,
            damping: 15,
            duration: 0.8
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity
            }}
          >
            <span className="text-2xl">🎯</span>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        className="mt-2 text-center text-sm text-medical-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {current === total ? (
          <span className="font-bold text-success-600">🎉 Готово! Отправляем...</span>
        ) : (
          <span>Продолжайте! Осталось {total - current} шагов 🚀</span>
        )}
      </motion.div>
    </div>
  );
}

