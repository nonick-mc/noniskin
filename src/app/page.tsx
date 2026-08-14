'use client';

import { BoxIcon, FolderArchiveIcon } from 'lucide-react';
import { AssetSection } from '@/components/asset-section';
import { EntrySection } from '@/components/entry-section';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buildSkinPack, slugify, triggerBlobDownload } from '@/lib/skin-pack';
import { SkinPackProvider, useSkinPackContext } from './context';

export default function Page() {
  return (
    <SkinPackProvider>
      <Navbar />
      <div className='mx-auto flex w-full max-w-350 gap-6 p-6'>
        <AssetSection />

        <div className='flex min-w-0 flex-1 flex-col gap-6'>
          <PackInfoCard />

          <EntrySection />

          <DownloadButton />
        </div>
      </div>
    </SkinPackProvider>
  );
}

function PackInfoCard() {
  const { packName, setPackName } = useSkinPackContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>全般設定</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Field orientation='responsive'>
          <FieldContent>
            <Label htmlFor='pack-name'>スキンパックの名前</Label>
          </FieldContent>
          <Input
            id='pack-name'
            value={packName}
            onChange={(event) => setPackName(event.target.value)}
            placeholder='My Skin Pack'
          />
        </Field>
      </CardContent>
    </Card>
  );
}

function DownloadButton() {
  const { packName, capes, skins, entries } = useSkinPackContext();
  const validatedPackName = packName.trim() === '' ? 'My Skin Pack' : packName;

  async function handleDownload(extension: 'mcpack' | 'zip') {
    const blob = await buildSkinPack({
      packName: validatedPackName,
      capes,
      skins,
      entries,
    });
    triggerBlobDownload(blob, `${slugify(validatedPackName, 'skin-pack')}.${extension}`);
  }

  const canDownload = entries.length > 0;

  return (
    <div className='flex gap-2'>
      <Button
        className='flex-1'
        size='lg'
        disabled={!canDownload}
        onClick={() => handleDownload('zip')}
      >
        <FolderArchiveIcon />
        Zipファイルでダウンロード
      </Button>
      <Button
        className='flex-1'
        variant='outline'
        size='lg'
        disabled={!canDownload}
        onClick={() => handleDownload('mcpack')}
      >
        <BoxIcon />
        Mcpackファイルでダウンロード
      </Button>
    </div>
  );
}
