import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../api/apiClient";
import { type Scripture } from "../types";

export function ScriptureList() {
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScriptures = async () => {
      try {
        setIsLoading(true);
        const response = await api.scriptures.getAll(searchQuery || undefined);
        setScriptures(response);
      } catch (err) {
        setError("Failed to fetch scriptures.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScriptures();
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Scripture Files</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search scriptures..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div
        className={
          "bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden" +
          (isLoading ? " opacity-50 pointer-events-none" : "")
        }
      >
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Language Code</th>
              <th className="p-4 font-semibold">Statistics</th>
              <th className="p-4 font-semibold">Path</th>
            </tr>
          </thead>
          <tbody>
            {scriptures.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  {searchQuery
                    ? "No scriptures found matching your search."
                    : "No scriptures available."}
                </td>
              </tr>
            ) : (
              scriptures.map((scripture) => (
                <tr
                  key={scripture.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={() => navigate(`/scriptures/${scripture.id}`)}
                >
                  <td className="p-4">{scripture.name}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {scripture.lang_code}
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {scripture.stats?.summary &&
                    Object.keys(scripture.stats.summary).length > 0 ? (
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="capitalize">OT:</span>
                          <span className="font-mono">
                            {Math.round(
                              scripture.stats.summary.old_testament * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="capitalize">NT:</span>
                          <span className="font-mono">
                            {Math.round(
                              scripture.stats.summary.new_testament * 100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">
                        No stats available
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-sm">
                    {scripture.path}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
