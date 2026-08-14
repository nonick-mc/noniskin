import { z } from 'zod';
import { getImageDimensions } from '@/lib/skin-pack';

export function createCapeFormSchema() {
  return z.object({
    file: z
      .custom<File | null>((value) => value === null || value instanceof File)
      .refine((file) => file !== null, 'ファイルを選択してください')
      .refine((file) => file?.type === 'image/png', 'PNG形式の画像を選択してください')
      .refine(async (file) => {
        if (!file) return false;
        const { width, height } = await getImageDimensions(file);
        return width === 64 && height === 32;
      }, '画像サイズは64x32ピクセルである必要があります'),
  });
}

export function createSkinFormSchema() {
  return z.object({
    file: z
      .custom<File | null>((value) => value === null || value instanceof File)
      .refine((file) => file !== null, 'ファイルを選択してください')
      .refine((file) => file?.type === 'image/png', 'PNG形式の画像を選択してください')
      .refine(async (file) => {
        if (!file) return false;
        const { width, height } = await getImageDimensions(file);
        return width === 64 && height === 64;
      }, '画像サイズは64x64ピクセルである必要があります'),
    bodyType: z.enum(['wide', 'slim']),
  });
}

const entryRowSchema = z.object({
  id: z.string(),
  skinId: z.string().nullable(),
  capeId: z.string().nullable(),
});

export function createEntriesFormSchema() {
  return z.object({ entries: z.array(entryRowSchema) });
}

export type CapeFormValues = z.infer<ReturnType<typeof createCapeFormSchema>>;
export type SkinFormValues = z.infer<ReturnType<typeof createSkinFormSchema>>;
export type EntryRowValues = z.infer<typeof entryRowSchema>;
export type EntriesFormValues = z.infer<ReturnType<typeof createEntriesFormSchema>>;
