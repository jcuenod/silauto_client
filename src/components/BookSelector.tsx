interface BookSelectorProps {
  selectedBooks: string[];
  onBooksChange: (books: string[]) => void;
  details?: Record<string, number>; // Book completion percentages (0-100): ● for 100%, ◐ for 1-99%, none for 0%
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

// Define color schemes for each book group
const GROUP_COLORS = {
  pentateuch:
    "bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300",
  historical:
    "bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300",
  wisdom:
    "bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300",
  majorProphets:
    "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300",
  minorProphets:
    "bg-cyan-100 border-cyan-300 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-900/20 dark:border-cyan-700 dark:text-cyan-300",
  gospels:
    "bg-violet-100 border-violet-300 text-violet-800 hover:bg-violet-200 dark:bg-violet-900/20 dark:border-violet-700 dark:text-violet-300",
  pauline:
    "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300",
  general:
    "bg-pink-100 border-pink-300 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-300",
  apocalyptic:
    "bg-red-100 border-red-300 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300",
  selected:
    "bg-slate-700 border-slate-800 text-white dark:bg-slate-300 dark:border-slate-400 dark:text-slate-900",
};

// Biblical book groupings
const BOOK_GROUPS = [
  {
    title: "Pentateuch",
    testament: "OT" as const,
    colorKey: "pentateuch" as keyof typeof GROUP_COLORS,
    books: ["GEN", "EXO", "LEV", "NUM", "DEU"],
  },
  {
    title: "Historical Books",
    testament: "OT" as const,
    colorKey: "historical" as keyof typeof GROUP_COLORS,
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
    colorKey: "wisdom" as keyof typeof GROUP_COLORS,
    books: ["JOB", "PSA", "PRO", "ECC", "SNG"],
  },
  {
    title: "Major Prophets",
    testament: "OT" as const,
    colorKey: "majorProphets" as keyof typeof GROUP_COLORS,
    books: ["ISA", "JER", "LAM", "EZK", "DAN"],
  },
  {
    title: "Minor Prophets",
    testament: "OT" as const,
    colorKey: "minorProphets" as keyof typeof GROUP_COLORS,
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
    colorKey: "gospels" as keyof typeof GROUP_COLORS,
    books: ["MAT", "MRK", "LUK", "JHN", "ACT"],
  },
  {
    title: "Pauline Epistles",
    testament: "NT" as const,
    colorKey: "pauline" as keyof typeof GROUP_COLORS,
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
    colorKey: "general" as keyof typeof GROUP_COLORS,
    books: ["HEB", "JAS", "1PE", "2PE", "1JN", "2JN", "3JN", "JUD"],
  },
  {
    title: "Apocalyptic",
    testament: "NT" as const,
    colorKey: "apocalyptic" as keyof typeof GROUP_COLORS,
    books: ["REV"],
  },
];

interface BookSelectionChipProps {
  bookCode: string;
  isSelected: boolean;
  onToggle: (bookCode: string) => void;
  colorScheme: string;
  completionPercentage?: number;
}

const BookSelectionChip = ({
  bookCode,
  isSelected,
  onToggle,
  colorScheme,
  completionPercentage = 0,
}: BookSelectionChipProps) => {
  const bookName = BOOK_NAMES[bookCode] || bookCode;

  const getChipClasses = () => {
    if (isSelected) {
      return GROUP_COLORS.selected;
    }
    return colorScheme;
  };

  const getCompletionText = () => {
    if (completionPercentage >= 100) {
      return "Complete";
    }
    if (completionPercentage > 0) {
      return `${completionPercentage}% complete`;
    }
    return null;
  };

  return (
    <div className="relative group">
      <button
        onClick={() => onToggle(bookCode)}
        className={`
        relative w-16 h-8 rounded border text-xs font-semibold
        ${getChipClasses()}
        ${
          completionPercentage > 0 && !isSelected ? "saturate-0 opacity-50" : ""
        }
      `}
        title={bookName}
      >
        <span className="block">{bookCode}</span>
      </button>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 flex flex-col items-center justify-center">
        {bookName}
        {getCompletionText() && <p>({getCompletionText()})</p>}
      </div>
    </div>
  );
};

export const BookSelector = ({
  selectedBooks,
  onBooksChange,
  details = {},
}: BookSelectorProps) => {
  const allBooks = BOOK_GROUPS.flatMap((group) => group.books);
  const selectedCount = selectedBooks.length;

  const selectNone = () => onBooksChange([]);

  const toggleBook = (bookCode: string) => {
    if (selectedBooks.includes(bookCode)) {
      onBooksChange(selectedBooks.filter((book) => book !== bookCode));
    } else {
      onBooksChange([...selectedBooks, bookCode]);
    }
  };

  // Create a map from book code to its group for color lookup
  const bookToGroupColor = new Map<string, string>();
  BOOK_GROUPS.forEach((group) => {
    group.books.forEach((book) => {
      bookToGroupColor.set(book, GROUP_COLORS[group.colorKey]);
    });
  });

  return (
    <div className="space-y-4">
      {/* Overall controls */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Select Books to Translate
        </h4>
        <div className="flex gap-2">
          <button
            onClick={selectNone}
            className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Select None
          </button>
        </div>
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-400">
        {selectedCount} of {allBooks.length} books selected
      </div>

      {/* Inline book grid with OT/NT separation */}
      <div className="space-y-4">
        {/* Old Testament Books */}
        <div className="flex flex-wrap gap-1">
          {BOOK_GROUPS.filter((group) => group.testament === "OT")
            .flatMap((group) => group.books)
            .map((bookCode) => (
              <BookSelectionChip
                key={bookCode}
                bookCode={bookCode}
                isSelected={selectedBooks.includes(bookCode)}
                onToggle={toggleBook}
                colorScheme={bookToGroupColor.get(bookCode) || ""}
                completionPercentage={details[bookCode] || 0}
              />
            ))}
        </div>

        {/* Divider between OT and NT */}
        <hr className="border-t border-slate-300 dark:border-slate-600" />

        {/* New Testament Books */}
        <div className="flex flex-wrap gap-1">
          {BOOK_GROUPS.filter((group) => group.testament === "NT")
            .flatMap((group) => group.books)
            .map((bookCode) => (
              <BookSelectionChip
                key={bookCode}
                bookCode={bookCode}
                isSelected={selectedBooks.includes(bookCode)}
                onToggle={toggleBook}
                colorScheme={bookToGroupColor.get(bookCode) || ""}
                completionPercentage={details[bookCode] || 0}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
