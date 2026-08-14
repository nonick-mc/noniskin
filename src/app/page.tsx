'use client';

import { BoxIcon, FolderArchiveIcon, ImageIcon, PencilIcon } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
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
  const isDesktop = useMediaQuery('(min-width: 1024px)', {
    defaultValue: false,
    initializeWithValue: false,
  });

  return (
    <SkinPackProvider>
      <Navbar />
      <div className='mx-auto flex w-full max-w-350 flex-col gap-6 p-6 lg:flex-row'>
        {isDesktop ? (
          <>
            <AssetSection />
            <EditorContent />
          </>
        ) : (
          <Tabs defaultValue='asset' className='w-full gap-6'>
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
        )}
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
