type ClientStatus = "in-progress" | "pending" | "completed";

interface BaseEntity {
  id: number;
  name: string;
  status: ClientStatus;
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
  projectId: number;
}