import { Outlet, NavLink } from "react-router";

export function Layout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200">
      <header className="bg-slate-800 dark:bg-black/50 shadow">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Project & Task Manager
          </h1>
          <div className="flex items-center space-x-4">
            <NavLink to="/" className={linkClass}>
              Projects
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
            <NavLink to="/scriptures" className={linkClass}>
              Scriptures
            </NavLink>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
