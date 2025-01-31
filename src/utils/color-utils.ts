export function generateAnalogousPalette(baseColor: string): string[] {
  const hsl = hexToHSL(baseColor);
  const colors: string[] = [];

  for (let i = -2; i <= 2; i++) {
    const h = (hsl.h + i * 30 + 360) % 360;
    colors.push(hslToHex({ h, s: hsl.s, l: hsl.l }));
  }

  return colors;
}

export function generateMonochromaticPalette(baseColor: string): string[] {
  const hsl = hexToHSL(baseColor);
  const colors: string[] = [];

  for (let i = 0; i < 5; i++) {
    const l = Math.max(0, Math.min(100, hsl.l - 20 + i * 10));
    colors.push(hslToHex({ h: hsl.h, s: hsl.s, l }));
  }

  return colors;
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s, l: l };
}

function hslToHex(hsl: { h: number; s: number; l: number }): string {
  let h = hsl.h / 360;
  let s = hsl.s;
  let l = hsl.l;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
