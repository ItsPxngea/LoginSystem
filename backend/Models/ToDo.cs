namespace backend.Models
{

    public enum Priority
    {
        Low,
        Medium,
        High
    }

    public class ToDoItem
    {
        public Guid ID { get; set; } = Guid.NewGuid();
        public string text { get; set; } = string.Empty;
        public bool isDone { get; set; } = false;
        public Priority priority { get; set; } = Priority.Medium;
        public DateTime createdAt { get; set; } = DateTime.UtcNow;

        public Guid UserID { get; set; }
        public UserRegistration User { get; set; } = null!;

    }


    public class CreateToDoRequest
    {
        public string text { get; set; } = string.Empty;
        public Priority priority { get; set; } = Priority.Medium;
    }

    public class UpdateTodoRequest
    {
        public string? text { get; set; }
        public bool? isDone { get; set; }
        public Priority? priority { get; set; }

    }

    public class ToDoDTO
    {
        public Guid ID { get; set; }
        public string text { get; set; } = string.Empty;
        public bool isDone { get; set; }
        public Priority priority { get; set; }
        public DateTime createdAt { get; set; }
    }
}