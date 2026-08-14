'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PaletteIcon, PlusIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useSkinPackContext } from '@/app/context';
import { createEntriesFormSchema } from '@/app/schema';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { PackEntry } from '@/types/skin-pack';
import { EntryCard } from './entry-card';

const entriesFormSchema = createEntriesFormSchema();

export function EntrySection() {
  const { skins, capes, setEntries } = useSkinPackContext();

  const form = useForm({
    resolver: zodResolver(entriesFormSchema),
    defaultValues: {
      entries: [] as { id: string; skinId: string | null; capeId: string | null }[],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
    keyName: 'fieldKey',
  });

  const watchedEntries = useWatch({ control: form.control, name: 'entries' });

  // フォームの内容をcontextへ同期
  useEffect(() => {
    const next: PackEntry[] = (watchedEntries ?? [])
      .filter((row) => row.skinId !== null)
      .map((row) => ({ id: row.id, skinId: row.skinId as string, capeId: row.capeId }));
    setEntries(next);
  }, [watchedEntries, setEntries]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>組み合わせ</CardTitle>
        <CardDescription>
          ここに追加したスキンとマントの組み合わせがスキンパックに含まれます。
        </CardDescription>
        <CardAction>
          <Button
            type='button'
            onClick={() => append({ id: crypto.randomUUID(), skinId: null, capeId: null })}
          >
            <PlusIcon />
            追加
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <Empty className='border border-dashed'>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <PaletteIcon />
              </EmptyMedia>
              <EmptyTitle>組み合わせが登録されていません</EmptyTitle>
              <EmptyDescription>
                右上の「追加」からスキンとマントの組み合わせを追加してください。
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className='flex flex-col gap-3'>
            {fields.map((field, index) => {
              const watchedEntry = watchedEntries?.find((entry) => entry.id === field.id);
              return (
                <EntryCard
                  key={field.fieldKey}
                  control={form.control}
                  index={index}
                  skinId={watchedEntry?.skinId ?? null}
                  capeId={watchedEntry?.capeId ?? null}
                  skins={skins}
                  capes={capes}
                  onRemove={() => remove(index)}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
