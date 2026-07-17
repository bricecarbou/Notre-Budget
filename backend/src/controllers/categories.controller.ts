import type { Request, Response } from "express";
import {
  createCategorySchema,
  updateCategorySchema,
  createSubcategorySchema,
  updateSubcategorySchema,
} from "../validators/categories.validators";
import * as categoriesService from "../services/categories.service";

function handleError(err: unknown, res: Response) {
  if (err instanceof categoriesService.CategoryError) {
    return res.status(err.status).json({ error: err.message });
  }
  throw err;
}

export async function listHandler(_req: Request, res: Response) {
  const categories = await categoriesService.listCategories();
  res.json(categories);
}

export async function createHandler(req: Request, res: Response) {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const category = await categoriesService.createCategory(parsed.data);
    res.status(201).json(category);
  } catch (err) {
    handleError(err, res);
  }
}

export async function updateHandler(req: Request, res: Response) {
  const parsed = updateCategorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const category = await categoriesService.updateCategory(req.params.id, parsed.data);
    res.json(category);
  } catch (err) {
    handleError(err, res);
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await categoriesService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}

export async function createSubcategoryHandler(req: Request, res: Response) {
  const parsed = createSubcategorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const sub = await categoriesService.createSubcategory(req.params.id, parsed.data.name);
    res.status(201).json(sub);
  } catch (err) {
    handleError(err, res);
  }
}

export async function updateSubcategoryHandler(req: Request, res: Response) {
  const parsed = updateSubcategorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const sub = await categoriesService.updateSubcategory(req.params.id, parsed.data.name);
    res.json(sub);
  } catch (err) {
    handleError(err, res);
  }
}

export async function deleteSubcategoryHandler(req: Request, res: Response) {
  try {
    await categoriesService.deleteSubcategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}
