import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

const HttpTab = ({ data, loading, error, onRetry }) => {
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Running HTTP(S) checks...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={onRetry}>
                    Retry HTTP Check
                </Button>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No HTTP(S) data available</p>
                <Button onClick={onRetry}>
                    Run HTTP Check
                </Button>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>HTTP(S) Check Results</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium">Location</th>
                            <th className="text-left py-3 font-medium">Result</th>
                            <th className="text-left py-3 font-medium">Code</th>
                            <th className="text-left py-3 font-medium">Response Time</th>
                            <th className="text-left py-3 font-medium">IP Address</th>
                            <th className="text-left py-3 font-medium">SSL</th>
                            <th className="text-left py-3 font-medium">Server</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((result, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                                <td className="py-3">{result.location}</td>
                                <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                        result.result === 'Success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                      {result.result}
                    </span>
                                </td>
                                <td className="py-3 font-mono">{result.code}</td>
                                <td className="py-3">{result.responseTime}</td>
                                <td className="py-3 font-mono">{result.ip}</td>
                                <td className="py-3">
                                    {result.ssl ? '✓' : '✗'}
                                </td>
                                <td className="py-3">{result.server}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

export default HttpTab
