import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTodosByUser,
  addTodo,
  deleteTodo,
  updateTodo
} from "../services/api";
import TodosView from "./TodosView";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [searchBy, setSearchBy] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (currentUser) {
      loadTodos();
    }
  }, []);

  async function loadTodos() {
    const data = await getTodosByUser(currentUser.id);
    setTodos(data);
  }

  async function handleAdd() {
    if (!newTitle.trim()) return;

    const newTodo = {
      userId: currentUser.id,
      title: newTitle,
      completed: false
    };

    const created = await addTodo(newTodo);
    setTodos([...todos, created]);
    setNewTitle("");
  }

  async function handleDelete(id) {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  async function handleToggle(todo) {
    const updated = await updateTodo(todo.id, {
      ...todo,
      completed: !todo.completed
    });

    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  }

  function handleStartEdit(todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  async function handleSaveEdit(todo) {
    if (!editingTitle.trim()) return;

    const updated = await updateTodo(todo.id, {
      ...todo,
      title: editingTitle
    });

    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    setEditingId(null);
    setEditingTitle("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  function getDisplayedTodos() {
    let result = [...todos];

    if (searchValue.trim()) {
      result = result.filter((todo) => {
        if (searchBy === "id") {
          return todo.id.toString().includes(searchValue);
        }

        if (searchBy === "title") {
          return todo.title.toLowerCase().includes(searchValue.toLowerCase());
        }

        if (searchBy === "completed") {
          const value = searchValue.toLowerCase();

          if (value === "true" || value === "completed" || value === "done") {
            return todo.completed === true;
          }

          if (
            value === "false" ||
            value === "not completed" ||
            value === "open"
          ) {
            return todo.completed === false;
          }

          return false;
        }

        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "completed") return Number(a.completed) - Number(b.completed);

      return 0;
    });

    return result;
  }

  if (!currentUser) {
    return (
      <div>
        <h1>Please login first</h1>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <TodosView
      newTitle={newTitle}
      setNewTitle={setNewTitle}
      sortBy={sortBy}
      setSortBy={setSortBy}
      searchBy={searchBy}
      setSearchBy={setSearchBy}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      displayedTodos={getDisplayedTodos()}
      editingId={editingId}
      editingTitle={editingTitle}
      setEditingTitle={setEditingTitle}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onToggle={handleToggle}
      onStartEdit={handleStartEdit}
      onSaveEdit={handleSaveEdit}
      onCancelEdit={handleCancelEdit}
      onBackHome={() => navigate("/home")}
    />
  );
}