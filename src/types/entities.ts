type ID = number; 

type ClientStatus = "in-progress" | "pending" | "completed";

export interface Client {
  id: ID;
  name: string;
  description: string;
  status: ClientStatus;
  createdAt: string; 
  updatedAt: string; 
}