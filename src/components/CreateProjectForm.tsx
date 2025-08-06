import { useState, type FormEvent, type ChangeEvent } from "react";
import { api } from "../api/apiClient";

// Extend the input element to include webkitdirectory
declare module "react" {
  interface InputHTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface CreateProjectFormProps {
  onProjectCreated: () => void;
}

export function CreateProjectForm({
  onProjectCreated,
}: CreateProjectFormProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError(
        "Please select a folder to upload. A 'Settings.xml' is required."
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.projects.create(files, (percent) => {
        setUploadProgress(percent);
      });
      setSuccess(
        `Project "${
          response instanceof Object && "name" in response
            ? response.name
            : "unknown name"
        }" created successfully!`
      );
      onProjectCreated(); // Notify parent to refresh the list
    } catch (err) {
      setError(
        "Failed to create project. Please check the files and try again."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Upload a Project Folder</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="files"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Select Project Folder (containing Settings.xml)
          </label>
          <input
            type="file"
            id="files"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 dark:text-slate-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-violet-50 dark:file:bg-violet-900/50 file:text-violet-700 dark:file:text-violet-300
                       hover:file:bg-violet-100 dark:hover:file:bg-violet-900"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click "Choose Files" and select the project folder containing all
            your project files
          </p>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        {files && files.length > 0 && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Uploading..." : "Create Project"}
            <div className="ml-2 inline-block">
              {uploadProgress > 0 && uploadProgress < 100 && (
                <span className="text-sm text-slate-300">
                  {uploadProgress}%
                </span>
              )}
            </div>
          </button>
        )}
      </form>
    </div>
  );
}
