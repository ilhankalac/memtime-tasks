type EntityStatus = "active" | "pending" | "completed" | "in-progress";

interface BaseEntity {
  id: number;
  name: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Client extends BaseEntity {
  description: string;
  projects?: Project[];
}

export interface Project extends BaseEntity {
  clientId: number;
  tasks?: Task[];
}

export interface Task extends BaseEntity {
  parent: number;
}

export interface TimeEntry {
  id: number;
  taskId: number;
  comment: string;
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
}