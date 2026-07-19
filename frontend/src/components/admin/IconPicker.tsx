import { ICON_OPTIONS, resolveIcon } from "@/lib/categoryIcon";

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <div className="grid max-h-48 grid-cols-6 gap-2 overflow-y-auto rounded-xl bg-slate-100 p-2 dark:bg-slate-900">
      {ICON_OPTIONS.map((name) => {
        const Icon = resolveIcon(name);
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            aria-label={name}
            title={name}
            className={`flex items-center justify-center rounded-lg p-2 ${
              selected
                ? "bg-blue-500 text-white"
                : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
