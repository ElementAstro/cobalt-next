import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BatteryDisplay from "./Battery";

// Mocking navigator.getBattery
const mockBattery = {
  level: 0.5,
  charging: false,
  chargingTime: 3600,
  dischargingTime: 7200,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

beforeAll(() => {
  Object.defineProperty(navigator, "getBattery", {
    value: jest.fn().mockResolvedValue(mockBattery),
  });
});

describe("BatteryDisplay", () => {
  it("renders correctly with default props", async () => {
    await act(async () => {
      render(<BatteryDisplay />);
    });

    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("电池正常")).toBeInTheDocument();
  });

  it("shows charging status when charging", async () => {
    mockBattery.charging = true;

    await act(async () => {
      render(<BatteryDisplay />);
    });

    expect(screen.getByText("充电中")).toBeInTheDocument();
  });

  it("shows low battery alert when battery level is below threshold", async () => {
    mockBattery.level = 0.1;
    mockBattery.charging = false;

    await act(async () => {
      render(<BatteryDisplay alertThreshold={20} />);
    });

    expect(screen.getByText("电量过低！")).toBeInTheDocument();
  });

  it("calls onAlert when battery level is below threshold", async () => {
    const onAlert = jest.fn();
    mockBattery.level = 0.1;
    mockBattery.charging = false;

    await act(async () => {
      render(<BatteryDisplay alertThreshold={20} onAlert={onAlert} />);
    });

    expect(onAlert).toHaveBeenCalled();
  });

  it("shows charging time when charging", async () => {
    mockBattery.charging = true;
    mockBattery.chargingTime = 3600;

    await act(async () => {
      render(<BatteryDisplay showChargingTime={true} />);
    });

    expect(screen.getByText("充满电需要时间: 1小时 0分钟")).toBeInTheDocument();
  });

  it("shows discharging time when not charging", async () => {
    mockBattery.charging = false;
    mockBattery.dischargingTime = 7200;

    await act(async () => {
      render(<BatteryDisplay showChargingTime={true} />);
    });

    expect(screen.getByText("剩余使用时间: 2小时 0分钟")).toBeInTheDocument();
  });

  it("applies correct theme classes", async () => {
    await act(async () => {
      render(<BatteryDisplay theme="dark" />);
    });

    expect(screen.getByText("50%")).toHaveClass("text-white");
  });

  it("applies correct size classes", async () => {
    await act(async () => {
      render(<BatteryDisplay size="large" />);
    });

    expect(screen.getByText("50%").closest("div")).toHaveClass("w-40 h-20");
  });

  it("refreshes battery status on button click", async () => {
    await act(async () => {
      render(<BatteryDisplay />);
    });

    const refreshButton = screen.getByText("刷新状态");
    fireEvent.click(refreshButton);

    expect(window.location.reload).toHaveBeenCalled();
  });
});
