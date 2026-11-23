
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/siomc-webapp/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        admin: resolve(__dirname, 'admin.html'),
        adminLogin: resolve(__dirname, 'admin-login.html'),
        setPassword: resolve(__dirname, 'set-password.html'),
        members: resolve(__dirname, 'members.html'),
        weight: resolve(__dirname, 'weight.html'),
        patientWeight: resolve(__dirname, 'patient-weight.html'),patientFood: resolve(__dirname, 'patient-food.html'),
        nutrition: resolve(__dirname, 'nutrition.html'),
        patientMeasurements: resolve(__dirname, 'patient-measurements.html'),
        patientAssessments: resolve(__dirname, 'patient-assessments.html'),
        assessment: resolve(__dirname, 'assessment.html'),
        learning: resolve(__dirname, 'learning.html'),
        staff: resolve(__dirname, 'staff.html'),
        careTeam: resolve(__dirname, 'care-team.html')
      }
    }
  }
})
