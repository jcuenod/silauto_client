import { useState, useEffect, useMemo, type FormEvent } from "react";
import { useParams } from "react-router";
import { api } from "../api/apiClient";
import { ScriptureSelector } from "./ScriptureSelector";
import { LangCodeSelector } from "./LangCodeSelector";
import type {
  TaskKind,
  AlignTaskCreate,
  TrainTaskCreate,
  Scripture,
  ParatextProject,
} from "../types";
import { RulerMeasureSvgIcon, GraduationSvgIcon } from "./Icons";

interface CreateTaskFormProps {
  onTaskCreated?: () => void;
  onCancel?: () => void;
  project: ParatextProject;
}

const DEFAULT_ALIGNMENT_SOURCES = [
  "en-NIV84",
  "en-NIV11R",
  "en-ESVUK16",
  "en-NLT",
  "en-NRSV",
  "en-NASB",
];

const getScriptureFilenameFromProject = (project: ParatextProject) =>
  `${project.iso_code}-${project.id}`;

export const CreateTaskForm = ({
  onTaskCreated,
  onCancel,
  project,
}: CreateTaskFormProps) => {
  const { projectId } = useParams<string>();
  const [taskType, setTaskType] = useState<TaskKind>("align");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data for form options
  const [scriptureFiles, setScriptureFiles] = useState<Scripture[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const getScriptureById = (id: string) =>
    scriptureFiles.find((s) => s.id === id);

  // Align task form state
  const [
    selectedSourceScriptureFilesForAlignment,
    setSelectedSourceScriptureFilesForAlignment,
  ] = useState<string[]>([]);

  // Train task form state
  const [trainingCorpus, setTrainingCorpus] = useState<string>("");
  const [langCodesMapping, setLangCodesMapping] = useState<
    Record<string, string>
  >({});
  const [
    selectedSourceScriptureFilesForTraining,
    setSelectedSourceScriptureFilesForTraining,
  ] = useState<string[]>([]);

  // Get unique language codes from selected scripture files and project
  const uniqueLangCodes = useMemo(() => {
    const langCodes = new Set<string>();

    // Add project's language code
    langCodes.add(project.iso_code);

    // Add language codes from selected scripture files
    selectedSourceScriptureFilesForTraining.forEach((id) => {
      const scripture = getScriptureById(id);
      if (scripture) {
        langCodes.add(scripture.lang_code);
      }
    });

    return Array.from(langCodes);
  }, [
    project.iso_code,
    selectedSourceScriptureFilesForTraining,
    scriptureFiles,
  ]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setIsLoadingData(true);
        const scriptureResponse = await api.scriptures.getAll();
        console.log("Fetched scripture files:", scriptureResponse);
        setScriptureFiles(scriptureResponse);
      } catch (err) {
        setError("Failed to load form data");
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchFormData();
  }, [projectId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectId) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (taskType === "align") {
        const alignData: AlignTaskCreate = {
          project_id: projectId,
          target_scripture_file: getScriptureFilenameFromProject(project),
          source_scripture_files: selectedSourceScriptureFilesForAlignment
            .map(getScriptureById)
            .filter((a) => !!a)
            .map((s) => s.id),
        };
        console.log("Creating align task:", alignData);
        await api.tasks.createAlign(alignData);
        setSuccess("Align task created successfully!");
      } else if (taskType === "train") {
        const trainData: TrainTaskCreate = {
          project_id: projectId,
          training_corpus: trainingCorpus,
          source_scripture_files: selectedSourceScriptureFilesForTraining,
          lang_codes: langCodesMapping,
        };
        console.log("Creating train task:", trainData);
        await api.tasks.createTrain(trainData);
        setSuccess("Train task created successfully!");
      }

      // Reset form
      setSelectedSourceScriptureFilesForAlignment([]);
      setSelectedSourceScriptureFilesForTraining([]);
      setTrainingCorpus("");
      setLangCodesMapping({});

      onTaskCreated?.();
    } catch (err) {
      setError(
        "Failed to create task. Please check your inputs and try again."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md mb-8">
        <div className="text-center">Loading form data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Task Type
          </label>
          <div className="flex">
            <button
              type="button"
              onClick={() => setTaskType("align")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-l-md font-semibold shadow-md border transition-colors
            ${
              taskType === "align"
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-violet-100 dark:hover:bg-violet-900"
            }`}
            >
              <RulerMeasureSvgIcon
                className={taskType !== "align" ? "scale-90" : ""}
              />
              Align
            </button>
            <button
              type="button"
              onClick={() => setTaskType("train")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-r-md font-semibold shadow-md border transition-colors
            ${
              taskType === "train"
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-violet-100 dark:hover:bg-violet-900"
            }`}
            >
              <GraduationSvgIcon
                className={taskType !== "train" ? "scale-90" : ""}
              />
              Train
            </button>
          </div>
        </div>

        {/* Align Task Fields */}
        {taskType === "align" && (
          <div>
            <div className="flex flex-row items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Source Projects
              </label>
              <button
                type="button"
                className="px-3 py-1 bg-violet-600 text-sm text-white font-semibold rounded-full shadow-md hover:bg-violet-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  const additionalSources = DEFAULT_ALIGNMENT_SOURCES.filter(
                    (s) => !selectedSourceScriptureFilesForAlignment.includes(s)
                  );
                  setSelectedSourceScriptureFilesForAlignment([
                    ...selectedSourceScriptureFilesForAlignment,
                    ...additionalSources,
                  ]);
                }}
              >
                Add Defaults
              </button>
            </div>
            <ScriptureSelector
              scriptureFiles={scriptureFiles}
              selectedScriptureFiles={selectedSourceScriptureFilesForAlignment}
              onSelectionChange={setSelectedSourceScriptureFilesForAlignment}
            />
          </div>
        )}

        {/* Train Task Fields */}
        {taskType === "train" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Training Corpus
              </label>
              <input
                type="text"
                value={trainingCorpus}
                onChange={(e) => setTrainingCorpus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-800"
                placeholder="e.g., NT or MAT-ACT;1CO"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Leave blank for all
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Scripture Files
              </label>
              <ScriptureSelector
                scriptureFiles={scriptureFiles}
                selectedScriptureFiles={selectedSourceScriptureFilesForTraining}
                onSelectionChange={setSelectedSourceScriptureFilesForTraining}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Language Codes
              </label>
              <LangCodeSelector
                langCodes={uniqueLangCodes}
                value={langCodesMapping}
                onChange={setLangCodesMapping}
              />
            </div>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {/* Form Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              (taskType === "align" &&
                selectedSourceScriptureFilesForAlignment.length === 0) ||
              (taskType === "train" &&
                Object.keys(langCodesMapping).length === 0)
            }
            className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Creating..."
              : `Create ${
                  taskType.charAt(0).toUpperCase() + taskType.slice(1)
                } Task`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
