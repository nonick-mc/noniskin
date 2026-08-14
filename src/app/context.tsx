'use client';

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { Cape, PackEntry, Skin } from '@/types/skin-pack';

type SkinPackContextValue = {
  packName: string;
  setPackName: (packName: string) => void;
  capes: Cape[];
  skins: Skin[];
  entries: PackEntry[];
  existingFileNames: Set<string>;
  addCape: (cape: Cape) => void;
  removeCape: (id: string) => void;
  addSkin: (skin: Skin) => void;
  removeSkin: (id: string) => void;
  setEntries: (entries: PackEntry[]) => void;
};

const SkinPackContext = createContext<SkinPackContextValue | null>(null);

export function SkinPackProvider({ children }: { children: ReactNode }) {
  const [packName, setPackName] = useState('');
  const [capes, setCapes] = useState<Cape[]>([]);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [entries, setEntries] = useState<PackEntry[]>([]);

  const existingFileNames = useMemo(
    () => new Set([...capes.map((cape) => cape.fileName), ...skins.map((skin) => skin.fileName)]),
    [capes, skins],
  );

  function addCape(cape: Cape) {
    setCapes((prev) => [...prev, cape]);
  }

  function removeCape(id: string) {
    setCapes((prev) => prev.filter((cape) => cape.id !== id));
  }

  function addSkin(skin: Skin) {
    setSkins((prev) => [...prev, skin]);
  }

  function removeSkin(id: string) {
    setSkins((prev) => prev.filter((skin) => skin.id !== id));
  }

  useEffect(() => {
    // react-skinview3d/skinview3dは内部でviewer.loadSkin()/loadCape()をcatchせず呼んでおり、
    // WebGLコンテキストロストなどでDOM Eventをそのままrejectすることがある。
    // アプリのバグ(Errorインスタンス)ではなく、この既知のライブラリ挙動の場合のみ無視する。
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      if (event.reason instanceof Event) {
        event.preventDefault();
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  return (
    <SkinPackContext.Provider
      value={{
        packName,
        setPackName,
        capes,
        skins,
        entries,
        existingFileNames,
        addCape,
        removeCape,
        addSkin,
        removeSkin,
        setEntries,
      }}
    >
      {children}
    </SkinPackContext.Provider>
  );
}

export function useSkinPackContext(): SkinPackContextValue {
  const ctx = useContext(SkinPackContext);
  if (!ctx) throw new Error('useSkinPackContext must be used within SkinPackProvider');
  return ctx;
}
