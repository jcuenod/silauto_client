import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../api/apiClient";
import {
  type AlignTask,
  type TrainTask,
  type Task,
  type Scripture,
  type Draft,
} from "../types";
import { BackSvgIcon } from "../components/Icons";
import { BookCompletion } from "../components/BookCompletion";
import { Drafts } from "../components/Drafts";

const formatDate = (dateStr: any) =>
  dateStr && new Date(dateStr).toLocaleString();

const Card = ({
  header,
  children,
}: {
  header: string;
  children?: React.ReactNode;
}) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{header}</h2>
    <div className="w-full overflow-auto bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
      {children || <></>}
    </div>
  </section>
);

const AlignResults = ({ task }: { task: AlignTask }) => {
  if (!task.parameters.results) {
    return <Card header="No Results" />;
  }

  return (
    <Card header="Results">
      <DictTable table={task.parameters.results} />
    </Card>
  );
};

const TrainResults = ({ task }: { task: TrainTask }) => {
  if (!task.parameters.results) {
    return <section>No results</section>;
  }

  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [drafts, setDrafts] = useState<Draft[] | null>(null);

  useEffect(() => {
    api.scriptures.getAll(task.parameters.target_scripture_file).then((s) => {
      if (s.length > 0) {
        setScripture(s[0]);
      }
    });

    api.drafts
      .getByExperimentName(task.parameters.experiment_name)
      .then((d) => {
        setDrafts(d);
      });
  }, [task]);

  const table = Object.keys(task.parameters.results).map((k) => ({
    score: k,
    ...task.parameters.results![k],
  }));

  return (
    <>
      <Card header="Results">
        <DictTable table={table} />
      </Card>
      <Card header="Source Data">
        <div className="flex flex-row items-center space-x-2">
          {task.parameters.training_corpus ? (
            <>
              <div className="font-semibold text-lg">Training Corpus:</div>
              {task.parameters.training_corpus.split(";").map((c) => (
                <div className="border-1 border-slate-300 py-1 px-2 rounded-lg bg-slate-100">
                  {c}
                </div>
              ))}
            </>
          ) : (
            <div className="text-sm text-slate-600">
              All available data was used for training
            </div>
          )}
        </div>
        <hr className="border-t border-slate-300 dark:border-slate-600 my-4" />
        {scripture && (
          <BookCompletion
            details={scripture.stats.details}
            drafts={drafts || []}
          />
        )}
      </Card>
      <Card header="Drafts">
        {scripture && (
          <Drafts drafts={drafts || []} task={task} scripture={scripture} />
        )}
      </Card>
    </>
  );
};

const DictTable = ({
  table,
}: {
  table: { [key: string]: string | number }[];
}) => {
  if (!table.length) {
    return <section>No Results</section>;
  }

  const headers = Object.keys(table[0]);
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 dark:bg-slate-800">
        <tr>
          {headers.map((h) => (
            <th className="p-4 font-semibold" key={h}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.map((row, index) => (
          <tr
            key={index}
            className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {headers.map((h) => (
              <td className="p-4">{row[h]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Results = ({ task }: { task: Task }) => {
  if (task.kind === "align") {
    return <AlignResults task={task} />;
  } else if (task.kind === "train") {
    return <TrainResults task={task} />;
  } else {
    return (
      <Card header="Results">
        {`Results display for task.kind (="${task.kind}") not implemented`}
      </Card>
    );
  }
};

export function TaskDetails() {
  const { taskId } = useParams<string>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskDetails = async () => {
    if (!taskId) {
      setTask(null);
      return;
    }
    try {
      setIsLoading(true);
      const taskResponse = await api.tasks.getById(taskId);
      setTask(taskResponse);
    } catch (err) {
      setError("Failed to fetch task details.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  if (isLoading)
    return <div className="text-center p-8">Loading task details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-row">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full bg-violet-500 text-slate-300 p-2 hover:bg-violet-600 hover:text-slate-100 active:scale-95 mr-4 cursor-pointer"
          >
            {BackSvgIcon}
          </button>
        </div>
        <div className="mb-6 flex-1">
          <h1 className="text-3xl font-bold">Task Details: {task?.kind}</h1>
          <div className="text-sm font-bold">Status: {task?.status}</div>
          {task && "experiment_name" in task.parameters && (
            <div className="text-slate-500 text-xl">
              {task.parameters.experiment_name as string}
            </div>
          )}
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Task Information</h2>
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
          <p className="text-slate-600 dark:text-slate-400">
            <strong>Created:</strong> {formatDate(task?.created_at)}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            <strong>Started:</strong>{" "}
            {formatDate(task?.started_at) || "Not started"}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            <strong>Ended:</strong> {formatDate(task?.ended_at) || "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            <strong>Error:</strong> {task?.error || "N/A"}
          </p>
        </div>
      </section>

      {task && <Results task={task} />}

      <section>
        <details>
          <summary className="text-2xl font-bold mb-4 cursor-pointer">
            Raw Data
          </summary>
          <pre className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 text-slate-600 dark:text-slate-400">
            {JSON.stringify(task?.parameters, null, 2)}
          </pre>
        </details>
      </section>
    </div>
  );
}
