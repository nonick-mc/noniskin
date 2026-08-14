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
    setEntries([...entries, { id: crypto.randomUUID(), name: '', skinId: null, capeId: null }]);
  }

  function removeEntry(id: string) {
    setEntries(entries.filter((entry) => entry.id !== id));
  }

  function updateEntry(id: string, patch: Partial<Omit<(typeof entries)[number], 'id'>>) {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
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
                name={entry.name}
                skinId={entry.skinId}
                capeId={entry.capeId}
                skins={skins}
                capes={capes}
                onNameChange={(name) => updateEntry(entry.id, { name })}
                onSkinIdChange={(skinId) => updateEntry(entry.id, { skinId })}
                onCapeIdChange={(capeId) => updateEntry(entry.id, { capeId })}
                onRemove={() => removeEntry(entry.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
