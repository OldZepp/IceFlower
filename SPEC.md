IceFlower Tasks — Specification
1. Overview
Внутренний трекер задач для компании IceFlower (~35 человек). Цель — заменить Jira на более простое решение: Kanban-доска, список задач, комментарии, роли. MVP для демо-портфолио. Срок разработки — 1 сутки. Деплой через GitVerse → ONREZA.

2. Роли и доступ (упрощено)
Две роли вместо трёх из исходного ТЗ:

admin — видит все проекты и задачи, создаёт/редактирует проекты, создаёт задачи, назначает исполнителей, управляет пользователями (через seed), архивирует проекты.

member — видит только проекты, в которые добавлен; может менять статус своих задач, комментировать, создавать задачи, если это разрешено проектом (для MVP — разрешено всем member).

Роль «руководитель проекта» из исходного ТЗ не выделяется отдельно — её функции в демо выполняет admin.

3. Scope
Included (делаем)
Аутентификация по email/паролю (демо-пользователи из seed), логаут, сохранение сессии после обновления страницы.

Главная: виджеты (активные задачи, просроченные, задачи на текущую неделю, ближайшие дедлайны, последние обновления, «Мои проекты»).

«Мои задачи»: список + Kanban-вид, фильтры (статус, проект, приоритет, срок, только просроченные), поиск по названию.

Проекты: карточки (название, описание, руководитель, кол-во открытых задач, кол-во участников, дата завершения, статус).

Страница проекта: вкладки «Доска», «Список задач», «Участники», «Информация».

Kanban-доска: 5 колонок (Бэклог, Запланировано, В работе, На проверке, Выполнено), drag-and-drop для смены статуса.

Карточка задачи: создание/редактирование (название, описание, проект, статус, исполнитель, постановщик, приоритет, дата создания, дедлайн, теги, ссылки).

Страница задачи: все поля + комментарии + лента смены статусов.

Комментарии: имя/инициалы автора, текст, дата/время; редактирование/удаление только своих (admin — любые).

«Команда»: список сотрудников (имя, должность, инициалы, email, кол-во активных задач, кол-во просроченных, текущая загрузка).

Уведомления внутри приложения: назначение задачи, новый комментарий к задаче.

Глобальный поиск: проекты и задачи (без сотрудников — упрощение).

Профиль: смена имени, должности, переключатель светлой/тёмной темы. Email и роль — только через seed/admin.

Адаптив: desktop (сайдбар + полная доска), mobile (гамбургер, одна колонка, горизонтальный скролл колонок Kanban, формы на весь экран).

Excluded (не делаем)
Загрузка файлов — только URL-ссылки.

Смена пароля, загрузка аватара — только инициалы.

Полная история изменений — только лента смены статусов.

Фоновые уведомления о приближении дедлайна — только события «назначена задача» и «новый комментарий».

Поиск сотрудников — только проекты и задачи.

Роль «руководитель проекта» — функции выполняет admin.

Видеозвонки, чат, диаграмма Ганта, учёт часов, интеграции Telegram/Email, импорт Jira, пользовательские типы задач, несколько workspace, платная подписка.

Отдельная страница управления пользователями — пользователи создаются через seed.

4. Technical Stack
Framework: Next.js (App Router)

Language: TypeScript (strict)

UI: Tailwind CSS + shadcn/ui

DnD: @hello-pangea/dnd

Auth: NextAuth.js (credentials)

DB: PostgreSQL (ONREZA) + Prisma

Deploy: ONREZA (GitVerse → ONREZA, автодеплой)

5. Brandbook Rules (обязательно)
Источник — брендбук IceFlower (см. brandbook.pptx).

Палитра (только через Tailwind-токены, никаких hex в компонентах)
fjord — Deep Fjord #0B2E4F — основной: сайдбар, хедер, фоны, заголовки.

aurora — Aurora Teal #00A9A5 — дополнительный: активные состояния, второстепенные кнопки.

glacier — Glacier #4CC9F0 — акцент: ссылки, инфоблоки.

sun — Northern Sun #FF7A59 — главный CTA (кнопка «Создать задачу» и т.п.).

graphite — Graphite #1B2735 — текст, тёмные подложки.

snow — Snow #F4F7FA — фон, разделители, карточки.

Правило 60/30/10
60% — Deep Fjord (сайдбар, хедер, крупные блоки).

30% — Snow (рабочая область, карточки).

10% — акценты (Aurora, Sun) только для CTA и активных состояний. Не заливать макет акцентными цветами.

Шрифты
Заголовки: Montserrat (Regular, Medium, SemiBold, Bold).

Текст: Inter / Segoe UI (Regular, Medium, SemiBold).

Подключение через next/font/google.

Типографика
H1: 48/56 Bold (Montserrat)

H2: 34/42 Bold (Montserrat)

H3: 24/32 SemiBold (Montserrat)

