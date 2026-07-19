import { useOfflineQueueStore } from "@/store/offlineQueueStore";
import { useCategories } from "@/hooks/useCategories";
import { useAuthStore } from "@/store/authStore";
import type { Transaction } from "@/types";

export interface PendingTransaction extends Transaction {
  pending: true;
  localId: string;
}

// Transforme la file d'attente hors ligne en transactions affichables, pour
// qu'un ajout tout juste saisi (pas encore synchronisé) apparaisse
// immédiatement dans les mêmes listes que les transactions déjà connues.
export function usePendingTransactions(): PendingTransaction[] {
  const items = useOfflineQueueStore((s) => s.items);
  const { data: categories = [] } = useCategories();
  const user = useAuthStore((s) => s.user);
  const createdBy = user ? { id: user.id, name: user.name } : { id: "", name: "Moi" };

  return items.map((item) => {
    if (item.type === "expense") {
      const category = categories.find((c) => c.id === item.payload.categoryId);
      const subcategory =
        category?.subcategories.find((s) => s.id === item.payload.subcategoryId) ?? null;
      return {
        id: item.localId,
        localId: item.localId,
        pending: true,
        type: "expense",
        label: item.payload.label ?? null,
        amount: item.payload.amount,
        date: item.payload.date,
        category,
        subcategory,
        createdBy,
      };
    }
    return {
      id: item.localId,
      localId: item.localId,
      pending: true,
      type: "income",
      label: item.payload.label,
      amount: item.payload.amount,
      date: item.payload.date,
      createdBy,
    };
  });
}
