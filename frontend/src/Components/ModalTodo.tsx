import { useState } from "react";
import type { FormEvent } from "react";
import type { Priority } from "../types/Todo";
//import "../Styles/TodoModalStyle.css";

interface AddTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (text: string, priority: Priority) => Promise<void>
}

export default function AddTodoModal({ isOpen, onClose, onAdd }: AddTodoModalProps) {
    const [text, setText] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setSubmitting(true);
        setFormError("");

        try {

            await onAdd(text.trim(), priority)
            setText("");
            setPriority("Medium");
            onClose();

        } catch {

            setFormError("Could not add Todo item. Please try again.")

        } finally {

            setSubmitting(false)

        }
    };

    const handleOverlayClicks = () => {
        if (!submitting) onClose();
    };

    return (
        <div className="todo-modal-overlay" onClick={handleOverlayClicks}>
            <div className="todo-modal-content" onClick={e => e.stopPropagation()}>
                <div className="todo-modal-header">
                    <h2 className="todo-modal-title">Add New To-Do</h2>
                    <button
                        className="todo-modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                {formError && <div className="todo-error">{formError}</div>}

                <form className="todo-add-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="What needs doing?"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="todo-input"
                        autoFocus
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
                    <div className="todo-modal-actions">
                        <button
                            type="button"
                            className="todo-modal-cancel-btn"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="todo-add-btn"
                            disabled={submitting}
                        >
                            {submitting ? "Adding…" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}