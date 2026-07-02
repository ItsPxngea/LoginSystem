export type Priority = 'Low' | 'Medium' | 'High';

export interface ToDoDTO {
    id: string
    text: string
    isDone: boolean
    priority: Priority
    createdAt: string
}

export interface CreateTodoRequest {
    text: string
    priority: Priority
}

export interface UpdateToDoRequest {
    text?: string
    priority?: Priority
    isDone?: boolean
}