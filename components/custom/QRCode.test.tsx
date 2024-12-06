import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import QRCode from "./QRCode";
import { motion } from "framer-motion";

// Mock framer-motion to avoid animations during testing
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: React.forwardRef(
        (
          props: React.JSX.IntrinsicAttributes &
            React.ClassAttributes<HTMLDivElement> &
            React.HTMLAttributes<HTMLDivElement>,
          ref: React.LegacyRef<HTMLDivElement> | undefined
        ) => <div {...props} ref={ref} />
      ),
      button: React.forwardRef(
        (
          props: React.JSX.IntrinsicAttributes &
            React.ClassAttributes<HTMLButtonElement> &
            React.ButtonHTMLAttributes<HTMLButtonElement>,
          ref: React.LegacyRef<HTMLButtonElement> | undefined
        ) => <button {...props} ref={ref} />
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("QRCode Component", () => {
  it("renders correctly with default props", async () => {
    render(<QRCode value="https://example.com" />);
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("renders with custom size", async () => {
    render(<QRCode value="https://example.com" size={300} />);
    await waitFor(() =>
      expect(screen.getByRole("img")).toHaveAttribute("width", "300")
    );
  });

  it("renders with custom colors", async () => {
    render(
      <QRCode
        value="https://example.com"
        color="#FF0000"
        backgroundColor="#00FF00"
      />
    );
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("renders with custom error correction level", async () => {
    render(<QRCode value="https://example.com" errorCorrectionLevel="H" />);
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("renders with custom icon", async () => {
    render(
      <QRCode
        value="https://example.com"
        iconSrc="https://example.com/icon.png"
      />
    );
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("renders with custom padding", async () => {
    render(<QRCode value="https://example.com" padding={20} />);
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("renders with SVG type", async () => {
    render(<QRCode value="https://example.com" type="svg" />);
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("toggles theme correctly", async () => {
    render(<QRCode value="https://example.com" />);
    const switchButton = screen.getByRole("switch");
    fireEvent.click(switchButton);
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("downloads QR code as PNG", async () => {
    render(<QRCode value="https://example.com" />);
    const downloadButton = screen.getByText("下载二维码");
    fireEvent.click(downloadButton);
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("downloads QR code as SVG", async () => {
    render(<QRCode value="https://example.com" type="svg" />);
    const downloadButton = screen.getByText("下载二维码");
    fireEvent.click(downloadButton);
    await waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("displays error message on QR code generation failure", async () => {
    render(<QRCode value="" />);
    await waitFor(() =>
      expect(
        screen.getByText("生成二维码失败，请检查输入值或网络连接。")
      ).toBeInTheDocument()
    );
  });
});
