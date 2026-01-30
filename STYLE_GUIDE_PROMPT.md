# Промпт для стилей проекта Jenny Wellness Questionnaire

## Общий стиль дизайна

**Стиль:** Медицинский / Wellness / Премиальный, сдержанный и профессиональный
**Настроение:** Доверие, спокойствие, чистота, профессионализм
**Подход:** Минималистичный, чистый, с легкими анимациями, не перегруженный эффектами

---

## Цветовая палитра

### Primary (Основной акцент - розовый/красный)
```css
primary-50: #fef3f2   /* Очень светлый фон */
primary-100: #fee4e2
primary-200: #fecdca
primary-300: #fda4af
primary-400: #fb7185
primary-500: #f43f5e  /* Основной цвет кнопок и акцентов */
primary-600: #e11d48  /* Hover состояние кнопок */
primary-700: #be123c
primary-800: #9f1239
primary-900: #881337
```

### Medical (Нейтральные серые - основной фон и текст)
```css
medical-50: #f8fafc   /* Фон страницы */
medical-100: #f1f5f9  /* Легкий фон секций */
medical-200: #e2e8f0  /* Границы */
medical-300: #cbd5e1  /* Границы полей ввода */
medical-400: #94a3b8
medical-500: #64748b
medical-600: #475569  /* Вторичный текст */
medical-700: #334155  /* Основной текст */
medical-800: #1e293b
medical-900: #0f172a  /* Заголовки */
```

### Success (Успешные состояния)
```css
success-50: #f0fdf4
success-100: #dcfce7
success-200: #bbf7d0
success-500: #22c55e
success-600: #16a34a
success-700: #15803d
success-800: #166534
```

### Accent (Дополнительный акцент - фиолетовый, опционально)
```css
accent-50: #fdf4ff
accent-500: #d946ef
accent-600: #c026d3
```

---

## Типографика

### Шрифты
- **Основной:** System fonts stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
- **Антиалиасинг:** `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`

### Размеры и веса
- **Заголовки H1:** `text-4xl md:text-5xl font-semibold text-medical-900`
- **Заголовки H2:** `text-2xl font-semibold mb-6 text-medical-900`
- **Заголовки H3:** `text-lg font-semibold text-medical-900`
- **Основной текст:** `text-base text-medical-700`
- **Вторичный текст:** `text-sm text-medical-600`
- **Подсказки:** `text-xs text-medical-600`
- **Ошибки:** `text-sm text-red-600`

---

## Компоненты и их стили

### Кнопки

**Основная кнопка (Submit):**
```css
w-full px-6 py-3 
bg-primary-600 text-white 
rounded-lg font-medium 
shadow-sm 
hover:bg-primary-700 hover:shadow-md 
transition-all 
disabled:opacity-50 disabled:cursor-not-allowed 
flex items-center justify-center gap-2
```

**Состояния:**
- Default: `bg-primary-600`
- Hover: `bg-primary-700 hover:shadow-md`
- Disabled: `opacity-50 cursor-not-allowed`

### Поля ввода (Input, Textarea, Select)

**Базовые стили:**
```css
w-full px-4 py-2.5 
border border-medical-300 
rounded-lg 
bg-white 
text-medical-900 
transition-all duration-200
```

**Состояния:**
- Default: `border-medical-300 bg-white`
- Hover: `border-medical-400`
- Focus: `outline-none border-primary-500` + `box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.1)`
- Focus ring: `focus:ring-2 focus:ring-primary-500`

**Select элементы:**
- Custom arrow через SVG background-image
- `appearance-none cursor-pointer`
- Arrow меняет цвет при focus (серый → primary-500)

### Карточки / Секции

**Базовый контейнер:**
```css
bg-white 
rounded-lg 
shadow-sm 
p-6 md:p-8 
border border-medical-200
```

**Hover эффект (для ссылок):**
```css
hover:shadow-md hover:border-primary-300 
transition-all
```

### Форма поля (FormField)

**Структура:**
- Label: `block text-sm font-medium text-medical-700`
- Required indicator: `text-red-500 ml-1` (звездочка *)
- Hint: `text-xs text-medical-600 mt-1 whitespace-pre-line`
- Error: `text-sm text-red-600`

### Информационные блоки

**GDPR / Privacy блок:**
```css
p-4 
bg-primary-50 
border border-primary-200 
rounded-lg
```

**Success сообщение:**
```css
bg-success-50 
border border-success-200 
rounded-lg p-8 
max-w-lg mx-auto 
shadow-sm
```

---

## Анимации (Framer Motion)

### Базовые анимации входа
```javascript
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, delay: 0.05 }}
```

### Последовательные задержки
- Первый элемент: `delay: 0`
- Второй: `delay: 0.05`
- Третий: `delay: 0.1`
- И так далее с шагом 0.05

