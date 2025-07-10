import type { Draft } from "../types";
import { BotSvgIcon } from "./Icons";

interface BookCompletionProps {
  details: Record<string, number>;
  drafts: Draft[];
}

// Map of book codes to full names
const BOOK_NAMES: Record<string, string> = {
  // Old Testament
  GEN: "Genesis",
  EXO: "Exodus",
  LEV: "Leviticus",
  NUM: "Numbers",
  DEU: "Deuteronomy",
  JOS: "Joshua",
  JDG: "Judges",
  RUT: "Ruth",
  "1SA": "1 Samuel",
  "2SA": "2 Samuel",
  "1KI": "1 Kings",
  "2KI": "2 Kings",
  "1CH": "1 Chronicles",
  "2CH": "2 Chronicles",
  EZR: "Ezra",
  NEH: "Nehemiah",
  EST: "Esther",
  JOB: "Job",
  PSA: "Psalms",
  PRO: "Proverbs",
  ECC: "Ecclesiastes",
  SNG: "Song of Songs",
  ISA: "Isaiah",
  JER: "Jeremiah",
  LAM: "Lamentations",
  EZK: "Ezekiel",
  DAN: "Daniel",
  HOS: "Hosea",
  JOL: "Joel",
  AMO: "Amos",
  OBA: "Obadiah",
  JON: "Jonah",
  MIC: "Micah",
  NAM: "Nahum",
  HAB: "Habakkuk",
  ZEP: "Zephaniah",
  HAG: "Haggai",
  ZEC: "Zechariah",
  MAL: "Malachi",
  // New Testament
  MAT: "Matthew",
  MRK: "Mark",
  LUK: "Luke",
  JHN: "John",
  ACT: "Acts",
  ROM: "Romans",
  "1CO": "1 Corinthians",
  "2CO": "2 Corinthians",
  GAL: "Galatians",
  EPH: "Ephesians",
  PHP: "Philippians",
  COL: "Colossians",
  "1TH": "1 Thessalonians",
  "2TH": "2 Thessalonians",
  "1TI": "1 Timothy",
  "2TI": "2 Timothy",
  TIT: "Titus",
  PHM: "Philemon",
  HEB: "Hebrews",
  JAS: "James",
  "1PE": "1 Peter",
  "2PE": "2 Peter",
  "1JN": "1 John",
  "2JN": "2 John",
  "3JN": "3 John",
  JUD: "Jude",
  REV: "Revelation",
};

// Biblical book groupings
const BOOK_GROUPS = [
  {
    title: "Pentateuch",
    testament: "OT" as const,
    books: ["GEN", "EXO", "LEV", "NUM", "DEU"],
  },
  {
    title: "Historical Books",
    testament: "OT" as const,
    books: [
      "JOS",
      "JDG",
      "RUT",
      "1SA",
      "2SA",
      "1KI",
      "2KI",
      "1CH",
      "2CH",
      "EZR",
      "NEH",
      "EST",
    ],
  },
  {
    title: "Wisdom & Poetry",
    testament: "OT" as const,
    books: ["JOB", "PSA", "PRO", "ECC", "SNG"],
  },
  {
    title: "Major Prophets",
    testament: "OT" as const,
    books: ["ISA", "JER", "LAM", "EZK", "DAN"],
  },
  {
    title: "Minor Prophets",
    testament: "OT" as const,
    books: [
      "HOS",
      "JOL",
      "AMO",
      "OBA",
      "JON",
      "MIC",
      "NAM",
      "HAB",
      "ZEP",
      "HAG",
      "ZEC",
      "MAL",
    ],
  },
  {
    title: "Gospels & Acts",
    testament: "NT" as const,
    books: ["MAT", "MRK", "LUK", "JHN", "ACT"],
  },
  {
    title: "Pauline Epistles",
    testament: "NT" as const,
    books: [
      "ROM",
      "1CO",
      "2CO",
      "GAL",
      "EPH",
      "PHP",
      "COL",
      "1TH",
      "2TH",
      "1TI",
      "2TI",
      "TIT",
      "PHM",
    ],
  },
  {
    title: "General Epistles",
    testament: "NT" as const,
    books: ["HEB", "JAS", "1PE", "2PE", "1JN", "2JN", "3JN", "JUD"],
  },
  {
    title: "Apocalyptic",
    testament: "NT" as const,
    books: ["REV"],
  },
];

interface BookProgressChipProps {
  bookCode: string;
  progress: number;
  isDrafted?: boolean;
}

