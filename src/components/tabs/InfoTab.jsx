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

    if (!data) {
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

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <InfoRow label="Target" value={target} />
                    <InfoRow label="IP Address" value={data.ip} />
                    <InfoRow label="Host Name" value={data.hostname} />
                    <InfoRow label="IP Range" value={data.ipRange} />
                    <InfoRow label="ASN" value={data.asn} />
                    <InfoRow label="ISP / Organization" value={data.isp} />
                    <InfoRow label="Country" value={data.country} />
                    <InfoRow label="Region" value={data.region} />
                    <InfoRow label="City" value={data.city} />
                    <InfoRow label="Postal Code" value={data.postalCode} />
                    <InfoRow label="Timezone" value={data.timezone} />
                    <InfoRow label="Local Time" value={data.localTime} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Location Map</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Карта */}
                            <MapView
                                coordinates={data.coordinates}
                                location={`${data.city}, ${data.country}`}
                            />
                        <div className="text-sm text-muted-foreground text-center">
                            Coordinates: {data.coordinates.lat.toFixed(4)}, {data.coordinates.lng.toFixed(4)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default InfoTab
