import {
  type Draft,
  type Scripture,
  type TrainTask,
  type DraftTaskCreate,
  type ParatextProject,
} from "../types";
import { BookSelector } from "../components/BookSelector";
import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import { api } from "../api/apiClient";

export const Drafts = ({
  drafts,
  task,
  scripture,
}: {
  drafts: Draft[];
  task: TrainTask;
  scripture: Scripture;
}) => {
  const [open, setOpen] = useState(false);
  const sources = Array.from(
    new Set(drafts.map((d) => d.source_scripture_name))
  ).sort();
  return (
    <>
      {sources.map((s, i) => (
        <div key={s}>
          {i > 0 && (
            <hr className="border-t border-slate-300 dark:border-slate-600 my-4" />
          )}
          <div>
            <div className="font-bold text-sm">{s}</div>
            <div>
              {drafts
                .filter((d) => d.source_scripture_name === s)
                .map((d) => (
                  <div key={d.book_name} className="inline-block mr-2">
                    {d.book_name}
                    {d.has_pdf && "*"}
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
      <div className="mt-3">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          New Draft
        </button>
      </div>{" "}
      <NewDraftModal
        open={open}
        onClose={() => setOpen(false)}
        task={task}
        scripture={scripture}
      />
    </>
  );
};

interface NewDraftModalProps {
  open: boolean;
  onClose: () => void;
  task: TrainTask;
  scripture: Scripture;
}

const NewDraftModal = ({
  open,
  onClose,
  task,
  scripture,
}: NewDraftModalProps) => {
  const [selectedProject, setSelectedProject] =
    useState<ParatextProject | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [sourceProjects, setSourceProjects] = useState<ParatextProject[]>([]);
  const [allProjects, setAllProjects] = useState<ParatextProject[]>([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAllProjects, setIsLoadingAllProjects] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load source projects from train task when modal opens
  useEffect(() => {
    if (open) {
      const loadSourceProjects = async () => {
        try {
          // Get projects for each source scripture file from the train task
          const sourceScriptureFiles = task.parameters.source_scripture_files;
          const projectPromises = sourceScriptureFiles.map((filename) =>
            api.projects.getByScripture(filename)
          );

          const projects = (await Promise.all(projectPromises)).flat();
          setSourceProjects(projects.filter(Boolean)); // Filter out any null/undefined results
        } catch (err) {
          console.error("Failed to load source projects:", err);
          // Fallback to empty array if there's an error
          setSourceProjects([]);
        }
      };

      loadSourceProjects();
      setError(null);
    }
  }, [open, task.parameters.source_scripture_files]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedProject(null);
      setSelectedBooks([]);
      setShowAllProjects(false);
      setAllProjects([]);
      setError(null);
    }
  }, [open]);

  // Load all projects when "Other" is selected
  const handleShowAllProjects = async () => {
    if (allProjects.length === 0) {
      setIsLoadingAllProjects(true);
      try {
        const projects = await api.projects.getAll();
        setAllProjects(projects);
      } catch (err) {
        console.error("Failed to load all projects:", err);
        setError("Failed to load additional projects. Please try again.");
      } finally {
        setIsLoadingAllProjects(false);
      }
    }
    setShowAllProjects(true);
  };

  const handleSubmit = async () => {
    if (!selectedProject || selectedBooks.length === 0) {
      setError("Please select a source project and at least one book.");
      return;
    }

    // Check if the project's language code is in the training data
    if (!(selectedProject.iso_code in task.parameters.lang_codes)) {
      setError(
        "The selected project's language was not included in the training data. This is almost certainly not what you wanted to do."
      );
      return;
    }

    // Extract project_id from task parameters
    const targetProjectId = task.parameters.project_id;

    if (!targetProjectId) {
      setError(
        "Could not determine target project ID from task. This task may not support draft creation."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const targetLangIsoCode =
        task.parameters.target_scripture_file.split("-")[0];
      const translateTaskData: DraftTaskCreate = {
        experiment_name: task.parameters.experiment_name,
        train_task_id: task.id,
        source_project_id: selectedProject.id,
        book_names: selectedBooks,
        source_script_code:
          task.parameters.lang_codes[selectedProject.iso_code],
        target_script_code: task.parameters.lang_codes[targetLangIsoCode],
        // Note: selectedProject.scripture_filename could potentially be used here
        // in the future if script codes need to be derived from the filename
      };

      await api.tasks.createDraft(translateTaskData);
      onClose();
    } catch (err) {
      console.error("Failed to create translation task:", err);
      setError("Failed to create translation task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-x-hidden overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex flex-row items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Create New Draft
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Source Project Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Source Project
            </label>

            {/* Projects from train task source scriptures */}
            {sourceProjects.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  From Training Sources
                </h4>
                <div className="space-y-2 border border-slate-200 dark:border-slate-700 rounded-md p-3">
                  {sourceProjects
                    .sort((a, b) =>
                      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                    )
                    .map((project) => (
                      <label
                        key={project.id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="sourceProject"
                          value={project.id}
                          checked={selectedProject?.id === project.id}
                          onChange={() => setSelectedProject(project)}
                          className="text-blue-600"
                        />
                        <span className="text-sm">
                          {project.name} ({project.iso_code})
                          {project.full_name &&
                            project.full_name !== project.name && (
                              <span className="text-slate-500 dark:text-slate-400 ml-1">
                                - {project.full_name}
                              </span>
                            )}
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            From Training
                          </span>
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            )}

            {/* Show all projects option */}
            {!showAllProjects ? (
              <button
                type="button"
                onClick={handleShowAllProjects}
                disabled={isLoadingAllProjects}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
              >
                {isLoadingAllProjects ? "Loading..." : "Show other projects..."}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    All Available Projects
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAllProjects(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Hide
                  </button>
                </div>
                {allProjects.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-md p-3">
                    {allProjects
                      .filter(
                        (project) =>
                          !sourceProjects.some((sp) => sp.id === project.id)
                      ) // Exclude projects already shown in source projects
                      .sort((a, b) =>
                        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                      )
                      .map((project) => (
                        <label
                          key={project.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="sourceProject"
                            value={project.id}
                            checked={selectedProject?.id === project.id}
                            onChange={() => setSelectedProject(project)}
                            className="text-blue-600"
                          />
                          <span className="text-sm">
                            {project.name} ({project.iso_code})
                            {project.full_name &&
                              project.full_name !== project.name && (
                                <span className="text-slate-500 dark:text-slate-400 ml-1">
                                  - {project.full_name}
                                </span>
                              )}
                          </span>
                        </label>
                      ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                    No additional projects available.
                  </div>
                )}
              </div>
            )}

            {/* Show message if no projects available */}
            {sourceProjects.length === 0 && !showAllProjects && (
              <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                No projects found from training sources. Try "Show other
                projects" to see all available projects.
              </div>
            )}
          </div>

          {/* Book Selection */}
          <div>
            <BookSelector
              selectedBooks={selectedBooks}
              onBooksChange={setSelectedBooks}
              details={scripture.stats.details}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isLoading || !selectedProject || selectedBooks.length === 0
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Draft"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