const BookProgressChip = ({
  bookCode,
  progress,
  isDrafted = false,
}: BookProgressChipProps) => {
  const bookName = BOOK_NAMES[bookCode] || bookCode;
  const isComplete = progress >= 100;
  const hasProgress = progress > 0;
  const progressPercent = Math.min(progress, 100);

  return (
    <div className="relative group">
      {/* Compact book chip */}
      <div
        className={`
          relative w-16 h-8 rounded-md border-2 overflow-hidden cursor-pointer
          transition-all duration-200 hover:opacity-50
          ${
            !hasProgress
              ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 opacity-40"
              : isComplete
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          }
        `}
        title={`${bookName}: ${progress}%${isDrafted ? " (Drafted)" : ""}`}
      >
        {/* Progress fill - only show if there's progress */}
        {hasProgress && (
          <div
            className={`
              absolute top-0 left-0 h-full transition-all duration-300
              ${
                isComplete
                  ? "bg-green-500"
                  : progressPercent > 50
                  ? "bg-blue-500"
                  : "bg-orange-500"
              }
            `}
            style={{ width: `${progressPercent}%` }}
          />
        )}

        {/* Book code text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`
            text-xs font-semibold z-10
            ${
              !hasProgress
                ? "text-slate-400 dark:text-slate-600"
                : isComplete
                ? "text-white"
                : "text-slate-700 dark:text-slate-300"
            }
          `}
          >
            {bookCode}
          </span>
        </div>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center">
        <p>
          {bookName}: {hasProgress ? `${progress}%` : "Not started"}
        </p>
        {isDrafted && <p>AI Draft Available</p>}
      </div>

      {/* Draft indicator - small dot in top-right */}
      {isDrafted && (
        <div className="absolute -top-1 -right-1">
          <BotSvgIcon
            className={
              "w-5 h-5 p-0.5 bg-slate-100 rounded-full border border-slate-300 text-slate-800"
            }
          />
        </div>
      )}
    </div>
  );
};

interface BookGroupProps {
  title: string;
  testament: "OT" | "NT";
  books: string[];
  details: Record<string, number>;
  drafts?: Draft[];
}

const BookGroup = ({
  title,
  testament,
  books,
  details,
  drafts = [],
}: BookGroupProps) => {
  // Show all books, but calculate stats only for those with progress
  const booksWithProgress = books.filter((bookCode) => details[bookCode] > 0);
  const completedCount = booksWithProgress.filter(
    (bookCode) => details[bookCode] >= 100
  ).length;

  // Create a set of drafted book names for quick lookup
  const draftedBookNames = new Set(drafts.map((draft) => draft.book_name));

  // Function to check if a book code has been drafted
  const isDrafted = (bookCode: string) => {
    return draftedBookNames.has(bookCode);
  };

  const draftedCount = books.filter(isDrafted).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {title}
          </h4>
          <span
            className={`
              px-1.5 py-0.5 text-xs font-semibold rounded-full
              ${
                testament === "OT"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  : "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
              }
            `}
          >
            {testament}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{completedCount} completed</span>
          {draftedCount > 0 && (
            <>
              <span>•</span>
              <span>{draftedCount} drafted</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {books.map((bookCode) => (
          <BookProgressChip
            key={bookCode}
            bookCode={bookCode}
            progress={details[bookCode] || 0}
            isDrafted={isDrafted(bookCode)}
          />
        ))}
      </div>
    </div>
  );
};

export const BookCompletion = ({
  details,
  drafts = [],
}: BookCompletionProps) => {
  // Calculate overall stats
  const allBooks = BOOK_GROUPS.flatMap((group) => group.books);
  const booksWithProgress = allBooks.filter(
    (bookCode) => details[bookCode] > 0
  );
  const completedBooks = booksWithProgress.filter(
    (bookCode) => details[bookCode] >= 100
  );
  const inProgressBooks = booksWithProgress.filter(
    (bookCode) => details[bookCode] < 100 && details[bookCode] > 0
  );
  const totalBooks = allBooks.length;

  // Calculate draft stats
  const draftedBookNames = new Set(drafts.map((draft) => draft.book_name));
  const isDrafted = (bookCode: string) => draftedBookNames.has(bookCode);
  const draftedBooks = allBooks.filter(isDrafted);
  console.log(draftedBookNames);

  // Calculate OT/NT specific stats
  const otBooks = BOOK_GROUPS.filter((g) => g.testament === "OT").flatMap(
    (g) => g.books
  );
  const ntBooks = BOOK_GROUPS.filter((g) => g.testament === "NT").flatMap(
    (g) => g.books
  );

  const otCompleted = otBooks.filter((book) => details[book] >= 100).length;
  const ntCompleted = ntBooks.filter((book) => details[book] >= 100).length;
  const otDrafted = otBooks.filter(isDrafted).length;
  const ntDrafted = ntBooks.filter(isDrafted).length;

  return (
    <div className="space-y-6">
      {/* Overall summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Scripture Progress
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">
              {completedBooks.length} completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">
              {inProgressBooks.length} in progress
            </span>
          </div>
          {draftedBooks.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-400">
                {draftedBooks.length} drafted
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">
              {totalBooks - booksWithProgress.length} not started
            </span>
          </div>
        </div>
      </div>

      {/* Testament breakdown */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            OT
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            {otCompleted}/{otBooks.length} completed
          </span>
          {otDrafted > 0 && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-400">
                {otDrafted} drafted
              </span>
            </>
          )}
        </div>
      </div>

      {/* Book groups */}
      <div className="space-y-4">
        {BOOK_GROUPS.map((group, index) => (
          <>
            <BookGroup
              key={group.title}
              title={group.title}
              testament={group.testament}
              books={group.books}
              details={details}
              drafts={drafts}
            />
            {/* Insert divider after the last OT group */}
            {group.testament === "OT" &&
              BOOK_GROUPS[index + 1]?.testament === "NT" && (
                <>
                  <hr className="border-t border-slate-300 dark:border-slate-600 my-4" />
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                      NT
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {ntCompleted}/{ntBooks.length} completed
                    </span>
                    {ntDrafted > 0 && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {ntDrafted} drafted
                        </span>
                      </>
                    )}
                  </div>
                </>
              )}
          </>
        ))}
      </div>
    </div>
  );
};
