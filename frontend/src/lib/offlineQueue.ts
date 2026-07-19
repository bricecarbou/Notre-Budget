import { apiClient, isNetworkError } from "@/api/client";
import { useOfflineQueueStore } from "@/store/offlineQueueStore";
import type { CreateExpenseInput } from "@/hooks/useCreateExpense";
import type { CreateIncomeInput } from "@/hooks/useIncomes";

const QUEUE_KEY = "notre-budget-offline-queue";

export interface QueuedExpense {
  localId: string;
  type: "expense";
  payload: CreateExpenseInput;
  createdAt: string;
}

export interface QueuedIncome {
  localId: string;
  type: "income";
  payload: CreateIncomeInput;
  createdAt: string;
}

export type QueuedItem = QueuedExpense | QueuedIncome;

function readQueue(): QueuedItem[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeQueue(items: QueuedItem[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  useOfflineQueueStore.getState().setItems(items);
}

// À appeler une fois au démarrage pour que l'état reflète ce qui a été mis
// en file lors d'une session précédente (avant le prochain rechargement).
export function initOfflineQueue() {
  useOfflineQueueStore.getState().setItems(readQueue());
}

export function queueOfflineExpense(payload: CreateExpenseInput) {
  const items = readQueue();
  items.push({
    localId: crypto.randomUUID(),
    type: "expense",
    payload,
    createdAt: new Date().toISOString(),
  });
  writeQueue(items);
}

export function queueOfflineIncome(payload: CreateIncomeInput) {
  const items = readQueue();
  items.push({
    localId: crypto.randomUUID(),
    type: "income",
    payload,
    createdAt: new Date().toISOString(),
  });
  writeQueue(items);
}

// Édition/suppression d'un item pas encore synchronisé : purement local,
// aucun appel réseau, donc toujours possible hors ligne.
export function updateQueuedExpense(localId: string, payload: CreateExpenseInput) {
  const items = readQueue().map((item) =>
    item.localId === localId && item.type === "expense" ? { ...item, payload } : item
  );
  writeQueue(items);
}

export function updateQueuedIncome(localId: string, payload: CreateIncomeInput) {
  const items = readQueue().map((item) =>
    item.localId === localId && item.type === "income" ? { ...item, payload } : item
  );
  writeQueue(items);
}

export function removeQueuedItem(localId: string) {
  writeQueue(readQueue().filter((item) => item.localId !== localId));
}

// Rejoue la file dans l'ordre. Un échec réseau garde l'item pour la
// prochaine tentative ; une erreur applicative (ex: catégorie supprimée
// entre-temps) le retire aussi — mieux vaut ne pas bloquer toute la file
// indéfiniment pour un seul item cassé.
export async function flushOfflineQueue(): Promise<{ synced: number }> {
  const items = readQueue();
  if (items.length === 0) return { synced: 0 };

  const remaining: QueuedItem[] = [];
  let synced = 0;

  for (const item of items) {
    try {
      if (item.type === "expense") {
        await apiClient.post("/expenses", item.payload);
      } else {
        await apiClient.post("/incomes", item.payload);
      }
      synced++;
    } catch (err) {
      if (isNetworkError(err)) {
        remaining.push(item);
      }
      // erreur applicative : on abandonne cet item plutôt que de bloquer les suivants
    }
  }

  writeQueue(remaining);
  return { synced };
}
