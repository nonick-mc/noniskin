'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, LockIcon, PlusIcon, ShirtIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSkinPackContext } from '@/app/context';
import { createCapeFormSchema } from '@/app/schema';
import { CapePreview } from '@/components/cape-preview';
import {
  ControlledField,
  ControlledFieldError,
  ControlledFieldLabel,
} from '@/components/rhf/field';
import { ControlledImageUpload } from '@/components/rhf/image-upload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@/components/ui/empty';
import { FieldContent, FieldDescription } from '@/components/ui/field';
import { slugify, uniqueFileName } from '@/lib/skin-pack';
import type { Cape } from '@/types/skin-pack';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const capeFormSchema = createCapeFormSchema();

export function CapeGroup() {
  const { capes, entries, existingFileNames, addCape, removeCape } = useSkinPackContext();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(capeFormSchema),
    defaultValues: { file: null as File | null },
  });

  const onSubmit = form.handleSubmit((values) => {
    // zodスキーマのrefineでnullでないことが保証されている
    const file = values.file as File;
    const name = crypto.randomUUID();
    const fileName = uniqueFileName(slugify(name, 'cape'), existingFileNames, '.png');

    addCape({ id: crypto.randomUUID(), name, file, fileName });
    form.reset();
    setOpen(false);
  });

  return (
    <div className='flex-1 flex flex-col gap-3 min-h-0'>
      <div className='flex items-center justify-between'>
        <h2 className='font-heading font-medium'>マント</h2>
        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) form.reset();
          }}
        >
          <DialogTrigger render={<Button type='button' variant='outline' size='icon-sm' />}>
            <PlusIcon />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>マントを追加</DialogTitle>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                <ControlledField control={form.control} name='file'>
                  <FieldContent>
                    <ControlledFieldLabel>画像ファイル</ControlledFieldLabel>
                    <FieldDescription>64×32のPNG画像である必要があります。</FieldDescription>
                    <ControlledFieldError />
                  </FieldContent>
                  <ControlledImageUpload className='aspect-2/1' />
                </ControlledField>
                <Button type='submit'>
                  <CheckIcon />
                  マントを追加
                </Button>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex-1 min-h-0 overflow-y-scroll overscroll-contain no-scrollbar scroll-fade-y'>
        {capes.length === 0 ? (
          <Empty className='border border-dashed px-3 h-full'>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <ShirtIcon />
              </EmptyMedia>
              <EmptyDescription className='text-xs'>マントがありません</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className='grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-3'>
            {capes.map((cape) => (
              <CapeThumbnail
                key={cape.id}
                cape={cape}
                inUse={entries.some((entry) => entry.capeId === cape.id)}
                onRemove={() => removeCape(cape.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CapeThumbnail({
  cape,
  inUse,
  onRemove,
}: {
  cape: Cape;
  inUse: boolean;
  onRemove: () => void;
}) {
  return (
    <Tooltip disabled={!inUse}>
      <TooltipTrigger
        render={
          <div className='group relative aspect-10/16 overflow-hidden rounded-lg border border-border bg-muted'>
            <CapePreview file={cape.file} />
            {inUse ? (
              <div className='absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-background/90 text-muted-foreground'>
                <LockIcon className='size-3' />
              </div>
            ) : (
              <button
                type='button'
                onClick={onRemove}
                className='absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100'
              >
                <Trash2Icon className='size-5 text-destructive' />
              </button>
            )}
          </div>
        }
      />
      <TooltipContent>使用中のため削除できません</TooltipContent>
    </Tooltip>
  );
}
