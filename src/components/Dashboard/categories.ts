/* ==========================================================================
   RIVEN — category options for the dashboard's dropdowns.

   Two different "category" concepts live in this product, and the mock data
   conflated them:

   - A *product* belongs to a node of the Category tree, identified by a real
     uuid from GET /categories. Sending anything else is a 400
     INVALID_REFERENCE, because the column is a foreign key.
   - A *vendor* has a VendorCategory enum value. It is not the tree, and it
     has nothing to do with product categories.
   ========================================================================== */

import type { Category } from './types';

export type CategoryOption = { value: string; label: string };

/**
 * Flattens the tree into selectable options, qualifying children with their
 * parent ("Home & Crafts / Ceramics") since leaf names repeat across branches.
 */
export function categoryOptions(tree: Category[], parentName?: string): CategoryOption[] {
  return tree.flatMap((category) => {
    const label = parentName ? `${parentName} / ${category.name}` : category.name;
    return [{ value: category.id, label }, ...categoryOptions(category.children ?? [], label)];
  });
}

/** categoryId -> label, for rendering a product's category in a table row. */
export function categoryNames(tree: Category[]): Record<string, string> {
  return Object.fromEntries(categoryOptions(tree).map((option) => [option.value, option.label]));
}

/**
 * The API's VendorCategory enum. Fixed, not fetched — it is a Prisma enum, so
 * there is no endpoint listing it, and sending a value outside this set is a
 * 400 VALIDATION_ERROR.
 */
export const VENDOR_CATEGORY_OPTIONS: readonly CategoryOption[] = [
  { value: 'FASHION', label: 'Fashion' },
  { value: 'FOOD', label: 'Food' },
  { value: 'HOME_CRAFTS', label: 'Home & Crafts' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'ACCESSORIES', label: 'Accessories' },
  { value: 'KIDS', label: 'Kids' },
  { value: 'ART', label: 'Art' },
  { value: 'OTHER', label: 'Other' },
];
