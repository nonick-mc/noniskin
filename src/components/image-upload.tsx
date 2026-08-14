'use client';

import { Trash2Icon, UploadCloudIcon } from 'lucide-react';
import type { FocusEvent } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useObjectUrl } from '@/hooks/use-object-url';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type ImageUploadProps = {
  className?: string;
  name?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  invalid?: boolean;
};

export function ImageUpload({
  className,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  invalid,
}: ImageUploadProps) {
  const [, { clearFiles, openFileDialog, getInputProps }] = useFileUpload({
    accept: 'image/png',
    multiple: false,
    onFilesChange: (files) => {
      const file = files[0]?.file;
      onChange(file instanceof File ? file : null);
    },
  });
  const previewUrl = useObjectUrl(value);

  return (
    <div
      data-invalid={invalid}
      className={cn(
        'w-full aspect-square relative overflow-hidden rounded-lg border data-[invalid=true]:border-destructive',
        className,
      )}
    >
      {previewUrl ? (
        <>
          {/** biome-ignore lint/performance/noImgElement: client file */}
          <img
            src={previewUrl}
            alt='preview'
            className='size-full object-cover [image-rendering:pixelated] pointer-events-none'
          />
          <Button
            className='absolute right-2 top-2'
            size='icon'
            variant='outline'
            disabled={disabled}
            onClick={() => {
              clearFiles();
              onChange(null);
            }}
          >
            <Trash2Icon className='text-destructive' />
          </Button>
        </>
      ) : (
        <div className='flex items-center justify-center w-full h-full'>
          <Button type='button' disabled={disabled} onClick={openFileDialog}>
            <UploadCloudIcon />
            画像をアップロード
          </Button>
          <input {...getInputProps({ id: name, name, disabled, onBlur })} className='sr-only' />
        </div>
      )}
    </div>
  );
}