### Плавные переходы
- Duration: `0.3s` для большинства элементов
- Easing: по умолчанию (ease-out)

### Условные анимации (FileUpload)
```javascript
initial={{ opacity: 0, height: 0 }}
animate={{ opacity: 1, height: 'auto' }}
exit={{ opacity: 0, height: 0 }}
```

---

## Tailwind CSS конфигурация

### Кастомные цвета
```javascript
colors: {
  primary: { 50-900 },    // Розовый/красный акцент
  medical: { 50-900 },    // Нейтральные серые
  success: { 50-900 },    // Зеленый для успеха
  accent: { 50-900 },     // Фиолетовый (опционально)
}
```

### Кастомные анимации
```javascript
animation: {
  'bounce-slow': 'bounce 2s infinite',
  'pulse-slow': 'pulse 3s infinite',
  'float': 'float 3s ease-in-out infinite',
  'glow': 'glow 2s ease-in-out infinite alternate',
  'slide-in': 'slideIn 0.5s ease-out',
  'scale-in': 'scaleIn 0.3s ease-out',
}
```

### Keyframes
- `float`: плавное движение вверх-вниз
- `glow`: свечение с primary цветом
- `slideIn`: вход слева
- `scaleIn`: масштабирование при появлении

---

## Адаптивность

### Breakpoints (Tailwind по умолчанию)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Мобильные оптимизации
- Font-size: `16px` для предотвращения зума на iOS
- Touch targets: минимум `44x44px` для кнопок и чекбоксов
- Padding: `p-6 md:p-8` (меньше на мобильных)

### Grid layouts
- 1 колонка на мобильных: `grid-cols-1`
- 2 колонки на планшетах: `md:grid-cols-2`
- 3 колонки на десктопе: `lg:grid-cols-3`

---

## Доступность

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus состояния
- Все интерактивные элементы имеют видимый focus ring
- Цвет: `primary-500` с прозрачностью
- Размер: `ring-2`

### Контрастность
- Текст на белом: `medical-900` для заголовков, `medical-700` для основного текста
- Текст на цветном: белый (`text-white`)
- Ошибки: `text-red-600`

---

## Специфичные паттерны

### Sticky элементы
```css
sticky bottom-4 z-10 px-4 sm:px-0
```
Используется для кнопки отправки, которая остается видимой при прокрутке.

### Spacing система
- Между секциями: `space-y-12` или `gap-6`
- Внутри секций: `space-y-4` или `gap-4`
- Padding секций: `p-6 md:p-8`
- Отступы полей: `px-4 py-2.5`

### Тени
- Легкая: `shadow-sm`
- Средняя: `shadow-md` (при hover)
- Без тени для плоского дизайна

### Скругления
- Стандартное: `rounded-lg` (8px)
- Маленькое: `rounded` (4px)
- Большое: `rounded-xl` (12px, редко)

---

## Примеры использования

### Карточка с hover эффектом
```jsx
<div className="bg-white rounded-lg shadow-sm border border-medical-200 hover:shadow-md hover:border-primary-300 transition-all">
  {/* контент */}
</div>
```

### Поле формы
```jsx
<FormField label="Название" required error={error?.message}>
  <input {...register('field')} />
</FormField>
```

### Анимированная секция
```jsx
<motion.section
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: 0.1 }}
  className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-medical-200"
>
  {/* контент */}
</motion.section>
```

### Кнопка отправки
```jsx
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium shadow-sm hover:bg-primary-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>
  Отправить
</button>
```

---

## Принципы дизайна

1. **Консистентность:** Все элементы следуют единой системе стилей
2. **Читаемость:** Высокий контраст, четкая иерархия типографики
3. **Доступность:** Поддержка reduced motion, правильные focus состояния
4. **Производительность:** Легкие анимации, оптимизация для мобильных
5. **Профессионализм:** Сдержанная цветовая палитра, минималистичный подход

---

## Глобальные стили (globals.css)

### Базовые настройки
- `scroll-behavior: smooth`
- Фон страницы: `#f8fafc` (medical-50)
- Box-sizing: `border-box` для всех элементов

### Унифицированные стили полей
Все `input`, `textarea`, `select` получают единые стили через `@layer base`:
- Белый фон
- Серая граница
- Скругление
- Плавные переходы
- Кастомная стрелка для select

---

## Итоговый чеклист для применения

- [ ] Настроить Tailwind с кастомными цветами (primary, medical, success)
- [ ] Применить системные шрифты
- [ ] Настроить базовые стили для полей ввода
- [ ] Создать компонент FormField с едиными стилями
- [ ] Применить цветовую палитру к кнопкам и акцентам
- [ ] Настроить Framer Motion с легкими анимациями
- [ ] Добавить поддержку reduced motion
- [ ] Оптимизировать для мобильных (font-size, touch targets)
- [ ] Применить spacing систему
- [ ] Использовать единые тени и скругления

