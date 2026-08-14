'use client';

import { SkinPreviewImage } from '@/components/skin-preview-image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Skin } from '@/types/skin-pack';

type SkinSelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  skins: Skin[];
};

export function SkinSelect({ value, onChange, skins }: SkinSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={skins.length === 0}>
      <SelectTrigger className='aspect-square h-auto! w-full items-stretch p-1.5 px-3 [&>svg]:self-center'>
        <SelectValue>
          {(value: string | null) => {
            const skin = skins.find((s) => s.id === value);
            return (
              <span className='relative size-full overflow-hidden rounded-md'>
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
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup className='grid grid-cols-3 gap-2 p-2'>
          {skins.map((skin) => (
            <SelectItem
              key={skin.id}
              value={skin.id}
              className='flex-col items-stretch p-0.5 pr-0.5'
            >
              <span className='relative aspect-1/2 w-full overflow-hidden rounded-md'>
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
    </Select>
  );
}
