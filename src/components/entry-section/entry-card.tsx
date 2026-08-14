'use client';

import { ArrowRightIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { Control } from 'react-hook-form';
import type { EntriesFormValues } from '@/app/schema';
import { SkinPreview3d } from '@/components/skin-preview-3d';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Cape, Skin } from '@/types/skin-pack';
import { CapeSelect } from './cape-select';
import { SkinSelect } from './skin-select';

type EntryCardProps = {
  control: Control<EntriesFormValues>;
  index: number;
  skinId: string | null;
  capeId: string | null;
  skins: Skin[];
  capes: Cape[];
  onRemove: () => void;
};

export function EntryCard({
  control,
  index,
  skinId,
  capeId,
  skins,
  capes,
  onRemove,
}: EntryCardProps) {
  const skin = skins.find((s) => s.id === skinId);
  const cape = capes.find((c) => c.id === capeId);

  return (
    <div className='flex flex-col items-stretch gap-2 lg:flex-row'>
      <Card className='min-w-0 flex-1 flex-col gap-3 p-4'>
        <div className='flex items-center gap-2'>
          <div className='min-w-0 flex-1'>
            <SkinSelect control={control} index={index} skins={skins} />
          </div>
          <PlusIcon className='size-4 shrink-0 text-muted-foreground' />
          <div className='min-w-0 flex-1'>
            <CapeSelect control={control} index={index} capes={capes} />
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
      <Button
        onClick={onRemove}
        variant='destructive'
        className='w-full gap-1.5 lg:h-full lg:w-9 lg:gap-0 lg:p-0'
      >
        <Trash2Icon />
        <span className='lg:hidden'>削除</span>
      </Button>
    </div>
  );
}
