import { type DBSchema, openDB } from 'idb';
import type { Cape, PackEntry, Skin } from '@/types/skin-pack';

const DbName = 'mcbe-cape-builder';
const DbVersion = 1;
const StoreName = 'skin-pack-state';
const StateKey = 'current';

export type PersistedState = {
  packName: string;
  capes: Cape[];
  skins: Skin[];
  entries: PackEntry[];
};

interface SkinPackDb extends DBSchema {
  [StoreName]: {
    key: string;
    value: PersistedState;
  };
}

function getDb() {
  return openDB<SkinPackDb>(DbName, DbVersion, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(StoreName)) {
        db.createObjectStore(StoreName);
      }
    },
  });
}

export async function loadPersistedState(): Promise<PersistedState | undefined> {
  const db = await getDb();
  return db.get(StoreName, StateKey);
}

export async function savePersistedState(state: PersistedState): Promise<void> {
  const db = await getDb();
  await db.put(StoreName, state, StateKey);
}
