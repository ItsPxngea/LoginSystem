using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ToDoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ToDoController(AppDbContext context)
        {
            _context = context;
        }


        private Guid GetUserID()
        {
            var idClaim = User.FindFirst("userID")?.Value;
            if (idClaim == null || !Guid.TryParse(idClaim, out var ID))
            {
                throw new UnauthorizedAccessException("User not allowed");
            }
            return ID;
        }

        //Get logged in user todo list
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userID = GetUserID();
            var toDoList = await _context.TodoItems.Where(t => t.UserID == userID)
            .OrderBy(t => t.isDone)
            .ThenByDescending(t => t.priority)
            .ThenByDescending(t => t.createdAt)
            .Select(t => new ToDoDTO
            {
                ID = t.ID,
                text = t.text,
                isDone = t.isDone,
                priority = t.priority,
                createdAt = t.createdAt

            }).ToListAsync();
            if(toDoList==null || toDoList.Count==0) return NotFound(new {message="No Todo Items found. Please create a new item."});

            return Ok(toDoList);
        }

        //create new todo items for logged in user
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateToDoRequest request)
        {
            if (string.IsNullOrEmpty(request.text)) return BadRequest(new { message = "Todo text cannot be empty" });

            var userID = GetUserID();
            var toDo = new ToDoItem
            {
                text = request.text.Trim(),
                priority = request.priority,
                UserID = userID
            };

            await _context.TodoItems.AddAsync(toDo);
            await _context.SaveChangesAsync();



            return Ok(new ToDoDTO
            {
                ID = toDo.ID,
                text = toDo.text,
                priority = toDo.priority,
                createdAt = toDo.createdAt,
                isDone = toDo.isDone
            });
        }

        //updating things inside the todo item
        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTodoRequest request)
        {

            var userID = GetUserID();

            var todo = await _context.TodoItems.FirstOrDefaultAsync(t => t.ID == id && t.UserID == userID);

            if (todo == null) return NotFound(new { message = "Todo item not found" });

            if (request.text != null) todo.text = request.text.Trim();
            if (request.priority.HasValue) todo.priority = request.priority.Value;
            if (request.isDone.HasValue) todo.isDone = request.isDone.Value;

            await _context.SaveChangesAsync();

            return StatusCode(204, new ToDoDTO
            {
                ID = todo.ID,
                text = todo.text,
                priority = todo.priority,
                isDone = todo.isDone,
                createdAt = todo.createdAt
            });
        }

        //Delete method for deleting a todo item
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userID = GetUserID();

            var todo = await _context.TodoItems.FirstOrDefaultAsync(t => t.ID == id && t.UserID == userID);

            if (todo == null) return NotFound(new { message = "Todo item not found" });

            await _context.TodoItems.AddAsync(todo);
            await _context.SaveChangesAsync();

            return StatusCode(205, "Todo item has been successfully deleted");
        }



    }
}