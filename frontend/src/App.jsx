import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // GET - Fetch all todos
  const getTodos = async () => {
    const response = await fetch("http://localhost:5000/api/todos");
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // POST - Add a new todo
  const addTodo = async () => {
    if (task.trim() === "") return;

    const response = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        task: task
      })
    });

    const newTodo = await response.json();

    setTodos([...todos, newTodo]);
    setTask("");
  };

  // PUT - Mark todo as complete/incomplete
  const toggleTodo = async (todo) => {
    const response = await fetch(
      `http://localhost:5000/api/todos/${todo._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !todo.completed
        })
      }
    );

    const updatedTodo = await response.json();

    setTodos(
      todos.map((item) =>
        item._id === todo._id ? updatedTodo : item
      )
    );
  };

  // PUT - Edit todo
  const updateTodo = async (id) => {
    const response = await fetch(
      `http://localhost:5000/api/todos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          task: editingText
        })
      }
    );

    const updatedTodo = await response.json();

    setTodos(
      todos.map((todo) =>
        todo._id === id ? updatedTodo : todo
      )
    );

    setEditingId(null);
    setEditingText("");
  };

  // DELETE - Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE"
    });

    setTodos(
      todos.filter((todo) => todo._id !== id)
    );
  };

  return (
    <div className="container">

      <h1>My Todo List</h1>

      <div className="add-section">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />

        <button onClick={addTodo}>
          Add
        </button>
      </div>

      <div className="todo-list">

        {todos.map((todo) => (
          <div className="todo" key={todo._id}>

            {editingId === todo._id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) =>
                    setEditingText(e.target.value)
                  }
                />

                <button
                  onClick={() => updateTodo(todo._id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  className={
                    todo.completed ? "completed" : ""
                  }
                  onClick={() => toggleTodo(todo)}
                >
                  {todo.completed ? "☑" : "☐"} {todo.task}
                </span>

                <div>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditingId(todo._id);
                      setEditingText(todo.task);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default App;