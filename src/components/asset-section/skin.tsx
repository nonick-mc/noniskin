'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, PlusIcon, ShirtIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSkinPackContext } from '@/app/context';
import { createSkinFormSchema } from '@/app/schema';
import { BodyTypeItem, BodyTypeLabels } from '@/components/body-type-item';
import {
  ControlledField,
  ControlledFieldError,
  ControlledFieldLabel,
} from '@/components/rhf/field';
import { ControlledImageUpload } from '@/components/rhf/image-upload';
import { ControlledSelect, ControlledSelectTrigger } from '@/components/rhf/select';
import { SkinPreviewImage } from '@/components/skin-preview-image';
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
import { SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select';
import { slugify, uniqueFileName } from '@/lib/skin-pack';
import type { BodyType, Skin } from '@/types/skin-pack';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const skinFormSchema = createSkinFormSchema();

export function SkinGroup() {
  const { skins, entries, existingFileNames, addSkin, removeSkin } = useSkinPackContext();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(skinFormSchema),
    defaultValues: { file: null as File | null, bodyType: 'wide' as BodyType },
  });

  const onSubmit = form.handleSubmit((values) => {
    // zodスキーマのrefineでnullでないことが保証されている
    const file = values.file as File;
    const name = crypto.randomUUID();
    const fileName = uniqueFileName(slugify(name, 'skin'), existingFileNames, '.png');

    addSkin({
      id: crypto.randomUUID(),
      name,
      file,
      fileName,
      bodyType: values.bodyType,
    });
    form.reset();
    setOpen(false);
  });

  return (
    <div className='flex-1 flex flex-col gap-3 min-h-0'>
      <div className='flex items-center justify-between'>
        <h2 className='font-heading font-medium'>スキン</h2>
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
              <DialogTitle>スキンを追加</DialogTitle>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                <ControlledField control={form.control} name='file'>
                  <FieldContent>
                    <ControlledFieldLabel>スキン画像</ControlledFieldLabel>
                    <FieldDescription>64×64のPNG画像である必要があります。</FieldDescription>
                    <ControlledFieldError />
                  </FieldContent>
                  <ControlledImageUpload />
                </ControlledField>
                <ControlledField control={form.control} name='bodyType'>
                  <FieldContent>
                    <ControlledFieldLabel>腕の細さ</ControlledFieldLabel>
                    <ControlledFieldError />
                  </FieldContent>
                  <ControlledSelect>
                    <ControlledSelectTrigger className='w-full'>
                      <SelectValue>
                        {(value: BodyType) => <BodyTypeItem bodyType={value} />}
                      </SelectValue>
                    </ControlledSelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        <SelectItem value='wide'>
                          <BodyTypeItem bodyType='wide' />
                        </SelectItem>
                        <SelectItem value='slim'>
                          <BodyTypeItem bodyType='slim' />
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </ControlledSelect>
                </ControlledField>
                <Button type='submit'>スキンを追加</Button>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>
      <div className='flex-1 min-h-0 overflow-y-scroll overscroll-contain no-scrollbar scroll-fade-y'>
        {skins.length === 0 ? (
          <Empty className='border border-dashed px-3 h-full'>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <ShirtIcon />
              </EmptyMedia>
              <EmptyDescription className='text-xs'>スキンがありません</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-2'>
            {skins.map((skin) => (
              <SkinThumbnail
                key={skin.id}
                skin={skin}
                inUse={entries.some((entry) => entry.skinId === skin.id)}
                onRemove={() => removeSkin(skin.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkinThumbnail({
  skin,
  inUse,
  onRemove,
}: {
  skin: Skin;
  inUse: boolean;
  onRemove: () => void;
}) {
  return (
    <Tooltip disabled={!inUse}>
      <TooltipTrigger
        render={
          <div
            className='group relative aspect-1/2 overflow-hidden rounded-lg border border-border bg-muted'
            title={`${skin.name}(${BodyTypeLabels[skin.bodyType]})`}
          >
            <SkinPreviewImage
              file={skin.file}
              bodyType={skin.bodyType}
              className='absolute inset-0'
            />
            {inUse ? (
              <div className='absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-muted-foreground'>
                <LockIcon className='size-3' />
              </div>
            ) : (
              <button
                type='button'
                onClick={onRemove}
                title={`${skin.name}を削除`}
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
