import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CapeGroup } from './cape';
import { SkinGroup } from './skin';

export function AssetSection() {
  return (
    <Card className='w-full lg:sticky lg:top-20 lg:h-[calc(100dvh-6.5rem)] lg:w-80 lg:shrink-0'>
      <CardHeader>
        <CardTitle>アセット</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 flex flex-col gap-6 overflow-y-auto'>
        <SkinGroup />
        <Separator />
        <CapeGroup />
      </CardContent>
    </Card>
  );
}
