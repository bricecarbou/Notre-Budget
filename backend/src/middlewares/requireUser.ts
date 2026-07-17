import type { Request, Response, NextFunction } from "express";

// L'admin gère les comptes et catégories à distance ; seul un USER saisit
// des transactions (ponctuelles ou récurrentes).
export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "USER") {
    return res.status(403).json({
      error: "Réservé aux utilisateurs — l'administrateur ne saisit pas de transactions",
    });
  }
  next();
}
