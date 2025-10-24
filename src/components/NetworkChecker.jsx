import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import ResultsTabs from './ResultsTabs'

const NetworkChecker = () => {
    const [target, setTarget] = useState('')
    const [port, setPort] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [resultsKey, setResultsKey] = useState(0) // для ререндера норм

    const handleCheck = async () => {
        if (!target.trim()) return

        setIsLoading(true)

        setResults(null)
        setResultsKey(prev => prev + 1)

        // mock инфа, потом сервис апи будет
        setTimeout(() => {
            setResults({
                target,
                port: port || 'N/A',
                timestamp: new Date().toISOString(),
                info: generateBasicInfo(target),

                http: null,
                ping: null,
                tcp: null,
                udp: null,
                dns: null
            })
            setIsLoading(false)
        }, 1000)
    }

    const generateBasicInfo = (target) => {
        return {
            ip: '188.114.96.0',
            hostname: target.includes('.') ? target : '188.114.96.0',
            ipRange: '188.114.96.0-188.114.97.255 CIDR',
            asn: '13335',
            isp: 'Cloudflare, Inc.',
            country: 'Canada (CA)',
            region: 'Ontario',
            city: 'Toronto',
            timezone: 'America/Toronto, GMT-0400',
            localTime: new Date().toLocaleString('en-US', {
                timeZone: 'America/Toronto',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            }),
            postalCode: 'M5A',
            coordinates: {
                lat: 43.6532,
                lng: -79.3832
            }
        }
    }

    const handleFetchTabData = async (tabId) => {
        if (!results) return null

        // mock, заменить на api сервис
        return await fetchMockTabData(tabId, results.target, results.port)
    }

    const fetchMockTabData = async (tabId, target, port) => {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

        const getRandomIp = () => {
            const base = '188.114.'
            const third = Math.floor(Math.random() * 255)
            const fourth = Math.floor(Math.random() * 255)
            return `${base}${third}.${fourth}`
        }

        switch (tabId) {
            case 'http':
                return [
                    {
                        location: 'Toronto, CA',
                        result: 'Success',
                        code: 200,
                        responseTime: `${Math.floor(Math.random() * 200) + 50}ms`,
                        ip: getRandomIp(),
                        ssl: true,
                        server: 'nginx/1.18.0'
                    },
                    {
                        location: 'New York, US',
                        result: 'Success',
                        code: 200,
                        responseTime: `${Math.floor(Math.random() * 100) + 30}ms`,
                        ip: getRandomIp(),
                        ssl: true,
                        server: 'cloudflare'
                    },
                    {
                        location: 'London, UK',
                        result: 'Success',
                        code: 200,
                        responseTime: `${Math.floor(Math.random() * 150) + 80}ms`,
                        ip: getRandomIp(),
                        ssl: true,
                        server: 'cloudflare'
                    }
                ]

            case 'ping':
                const avgTime = Math.floor(Math.random() * 100) + 20
                return [
                    {
                        location: 'Toronto, CA',
                        packetsSent: 4,
                        packetsReceived: 4,
                        packetLoss: '0%',
                        minTime: `${avgTime - 10}ms`,
                        avgTime: `${avgTime}ms`,
                        maxTime: `${avgTime + 15}ms`,
                        ip: getRandomIp()
                    },
                    {
                        location: 'Germany',
                        packetsSent: 4,
                        packetsReceived: 4,
                        packetLoss: '0%',
                        minTime: `${avgTime + 30}ms`,
                        avgTime: `${avgTime + 40}ms`,
                        maxTime: `${avgTime + 60}ms`,
                        ip: getRandomIp()
                    }
                ]

            case 'tcp':
                return [
                    {
                        location: 'Toronto, CA',
                        port: port || 443,
                        status: 'Open',
                        responseTime: `${Math.floor(Math.random() * 50) + 10}ms`,
                        protocol: 'TCP',
                        ip: getRandomIp()
                    },
                    {
                        location: 'Japan',
                        port: port || 443,
                        status: 'Open',
                        responseTime: `${Math.floor(Math.random() * 100) + 80}ms`,
                        protocol: 'TCP',
                        ip: getRandomIp()
                    }
                ]

            case 'udp':
                return [
                    {
                        location: 'Toronto, CA',
                        port: port || 53,
                        status: Math.random() > 0.5 ? 'Open' : 'Filtered',
                        responseTime: 'N/A',
                        protocol: 'UDP',
                        ip: getRandomIp()
                    }
                ]

            case 'dns':
                return {
                    A: [getRandomIp(), getRandomIp()],
                    AAAA: ['2606:4700::6810:8401', '2606:4700::6810:8501'],
                    MX: ['10 mx1.example.com', '20 mx2.example.com'],
                    NS: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
                    TXT: ['v=spf1 include:_spf.google.com ~all', 'google-site-verification=abc123'],
                    CNAME: []
                }

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Network Diagnostics Tool
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Target (URL/IP)</label>
                                <Input
                                    placeholder="example.com or 192.168.1.1"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                />
                            </div>

                            <div className="w-full sm:w-32 space-y-2">
                                <label className="text-sm font-medium">Port (optional)</label>
                                <Input
                                    placeholder="80, 443..."
                                    value={port}
                                    onChange={(e) => setPort(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleCheck}
                            disabled={isLoading || !target.trim()}
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? 'Checking...' : 'Run Diagnostics'}
                        </Button>
                    </CardContent>
                </Card>

                {results && (
                    <ResultsTabs
                        key={resultsKey} // ререндер норм
                        results={results}
                        onFetchTabData={handleFetchTabData}
                    />
                )}
            </div>
        </div>
    )
}

export default NetworkChecker
