'use client';

import { ArrowRightIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { SkinPreview3d } from '@/components/skin-preview-3d';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Cape, Skin } from '@/types/skin-pack';
import { CapeSelect } from './cape-select';
import { SkinSelect } from './skin-select';

type EntryCardProps = {
  name: string;
  skinId: string | null;
  capeId: string | null;
  skins: Skin[];
  capes: Cape[];
  onNameChange: (name: string) => void;
  onSkinIdChange: (skinId: string | null) => void;
  onCapeIdChange: (capeId: string | null) => void;
  onRemove: () => void;
};

export function EntryCard({
  name,
  skinId,
  capeId,
  skins,
  capes,
  onNameChange,
  onSkinIdChange,
  onCapeIdChange,
  onRemove,
}: EntryCardProps) {
  const skin = skins.find((s) => s.id === skinId);
  const cape = capes.find((c) => c.id === capeId);

  return (
    <div className='flex flex-col items-stretch gap-2 lg:flex-row'>
      <Card className='min-w-0 flex-1 flex-col gap-3 p-4'>
        <Input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder='組み合わせの名前'
        />
        <div className='flex items-center gap-2'>
          <div className='min-w-0 flex-1'>
            <SkinSelect value={skinId} onChange={onSkinIdChange} skins={skins} />
          </div>
          <PlusIcon className='size-4 shrink-0 text-muted-foreground' />
          <div className='min-w-0 flex-1'>
            <CapeSelect value={capeId} onChange={onCapeIdChange} capes={capes} />
          </div>
          <ArrowRightIcon className='size-4 shrink-0 text-muted-foreground' />
          <div className='relative aspect-square min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-checkerboard'>
            {skin && (
              <SkinPreview3d
                file={skin.file}
                bodyType={skin.bodyType}
                capeFile={cape?.file ?? null}
                className='absolute inset-0'
              />
            )}
          </div>
        </div>
      </Card>
      <div>
        <Button
          onClick={onRemove}
          variant='destructive'
          className='max-lg:w-full gap-1.5 lg:h-full'
        >
          <Trash2Icon />
          <span className='lg:hidden'>削除</span>
        </Button>
      </div>
    </div>
  );
}
