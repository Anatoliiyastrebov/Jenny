'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/locale';
import { questionnaireTranslations } from '@/lib/questionnaire-translations';

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
  required?: boolean;
}

export function FileUpload({ files, onChange, label, required }: FileUploadProps) {
  const { locale } = useLocale();
  const q = questionnaireTranslations[locale];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles);
    onChange([...files, ...newFiles]);
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-medical-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-medical-300 bg-medical-50 hover:border-medical-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip,.rar"
        />
        
        <div className="text-center">
          <div className="text-4xl mb-3">📎</div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow transition-all"
            >
              <span>{locale === 'ru' ? 'Выберите файлы' : 'Select files'}</span>
            </button>
            <p className="mt-3 text-sm text-medical-600">
              {locale === 'ru' ? 'или перетащите файлы сюда' : 'or drag files here'}
            </p>
            <p className="mt-2 text-xs text-medical-500">
              {locale === 'ru' ? 'PDF, JPG, PNG, DOC, ZIP и другие форматы' : 'PDF, JPG, PNG, DOC, ZIP and other formats'}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-medical-200 shadow-sm"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-medical-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-medical-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="ml-4 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  {q.removeFile}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

