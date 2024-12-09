import { Particle } from "./Particle";

describe("Particle", () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext("2d")!;
  });

  test("should initialize particle with correct properties", () => {
    const particle = new Particle(canvas, "red", 5, [10, 20], "circle");
    expect(particle.color).toBe("red");
    expect(particle.shape).toBe("circle");
    expect(particle.size).toBeGreaterThanOrEqual(10);
    expect(particle.size).toBeLessThanOrEqual(20);
    expect(particle.speedX).toBeGreaterThanOrEqual(-2.5);
    expect(particle.speedX).toBeLessThanOrEqual(2.5);
    expect(particle.speedY).toBeGreaterThanOrEqual(-2.5);
    expect(particle.speedY).toBeLessThanOrEqual(2.5);
  });

  test("should update particle position and size correctly", () => {
    const particle = new Particle(canvas, "blue", 5, [10, 20], "square");
    const initialX = particle.x;
    const initialY = particle.y;
    const mousePosition = { x: 400, y: 300 };
    particle.update(canvas, mousePosition, 100, "normal");
    expect(particle.x).not.toBe(initialX);
    expect(particle.y).not.toBe(initialY);
  });

  test("should handle mouse interaction correctly", () => {
    const particle = new Particle(canvas, "green", 5, [10, 20], "triangle");
    const mousePosition = { x: particle.x, y: particle.y };
    particle.update(canvas, mousePosition, 100, "attract");
    expect(particle.size).toBeGreaterThan(particle.baseSize);
    expect(particle.x).not.toBe(particle.x - particle.speedX);
    expect(particle.y).not.toBe(particle.y - particle.speedY);
  });

  test("should handle expand effect correctly", () => {
    const particle = new Particle(
      canvas,
      "yellow",
      5,
      [10, 20],
      "circle",
      true
    );
    particle.update(canvas, { x: 0, y: 0 }, 100, "normal");
    expect(particle.expandDistance).toBeGreaterThan(0);
    expect(particle.opacity).toBeLessThan(1);
  });

  test("should draw particle correctly", () => {
    const particle = new Particle(canvas, "purple", 5, [10, 20], "circle");
    particle.draw(ctx);
    expect(ctx.globalAlpha).toBe(1);
  });

  test("should apply click effect correctly", () => {
    const particle = new Particle(canvas, "orange", 5, [10, 20], "circle");
    particle.applyClickEffect();
    expect(particle.clickEffect).toBe(2);
  });
});
