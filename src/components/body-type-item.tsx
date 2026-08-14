import Image from 'next/image';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import type { BodyType } from '@/types/skin-pack';

export const BodyTypeLabels: Record<BodyType, string> = {
  wide: 'クラシック',
  slim: 'スリム',
};

const BodyTypesIcons: Record<BodyType, string> = {
  wide: '/steve.png',
  slim: '/alex.png',
};

export function BodyTypeItem({ bodyType }: { bodyType: BodyType }) {
  return (
    <Item size='xs' className='p-0'>
      <ItemMedia variant='image' className='rounded-none! size-5!'>
        <Image
          src={BodyTypesIcons[bodyType]}
          alt=''
          width={20}
          height={20}
          className='[image-rendering:pixelated]'
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{BodyTypeLabels[bodyType]}</ItemTitle>
      </ItemContent>
    </Item>
  );
}