Body L: 18/28 Regular (Inter)

Body M: 14/22 Regular (Inter)

Caption: 11/16 Medium (Inter)

Логотип
SVG-компонент <Logo variant="light" | "dark" />.

На светлом фоне — основная версия, на тёмном — белая.

Не искажать пропорции, не менять цвета, не добавлять тени/обводки, не поворачивать.

Тон микрокопии
Короткие утверждения, без канцелярита и англицизмов, если есть русский аналог.

«Создать задачу», «Проверьте дедлайн», «Не удалось загрузить. Попробуйте ещё раз».

Уверенные формулировки, без «возможно/постараемся».

Тёмная тема
Фон: Deep Fjord, карточки: Graphite, текст: Snow, акценты: Aurora/Sun.

Не инверсия светлой темы, а фирменный вариант.

6. Data Model
Схема Prisma. Файл: prisma/schema.prisma.

```prisma

model User {
id String @id @default(cuid())
email String @unique
passwordHash String
name String
position String?
role String @default("member") // "admin" | "member"
avatarInitials String?
createdAt DateTime @default(now())
projects Project[] @relation("ProjectMembers")
ledProjects Project[] @relation("ProjectLead")
assignedTasks Task[] @relation("TaskAssignee")
createdTasks Task[] @relation("TaskCreator")
comments Comment[]
statusChanges StatusHistory[]
notifications Notification[]
}

model Project {
id String @id @default(cuid())
name String
description String?
leadId String
lead User @relation("ProjectLead", fields: [leadId], references: [id])
members User[] @relation("ProjectMembers")
startDate DateTime?
endDate DateTime?
status String @default("planning") // "planning" | "active" | "paused" | "completed" | "archived"
createdAt DateTime @default(now())
tasks Task[]
}

model Task {
id String @id @default(cuid())
key String @unique // ICF-1, ICF-2, ...
title String
description String?
projectId String
project Project @relation(fields: [projectId], references: [id])
status String @default("backlog") // "backlog" | "planned" | "in_progress" | "review" | "done"
priority String @default("medium") // "low" | "medium" | "high" | "critical"
assigneeId String?
assignee User? @relation("TaskAssignee", fields: [assigneeId], references: [id])
creatorId String
creator User @relation("TaskCreator", fields: [creatorId], references: [id])
deadline DateTime?
tags String[] @default([])
links String[] @default([])
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
comments Comment[]
statusHistory StatusHistory[]
notifications Notification[]
}

model Comment {
id String @id @default(cuid())
taskId String
task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
authorId String
author User @relation(fields: [authorId], references: [id])
text String
createdAt DateTime @default(now())
editedAt DateTime?
}

model StatusHistory {
id String @id @default(cuid())
taskId String
task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
fromStatus String
toStatus String
changedById String
changedBy User @relation(fields: [changedById], references: [id])
changedAt DateTime @default(now())
}

model Notification {
id String @id @default(cuid())
userId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
type String // "assigned" | "comment"
taskId String
task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
read Boolean @default(false)
createdAt DateTime @default(now())
}
```
7. Seed Data (обязательно)
Скрипт prisma/seed.ts создаёт:

Пользователи (8)
Имя	Должность	Роль	Email
Анна Волкова	Операционный директор	admin	anna@iceflower.io
Максим Орлов	Руководитель проекта	admin	maksim@iceflower.io
Елена Соколова	Дизайнер	member	elena@iceflower.io
Илья Морозов	Frontend-разработчик	member	ilya@iceflower.io
Виктор Лебедев	Backend-разработчик	member	viktor@iceflower.io
Ольга Крылова	Маркетолог	member	olga@iceflower.io
Дмитрий Фролов	Тестировщик	member	dmitry@iceflower.io
Мария Белова	Аналитик	member	maria@iceflower.io
Пароль для всех: password123 (для демо).

Проекты (3)
«Разработка сайта для клиента GreenStone» — lead: Максим, участники: Елена, Илья, Виктор, Дмитрий, статус: active.

«Запуск рекламной кампании IceFlower» — lead: Анна, участники: Ольга, Елена, Мария, статус: active.

«Внутренняя автоматизация отдела продаж» — lead: Максим, участники: Виктор, Мария, Илья, статус: planning.

Задачи (25+)
Разные статусы: backlog, planned, in_progress, review, done.

Разные приоритеты: low, medium, high, critical.

3–4 задачи с deadline в прошлом (просроченные).

Несколько задач без исполнителя.

Теги: frontend, backend, design, marketing, analytics, qa.

