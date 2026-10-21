import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DAY = 24 * 60 * 60 * 1000;
const d = (n: number) => new Date(Date.now() + n * DAY);

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.notification.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const usersData = [
    { email: "anna@iceflower.io", name: "Анна Волкова", position: "Операционный директор", role: "admin", avatarInitials: "АВ" },
    { email: "maksim@iceflower.io", name: "Максим Орлов", position: "Руководитель проекта", role: "admin", avatarInitials: "МО" },
    { email: "elena@iceflower.io", name: "Елена Соколова", position: "Дизайнер", role: "member", avatarInitials: "ЕС" },
    { email: "ilya@iceflower.io", name: "Илья Морозов", position: "Frontend-разработчик", role: "member", avatarInitials: "ИМ" },
    { email: "viktor@iceflower.io", name: "Виктор Лебедев", position: "Backend-разработчик", role: "member", avatarInitials: "ВЛ" },
    { email: "olga@iceflower.io", name: "Ольга Крылова", position: "Маркетолог", role: "member", avatarInitials: "ОК" },
    { email: "dmitry@iceflower.io", name: "Дмитрий Фролов", position: "Тестировщик", role: "member", avatarInitials: "ДФ" },
    { email: "maria@iceflower.io", name: "Мария Белова", position: "Аналитик", role: "member", avatarInitials: "МБ" },
  ];

  const users: Record<string, { id: string }> = {};
  for (const u of usersData) {
    users[u.email] = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
  }

  const projectsData = [
    {
      name: "Разработка сайта для клиента GreenStone",
      description: "Корпоративный сайт с каталогом и формой заявки для клиента GreenStone.",
      leadEmail: "maksim@iceflower.io",
      members: ["elena@iceflower.io", "ilya@iceflower.io", "viktor@iceflower.io", "dmitry@iceflower.io"],
      status: "active",
      startDate: d(-20),
      endDate: d(30),
    },
    {
      name: "Запуск рекламной кампании IceFlower",
      description: "Контекстная реклама и продвижение нового трекера задач IceFlower.",
      leadEmail: "anna@iceflower.io",
      members: ["olga@iceflower.io", "elena@iceflower.io", "maria@iceflower.io"],
      status: "active",
      startDate: d(-10),
      endDate: d(45),
    },
    {
      name: "Внутренняя автоматизация отдела продаж",
      description: "Автоматизация отчётов и интеграция с CRM для отдела продаж.",
      leadEmail: "maksim@iceflower.io",
      members: ["viktor@iceflower.io", "maria@iceflower.io", "ilya@iceflower.io"],
      status: "planning",
      startDate: d(-5),
      endDate: d(60),
    },
  ];

  const projects: { id: string; name: string }[] = [];
  for (const p of projectsData) {
    const lead = users[p.leadEmail];
    const existing = await prisma.project.findFirst({ where: { name: p.name } });
    const project =
      existing ??
      (await prisma.project.create({
        data: {
          name: p.name,
          description: p.description,
          leadId: lead.id,
          status: p.status,
          startDate: p.startDate,
          endDate: p.endDate,
          members: { connect: p.members.map((m) => ({ id: users[m].id })) },
        },
      }));
    projects.push({ id: project.id, name: project.name });
  }

  const [greenstone, ads, automation] = projects;

  type TaskSeed = {
    key: string;
    title: string;
    projectId: string;
    status: string;
    priority: string;
    assigneeEmail?: string;
    creatorEmail: string;
    deadline?: Date;
    tags?: string;
    links?: string;
    description?: string;
  };

  const tasksData: TaskSeed[] = [
    { key: "ICF-1", title: "Редизайн главной страницы", projectId: greenstone.id, status: "in_progress", priority: "high", assigneeEmail: "elena@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "design", links: "https://figma.com/file/greenstone-main", description: "Обновить главную по новому брендбуку клиента.", deadline: d(5) },
    { key: "ICF-2", title: "Вёрстка лендинга по макету", projectId: greenstone.id, status: "in_progress", priority: "medium", assigneeEmail: "ilya@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "frontend", deadline: d(7) },
    { key: "ICF-3", title: "Настройка API для форм обратной связи", projectId: greenstone.id, status: "review", priority: "critical", assigneeEmail: "viktor@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "backend", description: "Эндпоинты для заявки и обратного звонка.", deadline: d(2) },
    { key: "ICF-4", title: "Тестирование формы заявки", projectId: greenstone.id, status: "planned", priority: "medium", assigneeEmail: "dmitry@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "qa", deadline: d(9) },
    { key: "ICF-5", title: "Подготовка макетов для мобильных", projectId: greenstone.id, status: "backlog", priority: "medium", assigneeEmail: "elena@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "design", links: "https://figma.com/file/greenstone-mobile" },
    { key: "ICF-6", title: "Оптимизация скорости загрузки", projectId: greenstone.id, status: "backlog", priority: "low", assigneeEmail: "ilya@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "frontend" },
    { key: "ICF-7", title: "Интеграция с CRM клиента", projectId: greenstone.id, status: "in_progress", priority: "high", assigneeEmail: "viktor@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "backend", deadline: d(-3) },
    { key: "ICF-8", title: "Ревью текстов для сайта", projectId: greenstone.id, status: "done", priority: "low", assigneeEmail: "elena@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "design" },
    { key: "ICF-9", title: "Наполнение каталога товарами", projectId: greenstone.id, status: "review", priority: "medium", creatorEmail: "maksim@iceflower.io", tags: "frontend" },
    { key: "ICF-10", title: "Кроссбраузерная проверка", projectId: greenstone.id, status: "backlog", priority: "medium", assigneeEmail: "dmitry@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "qa", deadline: d(-2) },
    { key: "ICF-11", title: "Запуск стейджинг-окружения", projectId: greenstone.id, status: "done", priority: "high", assigneeEmail: "viktor@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "backend" },
    { key: "ICF-12", title: "Стратегия рекламной кампании", projectId: ads.id, status: "in_progress", priority: "high", assigneeEmail: "olga@iceflower.io", creatorEmail: "anna@iceflower.io", tags: "marketing", deadline: d(4) },
    { key: "ICF-13", title: "Баннеры для Яндекс.Директ", projectId: ads.id, status: "review", priority: "medium", assigneeEmail: "elena@iceflower.io", creatorEmail: "anna@iceflower.io", tags: "design", links: "https://figma.com/file/nd-banners", deadline: d(3) },
    { key: "ICF-14", title: "Настройка аналитики кампании", projectId: ads.id, status: "planned", priority: "medium", assigneeEmail: "maria@iceflower.io", creatorEmail: "anna@iceflower.io", tags: "analytics", deadline: d(6) },
    { key: "ICF-15", title: "Контент-план на месяц", projectId: ads.id, status: "backlog", priority: "medium", assigneeEmail: "olga@iceflower.io", creatorEmail: "anna@iceflower.io", tags: "marketing" },
    { key: "ICF-16", title: "A/B-тестирование креативов", projectId: ads.id, status: "backlog", priority: "low", creatorEmail: "anna@iceflower.io", tags: "marketing,analytics" },
    { key: "ICF-17", title: "Отчёт по эффективности за месяц", projectId: ads.id, status: "planned", priority: "critical", assigneeEmail: "maria@iceflower.io", creatorEmail: "anna@iceflower.io", tags: "analytics", deadline: d(-1) },
    { key: "ICF-18", title: "Согласование бюджета кампании", projectId: ads.id, status: "done", priority: "high", assigneeEmail: "olga@iceflower.io", creatorEmail: "anna@iceflower.io", tags: "marketing" },
    { key: "ICF-19", title: "Презентация кампании для клиента", projectId: ads.id, status: "backlog", priority: "medium", assigneeEmail: "olga@iceflower.io", creatorEmail: "anna@iceflower.io", tags: "marketing" },
    { key: "ICF-20", title: "Анализ текущих процессов продаж", projectId: automation.id, status: "done", priority: "medium", assigneeEmail: "maria@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "analytics" },
    { key: "ICF-21", title: "ТЗ на интеграцию с телефонией", projectId: automation.id, status: "planned", priority: "high", assigneeEmail: "viktor@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "backend", deadline: d(8) },
    { key: "ICF-22", title: "Прототип воронки продаж", projectId: automation.id, status: "in_progress", priority: "medium", assigneeEmail: "ilya@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "frontend", links: "https://figma.com/file/sales-funnel", deadline: d(10) },
    { key: "ICF-23", title: "Автоматизация отчётов менеджеров", projectId: automation.id, status: "backlog", priority: "high", creatorEmail: "maksim@iceflower.io", tags: "backend,analytics", deadline: d(-5) },
    { key: "ICF-24", title: "Тестирование скриптов продаж", projectId: automation.id, status: "backlog", priority: "medium", creatorEmail: "maksim@iceflower.io", tags: "qa" },
    { key: "ICF-25", title: "Обучение отдела продаж", projectId: automation.id, status: "backlog", priority: "low", assigneeEmail: "maria@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "analytics" },
    { key: "ICF-26", title: "Пилот на трёх менеджерах", projectId: automation.id, status: "planned", priority: "medium", assigneeEmail: "viktor@iceflower.io", creatorEmail: "maksim@iceflower.io", deadline: d(12) },
    { key: "ICF-27", title: "Доработка формы заявки в CRM", projectId: automation.id, status: "in_progress", priority: "high", assigneeEmail: "ilya@iceflower.io", creatorEmail: "maksim@iceflower.io", tags: "frontend,backend", deadline: d(6) },
  ];

  const tasks: Record<string, { id: string }> = {};
  for (const t of tasksData) {
    const data = {
      title: t.title,
      description: t.description ?? null,
      projectId: t.projectId,
      status: t.status,
      priority: t.priority,
      assigneeId: t.assigneeEmail ? users[t.assigneeEmail].id : null,
      creatorId: users[t.creatorEmail].id,
      deadline: t.deadline ?? null,
      tags: t.tags ? t.tags.split(",").filter(Boolean) : [],
      links: t.links ? [t.links] : [],
    };
    const task = await prisma.task.upsert({
      where: { key: t.key },
      update: data,
      create: { key: t.key, ...data },
    });
    tasks[t.key] = { id: task.id };
  }

  const commentsData: { key: string; authorEmail: string; text: string }[] = [
    { key: "ICF-1", authorEmail: "maksim@iceflower.io", text: "Макет утвердили, можно вёрстку стартовать." },
    { key: "ICF-1", authorEmail: "elena@iceflower.io", text: "Обновила главную в фигме, ссылка в задаче." },
    { key: "ICF-3", authorEmail: "viktor@iceflower.io", text: "Эндпоинты готовы, осталось покрыть тестами." },
    { key: "ICF-3", authorEmail: "dmitry@iceflower.io", text: "Проверю после деплоя на стейджинг." },
    { key: "ICF-7", authorEmail: "viktor@iceflower.io", text: "Задержка из-за доступа к API клиента, жду токен." },
    { key: "ICF-13", authorEmail: "elena@iceflower.io", text: "Баннеры в трёх размерах, жду ревью." },
    { key: "ICF-17", authorEmail: "maria@iceflower.io", text: "Собираю данные за месяц, отчёт будет к пятнице." },
    { key: "ICF-22", authorEmail: "ilya@iceflower.io", text: "Прототип воронки нарисовал, посмотрите в фигме." },
    { key: "ICF-22", authorEmail: "maksim@iceflower.io", text: "Прототип хороший, правки по шагу 3 minimal." },
    { key: "ICF-11", authorEmail: "viktor@iceflower.io", text: "Стейджинг поднят, доступ по ссылке." },
  ];
  for (const c of commentsData) {
    await prisma.comment.create({
      data: { taskId: tasks[c.key].id, authorId: users[c.authorEmail].id, text: c.text },
    });
  }

  const historyData: { key: string; from: string; to: string; byEmail: string }[] = [
    { key: "ICF-1", from: "backlog", to: "planned", byEmail: "maksim@iceflower.io" },
    { key: "ICF-1", from: "planned", to: "in_progress", byEmail: "elena@iceflower.io" },
    { key: "ICF-3", from: "backlog", to: "planned", byEmail: "maksim@iceflower.io" },
    { key: "ICF-3", from: "planned", to: "in_progress", byEmail: "viktor@iceflower.io" },
    { key: "ICF-3", from: "in_progress", to: "review", byEmail: "viktor@iceflower.io" },
    { key: "ICF-11", from: "backlog", to: "planned", byEmail: "maksim@iceflower.io" },
    { key: "ICF-11", from: "planned", to: "in_progress", byEmail: "viktor@iceflower.io" },
    { key: "ICF-11", from: "in_progress", to: "review", byEmail: "viktor@iceflower.io" },
    { key: "ICF-11", from: "review", to: "done", byEmail: "maksim@iceflower.io" },
    { key: "ICF-13", from: "backlog", to: "planned", byEmail: "anna@iceflower.io" },
    { key: "ICF-13", from: "planned", to: "in_progress", byEmail: "elena@iceflower.io" },
    { key: "ICF-13", from: "in_progress", to: "review", byEmail: "elena@iceflower.io" },
    { key: "ICF-17", from: "backlog", to: "planned", byEmail: "anna@iceflower.io" },
    { key: "ICF-20", from: "backlog", to: "planned", byEmail: "maksim@iceflower.io" },
    { key: "ICF-20", from: "planned", to: "in_progress", byEmail: "maria@iceflower.io" },
    { key: "ICF-20", from: "in_progress", to: "review", byEmail: "maria@iceflower.io" },
    { key: "ICF-20", from: "review", to: "done", byEmail: "maksim@iceflower.io" },
    { key: "ICF-22", from: "backlog", to: "planned", byEmail: "maksim@iceflower.io" },
    { key: "ICF-22", from: "planned", to: "in_progress", byEmail: "ilya@iceflower.io" },
    { key: "ICF-27", from: "backlog", to: "planned", byEmail: "maksim@iceflower.io" },
    { key: "ICF-27", from: "planned", to: "in_progress", byEmail: "ilya@iceflower.io" },
  ];
  for (const h of historyData) {
    await prisma.statusHistory.create({
      data: { taskId: tasks[h.key].id, fromStatus: h.from, toStatus: h.to, changedById: users[h.byEmail].id },
    });
  }

  const notificationsData: { user: string; type: string; key: string }[] = [
    { user: "elena@iceflower.io", type: "assigned", key: "ICF-1" },
    { user: "ilya@iceflower.io", type: "assigned", key: "ICF-2" },
    { user: "viktor@iceflower.io", type: "assigned", key: "ICF-3" },
    { user: "anna@iceflower.io", type: "comment", key: "ICF-13" },
    { user: "maksim@iceflower.io", type: "comment", key: "ICF-7" },
    { user: "olga@iceflower.io", type: "assigned", key: "ICF-12" },
  ];
  for (const n of notificationsData) {
    await prisma.notification.create({
      data: { userId: users[n.user].id, type: n.type, taskId: tasks[n.key].id },
    });
  }

  console.log("Seed: users, projects, tasks done.");
  console.log(JSON.stringify({ users: Object.keys(users).length, projects: projects.length, tasks: Object.keys(tasks).length }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
