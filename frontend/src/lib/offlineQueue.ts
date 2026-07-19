import { apiClient, isNetworkError } from "@/api/client";
import { useOfflineQueueStore } from "@/store/offlineQueueStore";
import type { CreateExpenseInput } from "@/hooks/useCreateExpense";
import type { CreateIncomeInput } from "@/hooks/useIncomes";

const QUEUE_KEY = "notre-budget-offline-queue";

interface QueuedExpense {
  localId: string;
  type: "expense";
  payload: CreateExpenseInput;
  createdAt: string;
}

interface QueuedIncome {
  localId: string;
  type: "income";
  payload: CreateIncomeInput;
  createdAt: string;
}

type QueuedItem = QueuedExpense | QueuedIncome;

function readQueue(): QueuedItem[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeQueue(items: QueuedItem[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  useOfflineQueueStore.getState().setCount(items.length);
}

// À appeler une fois au démarrage pour que le compteur reflète ce qui a été
// mis en file lors d'une session précédente (avant le prochain rechargement).
export function initOfflineQueueCount() {
  useOfflineQueueStore.getState().setCount(readQueue().length);
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

export function getQueueCount() {
  return readQueue().length;
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
