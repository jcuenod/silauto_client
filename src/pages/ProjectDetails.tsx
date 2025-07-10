import { NavLink, useParams } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api/apiClient";
import {
  type Task,
  type Draft,
  type ParatextProject,
  type TrainTask,
  type Scripture,
} from "../types";
import { BackSvgIcon } from "../components/Icons";
import { CreateTaskForm } from "../components/CreateTaskForm";

const formatDate = (dateStr: any) =>
  dateStr && new Date(dateStr).toLocaleString();

const sortTasks = (a: Task, b: Task) =>
  new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

const groupDraftsBySourceText = (drafts: Draft[]) => {
  const grouped = [];
  const sourceTexts: { [key: string]: number } = {};
  for (const draft of drafts) {
    if (!(draft.source_scripture_name in sourceTexts)) {
      sourceTexts[draft.source_scripture_name] = grouped.length;
      grouped.push({
        source: draft.source_scripture_name,
        drafts: [] as Draft[],
      });
    }
    const index = sourceTexts[draft.source_scripture_name];
    grouped[index].drafts.push(draft);
  }
  return grouped;
};

const DefaultTaskCard = ({ task }: { task: Task }) => {
  return (
    <div
      key={task.id}
      className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6"
    >
      <div className="flex flex-row">
        <div className="flex-1 text-sm text-slate-500 dark:text-slate-40 mr-4">
          <div className="flex flex-row items-center">
            <NavLink
              className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-1"
              to={`/tasks/${task.id}`}
            >
              {task.kind}
            </NavLink>
            <span className="px-2 py-1 ml-2 text-xs bg-slate-100 rounded-full">
              {task.status}
            </span>
          </div>
          {"experiment_name" in task.parameters && (
            <div className="flex flex-row items-center text-xs mb-2">
              {task.parameters.experiment_name}
            </div>
          )}
          <p>
            <strong>Created:</strong> {formatDate(task.created_at)}
          </p>
          <p>
            <strong>Started:</strong> {formatDate(task.started_at)}
          </p>
          <p>
            <strong>Ended:</strong> {formatDate(task.ended_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

const TrainTaskCard = ({
  task,
  drafts,
}: {
  task: TrainTask;
  drafts: Draft[];
}) => {
  const key = Object.keys(task.parameters.results || {})
    .sort(
      (a, b) =>
        (+task.parameters.results![a]["BLEU"] || 0) -
        (+task.parameters.results![b]["BLEU"] || 0)
    )
    .at(-1);

  if (!key) {
    return <></>;
  }

  return (
    <div
      key={task.id}
      className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6"
    >
      <div className="flex flex-row">
        <div className="flex-1 text-sm text-slate-500 dark:text-slate-40 mr-4">
          <div className="flex flex-row items-center">
            <NavLink
              className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-1"
              to={`/tasks/${task.id}`}
            >
              {task.kind}
            </NavLink>
            <span className="px-2 py-1 ml-2 text-xs bg-slate-100 rounded-full">
              {task.status}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-bold">
            {task.parameters.experiment_name}
          </p>
          <div className="my-2">
            <p className="text-slate-500">{key}</p>
            <p>
              <strong>BLEU:</strong>
              {" " + task.parameters.results?.[key]?.["BLEU"]}
            </p>
            <p>
              <strong>ChrF3:</strong>
              {" " + task.parameters.results?.[key]?.["chrF3"]}
            </p>
          </div>
          <p>
            <strong>Created:</strong> {formatDate(task.created_at)}
          </p>
          <p>
            <strong>Started:</strong> {formatDate(task.started_at)}
          </p>
          <p>
            <strong>Ended:</strong> {formatDate(task.ended_at)}
          </p>
        </div>
        <DraftsList drafts={drafts} />
      </div>
    </div>
  );
};

const DraftsList = ({ drafts }: { drafts: Draft[] }) => {
  if (drafts.length === 0) {
    return (
      <div className="flex-1 border-l border-slate-300 ml-4 pl-4 flex items-center justify-center">
        No Drafts
      </div>
    );
  }
  return (
    <div className="flex-1 border-l border-slate-300 space-y-4 pl-4">
      {groupDraftsBySourceText(drafts).map(({ source, drafts }) => (
        <div key={source}>
          <h3 className="font-bold text-xs flex flex-row justify-center text-slate-400">
            ~ {source} ~
          </h3>
          <div>
            {drafts.map((draft) => (
              <>
                <span
                  key={JSON.stringify(draft)}
                  className="font-bold text-violet-500"
                >
                  {draft.book_name}
                </span>{" "}
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export function ProjectDetails() {
  const { projectId } = useParams<string>();
  const [project, setProject] = useState<ParatextProject | null>(null);
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const updateTasks = async () => {
    const tasksResponse = await api.tasks.getAll({ projectId });
    const sortedTasks = tasksResponse.sort(sortTasks);
    setTasks(sortedTasks);
  };

  const fetchDetails = async () => {
    if (!projectId) {
      setTasks([]);
      setDrafts([]);
      return;
    }
    try {
      setIsLoading(true);
      console.log("looking for scriptures by ", projectId);
      const [projectResponse, draftsResponse, scriptureResponse, _] =
        await Promise.all([
          api.projects.getById(projectId),
          api.drafts.getByProjectId(projectId),
          api.scriptures.getAll(projectId),
          updateTasks(),
        ]);
      setProject(projectResponse);
      setDrafts(draftsResponse);
      setScripture(scriptureResponse.at(0) || null);

      if (!scriptureResponse) {
        setError(
          "Cannot find Scripture File for this project. Are you sure it has been extracted?"
        );
      }
    } catch (err) {
      setError("Failed to fetch project details.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [projectId]);

  if (isLoading)
    return <div className="text-center p-8">Loading project details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-row">
        <div>
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-full bg-violet-500 text-slate-200 p-2 hover:bg-violet-600 hover:text-slate-100 active:scale-95 mr-4"
          >
            {BackSvgIcon}
          </NavLink>
        </div>
        <div className="mb-6 flex-1">
          <h1 className="text-3xl font-bold">
            Project Details: {project?.name}
          </h1>
          <span className="text-sm font-bold">{project?.full_name}</span>
          {scripture?.name && (
            <span className="text-sm ml-2">
              (scripture file: {scripture?.id})
            </span>
          )}
        </div>
      </div>

      {!scripture && projectId && (
        <section className="mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
            <p className="text-red-500">
              We could not find a scripture file. Have you extracted this
              project?
            </p>
            <button
              className="mt-2 py-1 px-3 text-sm font-bold text-white rounded-full bg-violet-500 hover:bg-violet-600 active:scale-95 cursor-pointer disabled:bg-slate-300"
              onClick={async () => {
                await api.tasks.createExtract({
                  project_id: projectId,
                });
                updateTasks();
              }}
            >
              Create Extract Task
            </button>
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="flex flex-row items-center mb-4">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <button
            disabled={!scripture}
            className="ml-4 py-1 px-3 text-sm font-bold text-white rounded-full bg-violet-500 hover:bg-violet-600 active:scale-95 cursor-pointer disabled:bg-slate-300"
            onClick={() => setIsCreatingTask(true)}
            title={
              !scripture
                ? "You cannot create a new task for a project that has not been extracted. No scripture file was found associated with this project."
                : undefined
            }
          >
            New Task
          </button>
          {drafts.length > 0 && (
            <button
              className="ml-2 py-1 px-3 text-sm font-bold text-white rounded-full bg-violet-500 hover:bg-violet-600 active:scale-95 cursor-pointer disabled:bg-slate-300"
              onClick={async () => {
                if (!projectId) return;
                await api.projects.downloadDrafts(projectId);
              }}
              type="button"
            >
              Download Drafts
            </button>
          )}
        </div>

        {isCreatingTask && project && (
          <CreateTaskForm
            project={project}
            onTaskCreated={() => {
              setIsCreatingTask(false);
              updateTasks();
            }}
            onCancel={() => setIsCreatingTask(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            if (task.kind === "train") {
              return (
                <TrainTaskCard
                  key={task.id}
                  task={task}
                  drafts={drafts.filter(
                    (d) =>
                      d.train_experiment_name ===
                      (task as TrainTask).parameters.experiment_name
                  )}
                />
              );
            }
            return <DefaultTaskCard key={task.id} task={task} />;
          })}
        </div>
      </section>
    </div>
  );
}
