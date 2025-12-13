type ClientStatus = "in-progress" | "pending" | "completed";

export interface Client {
  id: number;
  name: string;
  description: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
  projects?: Project[];
}

export interface Project {
  id: number;
  clientId: number;
  name: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}