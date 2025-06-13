"use client";

import { useTranslation as useTranslationOriginal } from "../i18n";
import { useEffect, useState } from "react";

export function useTranslation(
  lang: string,
  ns: string,
  options: { keyPrefix?: string } = {},
) {
  const [t, setT] = useState<Awaited<
    ReturnType<typeof useTranslationOriginal>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    useTranslationOriginal(lang, ns, options).then((result) => {
      setT(result);
      setIsLoading(false);
    });
  }, [lang, ns, options]);

  return {
    t: t?.t || ((key: string) => key),
    i18n: t?.i18n,
    isLoading,
  };
}
