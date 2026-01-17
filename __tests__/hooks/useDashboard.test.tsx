/**
 * useDashboard Hook Tests - Integration testing
 */

import { useDashboard } from "@/hooks/useDashboard";
import * as api from "@/lib/api";
import * as socket from "@/lib/socket";
import { act, renderHook, waitFor } from "@testing-library/react";

jest.mock("@/lib/api");
jest.mock("@/lib/socket");

const mockedApi = api as jest.Mocked<typeof api>;
const mockedSocket = socket as jest.Mocked<typeof socket>;

describe("useDashboard Hook", () => {
  let mockSocket: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    mockedSocket.initializeSocket.mockReturnValue(mockSocket);

    // Suppress console errors in tests
    jest.spyOn(console, "error").mockImplementation();
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockDashboardSummary = {
    summary: {
      totalPatients: 3,
      activeAnomalies: 2,
      criticalCount: 1,
      warningCount: 1,
    },
    recentAnomalies: [],
    latestVitals: [],
    timestamp: "2026-01-18T10:00:00Z",
  };

  describe("Initial State", () => {
    it("should start with loading state", () => {
      mockedApi.getDashboardSummary.mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useDashboard());

      expect(result.current.loading).toBe(true);
      expect(result.current.summary).toBeNull();
    });
  });

  describe("Data Fetching", () => {
    it("should fetch dashboard summary on mount", async () => {
      mockedApi.getDashboardSummary.mockResolvedValue(mockDashboardSummary);
      mockedApi.getPatientAnomalies.mockResolvedValue([]);

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockedApi.getDashboardSummary).toHaveBeenCalled();
      expect(result.current.summary).toEqual(mockDashboardSummary);
      expect(result.current.error).toBeNull();
    });

    it("should handle fetch errors", async () => {
      mockedApi.getDashboardSummary.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to load dashboard data");
    });
  });

  describe("Anomaly Management", () => {
    it("should track anomalies per patient", async () => {
      const mockAnomalies = [
        {
          _id: "A001",
          patientId: "P001",
          severity: "critical" as const,
          alerts: [],
          acknowledged: false,
          detectedAt: "2026-01-18",
        },
        {
          _id: "A002",
          patientId: "P001",
          severity: "warning" as const,
          alerts: [],
          acknowledged: true,
          detectedAt: "2026-01-17",
        },
      ];

      mockedApi.getDashboardSummary.mockResolvedValue({
        ...mockDashboardSummary,
        latestVitals: [{ patientId: "P001", patientName: "John" } as any],
      });
      mockedApi.getPatientAnomalies.mockResolvedValue(mockAnomalies);

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const allAnomalies = result.current.getPatientAnomalies("P001");
      expect(allAnomalies).toHaveLength(2);

      const activeAnomalies = result.current.getActiveAnomalies("P001");
      expect(activeAnomalies).toHaveLength(1);
      expect(activeAnomalies[0]._id).toBe("A001");
    });

    it("should acknowledge anomaly and refresh", async () => {
      mockedApi.getDashboardSummary.mockResolvedValue(mockDashboardSummary);
      mockedApi.getPatientAnomalies.mockResolvedValue([]);
      mockedApi.acknowledgeAnomaly.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setSelectedPatient("P001");
      });

      await act(async () => {
        await result.current.handleAcknowledge("A001");
      });

      expect(mockedApi.acknowledgeAnomaly).toHaveBeenCalledWith("A001");
      expect(result.current.selectedPatient).toBeNull();
    });
  });

  describe("WebSocket Integration", () => {
    it("should setup WebSocket listeners", async () => {
      mockedApi.getDashboardSummary.mockResolvedValue(mockDashboardSummary);
      mockedApi.getPatientAnomalies.mockResolvedValue([]);

      renderHook(() => useDashboard());

      await waitFor(() => {
        expect(mockedSocket.initializeSocket).toHaveBeenCalled();
      });

      expect(mockSocket.on).toHaveBeenCalledWith(
        "vital_update",
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "anomaly_alert",
        expect.any(Function)
      );
    });

    it("should cleanup on unmount", async () => {
      mockedApi.getDashboardSummary.mockResolvedValue(mockDashboardSummary);
      mockedApi.getPatientAnomalies.mockResolvedValue([]);

      const { unmount } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(mockSocket.on).toHaveBeenCalled();
      });

      unmount();

      expect(mockSocket.off).toHaveBeenCalledWith("vital_update");
      expect(mockSocket.off).toHaveBeenCalledWith("anomaly_alert");
    });
  });
});
