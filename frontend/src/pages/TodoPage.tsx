import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { ToDoApi } from "../API/ToDoApi";
import type { ToDoDTO, Priority } from "../types/Todo";
//import { useFetcher } from "react-router-dom";
import "../Styles/TodoStyle.css"
import { Trash2 } from "lucide-react";

const PRIORITY_ORDER: Record<Priority, number> = { Low: 1, Medium: 2, High: 3 };

export default function ToDoPage() {
    const [todos, setTodos] = useState<ToDoDTO[]>([])
    const [text, setText] = useState('')
    const [priority, setPriority] = useState<Priority>('Medium')
    const [loading, setLoading] = useState(true)
    const [formError, setFormError] = useState('')

    useEffect(() => {
        loadToDos()
    }, [])

    const loadToDos = async () => {
        setLoading(true)
        try {
            const data = await ToDoApi.getAll()
            setTodos(data)
            setFormError("")
        } catch {
            setFormError("Could not load todo list items. Please try again")
        } finally {
            setLoading(false);
        }
    }

    const handleAdd = async (e: FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return;

        try {
            const newTodo = await ToDoApi.create({ text, priority })
            setTodos(prev => [newTodo, ...prev])
            setText("")
            setPriority("Medium")
        } catch {
            setFormError("Could not add todo item. Please try again")
        }

    }

    const handleToggle = async (todo: ToDoDTO) => {
        try {
            const updated = await ToDoApi.update(todo.id, { isDone: !todo.isDone })
            setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)))
        } catch {
            setFormError("Unable to update the item.")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await ToDoApi.delete(id);
            setTodos(prev => prev.filter(t => t.id !== id))
        } catch {
            setFormError("Unable to delete that item")
        }
    }
    const sorted = [...todos].sort((a, b) => {
        if (a.isDone !== b.isDone) return a.isDone ? 1 : -1
        return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    })

    return (
        <div className="todo-page">
            <div className="todo-header">
                <h1 className="todo-title">My To-Dos</h1>
                <p className="todo-subtitle">
                    {todos.filter(t => !t.isDone).length} pending ·{' '}
                    {todos.filter(t => t.isDone).length} done
                </p>
            </div>

            {formError && <div className="todo-error">{formError}</div>}

            <form className="todo-add-form" onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Add a new to-do…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="todo-input"
                />
                <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Priority)}
                    className="todo-priority-select"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button type="submit" className="todo-add-btn">Add</button>
            </form>

            {loading ? (
                <p className="todo-loading">Loading your to-dos…</p>
            ) : sorted.length === 0 ? (
                <p className="todo-empty">No to-dos yet — add one above to get started.</p>
            ) : (
                <ul className="todo-list">
                    {sorted.map(todo => (
                        <li key={todo.id} className={`todo-item ${todo.isDone ? 'todo-done' : ''}`}>
                            <label className="todo-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={todo.isDone}
                                    onChange={() => handleToggle(todo)}
                                />
                                <span className="todo-text">{todo.text}</span>
                            </label>
                            <span className={`todo-priority-badge todo-priority-${todo.priority.toString().toLowerCase()}`}>
                                {todo.priority}
                            </span>
                            <button
                                className="todo-delete-btn"
                                onClick={() => handleDelete(todo.id)}
                                aria-label="Delete todo"
                            >
                                <Trash2 className="delete-icon"/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}