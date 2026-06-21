import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './screens/Home'
import List from './screens/List'
import Map from './screens/Map'
import ProviderProfile from './screens/ProviderProfile'
import Book from './screens/Book'
import Compare from './screens/Compare'
import Reviews from './screens/Reviews'

/**
 * Gundua — discover mental-health care across Tanzania.
 * Mounted under /gundua/* by the shell App router.
 */
export default function Gundua() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="list" element={<List />} />
      <Route path="map" element={<Map />} />
      <Route path="profile/:id" element={<ProviderProfile />} />
      <Route path="book/:id" element={<Book />} />
      <Route path="linganisha" element={<Compare />} />
      <Route path="maoni/:providerId" element={<Reviews />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}
