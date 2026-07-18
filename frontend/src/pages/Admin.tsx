import { useState } from "react";
import { UsersPanel } from "@/components/admin/UsersPanel";
import { CategoriesPanel } from "@/components/admin/CategoriesPanel";

type Tab = "users" | "categories";

export function Admin() {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Administration</h1>

      <div className="mb-4 flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        <button
          onClick={() => setTab("users")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            tab === "users" ? "bg-blue-500 text-white" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Utilisateurs
        </button>
        <button
          onClick={() => setTab("categories")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            tab === "categories" ? "bg-blue-500 text-white" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Catégories
        </button>
      </div>

      {tab === "users" ? <UsersPanel /> : <CategoriesPanel />}
    </div>
  );
}
