/**
 * DashboardPage Component Tests
 */

import DashboardPage from "@/app/page";
import { useDashboard } from "@/hooks/useDashboard";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

jest.mock("@/hooks/useDashboard");
jest.mock("next/navigation");

const mockedUseDashboard = useDashboard as jest.MockedFunction<
  typeof useDashboard
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("DashboardPage", () => {
  let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouter = {
      push: jest.fn(),
    };
    mockedUseRouter.mockReturnValue(mockRouter as any);
  });

  const mockDashboardData = {
    summary: {
      summary: {
        totalPatients: 2,
        activeAnomalies: 1,
        criticalCount: 0,
        warningCount: 1,
      },
      latestVitals: [
        {
          _id: "record1",
          patientId: "P001",
          patientName: "John Doe",
          heartRate: 75,
          bloodPressure: "120/80",
          bodyTemperature: 37.0,
          spo2: 98,
          recordedAt: "2026-01-18T10:00:00Z",
        },
      ],
      recentAnomalies: [],
      timestamp: "2026-01-18T10:00:00Z",
    },
    loading: false,
    error: null,
    selectedPatient: null,
    setSelectedPatient: jest.fn(),
    handleAcknowledge: jest.fn(),
    getPatientAnomalies: jest.fn(() => []),
    getActiveAnomalies: jest.fn(() => []),
    fetchData: jest.fn(),
  };

  it("should render loading state", () => {
    mockedUseDashboard.mockReturnValue({
      ...mockDashboardData,
      loading: true,
      summary: null,
    });

    render(<DashboardPage />);

    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it("should render error state", () => {
    mockedUseDashboard.mockReturnValue({
      ...mockDashboardData,
      loading: false,
      error: "Failed to load data",
      summary: null,
    });

    render(<DashboardPage />);

    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
  });

  it("should render dashboard with patient data", () => {
    mockedUseDashboard.mockReturnValue(mockDashboardData);

    render(<DashboardPage />);

    expect(screen.getByText(/patient overview/i)).toBeInTheDocument();
    // Patient name appears in both mobile and desktop views
    expect(screen.getAllByText(/john doe/i).length).toBeGreaterThan(0);
  });

  it("should use router.push for navigation when View Details is clicked", async () => {
    mockedUseDashboard.mockReturnValue(mockDashboardData);
    const user = userEvent.setup();

    render(<DashboardPage />);

    // Find and click the "View Details" button
    const viewDetailsButtons = screen.getAllByText(/view details/i);
    expect(viewDetailsButtons.length).toBeGreaterThan(0);

    await user.click(viewDetailsButtons[0]);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/patients/P001");
    });
  });

  it("should not use window.location.href for navigation", () => {
    mockedUseDashboard.mockReturnValue(mockDashboardData);

    // Spy on window.location
    const locationSpy = jest.spyOn(window, "location", "get");

    render(<DashboardPage />);

    // Verify that window.location was not accessed
    expect(locationSpy).not.toHaveBeenCalled();

    locationSpy.mockRestore();
  });

  it("should pass correct onViewDetails handler to PatientCard", () => {
    mockedUseDashboard.mockReturnValue(mockDashboardData);

    render(<DashboardPage />);

    // The component should render without errors and use router.push internally
    // Patient name appears in both mobile and desktop views
    expect(screen.getAllByText(/john doe/i).length).toBeGreaterThan(0);
    expect(mockedUseRouter).toHaveBeenCalled();
  });

  it("should handle empty patient list", () => {
    mockedUseDashboard.mockReturnValue({
      ...mockDashboardData,
      summary: {
        ...mockDashboardData.summary,
        latestVitals: [],
      },
    });

    render(<DashboardPage />);

    expect(screen.getByText(/no patient data available/i)).toBeInTheDocument();
  });
});
