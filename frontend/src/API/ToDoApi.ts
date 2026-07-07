import { http } from "./Client"
import type { ToDoDTO, CreateTodoRequest, UpdateToDoRequest } from "../types/Todo"

export const ToDoApi = {
    
    getAll: () => http.get<ToDoDTO[]>("/todo"),

    create: (data: CreateTodoRequest) => http.post<ToDoDTO>("/todo", data),

    update: (id: string, data: UpdateToDoRequest) => http.patch<ToDoDTO>(`/todo/${id}`, data),

    delete: (id: string) => http.delete<{ message: string }>(`/todo/${id}`)
}