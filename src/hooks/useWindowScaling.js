import { useCallback, useLayoutEffect, useMemo, useState } from "react";

function useWindowScaling() {
  const [windowWidth, setWindowWidth] = useState(480);
  const [windowHeight, setWindowHeight] = useState(320);

  const updateSize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, [setWindowHeight, setWindowWidth]);

  useLayoutEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { vgaHeight, vgaWidth, textSize } = useMemo(() => {
    const padding = 64;
    const widthTextScale = ((windowWidth > 1024 ? 1024 : windowWidth - 16) / 800) * 16;
    const heightTextScale = ((windowHeight > 768 ? 768 - padding : windowHeight - padding) / 600) * 16;
    return {
      vgaHeight: windowHeight > 768 ? 768 - padding : windowHeight - padding,
      vgaWidth: windowWidth > 1024 ? 1024 : windowWidth - 16,
      textSize: Math.min(widthTextScale, heightTextScale),
    };
  }, [windowWidth, windowHeight]);

  return { vgaHeight, vgaWidth, textSize, updateSize };
}

export default useWindowScaling;
