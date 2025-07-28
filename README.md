# Legal AI System

Современная система управления юридическими делами с AI-ассистентом, построенная на Next.js 14, TypeScript и Tailwind CSS.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env.local` в корне проекта:

```bash
# Скопируйте пример файла окружения
cp .env.example .env.local

# Отредактируйте .env.local с вашими реальными значениями
# См. файл .env.example для всех необходимых переменных
```

**Основные переменные для разработки:**
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-change-in-production

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Social Authentication (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_ID=your-apple-client-id
APPLE_SECRET=your-apple-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### 3. Запуск сервера разработки
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🔐 Аутентификация

### Тестовые аккаунты
- **Admin**: `admin@legalai.com` / `password`
- **Lawyer**: `lawyer@legalai.com` / `password`

### Социальная аутентификация
Система поддерживает вход через:
- **Google** - Настройте OAuth 2.0 в Google Cloud Console
- **Apple** - Настройте Sign in with Apple в Apple Developer Console
- **Facebook** - Настройте Facebook Login в Facebook Developers

#### Демо-режим (Разработка)
В режиме разработки (`NODE_ENV=development`) социальная аутентификация работает в демо-режиме:
- Симулирует успешный вход через социальные сети
- Создает тестовые пользовательские данные
- Показывает уведомления о процессе
- Автоматически перенаправляет на dashboard

#### Продакшн настройка
Для продакшна настройте переменные окружения:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_ID=your-apple-client-id
APPLE_SECRET=your-apple-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### Валидация форм
- **Email** - Проверка формата и уникальности
- **Пароль** - Минимум 8 символов, заглавные/строчные буквы, цифры, спецсимволы
- **Имя** - Только буквы и пробелы
- **Телефон** - Международный формат
- **Номер адвоката** - Буквы, цифры, дефисы

### API Endpoints

#### POST `/api/auth/login`
Вход в систему
```json
{
  "email": "admin@legalai.com",
  "password": "password"
}
```

#### POST `/api/auth/register`
Регистрация нового пользователя
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firm": "Legal Partners",
  "position": "Partner",
  "barNumber": "12345",
  "specialization": "Corporate Law",
  "notifications": true,
  "language": "en",
  "terms": true,
  "privacy": true
}
```

#### POST `/api/auth/verify-email`
Подтверждение email
```json
{
  "token": "verification-token"
}
```

#### POST `/api/auth/forgot-password`
Запрос на сброс пароля
```json
{
  "email": "admin@legalai.com"
}
```

#### POST `/api/auth/reset-password`
Сброс пароля
```json
{
  "token": "reset-token",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### POST `/api/auth/logout`
Выход из системы

#### GET `/api/auth/me`
Получение профиля текущего пользователя

## 🏗️ Архитектура

### Frontend
- **Next.js 14** - React framework с App Router
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Анимации
- **React Hook Form** - Управление формами
- **Zod** - Валидация данных
- **NextAuth.js** - Аутентификация (включая социальную)
- **React Icons** - Иконки для социальной аутентификации

### Backend (API Routes)
- **Next.js API Routes** - Серверные endpoints
- **JWT** - Аутентификация
- **bcryptjs** - Хеширование паролей
- **Zod** - Валидация на сервере

### Структура проекта
```
├── app/
│   ├── api/auth/          # API endpoints для аутентификации
│   ├── api/profile/       # API endpoints для профиля
│   ├── login/             # Страница входа
│   ├── register/          # Страница регистрации
│   ├── dashboard/         # Главная панель
│   ├── profile/           # Профиль пользователя
│   ├── ai-assistant/      # AI ассистент
│   ├── cases/             # Управление делами
│   └── settings/          # Настройки приложения
├── components/
│   ├── layout/            # Компоненты макета
│   ├── ui/                # UI компоненты
│   ├── auth/              # Компоненты аутентификации
│   ├── profile/           # Компоненты профиля
│   ├── settings/          # Компоненты настроек
│   └── providers/         # Провайдеры контекста
├── contexts/
│   └── AppContext.tsx     # Контекст для языка и темы
├── hooks/


├── lib/
│   ├── auth.ts            # Утилиты аутентификации
│   ├── utils.ts           # Общие утилиты
│   └── translations.ts    # Файлы переводов
└── types/
    └── index.ts           # TypeScript типы
```

## 🎨 Дизайн система

### Мультиязычность и темы
Система поддерживает 5 языков и 5 цветовых тем:

#### 🌍 Поддерживаемые языки:
- **🇺🇸 English** - Английский
- **🇺🇦 Українська** - Украинский
- **🇷🇺 Русский** - Русский
- **🇩🇪 Deutsch** - Немецкий
- **🇫🇷 Français** - Французский

#### 🎨 Доступные темы:
- **Dark Blue** - Темно-синяя (профессиональная)
- **Dark Purple** - Темно-фиолетовая (элегантная)
- **Dark Green** - Темно-зеленая (спокойная)
- **Dark Red** - Темно-красная (энергичная)
- **Dark Orange** - Темно-оранжевая (теплая)

#### 📍 Где доступны переключатели:
- **Страницы авторизации** - компактные переключатели в правом верхнем углу
- **Header приложения** - компактные переключатели в правой части
- **Settings** (`/settings/appearance`) - полная страница настроек
- **Sidebar** - ссылка "Appearance & Language" в настройках

### Цветовая палитра (по умолчанию)
- **Primary Blue**: #0066FF
- **Surface Dark**: #0A0E1A
- **Surface Medium**: #161B2E
- **Surface Light**: #1E2438
- **Text Primary**: #FFFFFF
- **Text Secondary**: #8B92B5
- **Accent Green**: #00D084
- **Accent Orange**: #FF8A00
- **Accent Red**: #FF4757

### Компоненты
- Glass morphism эффекты
- Градиентные кнопки
- Анимированные переходы
- Responsive дизайн

## 🔧 Разработка

### Добавление новых API endpoints
1. Создайте файл в `app/api/`
2. Экспортируйте функции `GET`, `POST`, `PUT`, `DELETE`
3. Используйте `NextRequest` и `NextResponse`

### Добавление новых страниц
1. Создайте папку в `app/`
2. Добавьте `page.tsx`
3. Обновите навигацию в `Sidebar.tsx`

### Стилизация
- Используйте Tailwind CSS классы
- Следуйте дизайн системе
- Добавляйте анимации с Framer Motion

## 🚀 Продакшн

### Сборка
```bash
npm run build
```

### Запуск
```bash
npm start
```

### Переменные окружения для продакшна
```env
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_API_URL=https://your-domain.com
NODE_ENV=production
```

## 📝 TODO

- [ ] Интеграция с реальной базой данных
- [ ] Email сервис для уведомлений
- [ ] Загрузка файлов
- [ ] AI интеграция
- [ ] Мобильное приложение
- [x] Многоязычность ✅
- [x] Переключение тем ✅
- [ ] Аналитика и отчеты

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📄 Лицензия

MIT License 