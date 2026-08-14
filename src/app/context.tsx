'use client';

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { loadPersistedState, savePersistedState } from '@/lib/db';
import type { Cape, PackEntry, Skin } from '@/types/skin-pack';

type SkinPackContextValue = {
  isHydrated: boolean;
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
const SaveDebounceMs = 500;

export function SkinPackProvider({ children }: { children: ReactNode }) {
  const [packName, setPackName] = useState('');
  const [capes, setCapes] = useState<Cape[]>([]);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [entries, setEntries] = useState<PackEntry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const debouncedSave = useDebounceCallback(savePersistedState, SaveDebounceMs);

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

  // 初回マウント時にIndexedDBから前回のデータを復元する
  useEffect(() => {
    let cancelled = false;

    loadPersistedState().then((state) => {
      if (cancelled) return;
      if (state) {
        setPackName(state.packName);
        setCapes(state.capes);
        setSkins(state.skins);
        setEntries(state.entries);
      }
      setIsHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // 内容が変わるたびにIndexedDBへ保存する
  // (復元(isHydrated)が完了する前に初期状態の空データで上書きしてしまうのを防ぐ)
  useEffect(() => {
    if (!isHydrated) return;
    debouncedSave({ packName, capes, skins, entries });
  }, [isHydrated, packName, capes, skins, entries, debouncedSave]);

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
        isHydrated,
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
