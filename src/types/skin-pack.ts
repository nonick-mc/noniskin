export type BodyType = 'wide' | 'slim';

export type Cape = {
  id: string;
  name: string;
  displayName: string;
  file: File;
  fileName: string;
};

export type Skin = {
  id: string;
  name: string;
  displayName: string;
  file: File;
  fileName: string;
  bodyType: BodyType;
};

export type PackEntry = {
  id: string;
  skinId: Skin['id'] | null;
  capeId: Cape['id'] | null;
};

export type SkinPackManifest = {
  format_version: 1;
  header: {
    name: string;
    uuid: string;
    version: [number, number, number];
  };
  modules: [
    {
      type: 'skin_pack';
      uuid: string;
      version: [number, number, number];
    },
  ];
};

export type SkinsJsonEntry = {
  localization_name: string;
  geometry: 'geometry.humanoid.custom' | 'geometry.humanoid.customSlim';
  texture: string;
  cape?: string;
  type: 'free';
};

export type SkinsJson = {
  skins: SkinsJsonEntry[];
  serialize_name: string;
  localization_name: string;
};
