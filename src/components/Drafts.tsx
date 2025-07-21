import {
  type Draft,
  type Scripture,
  type TrainTask,
} from "../types";
import { useState } from "react";
import { NewDraftModal } from "./NewDraftModal";

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
