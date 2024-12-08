import { useState, useEffect } from "react";

export function useMediaQuery(queries: string | string[]): boolean[] {
  const [matches, setMatches] = useState<boolean[]>(
    Array.isArray(queries) ? queries.map(() => false) : [false]
  );

  useEffect(() => {
    const queryList = Array.isArray(queries) ? queries : [queries];
    const mediaQueryLists = queryList.map((query) => window.matchMedia(query));

    const updateMatches = () => {
      setMatches(mediaQueryLists.map((mql) => mql.matches));
    };

    updateMatches();

    mediaQueryLists.forEach((mql) => {
      mql.addEventListener("change", updateMatches);
    });

    return () => {
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener("change", updateMatches);
      });
    };
  }, [queries]);

  return matches;
}
