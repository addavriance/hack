import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

const PingTab = ({ data, loading, error, onRetry }) => {
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Running ping tests...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={onRetry}>
                    Retry Ping
                </Button>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No ping data available</p>
                <p className="text-sm text-muted-foreground">
                    Open this tab to run ping test
                </p>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ping Results</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium">Location</th>
                            <th className="text-left py-3 font-medium">Status</th>
                            <th className="text-left py-3 font-medium">Packets</th>
                            <th className="text-left py-3 font-medium">Packet Loss</th>
                            <th className="text-left py-3 font-medium">Min Time</th>
                            <th className="text-left py-3 font-medium">Avg Time</th>
                            <th className="text-left py-3 font-medium">Max Time</th>
                            <th className="text-left py-3 font-medium">IP Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((result, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                                <td className="py-3">{result.location}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        result.is_failed
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {result.is_failed ? 'Failed' : 'Success'}
                                    </span>
                                </td>
                                <td className="py-3">
                                    {result.packetsReceived}/{result.packetsSent}
                                </td>
                                <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                        result.packetLoss === '0%'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                      {result.packetLoss}
                    </span>
                                </td>
                                <td className="py-3">{result.minTime}</td>
                                <td className="py-3 font-medium">{result.avgTime}</td>
                                <td className="py-3">{result.maxTime}</td>
                                <td className="py-3 font-mono">{result.ip}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

export default PingTab
