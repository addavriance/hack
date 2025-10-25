import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import NetworkChecker from './components/NetworkChecker'
import AgentsPage from './pages/AgentsPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-background">
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<NetworkChecker />} />
                            <Route
                                path="/agents"
                                element={
                                    <ProtectedRoute>
                                        <AgentsPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
