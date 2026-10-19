import { Navigate, Route, Routes } from "react-router-dom"

import { GuestRoute } from "@/components/guest-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardPage } from "@/pages/dashboard-page"
import { DiklatPage } from "@/pages/diklat-page"
import { JenisPelatihanPage } from "@/pages/jenis-pelatihan-page"
import { LoginPage } from "@/pages/login-page"
import { PegawaiPage } from "@/pages/pegawai-page"
import { SettingsPage } from "@/pages/settings-page"

export function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pegawai" element={<PegawaiPage />} />
          <Route path="jenis-pelatihan" element={<JenisPelatihanPage />} />
          <Route path="diklat" element={<DiklatPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
