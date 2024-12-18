import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import VideoPlayer from "./Video";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    iframe: ({ children, ...props }: any) => (
      <iframe {...props}>{children}</iframe>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("VideoPlayer", () => {
  const mockOnPlay = jest.fn();
  const mockOnPause = jest.fn();
  const mockOnEnded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("URL Parsing", () => {
    it("correctly parses YouTube URLs", () => {
      const { container } = render(
        <VideoPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute(
        "src",
        expect.stringContaining("youtube.com/embed/dQw4w9WgXcQ")
      );
    });

    it("correctly parses Vimeo URLs", () => {
      const { container } = render(
        <VideoPlayer src="https://vimeo.com/123456789" />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute(
        "src",
        expect.stringContaining("player.vimeo.com/video/123456789")
      );
    });

    it("handles direct URLs", () => {
      const directUrl = "https://example.com/video.mp4";
      const { container } = render(<VideoPlayer src={directUrl} />);
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute("src", directUrl);
    });
  });

  describe("Aspect Ratio", () => {
    it("calculates correct padding for 16:9 aspect ratio", () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ paddingTop: "56.25%" });
    });

    it("calculates correct padding for custom aspect ratio", () => {
      const { container } = render(
        <VideoPlayer src="test.mp4" aspectRatio="4:3" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ paddingTop: "75%" });
    });
  });

  describe("Thumbnail Behavior", () => {
    it("shows thumbnail when provided", () => {
      const { container } = render(
        <VideoPlayer src="test.mp4" thumbnail="thumb.jpg" />
      );
      const thumbnail = container.querySelector("img");
      expect(thumbnail).toBeInTheDocument();
      expect(thumbnail).toHaveAttribute("src", "thumb.jpg");
    });

    it("hides thumbnail on play", () => {
      const { container } = render(
        <VideoPlayer src="test.mp4" thumbnail="thumb.jpg" />
      );
      const thumbnail = container.querySelector("img");
      fireEvent.click(thumbnail!);
      expect(container.querySelector("img")).not.toBeInTheDocument();
    });
  });

  describe("Controls and Callbacks", () => {
    it("calls onPlay when play is triggered", () => {
      const { container } = render(
        <VideoPlayer
          src="test.mp4"
          thumbnail="thumb.jpg"
          onPlay={mockOnPlay}
          controls={false}
        />
      );
      const playButton = container.querySelector('[style*="cursor: pointer"]');
      fireEvent.click(playButton!);
      expect(mockOnPlay).toHaveBeenCalled();
    });

    it("calls onPause when pause is triggered", () => {
      const { container } = render(
        <VideoPlayer
          src="test.mp4"
          onPause={mockOnPause}
          controls={false}
          autoplay={true}
        />
      );
      const pauseButton = container.querySelector('[style*="cursor: pointer"]');
      fireEvent.click(pauseButton!);
      expect(mockOnPause).toHaveBeenCalled();
    });

    it("shows custom controls when controls prop is false", () => {
      const { container } = render(
        <VideoPlayer src="test.mp4" controls={false} />
      );
      const customControls = container.querySelector(
        '[style*="cursor: pointer"]'
      );
      expect(customControls).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("shows loading indicator initially", () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      expect(container.querySelector(".loader")).toBeInTheDocument();
    });

    it("hides loading indicator after load", () => {
      const { container } = render(<VideoPlayer src="test.mp4" />);
      const iframe = container.querySelector("iframe")!;
      act(() => {
        fireEvent.load(iframe);
      });
      expect(container.querySelector(".loader")).not.toBeInTheDocument();
    });
  });

  describe("Autoplay Behavior", () => {
    it("starts playing when autoplay is true", () => {
      const { container } = render(
        <VideoPlayer src="test.mp4" autoplay={true} controls={false} />
      );
      const playButton = container.querySelector("svg");
      expect(playButton).not.toBeInTheDocument();
    });

    it("generates correct autoplay parameter in embed URL", () => {
      const { container } = render(
        <VideoPlayer
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          autoplay={true}
        />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute(
        "src",
        expect.stringContaining("autoplay=1")
      );
    });
  });
});
