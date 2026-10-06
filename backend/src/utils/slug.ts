/**
 * Converts any string into a clean, URL-friendly slug.
 * Example: "Paracetamol 500mg (10 Tablets)" -> "paracetamol-500mg-10-tablets"
 */
const createSlug = (text: string): string => {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars except hyphen
    .replace(/--+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-+/, "") // Trim hyphen from start
    .replace(/-+$/, ""); // Trim hyphen from end
};

/**
 * Generates a unique slug by appending an incremental number (-1, -2, etc.)
 * if the base slug already exists in the database.
 */
const generateUniqueSlug = async (
  text: string,
  isSlugTaken: (slug: string) => Promise<boolean>
): Promise<string> => {
  const baseSlug = createSlug(text);
  let slug = baseSlug;
  let counter = 1;

  while (await isSlugTaken(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export { createSlug, generateUniqueSlug };
export default createSlug;
