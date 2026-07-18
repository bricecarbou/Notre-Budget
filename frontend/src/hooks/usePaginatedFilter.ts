import { useMemo, useState } from "react";

export const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

export function usePaginatedFilter<T>({
  items,
  searchFields,
  initialPageSize = 10,
}: {
  items: T[];
  searchFields: (item: T) => string[];
  initialPageSize?: (typeof PAGE_SIZE_OPTIONS)[number];
}) {
  const [search, setSearchState] = useState("");
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => searchFields(item).some((f) => f.toLowerCase().includes(q)));
  }, [items, search, searchFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function setSearch(value: string) {
    setSearchState(value);
    setPage(1);
  }

  function setPageSize(value: number) {
    setPageSizeState(value);
    setPage(1);
  }

  return {
    search,
    setSearch,
    pageSize,
    setPageSize,
    page: currentPage,
    setPage,
    totalPages,
    totalResults: filtered.length,
    paginated,
  };
}
