import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";

// Chargées à la demande : Analytics embarque Recharts (le plus gros
// morceau du bundle), Admin/Récurrents/Transactions ne servent pas au
// premier écran vu par la plupart des visites.
const Analytics = lazy(() =>
  import("@/pages/Analytics").then((m) => ({ default: m.Analytics }))
);
const RecurringManagement = lazy(() =>
  import("@/pages/RecurringManagement").then((m) => ({ default: m.RecurringManagement }))
);
const Admin = lazy(() => import("@/pages/Admin").then((m) => ({ default: m.Admin })));
const AllTransactions = lazy(() =>
  import("@/pages/AllTransactions").then((m) => ({ default: m.AllTransactions }))
);

function PageLoading() {
  return <p className="py-8 text-center text-sm text-slate-500">Chargement...</p>;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/transactions"
            element={
              <Suspense fallback={<PageLoading />}>
                <AllTransactions />
              </Suspense>
            }
          />
          <Route
            path="/analytics"
            element={
              <Suspense fallback={<PageLoading />}>
                <Analytics />
              </Suspense>
            }
          />
          <Route
            path="/recurring"
            element={
              <Suspense fallback={<PageLoading />}>
                <RecurringManagement />
              </Suspense>
            }
          />

          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<PageLoading />}>
                  <Admin />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
