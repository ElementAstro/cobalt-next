import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { LightBox } from "./Lightbox";
import Image from "next/image";
import { motion } from "framer-motion";

// Mocking next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: jest.fn((props) => <img {...props} />),
}));

// Mocking framer-motion
jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: {
    div: jest.fn((props) => <div {...props} />),
  },
  AnimatePresence: jest.fn(({ children }) => <>{children}</>),
}));

const images = [
  { src: "image1.jpg", alt: "Image 1", width: 800, height: 600 },
  { src: "image2.jpg", alt: "Image 2", width: 800, height: 600 },
];

describe("LightBox", () => {
  it("renders correctly with default props", () => {
    render(<LightBox images={images} />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
  });

  it("opens and closes the LightBox", () => {
    render(<LightBox images={images} />);
    fireEvent.click(screen.getByAltText("Image 1"));
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close (Esc)"));
    expect(screen.queryByAltText("Image 1")).not.toBeInTheDocument();
  });

  it("navigates to the next and previous images", () => {
    render(<LightBox images={images} />);
    fireEvent.click(screen.getByAltText("Image 1"));
    fireEvent.click(screen.getByText("Next (→)"));
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Previous (←)"));
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("zooms in and out", () => {
    render(<LightBox images={images} enableZoom={true} />);
    fireEvent.click(screen.getByAltText("Image 1"));
    fireEvent.click(screen.getByText("Zoom In"));
    fireEvent.click(screen.getByText("Zoom Out"));
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("toggles fullscreen mode", () => {
    render(<LightBox images={images} enableFullscreen={true} />);
    fireEvent.click(screen.getByAltText("Image 1"));
    fireEvent.click(screen.getByText("Toggle Fullscreen (F)"));
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("autoplays images", () => {
    jest.useFakeTimers();
    render(<LightBox images={images} autoPlayInterval={1000} />);
    fireEvent.click(screen.getByAltText("Image 1"));
    fireEvent.click(screen.getByText("Toggle Autoplay (Space)"));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("downloads the current image", () => {
    render(<LightBox images={images} enableDownload={true} />);
    fireEvent.click(screen.getByAltText("Image 1"));
    fireEvent.click(screen.getByText("Download Image"));
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("shares the current image", () => {
    navigator.share = jest.fn();
    render(<LightBox images={images} enableSharing={true} />);
    fireEvent.click(screen.getByAltText("Image 1"));
    fireEvent.click(screen.getByText("Share Image"));
    expect(navigator.share).toHaveBeenCalled();
  });

  it("shows and hides image info", () => {
    render(
      <LightBox
        images={[{ ...images[0], description: "Description 1" }]}
        showThumbnails={false}
      />
    );
    fireEvent.click(screen.getByAltText("Image 1"));
    fireEvent.click(screen.getByText("Toggle Image Info (I)"));
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Toggle Image Info (I)"));
    expect(screen.queryByText("Description 1")).not.toBeInTheDocument();
  });

  it("shows thumbnails and selects an image from thumbnails", () => {
    render(<LightBox images={images} showThumbnails={true} />);
    fireEvent.click(screen.getByAltText("Image 1"));
    fireEvent.click(screen.getByAltText("Image 2"));
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
  });
});