Ссылки: несколько задач с links (например, https://figma.com/...).

Комментарии и история
К 5–7 задачам — по 1–3 комментария от разных пользователей.

К 5–7 задачам — записи StatusHistory (смена статусов).

Несколько уведомлений для admin и member.

8. Этапы работы (строго по порядку)
После каждого этапа: npm run build + чеклист проверки + остановка и ожидание команды.

Этап 1. Брендбук и каркас
Tailwind-токены палитры (6 цветов), шрифты через next/font.

<Logo> SVG-компонент (light/dark).

Layout: сайдбар (Deep Fjord) + рабочая область (Snow), гамбургер на mobile.

Тёмная тема через CSS-переменные + переключатель.

Проверка: все 6 цветов в конфиге; шрифты подключены; логотип отображается; сайдбар/гамбургер работают; тема переключается; npm run build проходит.

Этап 2. Схема данных и seed
Prisma schema из раздела 6.

npx prisma db push (без миграций).

prisma/seed.ts с данными из раздела 7.

Проверка: таблицы созданы; seed выполнен; 8 юзеров, 3 проекта, 25+ задач, 3–4 просроченные, комментарии и история есть; npm run build проходит.

Этап 3. Аутентификация
NextAuth credentials, страница логина (email + пароль, показать/скрыть пароль, сообщение об ошибке).

Кнопки быстрого входа: «Войти как админ» (Анна), «Войти как сотрудник» (Илья).

Логаут, защита роутов через middleware.

Проверка: логин работает; сессия сохраняется после F5; логаут работает; member не видит чужие проекты; npm run build проходит.

Этап 4. Проекты и Kanban
Страница списка проектов (карточки по разделу 3).

Страница проекта: вкладки «Доска», «Список», «Участники», «Информация».

Kanban с @hello-pangea/dnd: 5 колонок, drag-and-drop, PATCH статуса в БД.

Проверка: карточки проектов отображаются; доска рендерится; drag-and-drop меняет статус и сохраняется после F5; npm run build проходит.

Этап 5. Задачи и комментарии
Форма создания/редактирования задачи (все поля из раздела 3, обязательные: название, проект, исполнитель, статус, приоритет).

Страница задачи: все поля + комментарии + лента смены статусов.

Комментарии: добавление, редактирование/удаление только своих (admin — любые).

Проверка: задача создаётся и появляется на доске; редактируется; комментарии работают; свои можно редактировать/удалять, чужие — нет; npm run build проходит.

Этап 6. «Мои задачи» и фильтры
Список задач текущего пользователя (название, проект, статус, приоритет, срок, постановщик).

Переключение list/board.

Фильтры: статус, проект, приоритет, срок, только просроченные.

Поиск по названию.

Проверка: задачи отображаются; фильтры и поиск работают; переключение вида работает; npm run build проходит.

Этап 7. Главная, «Команда», уведомления, профиль
Главная: виджеты (активные, просроченные, на неделю, ближайшие дедлайны, последние обновления, «Мои проекты»).

«Команда»: список сотрудников с агрегатами (активные/просроченные задачи).

Уведомления: иконка в хедере, список, создание при назначении задачи и новом комментарии.

Профиль: смена имени, должности, переключатель темы.

Проверка: виджеты показывают корректные числа; «Команда» отображается; уведомления появляются; профиль сохраняется; npm run build проходит.

Этап 8. Адаптив и полировка
Проверка на 375px: гамбургер, одна колонка, горизонтальный скролл Kanban, формы на весь экран, кнопки удобного размера.

Визуальное выделение просроченных задач (красный бейдж/рамка).

Соответствие брендбуку (палитра, шрифты, 60/30/10, логотип).

Проверка: все критерии приёмки из раздела 9 выполнены; npm run build проходит; деплой на ONREZA работает.

9. Acceptance Criteria (финальная проверка)
Логин/логаут работают, сессия сохраняется после обновления страницы.

Admin видит все проекты, member — только свои.

Admin может создавать проекты; member — нет.

Задачи создаются и редактируются; назначаются исполнителю.

Kanban: карточки перетаскиваются, статус сохраняется в БД.

«Мои задачи»: фильтры и поиск работают, переключение list/board.

Комментарии: добавление, редактирование/удаление только своих (admin — любые).

Просроченные задачи визуально выделены.

Уведомления появляются при назначении задачи и новом комментарии.

Глобальный поиск находит проекты и задачи, группирует по типу.

Адаптив: на 375px всё читается, кнопки нажимаются, горизонтальной прокрутки страницы нет.

Интерфейс соответствует брендбуку (палитра, шрифты, 60/30/10, логотип).

Демо-данные на месте после деплоя (8 юзеров, 3 проекта, 25+ задач).

npm run build проходит без ошибок.

Нет критических ошибок, блокирующих основные сценарии.

10. Definition of Done
Все 8 этапов выполнены и проверены.

npm run build проходит.

Приложение задеплоено на ONREZA через GitVerse.

URL демо работает, проверен на desktop и mobile (375px).

README содержит: описание, стек, скриншоты, инструкцию запуска, блок «Внедрение брендбука».