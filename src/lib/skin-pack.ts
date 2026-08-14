import JSZip from 'jszip';
import geometry from '@/structures/geometry.json';
import type {
  BodyType,
  Cape,
  PackEntry,
  Skin,
  SkinPackManifest,
  SkinsJson,
  SkinsJsonEntry,
} from '@/types/skin-pack';

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

export function slugify(input: string, fallback: string): string {
  const slug = input
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || fallback;
}

export function uniqueFileName(base: string, existing: Set<string>, extension: string): string {
  let candidate = `${base}${extension}`;
  let suffix = 2;

  while (existing.has(candidate)) {
    candidate = `${base}-${suffix}${extension}`;
    suffix += 1;
  }

  return candidate;
}

export function buildManifest(packName: string): SkinPackManifest {
  return {
    format_version: 1,
    header: {
      name: `${packName} §r§7 made with skin.nonick.net`,
      uuid: crypto.randomUUID(),
      version: [0, 1, 1],
    },
    modules: [
      {
        type: 'skin_pack',
        uuid: crypto.randomUUID(),
        version: [0, 0, 1],
      },
    ],
  };
}

const GeometryIdentifiers: Record<BodyType, SkinsJsonEntry['geometry']> = {
  wide: 'geometry.humanoid.custom',
  slim: 'geometry.humanoid.customSlim',
};

export function buildSkinsJson(entries: PackEntry[], skins: Skin[], capes: Cape[]): SkinsJson {
  return {
    skins: entries.flatMap((entry) => {
      const skin = skins.find((s) => s.id === entry.skinId);
      if (!skin) return [];

      const cape = entry.capeId ? capes.find((c) => c.id === entry.capeId) : undefined;

      return [
        {
          localization_name: skin.name,
          geometry: GeometryIdentifiers[skin.bodyType],
          texture: skin.fileName,
          ...(cape && { cape: cape.fileName }),
          type: 'free',
        },
      ];
    }),
    serialize_name: 'customSkinPack',
    localization_name: 'customSkinPack',
  };
}

type BuildSkinPackParams = {
  packName: string;
  capes: Cape[];
  skins: Skin[];
  entries: PackEntry[];
};

export async function buildSkinPack({
  packName,
  capes,
  skins,
  entries,
}: BuildSkinPackParams): Promise<Blob> {
  const zip = new JSZip();

  zip.file('manifest.json', JSON.stringify(buildManifest(packName), null, 2));
  zip.file('skins.json', JSON.stringify(buildSkinsJson(entries, skins, capes), null, 2));
  zip.file('geometry.json', JSON.stringify(geometry, null, 2));

  for (const cape of capes) {
    zip.file(cape.fileName, cape.file);
  }
  for (const skin of skins) {
    zip.file(skin.fileName, skin.file);
  }

  return zip.generateAsync({ type: 'blob' });
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
