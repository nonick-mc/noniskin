'use client';

import { BoxIcon, FolderArchiveIcon, ImageIcon, PencilIcon } from 'lucide-react';
import { useId } from 'react';
import { AssetSection } from '@/components/asset-section';
import { EntrySection } from '@/components/entry-section';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildSkinPack, slugify, triggerBlobDownload } from '@/lib/skin-pack';
import { SkinPackProvider, useSkinPackContext } from './context';

export default function Page() {
  return (
    <SkinPackProvider>
      <Navbar />
      <div className='mx-auto flex w-full max-w-350 flex-col gap-6 p-6 lg:flex-row'>
        <div className='hidden lg:contents'>
          <AssetSection />
          <EditorContent />
        </div>
        <Tabs defaultValue='asset' className='w-full gap-6 lg:hidden'>
          <TabsList className='w-full'>
            <TabsTrigger value='asset'>
              <ImageIcon className='mt-0.5' />
              アセット
            </TabsTrigger>
            <TabsTrigger value='editor'>
              <PencilIcon className='mt-0.5' />
              エディター
            </TabsTrigger>
          </TabsList>
          <TabsContent value='asset'>
            <AssetSection />
          </TabsContent>
          <TabsContent value='editor'>
            <EditorContent />
          </TabsContent>
        </Tabs>
      </div>
    </SkinPackProvider>
  );
}

function EditorContent() {
  return (
    <div className='flex min-w-0 flex-1 flex-col gap-6'>
      <PackInfoCard />

      <EntrySection />

      <DownloadButton />
    </div>
  );
}

function PackInfoCard() {
  const { packName, setPackName } = useSkinPackContext();
  const packNameId = useId();

  return (
    <Card>
      <CardHeader>
        <CardTitle>全般設定</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Field orientation='responsive'>
          <FieldContent>
            <Label htmlFor={packNameId}>スキンパックの名前</Label>
          </FieldContent>
          <Input
            id={packNameId}
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

  const canDownload = entries.some((entry) => entry.skinId !== null);

  return (
    <div className='flex flex-col md:flex-row gap-2'>
      <Button
        className='md:flex-1'
        size='lg'
        disabled={!canDownload}
        onClick={() => handleDownload('zip')}
      >
        <FolderArchiveIcon />
        Zipファイルでダウンロード
      </Button>
      <Button
        className='md:flex-1'
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
