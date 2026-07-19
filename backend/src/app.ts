import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import categoryRoutes from "./routes/categories.routes";
import subcategoryRoutes from "./routes/subcategories.routes";
import incomeRoutes from "./routes/incomes.routes";
import incomeTemplateRoutes from "./routes/incomeTemplates.routes";
import expenseRoutes from "./routes/expenses.routes";
import expenseTemplateRoutes from "./routes/expenseTemplates.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import analyticsRoutes from "./routes/analytics.routes";
import settingsRoutes from "./routes/settings.routes";
import transactionsRoutes from "./routes/transactions.routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/subcategories", subcategoryRoutes);
  app.use("/api/incomes", incomeRoutes);
  app.use("/api/income-templates", incomeTemplateRoutes);
  app.use("/api/expenses", expenseRoutes);
  app.use("/api/expense-templates", expenseTemplateRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/transactions", transactionsRoutes);

  if (process.env.NODE_ENV === "production") {
    const frontendDist = path.resolve(__dirname, "../../frontend/dist");
    app.use(express.static(frontendDist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }

  return app;
}
