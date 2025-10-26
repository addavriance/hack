import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import MapView from "../MapView.jsx";

const InfoTab = ({ data, loading, error, onRetry, target }) => {
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading basic information...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                    Retry
                </button>
            </div>
        )
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No data available
            </div>
        )
    }

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b">
            <span className="font-medium text-muted-foreground">{label}</span>
            <span className="text-right">{value}</span>
        </div>
    )

    const AgentCard = ({ agentData, index }) => (
        <Card>
            <CardHeader>
                <CardTitle>{agentData.agent}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <InfoRow label="Target" value={target} />
                <InfoRow label="IP Address" value={agentData.ip} />
                <InfoRow label="Host Name" value={agentData.hostname} />
                <InfoRow label="IP Range" value={agentData.ipRange} />
                <InfoRow label="ASN" value={agentData.asn} />
                <InfoRow label="ISP / Organization" value={agentData.isp} />
                <InfoRow label="Country" value={agentData.country} />
                <InfoRow label="Region" value={agentData.region} />
                <InfoRow label="City" value={agentData.city} />
                <InfoRow label="Postal Code" value={agentData.postalCode} />
                <InfoRow label="Timezone" value={agentData.timezone} />
                <InfoRow label="Local Time" value={agentData.localTime} />
            </CardContent>
        </Card>
    )

    const MapCard = ({ agentData }) => (
        <Card>
            <CardHeader>
                <CardTitle>Location Map</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <MapView
                        coordinates={agentData.coordinates}
                        location={`${agentData.city}, ${agentData.country}`}
                    />
                    <div className="text-sm text-muted-foreground text-center">
                        Coordinates: {agentData.coordinates.lat.toFixed(4)}, {agentData.coordinates.lng.toFixed(4)}
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6">
            {data.map((agentData, index) => (
                <div key={index} className="space-y-4">
                    <AgentCard agentData={agentData} index={index} />
                    <MapCard agentData={agentData} />
                </div>
            ))}
        </div>
    )
}

export default InfoTab
