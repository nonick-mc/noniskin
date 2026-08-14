'use client';

import { PaletteIcon, PlusIcon } from 'lucide-react';
import { useSkinPackContext } from '@/app/context';
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
import { EntryCard } from './entry-card';

export function EntrySection() {
  const { skins, capes, entries, setEntries } = useSkinPackContext();

  function addEntry() {
    setEntries([...entries, { id: crypto.randomUUID(), skinId: null, capeId: null }]);
  }

  function removeEntry(id: string) {
    setEntries(entries.filter((entry) => entry.id !== id));
  }

  function updateEntry(id: string, skinId: string | null, capeId: string | null) {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, skinId, capeId } : entry)));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>組み合わせ</CardTitle>
        <CardDescription>
          ここに追加したスキンとマントの組み合わせがスキンパックに含まれます。
        </CardDescription>
        <CardAction>
          <Button type='button' onClick={addEntry}>
            <PlusIcon />
            追加
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
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
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                skinId={entry.skinId}
                capeId={entry.capeId}
                skins={skins}
                capes={capes}
                onSkinIdChange={(skinId) => updateEntry(entry.id, skinId, entry.capeId)}
                onCapeIdChange={(capeId) => updateEntry(entry.id, entry.skinId, capeId)}
                onRemove={() => removeEntry(entry.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
