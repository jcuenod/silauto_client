import type {
  // Project,
  // Task,
  // Scripture,
  // Translation,
  AlignTaskCreate,
  Draft,
  ExtractTaskCreate,
  ParatextProject,
  Scripture,
  Task,
  TrainTaskCreate,
  DraftTaskCreate,
} from "../types";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchClient = async <T>(
  url: string,
  options: RequestInit = {},
  json: boolean = true,
): Promise<T> => {
  // const { headers, ...otherOptions } = options;
  const response = await fetch(`${baseURL}${url}`, {
    // headers,
    // ...otherOptions,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!json) {
    return response as unknown as T; // Return as is if not expecting JSON
  }
  return response.json();
};

// --- Project Endpoints ---

const projects = {
  // GET /projects/
  getAll: (skip: number = 0, limit: number = 1000) =>
    fetchClient<ParatextProject[]>(`/projects/?skip=${skip}&limit=${limit}`),

  // GET /projects/?scripture_filename={scriptureFilename}
  getByScripture: (scriptureFilename: string) =>
    fetchClient<ParatextProject[]>(
      `/projects/?scripture_filename=${scriptureFilename}`
    ),

  // GET /projects/{project_id}
  getById: (projectId: string) =>
    fetchClient<ParatextProject>(`/projects/${projectId}`),

  // GET /projects/{project_id}/download_drafts
  downloadDrafts: (projectId: string) =>
    fetchClient<Response>(`/projects/${projectId}/download_drafts`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/zip",
      },
    }, false).then(async (response) => {
      if (!response.ok) {
        alert("Failed to download drafts.");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectId}_drafts.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }),

  // POST /projects/
  create: (files: FileList) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = (file as any).webkitRelativePath || file.name;
      formData.append("files", file, filePath);
    }
    return fetchClient(`/projects/`, {
      method: "POST",
      body: formData,
    });
  },

  // DELETE /projects/{project_id}
  delete: (projectId: string) =>
    fetchClient(`/projects/${projectId}`, { method: "DELETE" }),
};

// --- Task Endpoints ---

type GetAllTasksParams = { skip?: number; limit?: number; projectId?: string };
const tasks = {
  // GET /tasks/
  getAll: (params?: GetAllTasksParams) => {
    const { skip = 0, limit = 100, projectId } = params || {};
    return projectId
      ? fetchClient<Task[]>(
          `/tasks/?skip=${skip}&limit=${limit}&project_id=${projectId}`
        )
      : fetchClient<Task[]>(`/tasks/?skip=${skip}&limit=${limit}`);
  },

  // GET /tasks/{task_id}
  getById: (taskId: string) => fetchClient<Task>(`/tasks/${taskId}`),

  // POST /tasks/align_task
  createAlign: (data: AlignTaskCreate) =>
    fetchClient(`/tasks/align_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  // POST /tasks/train_task
  createTrain: (data: TrainTaskCreate) =>
    fetchClient(`/tasks/train_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  // POST /tasks/draft_task
  createDraft: (data: DraftTaskCreate) =>
    fetchClient(`/tasks/draft_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  // POST /tasks/extract_task
  createExtract: (data: ExtractTaskCreate) =>
    fetchClient(`/tasks/extract_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  // DELETE /tasks/{task_id}
  delete: (taskId: string) =>
    fetchClient(`/tasks/${taskId}`, { method: "DELETE" }),
};

// --- Other Endpoints ---

const scriptures = {
  // GET /scriptures/
  getAll: (query?: string, skip: number = 0, limit: number = 100) =>
    query
      ? fetchClient<Scripture[]>(
          `/scriptures/?query=${query}&skip=${skip}&limit=${limit}`
        )
      : fetchClient<Scripture[]>(`/scriptures/?skip=${skip}&limit=${limit}`),
  
  // GET /scriptures/{id}
  getById: (id: string) =>
    fetchClient<Scripture[]>(`/scriptures/?query=${id}`),
};

const drafts = {
  // GET /drafts/
  getByProjectId: (projectId: string) =>
    fetchClient<Draft[]>(`/drafts/?project_id=${projectId}`),
  getByExperimentName: (experimentName: string) =>
    fetchClient<Draft[]>(`/drafts/?experiment_name=${experimentName}`),
  get: (experimentName: string, projectId: string) => {
    return fetchClient<Draft[]>(
      `/drafts/?experiment_name=${experimentName}&project_id=${projectId}`
    );
  },
};

const langCodes = {
  // GET /lang_codes/
  getByLangCode: (langCode: string) =>
    fetchClient<string[]>(`/lang_codes/?lang_code=${langCode}`),
};

// Expose all endpoint groups
export const api = {
  projects,
  tasks,
  scriptures,
  drafts,
  langCodes,
};
