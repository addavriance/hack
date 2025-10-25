import React, {useState, useRef} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from './ui/card'
import {Button} from './ui/button'
import {Input} from './ui/input'
import ResultsTabs from './ResultsTabs'
import {Scan, ArrowDown} from 'lucide-react'

const NetworkChecker = () => {
    const [target, setTarget] = useState('')
    const [port, setPort] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [resultsKey, setResultsKey] = useState(0)
    const [targetError, setTargetError] = useState('')
    const portInputRef = useRef(null)

    const isValidTarget = (value) => {
        if (!value) return false

        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
        if (ipRegex.test(value)) {
            const parts = value.split('.')
            return parts.every(part => {
                const num = parseInt(part, 10)
                return num >= 0 && num <= 255
            })
        }

        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        return domainRegex.test(value)
    }

    const handleTargetChange = (e) => {
        const value = e.target.value
        setTarget(value)
        setTargetError('')

        if (value.includes(':')) {
            const [newTarget, newPort] = value.split(':')

            if (newTarget && newPort) {
                setTarget(newTarget)
                setPort(newPort.replace(/\D/g, ''))
                setTimeout(() => {
                    portInputRef.current?.focus()
                }, 0)
            }
        }
    }

    const handleTargetKeyDown = (e) => {
        if (e.key === ':') {
            e.preventDefault()
            const cursorPosition = e.target.selectionStart
            const textBeforeCursor = target.slice(0, cursorPosition)
            const textAfterCursor = target.slice(cursorPosition)

            setTarget(textBeforeCursor)

            if (textAfterCursor) {
                setPort(textAfterCursor.replace(/\D/g, ''))
            }

            setTimeout(() => {
                portInputRef.current?.focus()
            }, 0)
        }
    }

    const handlePortChange = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setPort(value)
    }

    const handleCheck = async () => {
        if (!target.trim()) {
            setTargetError('Please enter a target URL or IP address')
            return
        }

        if (!isValidTarget(target)) {
            setTargetError('Please enter a valid URL or IP address')
            return
        }

        if (port && (parseInt(port) < 1 || parseInt(port) > 65535)) {
            setTargetError('Port must be between 1 and 65535')
            return
        }

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
                dns: null,
                traceroute: null,
            })
            setIsLoading(false)
        }, 1000)
    }

    const generateBasicInfo = (target) => {
        const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(target)

        if (isIP) {
            return {
                ip: target,
                hostname: 'N/A',
                ipRange: `${target.split('.').slice(0, 3).join('.')}.0/24`,
                asn: 'AS15169',
                isp: 'Google LLC',
                country: 'United States (US)',
                region: 'California',
                city: 'Mountain View',
                timezone: 'America/Los_Angeles, GMT-0700',
                localTime: new Date().toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                }),
                postalCode: '94043',
                coordinates: {
                    lat: 37.3861,
                    lng: -122.0839
                }
            }
        } else {
            return {
                ip: '142.251.42.78',
                hostname: target,
                ipRange: '142.251.42.0-142.251.42.255 CIDR',
                asn: 'AS15169',
                isp: 'Google LLC',
                country: 'United States (US)',
                region: 'California',
                city: 'Mountain View',
                timezone: 'America/Los_Angeles, GMT-0700',
                localTime: new Date().toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                }),
                postalCode: '94043',
                coordinates: {
                    lat: 37.3861,
                    lng: -122.0839
                }
            }
        }
    }

    const handleFetchTabData = async (tabId) => {
        if (!results) return null

        return await fetchMockTabData(tabId, results.target, results.port)
    }

    const fetchMockTabData = async (tabId, target, port) => {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

        const getRandomIp = () => {
            const base = target.includes('.') ? target.split('.').slice(0, 3).join('.') + '.' : '142.251.42.'
            const fourth = Math.floor(Math.random() * 255)
            return `${base}${fourth}`
        }

        switch (tabId) {
            case 'http':
                return [
                    {
                        location: 'California, US',
                        result: 'Success',
                        code: 200,
                        responseTime: `${Math.floor(Math.random() * 200) + 50}ms`,
                        ip: getRandomIp(),
                        ssl: true,
                        server: 'nginx/1.18.0',
                        headers: {
                            'server': 'nginx/1.18.0',
                            'content-type': 'text/html; charset=utf-8',
                            'content-length': '1256',
                            'connection': 'keep-alive',
                            'cache-control': 'public, max-age=3600',
                            'etag': 'W/"4e-1234567890"',
                            'date': new Date().toUTCString(),
                            'x-powered-by': 'Express',
                            'x-frame-options': 'SAMEORIGIN',
                            'x-content-type-options': 'nosniff'
                        }
                    },
                    {
                        location: 'New York, US',
                        result: 'Success',
                        code: 200,
                        responseTime: `${Math.floor(Math.random() * 100) + 30}ms`,
                        ip: getRandomIp(),
                        ssl: true,
                        server: 'cloudflare',
                        headers: {
                            'server': 'cloudflare',
                            'content-type': 'text/html; charset=utf-8',
                            'cf-ray': '7a8b9c0d1e2f3g4h',
                            'cf-cache-status': 'HIT',
                            'content-length': '1892',
                            'connection': 'keep-alive',
                            'cache-control': 'max-age=14400',
                            'expires': new Date(Date.now() + 14400000).toUTCString(),
                            'date': new Date().toUTCString(),
                            'x-frame-options': 'SAMEORIGIN',
                            'strict-transport-security': 'max-age=31536000; includeSubDomains'
                        }
                    },
                    {
                        location: 'London, UK',
                        result: 'Success',
                        code: 200,
                        responseTime: `${Math.floor(Math.random() * 150) + 80}ms`,
                        ip: getRandomIp(),
                        ssl: true,
                        server: 'Apache/2.4.41',
                        headers: {
                            'server': 'Apache/2.4.41 (Ubuntu)',
                            'content-type': 'text/html; charset=UTF-8',
                            'content-length': '2156',
                            'connection': 'keep-alive',
                            'cache-control': 'no-cache, private',
                            'date': new Date().toUTCString(),
                            'x-ua-compatible': 'IE=edge',
                            'x-powered-by': 'PHP/8.1.0',
                            'x-content-type-options': 'nosniff',
                            'x-xss-protection': '1; mode=block'
                        }
                    }
                ]
            case 'ping':
                const avgTime = Math.floor(Math.random() * 100) + 20
                return [
                    {
                        location: 'California, US',
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
            case 'traceroute':
                const baseIP = target.includes('.') ? target.split('.').slice(0, 3).join('.') + '.' : '142.251.42.'
                return [
                    {
                        location: 'California, US',
                        target: target,
                        totalTime: `${Math.floor(Math.random() * 200) + 100}ms`,
                        hops: [
                            {
                                ip: '192.168.1.1',
                                hostname: 'router.local',
                                country: 'Local',
                                time: '1ms',
                                asn: null,
                                isp: 'Local Network'
                            },
                            {
                                ip: '10.0.0.1',
                                hostname: 'gateway.isp.com',
                                country: 'United States',
                                time: '15ms',
                                asn: 'AS12345',
                                isp: 'ISP Network'
                            },
                            {
                                ip: '203.0.113.1',
                                hostname: 'core1.lax.isp.net',
                                country: 'United States',
                                time: '25ms',
                                asn: 'AS12345',
                                isp: 'ISP Backbone'
                            },
                            {
                                ip: '198.51.100.1',
                                hostname: 'peer1.sjc.net',
                                country: 'United States',
                                time: '35ms',
                                asn: 'AS64512',
                                isp: 'Tier 1 Provider'
                            },
                            {
                                ip: '203.0.113.50',
                                hostname: 'ix-la.us.ix.net',
                                country: 'United States',
                                time: '45ms',
                                asn: 'AS64513',
                                isp: 'Internet Exchange'
                            },
                            {
                                ip: `${baseIP}${Math.floor(Math.random() * 255)}`,
                                hostname: target.includes('.') ? target : `${target}.google.com`,
                                country: 'United States',
                                time: `${Math.floor(Math.random() * 30) + 50}ms`,
                                asn: 'AS15169',
                                isp: 'Google LLC',
                                packetLoss: '0%'
                            }
                        ]
                    },
                    {
                        location: 'Germany',
                        target: target,
                        totalTime: `${Math.floor(Math.random() * 300) + 200}ms`,
                        hops: [
                            {
                                ip: '192.168.1.1',
                                hostname: 'router.local',
                                country: 'Local',
                                time: '1ms',
                                asn: null,
                                isp: 'Local Network'
                            },
                            {
                                ip: '10.0.0.1',
                                hostname: 'gateway.isp.de',
                                country: 'Germany',
                                time: '10ms',
                                asn: 'AS54321',
                                isp: 'German ISP'
                            },
                            {
                                ip: '193.110.1.1',
                                hostname: 'core1.fra.de.net',
                                country: 'Germany',
                                time: '25ms',
                                asn: 'AS54321',
                                isp: 'German Backbone'
                            },
                            {
                                ip: '212.1.2.3',
                                hostname: 'transatlantic.cogent.net',
                                country: 'Germany',
                                time: '85ms',
                                asn: 'AS174',
                                isp: 'Cogent Communications'
                            },
                            {
                                ip: '2001:db8::1',
                                hostname: 'us-gw.ix.net',
                                country: 'United States',
                                time: '120ms',
                                asn: 'AS64514',
                                isp: 'Transit Provider'
                            },
                            {
                                ip: `${baseIP}${Math.floor(Math.random() * 255)}`,
                                hostname: target.includes('.') ? target : `${target}.google.com`,
                                country: 'United States',
                                time: `${Math.floor(Math.random() * 50) + 150}ms`,
                                asn: 'AS15169',
                                isp: 'Google LLC',
                                packetLoss: '0%'
                            }
                        ]
                    }
                ]
            case 'tcp':
                return [
                    {
                        location: 'California, US',
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
                        location: 'California, US',
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
                    AAAA: ['2607:f8b0:4004:815::200e'],
                    MX: ['10 smtp.google.com'],
                    NS: ['ns1.google.com', 'ns2.google.com'],
                    TXT: ['v=spf1 include:_spf.google.com ~all', 'google-site-verification=abc123'],
                    CNAME: []
                }

            default:
                return null
        }
    }

    const handleTargetKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCheck()
        }
    }

    const handlePortKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCheck()
        }
    }

    const EmptyResultsPlaceholder = () => (
        <Card className="mt-4 mb-10 max-w-[70rem] mx-auto">
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="relative">
                        <Scan className="h-24 w-24 text-muted-foreground/40 mx-auto mb-4"/>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-16 h-16 border-2 border-muted-foreground/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-2xl font-semibold text-foreground">
                            Ready to Diagnose
                        </h3>
                        <p className="text-muted-foreground text-lg">
                            Enter a website URL or IP address above to start network diagnostics
                        </p>
                        <p className="text-sm text-muted-foreground/70">
                            Comprehensive results including HTTP checks, ping tests, port scanning,
                            DNS records, and geographical data will appear here
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )

    return (
        <div className="bg-background">
            <div className="max-w-6xl mx-auto">
                <div className="p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                Network Diagnostics Tool
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium">Target (URL or IP)</label>
                                    <Input
                                        placeholder="example.com or 192.168.1.1"
                                        value={target}
                                        onChange={handleTargetChange}
                                        onKeyDown={handleTargetKeyDown}
                                        onKeyPress={handleTargetKeyPress}
                                        className={targetError ? 'border-destructive' : ''}
                                    />
                                    {targetError && (
                                        <p className="text-sm text-destructive">{targetError}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Tip: Type <kbd className="px-1 py-0.5 bg-muted rounded text-xs">:</kbd> to
                                        quickly jump to port field
                                    </p>
                                </div>

                                <div className="w-full sm:w-32 space-y-2">
                                    <label className="text-sm font-medium">Port (optional)</label>
                                    <Input
                                        ref={portInputRef}
                                        placeholder="80, 443..."
                                        value={port}
                                        onChange={handlePortChange}
                                        onKeyPress={handlePortKeyPress}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Range: 1-65535
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheck}
                                disabled={isLoading || !target.trim()}
                                className="w-full sm:w-auto"
                            >
                                {isLoading ? (
                                    <>
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Checking...
                                    </>
                                ) : (
                                    'Run Diagnostics'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Результаты или плейсхолдер */}
                {results ? (
                    <div className="p-4">
                        <ResultsTabs
                            key={resultsKey}
                            results={results}
                            onFetchTabData={handleFetchTabData}
                        />
                    </div>
                ) : (
                    <EmptyResultsPlaceholder/>
                )}
            </div>
        </div>
    )
}

export default NetworkChecker
