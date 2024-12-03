import { WatermarkOptions } from "@/types/watermark";

export function createWatermark(options: WatermarkOptions): string {
  const {
    content,
    width,
    height,
    rotate = 0,
    globalRotate = 0,
    fontSize,
    fontFamily,
    fontStyle,
    fontVariant,
    fontWeight,
    fontColor,
    lineHeight,
    image,
    imageWidth,
    imageHeight,
    imageOpacity = 1,
    textAlign,
    canvasWidth,
    canvasHeight,
    xGap,
    yGap,
    xOffset = 0,
    yOffset = 0,
    debug,
  } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.rotate((globalRotate * Math.PI) / 180);

  const drawWatermark = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotate * Math.PI) / 180);

    if (image) {
      const img = new Image();
      img.src = image;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.globalAlpha = imageOpacity;
        ctx.drawImage(
          img,
          0,
          0,
          imageWidth || img.width,
          imageHeight || img.height
        );
        ctx.globalAlpha = 1;
      };
    }

    if (content) {
      ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${
        fontFamily || "sans-serif"
      }`;
      ctx.fillStyle = fontColor || "black";
      ctx.textAlign = textAlign as CanvasTextAlign;
      ctx.textBaseline = "top";

      const lines =
        typeof content === "string" ? content.split("\n") : content || [];
      if (!Array.isArray(lines)) {
        throw new Error("Content must be a string or an array of strings");
      }
      lines.forEach((line: string, index: number) => {
        ctx.fillText(line, 0, index * ((lineHeight || fontSize) ?? 0));
      });
    }

    ctx.restore();
  };

  for (let x = xOffset; x < canvasWidth; x += (width || 0) + (xGap || 0)) {
    for (let y = yOffset; y < canvasHeight; y += (height || 0) + (yGap || 0)) {
      drawWatermark(x, y);
    }
  }

  if (debug) {
    ctx.strokeStyle = "red";
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
  }

  return canvas.toDataURL();
}
