// Worker for off-canvas rendering
import { z } from "zod";

// Zod schema for worker messages
const workerMessageSchema = z.object({
  type: z.enum(["render", "animate"]),
  width: z.number().min(100).max(5000),
  height: z.number().min(100).max(5000),
  dpr: z.number().min(1).max(3),
  offset: z.object({
    x: z.number(),
    y: z.number(),
  }),
  zoomLevel: z.number().min(0.5).max(2),
  rotationSpeed: z.number().min(0).max(10),
  autoRotate: z.boolean(),
  showGrid: z.boolean(),
  lineLength: z.number().min(50).max(150),
  celestialObjects: z.array(
    z.object({
      type: z.enum(["star", "nebula", "galaxy"]),
      x: z.number(),
      y: z.number(),
      magnitude: z.number().min(1).max(6),
    })
  ),
  calibrationStatus: z.enum(["idle", "calibrating", "error"]),
});

let offscreenCanvas: OffscreenCanvas;
let offscreenCtx: OffscreenCanvasRenderingContext2D;
let rotation = 0;

self.onmessage = (event) => {
  try {
    const message = workerMessageSchema.parse(event.data);

    switch (message.type) {
      case "render":
        handleRender(message);
        break;
      case "animate":
        handleAnimate(message);
        break;
      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

function handleRender(message: z.infer<typeof workerMessageSchema>) {
  if (
    !offscreenCanvas ||
    offscreenCanvas.width !== message.width * message.dpr ||
    offscreenCanvas.height !== message.height * message.dpr
  ) {
    offscreenCanvas = new OffscreenCanvas(
      message.width * message.dpr,
      message.height * message.dpr
    );
    const context = offscreenCanvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("Failed to get offscreen context");
    }
    offscreenCtx = context;
  }

  const startTime = performance.now();

  // Clear canvas
  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  // Apply transformations
  offscreenCtx.save();
  offscreenCtx.translate(
    message.width / 2 + message.offset.x,
    message.height / 2 + message.offset.y
  );
  offscreenCtx.scale(message.zoomLevel, message.zoomLevel);

  // Apply rotation
  if (message.autoRotate) {
    rotation += message.rotationSpeed * 0.01;
  }
  offscreenCtx.rotate(rotation);

  // Draw background
  const gradient = offscreenCtx.createRadialGradient(
    0,
    0,
    50,
    0,
    0,
    Math.max(message.width, message.height)
  );
  gradient.addColorStop(0, "#1f2937");
  gradient.addColorStop(1, "#111827");
  offscreenCtx.fillStyle = gradient;
  offscreenCtx.fillRect(
    -message.width / 2,
    -message.height / 2,
    message.width,
    message.height
  );

  // Draw coordinate system
  offscreenCtx.strokeStyle = "#4b5563";
  offscreenCtx.lineWidth = 1;
  offscreenCtx.beginPath();
  offscreenCtx.moveTo(-message.width / 2, 0);
  offscreenCtx.lineTo(message.width / 2, 0);
  offscreenCtx.moveTo(0, -message.height / 2);
  offscreenCtx.lineTo(0, message.height / 2);
  offscreenCtx.stroke();

  // Draw calibration lines
  offscreenCtx.strokeStyle = "#f87171";
  offscreenCtx.lineWidth = 2;
  offscreenCtx.beginPath();
  offscreenCtx.moveTo(0, 0);
  offscreenCtx.lineTo(message.lineLength, -message.lineLength / 2);
  offscreenCtx.stroke();

  offscreenCtx.strokeStyle = "#60a5fa";
  offscreenCtx.beginPath();
  offscreenCtx.moveTo(0, 0);
  offscreenCtx.lineTo(-message.lineLength / 2, message.lineLength);
  offscreenCtx.stroke();

  offscreenCtx.restore();

  // Send rendered image back to main thread
  const imageData = offscreenCtx.getImageData(
    0,
    0,
    offscreenCanvas.width,
    offscreenCanvas.height
  );

  self.postMessage(
    {
      type: "render",
      imageData,
      drawTime: performance.now() - startTime,
    },
    { transfer: [imageData.data.buffer] }
  );
}

function handleAnimate(message: z.infer<typeof workerMessageSchema>) {
  // Handle animation updates
  if (message.autoRotate) {
    rotation += message.rotationSpeed * 0.01;
  }
}
