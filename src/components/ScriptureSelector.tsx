import { useState, useMemo, useCallback } from "react";
import type { Scripture } from "../types";
import { TrashSvgIcon } from "./Icons";

// Helper type for props
interface ScriptureSelectorProps {
  scriptureFiles: Scripture[];
  selectedScriptureFiles: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

// --- Draggable Item for the "Available" List ---
interface DraggableScriptureProps {
  scripture: Scripture;
  onToggle: (id: string) => void;
  isDragging: boolean;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    scriptureId: string,
    source: string
  ) => void;
  onDragEnd: () => void;
}

const DraggableScripture = ({
  scripture,
  onToggle,
  isDragging,
  onDragStart,
  onDragEnd,
}: DraggableScriptureProps) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(scripture.id);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, scripture.id, "available")}
      onDragEnd={onDragEnd}
      className={`flex items-center pl-2 pr-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-grab active:cursor-grabbing border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-150 ${
        isDragging ? "opacity-50 scale-105 ring-2 ring-blue-400" : ""
      }`}
      title={`Drag ${scripture.lang_code} / ${scripture.name} to select`}
    >
      <div className="w-2 h-2 bg-slate-400 rounded-full mr-3" />
      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
        {scripture.lang_code} / {scripture.name}
      </span>
      <button
        type="button"
        onClick={handleButtonClick}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-5 h-5 my-1 flex items-center justify-center font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
      >
        +
      </button>
    </div>
  );
};

// --- Draggable Item for the "Selected" List ---
const SelectedScripture = ({
  scripture,
  onRemove,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  scripture: Scripture;
  onRemove: (id: string) => void;
  isDragging: boolean;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    scriptureId: string,
    source: string
  ) => void;
  onDragEnd: () => void;
}) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(scripture.id);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, scripture.id, "selected")}
      onDragEnd={onDragEnd}
      className={`flex items-center justify-between bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-md pl-2 pr-1.5 cursor-move transition-all duration-150 ${
        isDragging ? "opacity-50 scale-105 ring-2 ring-violet-400" : ""
      }`}
      title={`Drag ${scripture.lang_code} / ${scripture.name} to remove`}
    >
      <div className="flex items-center">
        <div className="w-2 h-2 bg-violet-500 rounded-full mr-3" />
        <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
          {scripture.lang_code} / {scripture.name}
        </span>
      </div>
      <button
        type="button"
        onClick={handleRemoveClick}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="text-xs h-5 w-5 my-1.5 flex items-center justify-center text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200 hover:bg-violet-200 dark:hover:bg-violet-800/30 rounded"
      >
        ✕
      </button>
    </div>
  );
};

