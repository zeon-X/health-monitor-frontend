// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => ""),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock socket.io-client
jest.mock("socket.io-client", () => {
  const on = jest.fn();
  const off = jest.fn();
  const emit = jest.fn();
  const disconnect = jest.fn();

  return {
    __esModule: true,
    default: jest.fn(() => ({
      on,
      off,
      emit,
      disconnect,
      connected: true,
    })),
    io: jest.fn(() => ({
      on,
      off,
      emit,
      disconnect,
      connected: true,
    })),
  };
});

// Mock Notification API
global.Notification = {
  permission: "granted",
  requestPermission: jest.fn().mockResolvedValue("granted"),
};

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000";
