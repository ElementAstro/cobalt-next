import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ParticleBackground from "./ParticleBackground";
import Particle from "./Particle";

// Mock Particle class to avoid actual particle behavior during testing
jest.mock("./Particle");

describe("ParticleBackground Component", () => {
  it("renders correctly with default props", () => {
    render(<ParticleBackground />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with custom particle count", () => {
    render(<ParticleBackground particleCount={200} />);
    expect(Particle).toHaveBeenCalledTimes(200);
  });

  it("renders with custom color", () => {
    render(<ParticleBackground color="#FF0000" />);
    expect(Particle).toHaveBeenCalledWith(
      expect.anything(),
      "#FF0000",
      expect.anything(),
      expect.anything(),
      expect.anything()
    );
  });

  it("renders with custom max speed", () => {
    render(<ParticleBackground maxSpeed={2} />);
    expect(Particle).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      2,
      expect.anything(),
      expect.anything()
    );
  });

  it("renders with custom size range", () => {
    render(<ParticleBackground sizeRange={[5, 10]} />);
    expect(Particle).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      [5, 10],
      expect.anything()
    );
  });

  it("renders with custom interaction distance", () => {
    render(<ParticleBackground interactionDistance={200} />);
    // No direct way to test interaction distance, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with custom background color", () => {
    render(<ParticleBackground backgroundColor="blue" />);
    // No direct way to test background color, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with custom shape", () => {
    render(<ParticleBackground shape="square" />);
    expect(Particle).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      "square"
    );
  });

  it("renders with custom animation mode", () => {
    render(<ParticleBackground animationMode="attract" />);
    // No direct way to test animation mode, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with gradient colors", () => {
    render(<ParticleBackground gradientColors={["#000000", "#FFFFFF"]} />);
    // No direct way to test gradient colors, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with connections between particles", () => {
    render(<ParticleBackground showConnections={true} />);
    // No direct way to test connections, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with custom connection distance", () => {
    render(<ParticleBackground connectionDistance={150} />);
    // No direct way to test connection distance, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with custom expanding particle count", () => {
    render(<ParticleBackground expandingParticleCount={30} />);
    // No direct way to test expanding particle count, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("handles mouse move events", () => {
    render(<ParticleBackground />);
    fireEvent.mouseMove(screen.getByRole("img"), { clientX: 100, clientY: 100 });
    // No direct way to test mouse position, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("handles touch move events", () => {
    render(<ParticleBackground />);
    fireEvent.touchMove(screen.getByRole("img"), {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    // No direct way to test touch position, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("handles click events", () => {
    render(<ParticleBackground />);
    fireEvent.click(screen.getByRole("img"), { clientX: 100, clientY: 100 });
    // No direct way to test click effect, but ensure component renders
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("displays FPS counter", async () => {
    render(<ParticleBackground />);
    await waitFor(() => expect(screen.getByText(/FPS:/)).toBeInTheDocument());
  });
});