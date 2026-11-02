export interface ProductCategoryItem {
  id: string;
  name: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryItem[] = [
  {
    id: "69ec5ba2afc1f2b9277ae6f5",
    name: "Templates",
  },
  {
    id: "69ec7ac8558abbabebfce3dd",
    name: "Graphics",
  },
  {
    id: "69ec7ad4558abbabebfce3df",
    name: "Ebooks",
  },
  {
    id: "69ec7abc558abbabebfce3db",
    name: "Bundles",
  },
];

export const CATEGORY_MAP: Record<string, string> = {
  // IDs to Names
  "69ec5ba2afc1f2b9277ae6f5": "Templates",
  "69ec7ac8558abbabebfce3dd": "Graphics",
  "69ec7ad4558abbabebfce3df": "Ebooks",
  "69ec7abc558abbabebfce3db": "Bundles",

  // Text variations & legacy names
  "template": "Templates",
  "templates": "Templates",
  "graphic": "Graphics",
  "graphics": "Graphics",
  "digital product": "Graphics",
  "digital products": "Graphics",
  "digitalproduct": "Graphics",
  "ebook": "Ebooks",
  "ebooks": "Ebooks",
  "e-book": "Ebooks",
  "e-books": "Ebooks",
  "bundle": "Bundles",
  "bundles": "Bundles",
};

export const PRODUCT_CATEGORY_IDS = new Set([
  "69ec5ba2afc1f2b9277ae6f5",
  "69ec7ac8558abbabebfce3dd",
  "69ec7ad4558abbabebfce3df",
  "69ec7abc558abbabebfce3db",
]);

export const PRODUCT_CATEGORY_NAMES = new Set([
  "templates",
  "template",
  "graphics",
  "graphic",
  "digital product",
  "digital products",
  "digitalproduct",
  "ebooks",
  "ebook",
  "e-book",
  "e-books",
  "bundles",
  "bundle",
]);

export const isProductCategory = (category: any): boolean => {
  if (!category) return false;
  if (typeof category === "object") {
    const id = String(category._id || category.id || "").trim();
    const name = String(category.name || "").trim().toLowerCase();
    if (PRODUCT_CATEGORY_IDS.has(id)) return true;
    if (PRODUCT_CATEGORY_NAMES.has(name)) return true;
    return false;
  }
  if (typeof category === "string") {
    const trimmed = category.trim();
    if (PRODUCT_CATEGORY_IDS.has(trimmed)) return true;
    if (PRODUCT_CATEGORY_NAMES.has(trimmed.toLowerCase())) return true;
  }
  return false;
};

export const getProductCategoryName = (category: any): string => {
  if (!category) return "Uncategorized";

  // 1. Populated object (backend returns category: { _id, name })
  if (typeof category === "object") {
    if (category.name && typeof category.name === "string") {
      const trimmed = category.name.trim();
      const lower = trimmed.toLowerCase();
      if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
      return trimmed;
    }
    const catId = String(category._id || category.id || "").trim();
    if (CATEGORY_MAP[catId]) return CATEGORY_MAP[catId];
  }

  // 2. String (ObjectId or category name)
  if (typeof category === "string") {
    const trimmed = category.trim();
    if (trimmed) {
      if (CATEGORY_MAP[trimmed]) return CATEGORY_MAP[trimmed];
      const lower = trimmed.toLowerCase();
      if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
      if (!/^[0-9a-fA-F]{24}$/.test(trimmed)) {
        return trimmed;
      }
    }
  }

  return "Uncategorized";
};
