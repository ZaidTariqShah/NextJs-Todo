"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Todo {
  _id: string;
  task: string;
}
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentId, setCurrentId] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [task, setTask] = useState<string>("");

  const getTodos = async () => {
    const res = await axios.get("/api/todos");
    setTodos(res.data.userData || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getTodos();
    };
    fetchData();
  }, []);

  const postTodos = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/todos", { task });
    toast.success("Added!");
    setTask("");
    await getTodos();
  };

  const deleteTodos = async (id: string) => {
    try {
      await axios.delete("/api/todos", { data: { id } });
      toast.error("Task deleted!");
      await getTodos();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleEdit = async (item: { _id: string; task: string }) => {
    setTask(item.task);
    setEditMode(true);
    setCurrentId(item._id);
  };

  const updateTodos = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put("/api/todos", { id: currentId, task });
    toast.success("Task updated!");
    setTask("");
    setEditMode(false);
    setCurrentId("");
    await getTodos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6 py-12">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-5xl font-extrabold mb-10 text-center tracking-wide drop-shadow-2xl bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
        📝 My Todo List
      </h1>

      {/* Input Form */}
      <form
        onSubmit={editMode ? updateTodos : postTodos}
        className="flex w-full max-w-md items-center gap-3 bg-gray-800/70 p-4 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700 hover:border-indigo-400 transition-all duration-300"
      >
        <input
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-gray-800/80 transition-all"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 active:scale-95 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
        >
          {editMode ? "Update" : "Add"}
        </button>
      </form>

      {/* Todo List */}
      <div className="mt-10 w-full max-w-md space-y-4">
        {todos.length === 0 ? (
          <p className="text-gray-400 text-center text-lg font-medium animate-pulse bg-gray-800/60 py-5 rounded-xl shadow-md border border-gray-700">
            No tasks found 😢 <br /> Add your first one!
          </p>
        ) : (
          todos.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-gray-800/80 p-4 rounded-2xl shadow-md hover:bg-gray-700/80 hover:scale-[1.02] transition-all border border-gray-700 group duration-300"
            >
              <p className="text-lg font-medium tracking-wide text-gray-100 group-hover:text-indigo-300 transition-colors">
                {item.task}
              </p>

              <div className="flex items-center gap-3">
                {/* 🎨 EDITED BUTTON: Modern styling with embedded SVG (Edit icon) */}
                <button
                  onClick={() => handleEdit(item)}
                  className="p-3 rounded-full bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 hover:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  title="Edit Task"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 stroke-current"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </button>

                {/* 🎨 EDITED BUTTON: Modern styling with embedded SVG (Delete/Trash icon) */}
                <button
                  onClick={() => deleteTodos(item._id)}
                  className="p-3 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                  title="Delete Task"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 stroke-current"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
