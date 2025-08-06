import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { api } from "../api/apiClient";
import { type Scripture } from "../types";
import { BookCompletion } from "../components/BookCompletion";
import { BackSvgIcon } from "../components/Icons";

export function ScriptureDetails() {
  const { scriptureId } = useParams<{ scriptureId: string }>();
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScriptureDetails = async () => {
      if (!scriptureId) {
        setError("Scripture ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching scripture details for ID:", scriptureId);
        const scriptureResponse = (
          await api.scriptures.getById(scriptureId)
        )?.[0];
        setScripture(scriptureResponse);
      } catch (err) {
        setError("Failed to fetch scripture details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScriptureDetails();
  }, [scriptureId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-slate-600 dark:text-slate-400">
          Loading scripture details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <Link
          to="/scriptures"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Scripture List
        </Link>
      </div>
    );
  }

  if (!scripture) {
    return (
      <div className="text-center p-8">
        <div className="text-slate-500 mb-4">Scripture not found</div>
        <Link
          to="/scriptures"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Scripture List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full bg-violet-500 text-slate-300 p-2 hover:bg-violet-600 hover:text-slate-100 active:scale-95 mr-4 cursor-pointer"
          >
            {BackSvgIcon}
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            {scripture.name}
          </h1>
        </div>
      </div>

      {/* Scripture metadata */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Scripture Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Name
            </label>
            <div className="text-slate-900 dark:text-slate-100">
              {scripture.name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Language Code
            </label>
            <div className="text-slate-900 dark:text-slate-100">
              {scripture.lang_code}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Path
            </label>
            <div className="text-slate-900 dark:text-slate-100 font-mono text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded">
              {scripture.path}
            </div>
          </div>
        </div>

        {/* Overall statistics */}
        {scripture.stats?.summary && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Overall Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {Math.round(scripture.stats.summary.whole_bible * 100)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Whole Bible
                </div>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                  {Math.round(scripture.stats.summary.old_testament * 100)}%
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-400">
                  Old Testament
                </div>
              </div>
              <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <div className="text-2xl font-bold text-violet-800 dark:text-violet-300">
                  {Math.round(scripture.stats.summary.new_testament * 100)}%
                </div>
                <div className="text-sm text-violet-600 dark:text-violet-400">
                  New Testament
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {Math.round(scripture.stats.summary.deuterocanonical * 100)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Deuterocanonical
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book completion details */}
      {scripture.stats?.details && (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
          <BookCompletion details={scripture.stats.details} drafts={[]} />
        </div>
      )}
    </div>
  );
}
