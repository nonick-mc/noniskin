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
    <div className='flex items-stretch gap-2'>
      <Card className='flex-1 flex-col gap-3 p-4'>
        <div className='flex w-full items-center gap-2'>
          <div className='min-w-0 flex-1 self-stretch'>
            <SkinSelect control={control} index={index} skins={skins} />
          </div>
          <PlusIcon className='size-6 shrink-0 text-muted-foreground' />
          <div className='min-w-0 flex-1 self-stretch'>
            <CapeSelect control={control} index={index} capes={capes} />
          </div>
          <ArrowRightIcon className='size-6 shrink-0 text-muted-foreground' />
          <div className='w-100 relative aspect-3/2 shrink-0 overflow-hidden rounded-lg border border-border bg-checkerboard'>
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
        <Button onClick={onRemove} size='icon' className='h-full' variant='destructive'>
          <Trash2Icon />
        </Button>
      </div>
    </div>
  );
}
