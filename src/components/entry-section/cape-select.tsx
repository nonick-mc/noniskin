'use client';

import { BanIcon } from 'lucide-react';
import type { Control } from 'react-hook-form';
import type { EntriesFormValues } from '@/app/schema';
import { CapePreview } from '@/components/cape-preview';
import { ControlledFieldProvider } from '@/components/rhf/field';
import { ControlledSelect, ControlledSelectTrigger } from '@/components/rhf/select';
import { SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select';
import type { Cape } from '@/types/skin-pack';

type CapeSelectProps = {
  control: Control<EntriesFormValues>;
  index: number;
  capes: Cape[];
};

export function CapeSelect({ control, index, capes }: CapeSelectProps) {
  return (
    <ControlledFieldProvider control={control} name={`entries.${index}.capeId`}>
      <ControlledSelect disabled={capes.length === 0}>
        <ControlledSelectTrigger className='aspect-square h-auto! w-full items-stretch p-1.5 px-3 [&>svg]:self-center'>
          <SelectValue>
            {(value: string | null) => {
              const cape = capes.find((c) => c.id === value);
              return (
                <span className='relative rounded-md size-full md:p-6'>
                  {cape ? (
                    <CapePreview file={cape.file} />
                  ) : (
                    <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
                      <BanIcon className='size-4 text-muted-foreground' />
                      <p className='max-lg:hidden'>マントなし</p>
                    </div>
                  )}
                </span>
              );
            }}
          </SelectValue>
        </ControlledSelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup className='grid grid-cols-3 gap-2 p-2'>
            <SelectItem
              value={null}
              className='flex-col items-stretch gap-1 rounded-lg p-1.5 pr-1.5 data-selected:ring-2 data-selected:ring-primary'
            >
              <span className='relative aspect-10/16 w-full overflow-hidden rounded-md bg-muted border'>
                <BanIcon className='absolute inset-0 m-auto size-4 text-muted-foreground' />
              </span>
            </SelectItem>
            {capes.map((cape) => (
              <SelectItem
                key={cape.id}
                value={cape.id}
                className='flex-col items-stretch gap-1 rounded-lg p-1.5 pr-1.5 data-selected:ring-2 data-selected:ring-primary'
              >
                <span className='relative aspect-10/16 w-full overflow-hidden rounded-md bg-muted border'>
                  <CapePreview file={cape.file} />
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </ControlledSelect>
    </ControlledFieldProvider>
  );
}