// --- Main Selector Component ---
export const ScriptureSelector = ({
  scriptureFiles,
  selectedScriptureFiles,
  onSelectionChange,
}: ScriptureSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);

  const availableScriptures = useMemo(() => {
    return scriptureFiles.filter(
      (s) =>
        !selectedScriptureFiles.includes(s.id) &&
        (s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.lang_code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [scriptureFiles, selectedScriptureFiles, searchTerm]);

  const selectedScriptures = useMemo(() => {
    return selectedScriptureFiles
      .map((id) => scriptureFiles.find((s) => s.id === id))
      .filter((s): s is Scripture => s !== undefined);
  }, [selectedScriptureFiles, scriptureFiles]);

  const handleDragStart = useCallback(
    (
      event: React.DragEvent<HTMLDivElement>,
      scriptureId: string,
      source: string
    ) => {
      event.dataTransfer.setData("scriptureId", scriptureId);
      event.dataTransfer.setData("source", source);
      event.dataTransfer.effectAllowed = "move";
      setDraggedItemId(scriptureId);
    },
    []
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>, zone: string) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (zone !== dragOverZone) {
        setDragOverZone(zone);
      }
    },
    [dragOverZone]
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const dropZone = event.currentTarget as HTMLElement;
      if (!dropZone.contains(event.relatedTarget as Node)) {
        setDragOverZone(null);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, targetZone: string) => {
      event.preventDefault();
      const scriptureId = event.dataTransfer.getData("scriptureId");
      const source = event.dataTransfer.getData("source");

      if (!scriptureId || !source) return;

      if (source === targetZone) {
        // Same zone, no action needed
        setDraggedItemId(null);
        setDragOverZone(null);
        return;
      }

      if (targetZone === "selected") {
        // Moving to selected
        if (!selectedScriptureFiles.includes(scriptureId)) {
          onSelectionChange([...selectedScriptureFiles, scriptureId]);
        }
      } else {
        // Moving to available (removing from selected)
        onSelectionChange(
          selectedScriptureFiles.filter((id) => id !== scriptureId)
        );
      }

      setDraggedItemId(null);
      setDragOverZone(null);
    },
    [selectedScriptureFiles, onSelectionChange]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItemId(null);
    setDragOverZone(null);
  }, []);

  const handleToggle = (id: string) => {
    if (selectedScriptureFiles.includes(id)) {
      onSelectionChange(
        selectedScriptureFiles.filter((selectedId) => selectedId !== id)
      );
    } else {
      onSelectionChange([...selectedScriptureFiles, id]);
    }
  };

  if (
    selectedScriptureFiles.length === 0 &&
    selectedScriptureFiles.length > 0
  ) {
    onSelectionChange(selectedScriptureFiles);
  }

  return (
    <>
      <div className="flex flex-row p-4 w-full h-96 rounded-md shadow-sm border border-slate-300 dark:border-slate-600">
        {/* Available Items - Left Side */}
        <div className="flex-1 mr-2 flex flex-col h-full">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Available Scripture Files
          </div>
          <div className="mb-3 relative flex items-center justify-center">
            <input
              type="text"
              placeholder="Search scripture files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-800 text-sm pr-8"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 m-1 w-5 h-5 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-200 text-lg focus:outline-none cursor-pointer flex justify-center items-center"
                aria-label="Clear search"
                tabIndex={0}
              >
                ×
              </button>
            )}
          </div>
          <div
            onDrop={(e) => handleDrop(e, "available")}
            onDragOver={(e) => handleDragOver(e, "available")}
            onDragLeave={handleDragLeave}
            data-testid="available-drop-zone"
            className={`flex-1 min-h-0 overflow-y-auto border-2 border-dashed rounded-md p-3 transition-all duration-300 ${
              dragOverZone === "available"
                ? "border-red-400 bg-red-50/50 dark:bg-red-900/20 ring-2 ring-red-400"
                : "border-slate-300 dark:border-slate-600"
            }`}
          >
            {availableScriptures.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-slate-400 dark:text-slate-500 mb-2">
                  📚
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {searchTerm
                    ? "No scriptures found matching your search"
                    : "All available scriptures are selected"}
                </p>
                {selectedScriptureFiles.length > 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Drag selected items here to remove them
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {availableScriptures.map((scripture) => (
                  <DraggableScripture
                    key={scripture.id}
                    scripture={scripture}
                    onToggle={handleToggle}
                    isDragging={draggedItemId === scripture.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Items - Right Side */}
        <div className="flex-1 ml-2 flex flex-col h-full">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex flex-row items-center justify-between">
            Selected ({selectedScriptureFiles.length})
            {selectedScriptureFiles.length > 0 && (
              <button
                type="button"
                onClick={() => onSelectionChange([])}
                className="ml-2 p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm hover:bg-red-50 dark:hover:bg-red-800/30 rounded flex items-center"
              >
                <TrashSvgIcon />
              </button>
            )}
          </div>
          <div
            onDrop={(e) => handleDrop(e, "selected")}
            onDragOver={(e) => handleDragOver(e, "selected")}
            onDragLeave={handleDragLeave}
            data-testid="selected-drop-zone"
            className={`h-full flex-1 overflow-y-auto border-2 border-dashed rounded-md p-3 transition-all duration-300 ${
              dragOverZone === "selected"
                ? "border-violet-400 bg-violet-50/50 dark:bg-violet-900/20 ring-2 ring-violet-400"
                : "border-slate-300 dark:border-slate-600"
            } ${
              selectedScriptureFiles.length > 0
                ? "bg-violet-50/30 dark:bg-violet-900/10"
                : ""
            }`}
          >
            {selectedScriptureFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-slate-400 dark:text-slate-500 mb-2">
                  📖
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Drag scripture files here or click + to select
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Default: en-NIV11, en-ESVUS16
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedScriptures.map((scripture) => (
                  <SelectedScripture
                    key={scripture.id}
                    scripture={scripture}
                    onRemove={handleToggle}
                    isDragging={draggedItemId === scripture.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedScriptureFiles.length === 0 && (
        <p className="text-red-500 text-sm mt-2">
          Please select at least one scripture file
        </p>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Drag scripture files from left to right to select them, or click the +
        button. Drag from right to left to remove them.
      </p>
    </>
  );
};
