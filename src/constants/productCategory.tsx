
export const PRODUCT_CATEGORIES = [
  {
    id: "69ec7abc558abbabebfce3db",
    name: "Course",
  },
  {
    id: "69ec7ac8558abbabebfce3dd",
    name: "Digital Product",
  },
  {
    id: "69ec5ba2afc1f2b9277ae6f5",
    name: "Template",
  },
  {
    id: "69ec7ad4558abbabebfce3df",
    name: "ebook",
  },
];

export const getProductCategoryName = (category: any): string => {
  if (!category) return "Uncategorized";

  // Handle populated category object
  if (typeof category === "object") {
    if (category.name) return category.name;

    const categoryId = String(category._id || category.id || "");

    return (
      PRODUCT_CATEGORIES.find((item) => item.id === categoryId)?.name ||
      "Uncategorized"
    );
  }

  // Handle category ObjectId string
  return (
    PRODUCT_CATEGORIES.find((item) => item.id === String(category))?.name ||
    "Uncategorized"
  );
};
