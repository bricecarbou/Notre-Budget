import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { ExpenseQuickAdd } from "./ExpenseQuickAdd";

export function Layout() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <div className="mx-auto min-h-screen max-w-md pb-24">
      <main className="p-4">
        <Outlet />
      </main>
      <BottomNav onAddClick={() => setShowQuickAdd(true)} />
      {showQuickAdd && <ExpenseQuickAdd onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
}
