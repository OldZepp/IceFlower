# IceFlower Tasks — Agent Rules

## ⚠️ Протокол работы (обязателен)

Ты работаешь поэтапно. На каждом этапе выполняй цикл:

### Шаг 1. План (Plan mode)
Перед любыми изменениями кода:
- Прочитай `SPEC.md` и определи, какой этап сейчас в работе (см. список этапов ниже).
- Выдай **план действий** для этого этапа: какие файлы создашь/изменишь, какие команды выполнишь, как проверишь результат.
- **Не пиши код и не выполняй команды** на этом шаге. Только план.
- Дождись явного одобрения от пользователя (слово «одобрено» или «go»).

### Шаг 2. Выполнение (Build mode)
После одобрения:
- Выполни ровно то, что в плане. Не добавляй функции «от себя».
- Если в процессе выяснилось, что план неверен — остановись и предложи корректировку, не продолжай молча.

### Шаг 3. Проверка
После выполнения этапа:
- Запусти `npm run build` (и другие проверки, указанные в этапе).
- Покажи результат: что сделано, какие файлы изменены, какие команды выполнены.
- Если проверка не прошла — исправь в рамках этого же этапа, не переходи к следующему.

### Шаг 4. Стоп
После проверки **остановись** и жди команды на следующий этап. Не начинай следующий этап автоматически.

## Этапы работы (строго по порядку)

1. **Брендбук и каркас**: Tailwind-токены, шрифты, `<Logo>`, layout с сайдбаром/hamburger, тёмная тема.
2. **Схема данных и seed**: Prisma schema, миграция (`db push`), seed-скрипт (8 юзеров, 3 проекта, 25 задач).
3. **Аутентификация**: NextAuth credentials, страница логина с демо-входом, защита роутов.
4. **Проекты и доска**: страница списка проектов, страница проекта с Kanban (`@hello-pangea/dnd`), смена статуса.
5. **Задачи и комментарии**: карточка задачи, страница задачи, комментарии, лента смены статусов.
6. **«Мои задачи» и фильтры**: список + board вид, фильтры, поиск.
7. **Главная и «Команда»**: виджеты, список сотрудников с агрегатами.
8. **Адаптив и полировка**: проверка на 375px, финальная проверка по критериям из SPEC.

## Источник требований
`SPEC.md` — единственный источник истины по функциям и данным. Не добавляй то, чего там нет.

## Стиль кода
- TypeScript strict, Server Components по умолчанию.
- Tailwind + shadcn/ui. Цвета — только через токены (Deep Fjord, Aurora Teal, Glacier, Northern Sun, Graphite, Snow). Никаких hex в компонентах.
- Шрифты: Montserrat (заголовки), Inter (текст) через `next/font/google`.

## Запрещено
- Загрузка файлов (только URL).
- Роль «руководитель проекта» (только admin/member).
- Смена пароля, аватары (только инициалы).
- Полная история изменений (только смена статуса).
- Фоновые уведомления о дедлайнах.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
