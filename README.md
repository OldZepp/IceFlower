# 🌸 IceFlower Tasks

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v5_beta-E34F26?logo=nextdotjs&logoColor=white)](https://next-auth.js.org)

Внутренний трекер задач для компании **IceFlower** (~35 человек). Простая замена Jira: Kanban-доска, задачи, комментарии, роли — без лишнего. MVP для демо-портфолио.

---

## ✨ Функционал

- 📋 **Kanban-доска** — 5 колонок (Бэклог → Выполнено) с drag-and-drop (`@hello-pangea/dnd`)
- 👥 **Роли** — `admin` (все проекты, управление) и `member` (только свои проекты и задачи)
- 💬 **Комментарии** — с автором, временем; редактирование и удаление только своих (admin — любые)
- 🏷 **Задачи** — приоритеты, дедлайны, теги, ссылки, исполнитель, лента смены статусов
- 🔍 **Фильтры и поиск** — «Мои задачи» в видах список/доска, фильтры по статусу, проекту, приоритету, сроку; глобальный поиск по проектам и задачам
- 🔔 **Уведомления** — в приложении: назначение задачи, новый комментарий
- 👤 **Профиль** — смена имени и должности, переключатель светлой/тёмной темы
- 📱 **Адаптив** — от 375px: гамбургер-меню, горизонтальный скролл Kanban, формы на весь экран

## 🛠 Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 16 (App Router, Server Components, Cache Components) |
| Язык | TypeScript (strict) |
| Стили | Tailwind CSS v4 + дизайн-токены |
| UI | shadcn/ui-подход, кастомные компоненты |
| DnD | @hello-pangea/dnd |
| Auth | NextAuth.js v5 (credentials, JWT-сессии) |
| БД | Prisma 6 + **SQLite** (демо; в проде — PostgreSQL) |

## 📸 Скриншоты

| Главная | Доска |
|---|---|
| ![Главная](docs/screenshots/home.png) | ![Доска](docs/screenshots/board.png) |

| Мои задачи | Тёмная тема |
|---|---|
| ![Мои задачи](docs/screenshots/my-tasks.png) | ![Тёмная тема](docs/screenshots/dark.png) |

## 🔑 Демо-доступ

Пароль у всех демо-пользователей: `password123`

| Роль | Email | Кто |
|---|---|---|
| 👑 Админ | `anna@iceflower.io` | Анна Волкова, операционный директор |
| 👤 Сотрудник | `ilya@iceflower.io` | Илья Морозов, frontend-разработчик |

На странице логина есть кнопки быстрого входа — можно войти в один клик. Всего в демо-данных 8 сотрудников, 3 проекта и 27 задач.

## 🚀 Запуск

```bash
# 1. Клонировать
git clone <URL_РЕПОЗИТОРИЯ>
cd tracker-3

# 2. Зависимости
npm install

# 3. Переменные окружения
cp .env.example .env
# в .env подставьте свой AUTH_SECRET:
#   DATABASE_URL="file:./dev.db"
#   AUTH_SECRET="$(openssl rand -base64 32)"

# 4. База данных + демо-данные
npm run db:push    # создать таблицы (SQLite dev.db)
npm run db:seed    # засеять: 8 юзеров, 3 проекта, 27 задач

# 5. Запуск
npm run dev        # http://localhost:3000
```

Прод-сборка: `npm run build && npm run start`.

## 🎨 Внедрение брендбука

Дизайн-система построена по брендбуку IceFlower. Все цвета — **только через Tailwind-токены** (`app/globals.css`), хардкод hex в компонентах запрещён.

### Палитра

| Токен | Цвет | Роль в интерфейсе |
|---|---|---|
| `fjord` | Deep Fjord `#0B2E4F` | Основной: сайдбар, хедер, фоны, заголовки |
| `aurora` | Aurora Teal `#00A9A5` | Активные состояния, второстепенные кнопки |
| `glacier` | Glacier `#4CC9F0` | Ссылки, инфоблоки |
| `sun` | Northern Sun `#FF7A59` | Главный CTA («Создать задачу» и т.п.) |
| `graphite` | Graphite `#1B2735` | Текст, тёмные подложки, карточки в тёмной теме |
| `snow` | Snow `#F4F7FA` | Фон рабочей области, разделители |
| `danger` | Danger `#E5484D` | Служебный: просроченные задачи, ошибки |

### Правило 60/30/10

- **60%** — Deep Fjord: сайдбар, хедер, крупные блоки
- **30%** — Snow: рабочая область, карточки
- **10%** — акценты (Aurora, Sun) строго для CTA и активных состояний

### Шрифты

- **Montserrat** — заголовки H1–H6 (подключение через `next/font/google`)
- **Inter** — основной текст

### Логотип

SVG-компонент `<Logo variant="light" | "dark" />` (`components/logo.tsx`) — версия для светлого и тёмного фона. Пропорции и цвета не искажаются.

### Тёмная тема

Не инверсия светлой, а фирменный вариант: фон — Deep Fjord, карточки — Graphite, текст — Snow, акценты — Aurora/Sun. Переключение — в профиле и в шапке.

---

Разработано как демо-портфолио · IceFlower © 2026
