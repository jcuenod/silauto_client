// src/pages/ProjectsPage.tsx
import { useState, useEffect } from "react";
import { api } from "../api/apiClient";
import type { ParatextProject } from "../types";
import { CreateProjectForm } from "../components/CreateProjectForm";
import { NavLink } from "react-router";

export function ProjectsList() {
  const [projects, setProjects] = useState<ParatextProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await api.projects.getAll();
      console.log(response);
      setProjects(response);
    } catch (err) {
      setError("Failed to fetch projects.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const List = () =>
    isLoading ? (
      <div className="text-center p-8">Loading projects...</div>
    ) : error ? (
      <div className="text-center p-8 text-red-500">{error}</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects
          .filter(
            (f) =>
              f.name.toLowerCase().includes(filter.toLowerCase()) ||
              f.id.toLowerCase().includes(filter.toLowerCase())
          )
          .map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-violet-600 dark:text-violet-400">
                <NavLink to={`/projects/${project.id}`}>{project.name}</NavLink>
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {project.full_name}
              </p>
              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                <p>
                  <strong>Language:</strong> {project.lang} ({project.iso_code})
                </p>
                <p className="truncate">
                  <strong>ID:</strong> {project.id}
                </p>
              </div>
            </div>
          ))}
      </div>
    );

  return (
    <div>
      <CreateProjectForm onProjectCreated={fetchProjects} />
      <div className="flex flex-row items-center mb-6">
        <h1 className="text-3xl font-bold mb-1">Paratext Projects</h1>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search for Projects..."
          className="ml-4 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 transition-colors"
        />
      </div>
      <List />
    </div>
  );
}
