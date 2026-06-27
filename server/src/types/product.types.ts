import { z } from 'zod';
import { createProductSchema, queryProductSchema, updateProductSchema } from '../validation/product.schema';

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof queryProductSchema>;