export const BackSvgIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

export const TrashSvgIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 9.75l-.867 9.337A2.25 2.25 0 0116.392 21H7.608a2.25 2.25 0 01-2.241-1.913L4.5 9.75m15 0H4.5m15 0l-.6-3.75A2.25 2.25 0 0016.692 4.5H7.308a2.25 2.25 0 00-2.208 1.5l-.6 3.75m15 0H4.5M9.75 12.75v6m4.5-6v6"
    />
  </svg>
);

// Lucide Graduation-cap icon
export const GraduationSvgIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={"w-6 h-6 " + className}
  >
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
    <path d="M22 10v6" />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </svg>
);

// Lucide Ruler-Dimension-Line icon
export const RulerMeasureSvgIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={"w-6 h-6 " + className}
  >
    <path d="M12 15v-3.014" />
    <path d="M16 15v-3.014" />
    <path d="M20 6H4" />
    <path d="M20 8V4" />
    <path d="M4 8V4" />
    <path d="M8 15v-3.014" />
    <rect x="3" y="12" width="18" height="7" rx="1" />
  </svg>
);

export const BotSvgIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
