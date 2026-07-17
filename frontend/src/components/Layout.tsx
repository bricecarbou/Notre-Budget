import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { ExpenseQuickAdd } from "./ExpenseQuickAdd";

export function Layout() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <div className="mx-auto min-h-screen max-w-md pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <TopBar />
      <main className="p-4">
        <Outlet />
      </main>
      <BottomNav onAddClick={() => setShowQuickAdd(true)} />
      {showQuickAdd && <ExpenseQuickAdd onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
}
