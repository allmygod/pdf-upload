import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Workspaces from './pages/Workspaces'
import CreateWorkspace from './pages/Workspaces/Create'
import ShowWorkspace from './pages/Workspaces/Show'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/workspaces" element={
            <PrivateRoute>
              <Workspaces />
            </PrivateRoute>
          }
        />
        <Route path="/workspaces/:id" element={
            <PrivateRoute>
              <ShowWorkspace />
            </PrivateRoute>
          }
        />
        <Route path="/create" element={
            <PrivateRoute>
              <CreateWorkspace />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
