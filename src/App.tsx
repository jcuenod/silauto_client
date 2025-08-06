import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { ProjectsList } from "./pages/ProjectsList";
import { ProjectDetails } from "./pages/ProjectDetails";
import { TasksPage } from "./pages/TasksPage";
import { TaskDetails } from "./pages/TaskDetails";
import { ScriptureList } from "./pages/ScriptureList";
import { ScriptureDetails } from "./pages/ScriptureDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProjectsList />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/:taskId" element={<TaskDetails />} />
          <Route path="scriptures" element={<ScriptureList />} />
          <Route path="scriptures/:scriptureId" element={<ScriptureDetails />} />
          {/* You can add more routes here for specific projects/tasks */}
          {/* e.g., <Route path="projects/:projectId" element={<ProjectDetailPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
