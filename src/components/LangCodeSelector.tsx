import { useState, useEffect } from "react";
import { api } from "../api/apiClient";

interface LangCodeOption {
  langCode: string;
  displayName: string;
  options: string[];
  selectedValue: string;
  isCustom: boolean;
  customValue: string;
}

interface LangCodeSelectorProps {
  langCodes: string[]; // Array of ISO codes like ["en", "id"]
  value: Record<string, string>; // Current lang codes mapping
  onChange: (langCodes: Record<string, string>) => void;
}

export const LangCodeSelector = ({
  langCodes,
  value,
  onChange,
}: LangCodeSelectorProps) => {
  const [langCodeOptions, setLangCodeOptions] = useState<LangCodeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLangCodeOptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const uniqueLangCodes = [...new Set(langCodes)];
        const optionsPromises = uniqueLangCodes.map(async (langCode) => {
          try {
            const options = await api.langCodes.getByLangCode(langCode);
            return {
              langCode,
              displayName: langCode.toUpperCase(),
              options,
              selectedValue: options.length > 0 ? options[0] : "",
              isCustom: false,
              customValue: "",
            };
          } catch (err) {
            console.error(`Failed to fetch lang codes for ${langCode}:`, err);
            return {
              langCode,
              displayName: langCode.toUpperCase(),
              options: [],
              selectedValue: "custom",
              isCustom: true,
              customValue: "",
            };
          }
        });

        const resolvedOptions = await Promise.all(optionsPromises);

        // Apply current values to the resolved options
        const optionsWithCurrentValues = resolvedOptions.map((option) => {
          const currentValue = value[option.langCode];
          const hasValue = currentValue !== undefined && currentValue !== "";
          const isValueInOptions =
            hasValue && option.options.includes(currentValue);
          const isCustomValue = hasValue && !isValueInOptions;

          return {
            ...option,
            selectedValue: isCustomValue
              ? "custom"
              : currentValue ||
                (option.options.length > 0 ? option.options[0] : ""),
            isCustom: isCustomValue,
            customValue: isCustomValue ? currentValue : "",
          };
        });

        setLangCodeOptions(optionsWithCurrentValues);
      } catch (err) {
        setError("Failed to load language code options");
        console.error("Error fetching lang code options:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (langCodes.length > 0) {
      fetchLangCodeOptions();
    } else {
      setLangCodeOptions([]);
      setIsLoading(false);
    }
  }, [langCodes]);

  const handleOptionChange = (langCode: string, selectedValue: string) => {
    const updatedOptions = langCodeOptions.map((option) =>
      option.langCode === langCode
        ? {
            ...option,
            selectedValue:
              selectedValue === "custom" ? "custom" : selectedValue,
            isCustom: selectedValue === "custom",
            customValue: selectedValue === "custom" ? option.customValue : "",
          }
        : option
    );
    setLangCodeOptions(updatedOptions);

    // Update the parent component
    const newValue = { ...value };
    if (selectedValue === "custom") {
      const option = updatedOptions.find((opt) => opt.langCode === langCode);
      // Keep the existing custom value or use empty string if none exists
      newValue[langCode] = option?.customValue || "";
    } else {
      newValue[langCode] = selectedValue;
    }
    onChange(newValue);
  };

  const handleCustomValueChange = (langCode: string, customValue: string) => {
    const updatedOptions = langCodeOptions.map((option) =>
      option.langCode === langCode ? { ...option, customValue } : option
    );
    setLangCodeOptions(updatedOptions);

    // Update the parent component
    const newValue = { ...value };
    newValue[langCode] = customValue;
    onChange(newValue);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-slate-500 dark:text-slate-400">
        Loading language code options...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

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
                onClick={() => handleOptionChange(option.langCode, optionValue)}
                className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                  !option.isCustom && option.selectedValue === optionValue
                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {optionValue}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleOptionChange(option.langCode, "custom")}
              className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                option.isCustom
                  ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom Input */}
          {option.isCustom && (
            <input
              type="text"
              value={option.customValue}
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
