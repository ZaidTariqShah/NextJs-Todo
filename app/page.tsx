"use client";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [todos, setTodos] = useState<{ _id: string; task: string }[]>([]);
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

  const postTodos = async (e) => {
    e.preventDefault();
    await axios.post("/api/todos", { task });
    setTask("");
    await getTodos();
  };

  const deleteTodos = async (id: string) => {
    await axios.delete("/api/todos", { data: { id } });
    await getTodos();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">📝 My Todo List</h1>

      <form
        onSubmit={postTodos}
        className="bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-md flex gap-3"
      >
        <input
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold transition-all"
        >
          Add
        </button>
      </form>

      <div className="mt-8 w-full max-w-md space-y-4">
        {todos.length === 0 ? (
          <p className="text-gray-400 text-center text-lg font-medium animate-pulse bg-gray-800/60 py-4 rounded-xl shadow-md">
            No tasks found 😢 <br /> Add your first one!
          </p>
        ) : (
          todos.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-gray-800/70 p-4 rounded-xl shadow-md hover:bg-gray-700 transition-all"
            >
              <p className="text-lg">{item.task}</p>
              <button
                onClick={() => deleteTodos(item._id)}
                className="text-red-400 hover:text-red-500 font-semibold transition-all"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
