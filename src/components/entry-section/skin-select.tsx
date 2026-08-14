'use client';

import type { Control } from 'react-hook-form';
import type { EntriesFormValues } from '@/app/schema';
import { ControlledFieldProvider } from '@/components/rhf/field';
import { ControlledSelect, ControlledSelectTrigger } from '@/components/rhf/select';
import { SkinPreviewImage } from '@/components/skin-preview-image';
import { SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select';
import type { Skin } from '@/types/skin-pack';

type SkinSelectProps = {
  control: Control<EntriesFormValues>;
  index: number;
  skins: Skin[];
};

export function SkinSelect({ control, index, skins }: SkinSelectProps) {
  return (
    <ControlledFieldProvider control={control} name={`entries.${index}.skinId`}>
      <ControlledSelect disabled={skins.length === 0}>
        <ControlledSelectTrigger className='h-full! w-full items-stretch p-1.5 px-3 [&>svg]:self-center'>
          <SelectValue>
            {(value: string | null) => {
              const skin = skins.find((s) => s.id === value);
              return (
                <span className='relative size-full'>
                  {skin && (
                    <SkinPreviewImage
                      file={skin.file}
                      bodyType={skin.bodyType}
                      className='absolute inset-0'
                    />
                  )}
                </span>
              );
            }}
          </SelectValue>
        </ControlledSelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup className='grid grid-cols-3 gap-2 p-2'>
            {skins.map((skin) => (
              <SelectItem
                key={skin.id}
                value={skin.id}
                className='flex-col items-stretch p-0.5 pr-0.5'
              >
                <span className='relative aspect-1/2 w-full'>
                  <SkinPreviewImage
                    file={skin.file}
                    bodyType={skin.bodyType}
                    className='absolute inset-0'
                  />
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </ControlledSelect>
    </ControlledFieldProvider>
  );
}
