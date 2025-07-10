// src/pages/TasksPage.tsx
import { useState, useEffect } from "react";
import { api } from "../api/apiClient";
import { type Task, type TaskStatus } from "../types";
import { NavLink } from "react-router";

const relevantId = (task: Task) => {
  if (task.kind === "train") {
    return task.parameters.experiment_name;
  } else if (task.kind === "align") {
    return task.parameters.target_scripture_file;
  } else if (task.kind === "extract") {
    return task.parameters.project_id;
  } else if (task.kind === "draft") {
    return task.parameters.experiment_name;
  } else {
    console.error("Failed to account for some task.kind: ", task);
    return "error";
  }
};

const statusColorMap: Record<TaskStatus, string> = {
  queued: "bg-indigo-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  cancelled: "bg-yellow-500",
  unknown: "bg-gray-500",
};

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.tasks.getAll();
        setTasks(response);
      } catch (err) {
        setError("Failed to fetch tasks.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (isLoading) return <div className="text-center p-8">Loading tasks...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Task Queue</h1>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-4 font-semibold">Identifier</th>
              <th className="p-4 font-semibold">Kind</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b border-slate-200 dark:border-slate-700"
              >
                <td className="p-4">
                  <NavLink to={`/tasks/${task.id}`}>{relevantId(task)}</NavLink>
                </td>
                <td className="p-4 capitalize">{task.kind}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${
                      statusColorMap[task.status || "queued"]
                    }`}
                  >
                    {task.status || "queued"}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(task.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
