// Задачи объекта: канбан + статус "Ожидание" + приоритетная задача дня.
// Мок-данные используются как fallback, если в БД ещё нет таблицы tasks.

export type TaskStatus = "todo" | "in_progress" | "waiting" | "done";

export interface TaskWaitingInfo {
  waitingOn: string;
  waitingFor: string;
  waitingSince: string; // YYYY-MM-DD
  remindAt?: string | null; // YYYY-MM-DD
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  section?: string;
  assignee?: string;
  dueDate?: string | null;
  status: TaskStatus;
  isPriority: boolean;
  waiting?: TaskWaitingInfo | null;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "План",
  in_progress: "В работе",
  waiting: "Ожидание",
  done: "Готово",
};

export const TASK_STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "waiting", "done"];

/** Контакты объекта — для подсказок в поле «кого ждём» */
export const projectContacts = [
  "Подрядчик «СтройМонолит»",
  "Поставщик «Арматура-Юг»",
  "Заказчик",
  "Бухгалтерия",
  "Проектировщик",
];

export const mockTasks: Task[] = [
  {
    id: "t-1",
    title: "Приёмка арматуры A500C ∅16 на секции А",
    projectId: "p-1",
    projectName: "ЖК Рассвет",
    section: "Секция А",
    assignee: "Иванов А.П.",
    dueDate: "2026-08-27",
    status: "in_progress",
    isPriority: true,
  },
  {
    id: "t-2",
    title: "Разбивка осей под ростверк, секция Б",
    projectId: "p-1",
    projectName: "ЖК Рассвет",
    section: "Секция Б",
    assignee: "Морозов Е.А.",
    dueDate: "2026-08-28",
    status: "todo",
    isPriority: false,
  },
  {
    id: "t-3",
    title: "Смета на плитку входных групп",
    projectId: "p-1",
    projectName: "ЖК Рассвет",
    assignee: "Петрова М.С.",
    status: "waiting",
    isPriority: false,
    waiting: {
      waitingOn: "Подрядчик «СтройМонолит»",
      waitingFor: "смету на плитку",
      waitingSince: "2026-08-22",
      remindAt: "2026-08-28",
    },
  },
  {
    id: "t-4",
    title: "Согласование замены гидроизоляции",
    projectId: "p-1",
    projectName: "ЖК Рассвет",
    assignee: "Сидоров К.Л.",
    status: "waiting",
    isPriority: false,
    waiting: {
      waitingOn: "Заказчик",
      waitingFor: "письменное согласование материала",
      waitingSince: "2026-08-18",
      remindAt: null,
    },
  },
  {
    id: "t-5",
    title: "Акт скрытых работ по свайному полю",
    projectId: "p-1",
    projectName: "ЖК Рассвет",
    section: "Секция А",
    assignee: "Иванов А.П.",
    status: "done",
    isPriority: false,
  },
];
