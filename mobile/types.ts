export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
};

export type TodoStats = {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
};

export type SleepResult = {
  id: string;
  dateLabel: string;
  duration: string;
  startTime?: string;
  endTime?: string;
};

export type ActiveSleepSession = {
  startedAt: string;
};
