export type ParticleShape = "circle" | "square" | "triangle";
export type AnimationMode = "normal" | "attract" | "repel";

export class Particle {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  growthFactor: number;
  shape: ParticleShape;
  trail: { x: number; y: number }[];
  clickEffect: number;
  isExpanding: boolean;
  expandSpeed: number;
  expandDistance: number;
  maxExpandDistance: number;

  constructor(
    canvas: HTMLCanvasElement,
    color: string,
    maxSpeed: number,
    sizeRange: [number, number],
    shape: ParticleShape,
    isExpanding: boolean = false,
    x?: number,
    y?: number
  ) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.baseSize =
      Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
    this.size = this.baseSize;
    this.speedX = (Math.random() - 0.5) * maxSpeed;
    this.speedY = (Math.random() - 0.5) * maxSpeed;
    this.color = color;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.growthFactor = Math.random() * 0.02 + 0.98;
    this.shape = shape;
    this.trail = [];
    this.clickEffect = 0;
    this.isExpanding = isExpanding;
    this.expandSpeed = Math.random() * 2 + 1;
    this.expandDistance = 0;
    this.maxExpandDistance = Math.random() * 100 + 50;
  }

  update(
    canvas: HTMLCanvasElement,
    mousePosition: { x: number; y: number },
    interactionDistance: number,
    animationMode: AnimationMode
  ) {
    if (this.isExpanding) {
      this.expandDistance += this.expandSpeed;
      this.x += Math.cos(this.speedX) * this.expandSpeed;
      this.y += Math.sin(this.speedY) * this.expandSpeed;
      this.opacity = Math.max(
        0,
        1 - this.expandDistance / this.maxExpandDistance
      );
      if (this.expandDistance >= this.maxExpandDistance) {
        this.opacity = 0;
      }
    } else {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen edges
      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;

      // Mouse interaction
      const dx = mousePosition.x - this.x;
      const dy = mousePosition.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < interactionDistance) {
        this.size =
          this.baseSize *
          (1 + (interactionDistance - distance) / interactionDistance);
        if (animationMode === "attract") {
          this.x += dx * 0.05;
          this.y += dy * 0.05;
        } else if (animationMode === "repel") {
          this.x -= dx * 0.05;
          this.y -= dy * 0.05;
        }
      } else {
        this.size = Math.max(this.baseSize, this.size * this.growthFactor);
      }

      // Pulsating effect
      this.opacity = 0.5 + Math.sin(Date.now() * 0.001 + this.x + this.y) * 0.2;

      // Update trail
      this.trail.unshift({ x: this.x, y: this.y });
      if (this.trail.length > 5) {
        this.trail.pop();
      }

      // Update click effect
      if (this.clickEffect > 0) {
        this.clickEffect -= 0.05;
        this.size += this.clickEffect;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();

    switch (this.shape) {
      case "square":
        ctx.rect(
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
        break;
      case "triangle":
        ctx.moveTo(this.x, this.y - this.size / 2);
        ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
        ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
        ctx.closePath();
        break;
      default: // circle
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    }

    ctx.fill();

    if (!this.isExpanding) {
      // Draw trail
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size / 4;
      ctx.beginPath();
      this.trail.forEach((point, index) => {
        ctx.globalAlpha =
          ((this.trail.length - index) / this.trail.length) * this.opacity;
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  applyClickEffect() {
    this.clickEffect = 2;
  }

  mockClear() {
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.baseSize = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.color = "";
    this.opacity = 0;
    this.growthFactor = 0;
    this.shape = "circle";
    this.trail = [];
    this.clickEffect = 0;
    this.isExpanding = false;
    this.expandSpeed = 0;
    this.expandDistance = 0;
    this.maxExpandDistance = 0;
  }
}

export default Particle;
