export type StoreDirectoryFilters = {
  searchTerm: string;
  category: string;
};

export function buildStoreDirectoryHref(searchTerm: string, category: string): string {
  const params = new URLSearchParams();
  const trimmedSearch = searchTerm.trim();

  if (trimmedSearch) params.set("q", trimmedSearch);
  if (category && category !== "All") params.set("category", category);

  const query = params.toString();
  return query ? `/stores?${query}` : "/stores";
}

export function getStoreDirectoryFilters(search: string): StoreDirectoryFilters {
  const params = new URLSearchParams(search);
  return {
    searchTerm: params.get("q")?.trim() ?? "",
    category: params.get("category")?.trim() || "All",
  };
}
