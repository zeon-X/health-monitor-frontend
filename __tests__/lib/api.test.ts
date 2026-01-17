/**
 * API Client Tests - Core business logic testing
 */

// Mock axios before any imports - Jest will use __mocks__/axios.js
jest.mock('axios')

// Import api module after mocking
import * as api from '@/lib/api'

// Import the mock functions (these come from __mocks__/axios.js)
const axios = require('axios')
const mockGet = axios.mockGet
const mockPost = axios.mockPost

describe('API Client', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Patient APIs', () => {
        it('should fetch all patients', async () => {
            mockGet.mockResolvedValueOnce({
                data: [{ patientId: 'P001', name: 'John Doe' }]
            })

            const result = await api.getPatients()

            expect(mockGet).toHaveBeenCalledWith('/patients')
            expect(result).toEqual([{ patientId: 'P001', name: 'John Doe' }])
        })

        it('should fetch single patient by ID', async () => {
            mockGet.mockResolvedValueOnce({
                data: { patientId: 'P001', name: 'John Doe' }
            })

            const result = await api.getPatient('P001')

            expect(mockGet).toHaveBeenCalledWith('/patients/P001')
            expect(result.patientId).toBe('P001')
        })
    })

    describe('Vitals APIs', () => {
        it('should fetch latest vitals', async () => {
            mockGet.mockResolvedValueOnce({
                data: { heartRate: 72, spo2: 98 }
            })

            const result = await api.getLatestVitals('P001')

            expect(mockGet).toHaveBeenCalledWith('/vitals/P001/latest')
            expect(result.heartRate).toBe(72)
        })

        it('should fetch vitals history', async () => {
            mockGet.mockResolvedValueOnce({ data: { records: [] } })

            await api.getVitalsHistory('P001', 24)

            expect(mockGet).toHaveBeenCalledWith('/vitals/P001/history', {
                params: { hours: 24 }
            })
        })
    })

    describe('Anomaly APIs', () => {
        it('should fetch active anomalies', async () => {
            mockGet.mockResolvedValueOnce({ data: [] })

            await api.getActiveAnomalies()

            expect(mockGet).toHaveBeenCalledWith('/anomalies/active')
        })

        it('should fetch patient anomalies', async () => {
            mockGet.mockResolvedValueOnce({ data: [] })

            await api.getPatientAnomalies('P001')

            expect(mockGet).toHaveBeenCalledWith('/anomalies/patient/P001')
        })

        it('should acknowledge anomaly', async () => {
            mockPost.mockResolvedValueOnce({ data: { success: true } })

            await api.acknowledgeAnomaly('A001')

            expect(mockPost).toHaveBeenCalledWith(
                '/anomalies/A001/acknowledge',
                { acknowledgedBy: 'Web User' }
            )
        })
    })

    describe('Dashboard API', () => {
        it('should fetch dashboard summary', async () => {
            const mockData = {
                summary: { totalPatients: 5, activeAnomalies: 3 },
                recentAnomalies: [],
                latestVitals: []
            }
            mockGet.mockResolvedValueOnce({ data: mockData })

            const result = await api.getDashboardSummary()

            expect(mockGet).toHaveBeenCalledWith('/dashboard/summary')
            expect(result.summary.totalPatients).toBe(5)
        })
    })

    describe('Error Handling', () => {
        it('should handle network errors', async () => {
            mockGet.mockRejectedValueOnce(new Error('Network Error'))

            await expect(api.getPatients()).rejects.toThrow('Network Error')
        })

        it('should handle 404 errors', async () => {
            const error = {
                response: { status: 404, data: { message: 'Not found' } }
            }
            mockGet.mockRejectedValueOnce(error)

            await expect(api.getPatient('INVALID')).rejects.toMatchObject({
                response: { status: 404 }
            })
        })
    })
})
