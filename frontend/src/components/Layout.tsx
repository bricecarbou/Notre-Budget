import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { ExpenseQuickAdd } from "./ExpenseQuickAdd";
import { InstallAppBanner } from "./InstallAppBanner";
import { OfflineQueueBanner } from "./OfflineQueueBanner";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { useSettings } from "@/hooks/useSettings";
import { useMonthStore } from "@/store/monthStore";

export function Layout() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  useOfflineSync();

  const { data: settings } = useSettings();
  useEffect(() => {
    if (settings) useMonthStore.getState().initializeFromStartDay(settings.monthStartDay);
  }, [settings]);

  return (
    <div className="mx-auto min-h-screen max-w-md pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <TopBar />
      <InstallAppBanner />
      <OfflineQueueBanner />
      <main className="p-4">
        <Outlet />
      </main>
      <BottomNav onAddClick={() => setShowQuickAdd(true)} />
      {showQuickAdd && <ExpenseQuickAdd onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
}
