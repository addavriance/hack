import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

const TcpTab = ({ data, loading, error, onRetry, port }) => {
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Checking TCP ports...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={onRetry}>
                    Retry TCP Check
                </Button>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No TCP port data available</p>
                <Button onClick={onRetry}>
                    Check TCP Port {port || '(default)'}
                </Button>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>TCP Port Check Results</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium">Location</th>
                            <th className="text-left py-3 font-medium">Port</th>
                            <th className="text-left py-3 font-medium">Status</th>
                            <th className="text-left py-3 font-medium">Response Time</th>
                            <th className="text-left py-3 font-medium">Protocol</th>
                            <th className="text-left py-3 font-medium">IP Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((result, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                                <td className="py-3">{result.location}</td>
                                <td className="py-3 font-mono">{result.port}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        result.reachable 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {result.reachable ? 'Open' : 'Closed'}
                                    </span>
                                </td>
                                <td className="py-3">{result.latency}</td>
                                <td className="py-3">{result.protocol}</td>
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

export default TcpTab
