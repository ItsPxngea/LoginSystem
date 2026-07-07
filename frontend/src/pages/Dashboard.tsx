import { useNavigate } from "react-router-dom";
//import { useAuth } from '../hooks/UseAuth'
import { useEffect, useState } from "react";
import type { UserDTO } from "../types/Auth";
import { http } from '../API/Client'
import "../Styles/Dashboard.css"
import type { ToDoDTO, Priority } from "../types/Todo";
import { ToDoApi } from '../API/ToDoApi'
import AddTodoModal from '../Components/ModalTodo'
import { Edit, Trash2 } from "lucide-react";


export default function Dashboard() {

  const [user, setUser] = useState<UserDTO | null>(null);
  const [formError, setFormError] = useState("")
  //const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recentTodos, setRecentTodos] = useState<ToDoDTO[]>([])
  const [todosLoading, setTodosLoading] = useState(true)

  const navigate = useNavigate();

  /*(const getUser = async(): Promise<UserDTO> =>{
    /*const response = await fetch(`http://localhost:5157/api/user/profile`)
    console.log(JSON.stringify(response))
    if(!response.ok){
      throw new Error("failed to fetch user")
    }
    return await response.json();
    return http.get<UserDTO>("user/profile")

    


  }
  const { logout } = useAuth();
  const navigate = useNavigate();
*/
  /*const handleLogout = async () => {
    await logout()
    setLoading(true);
    //setTimeout(() => navigate("/login"), 2500)
    navigate("/login")



  }*/


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await http.get<UserDTO>("/user/profile")
        setUser(data);


      } catch (err) {
        setFormError("Failed to fetch user")
      }

    }
    fetchUser();
  }, [])

  //Loading and fetching todo items to display on the dashboard
  useEffect(() => {
    const fetchRecentTodos = async () => {
      setTodosLoading(true);

      try {
        const data = await ToDoApi.getAll()
        const sorted = [...data]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentTodos(sorted);

      } catch {
        setFormError("Could not load recent todo list items.")
      } finally {
        setTodosLoading(false);
      }
    }
    fetchRecentTodos();
  }, [])

  const handleDeleteFromDashboard = async (id: string) => {
    try {

      await ToDoApi.delete(id);
      setRecentTodos(prev => prev.filter(t => t.id !== id));

    } catch {
      setFormError("Unable to delete item");
    }
  }

  const handleEditItemDashboard = (id: string) => {
    navigate("/todos", { state: { editID: id } })
  }

  const handleAddTodo = async (text: string, priority: Priority) => {
    const newTodo = await ToDoApi.create({ text, priority });
    setRecentTodos(prev => [newTodo, ...prev].slice(0, 5));
  }

  //const initial = user?.userProfileName.match(/[A-Z]/)?.[0] ?? user?.userProfileName.trim().charAt(0).toUpperCase() ?? "";

  return (
    <>
      {/*Main content*/}
      <main className="dash-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Welcome {user?.userProfileName}</h1>
            <p className="page-sub-title">Here's the latest</p>
          </div>
          <button className="dash-btn-primary" onClick={() => setIsModalOpen(true)}>+ New Item</button>
        </div>

        {/* fill in the body of the dashboard */}

        {formError && <div className="todo-error">{formError}</div>}

        <div className="dash-card">
          <div className="dash-card-title"><span>Recent Items</span></div>

          {todosLoading ? (<p className="todo-loading">Loading...</p>) :
            recentTodos.length === 0 ? (<p className="todo-empty">No to-dos yet — add one to get started.</p>) : (
              <ul className="todo-list">
                {recentTodos.map(todo => (
                  <li key={todo.id} className={`todo-item ${todo.isDone ? 'todo-done' : ''}`}>
                    <span className="todo-text">{todo.text}</span>
                    <span className={`todo-priority-badge todo-priority-${todo.priority.toString().toLowerCase()}`}>{todo.priority}</span>

                    <button className="todo-edit-btn"
                      onClick={() => handleEditItemDashboard(todo.id)}
                      aria-label="Edit todo item">
                      <Edit className="edit-btn" size={14} />
                    </button>

                    <button className="todo-delete-btn"
                      onClick={() => handleDeleteFromDashboard(todo.id)}
                      aria-label="Delete todo item">
                      <Trash2 className="delete-icon" size={27} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </main>

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTodo} />

    </>


  )


}