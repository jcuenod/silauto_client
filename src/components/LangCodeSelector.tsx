export type CustomValue = {
  isCustom: true;
  customValue: string;
  selectedValue: null;
};

export type SelectedOption = {
  isCustom: false;
  selectedValue: string;
  customValue: null;
};

export type SelectedValue = CustomValue | SelectedOption;

export interface LangCodeOption {
  langCode: string;
  displayName: string;
  options: string[];
  selection: SelectedValue;
}

interface LangCodeSelectorProps {
  langCodeOptions: LangCodeOption[];
  onChange: (langCode: string, selection: SelectedValue) => void;
}

export const LangCodeSelector = ({
  langCodeOptions,
  onChange,
}: LangCodeSelectorProps) => {
  const handleOptionSelect = (langCode: string, selectedValue: string) => {
    const selection: SelectedValue = {
      isCustom: false,
      selectedValue,
      customValue: null,
    };
    onChange(langCode, selection);
  };

  const handleCustomSelect = (langCode: string) => {
    const currentOption = langCodeOptions.find(opt => opt.langCode === langCode);
    const customValue = currentOption?.selection.isCustom 
      ? currentOption.selection.customValue 
      : "";
    
    const selection: SelectedValue = {
      isCustom: true,
      customValue,
      selectedValue: null,
    };
    onChange(langCode, selection);
  };

  const handleCustomValueChange = (langCode: string, customValue: string) => {
    const selection: SelectedValue = {
      isCustom: true,
      customValue,
      selectedValue: null,
    };
    onChange(langCode, selection);
  };

  if (langCodeOptions.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 dark:text-slate-400">
        No language codes to configure
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {langCodeOptions.map((option) => (
        <div key={option.langCode} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {option.displayName} Language Code
          </label>

          {/* Button Group */}
          <div className="flex flex-wrap gap-2">
            {option.options.map((optionValue) => (
              <button
                key={optionValue}
                type="button"
                onClick={() => handleOptionSelect(option.langCode, optionValue)}
                className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                  !option.selection.isCustom && option.selection.selectedValue === optionValue
                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {optionValue}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleCustomSelect(option.langCode)}
              className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                option.selection.isCustom
                  ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom Input */}
          {option.selection.isCustom && (
            <input
              type="text"
              value={option.selection.customValue}
              onChange={(e) =>
                handleCustomValueChange(option.langCode, e.target.value)
              }
              placeholder="Enter custom language code"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>
      ))}
    </div>
  );
};
