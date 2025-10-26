import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { MapPin, Clock, AlertCircle } from 'lucide-react'

const TracerouteTab = ({ data, loading, error, onRetry }) => {
    const getHopStatusColor = (hop) => {
        if (hop.time === 'timeout') return 'text-red-500'
        if (hop.time === 'N/A') return 'text-yellow-500'
        return 'text-green-500'
    }

    const getHopStatusIcon = (hop) => {
        if (hop.time === 'timeout') return <AlertCircle className="h-4 w-4 text-red-500" />
        if (hop.time === 'N/A') return <Clock className="h-4 w-4 text-yellow-500" />
        return <MapPin className="h-4 w-4 text-green-500" />
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Running traceroute...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={onRetry}>
                    Retry Traceroute
                </Button>
            </div>
        )
    }

    if (!data || (!data.hops || data.hops.length === 0)) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No traceroute data available</p>
                <Button onClick={onRetry}>
                    Run Traceroute
                </Button>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Traceroute Results</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Traceroute</h3>
                            <div className="text-sm text-muted-foreground">
                                Target: <span className="font-mono">{data.target}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {data.hops.map((hop, hopIndex) => (
                                <div
                                    key={hopIndex}
                                    className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    {/* Hop Number */}
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-primary">{hopIndex + 1}</span>
                                    </div>

                                    {/* Status Icon */}
                                    <div className="flex-shrink-0">
                                        {getHopStatusIcon(hop)}
                                    </div>

                                    {/* Hop Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-mono text-sm truncate">{hop.ip || 'N/A'}</span>
                                            {hop.hostname && hop.hostname !== hop.ip && (
                                                <span className="text-xs text-muted-foreground truncate">
                                                    ({hop.hostname})
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                            {hop.country && (
                                                <span className="flex items-center space-x-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{hop.country}</span>
                                                </span>
                                            )}
                                            {hop.asn && (
                                                <span>AS{hop.asn}</span>
                                            )}
                                            {hop.isp && (
                                                <span className="truncate">{hop.isp}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Response Time */}
                                    <div className={`text-right ${getHopStatusColor(hop)}`}>
                                        <div className="text-sm font-medium">
                                            {hop.time === 'timeout' ? 'Timeout' : hop.time === 'N/A' ? 'N/A' : hop.time}
                                        </div>
                                        {hop.packetLoss && (
                                            <div className="text-xs text-muted-foreground">
                                                {hop.packetLoss} loss
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Route Summary */}
                        <div className="mt-4 pt-4 border-t border-muted">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Total Hops:</span>
                                    <span className="ml-2 font-medium">{data.hops.length}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Successful:</span>
                                    <span className="ml-2 font-medium text-green-600">
                                        {data.hops.filter(h => h.time !== 'timeout' && h.time !== 'N/A').length}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Timeouts:</span>
                                    <span className="ml-2 font-medium text-red-600">
                                        {data.hops.filter(h => h.time === 'timeout').length}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Total Time:</span>
                                    <span className="ml-2 font-medium">N/A</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TracerouteTab
