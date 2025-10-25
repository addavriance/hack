import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { Button } from './ui/button'
import LoginModal from './modals/LoginModal'
import { Loader2, Network } from 'lucide-react'

const Header = () => {
    const { isAuthenticated, user, logout, loading } = useAuthContext()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const location = useLocation()

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === to ? 'text-primary' : 'text-muted-foreground'
            }`}
        >
            {children}
        </Link>
    )

    return (
        <>
            <header className="border-b bg-background">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
                                <Network className="h-6 w-6 text-primary" />
                                <span className="text-2xl">Lvalue</span>
                            </Link>

                            {isAuthenticated && (
                                <nav className="flex items-center space-x-6">
                                    <NavLink to="/">Diagnostics</NavLink>
                                    <NavLink to="/agents">Agents</NavLink>
                                    <NavLink to="/about">About</NavLink>
                                    <NavLink to="/documentation">Documentation</NavLink>
                                </nav>
                            )}

                            {!isAuthenticated && !loading && (
                                <nav className="flex items-center space-x-6">
                                    <NavLink to="/">Diagnostics</NavLink>
                                    <NavLink to="/about">About</NavLink>
                                    <NavLink to="/documentation">Documentation</NavLink>
                                </nav>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            {loading ? (
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Loading...</span>
                                </div>
                            ) : isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-muted-foreground">
                                        Welcome, {user?.username}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={logout}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    Login / Register
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {showLoginModal && (
                <LoginModal onClose={() => setShowLoginModal(false)} />
            )}
        </>
    )
}

export default Header
