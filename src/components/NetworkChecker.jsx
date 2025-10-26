import React, {useState, useRef} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from './ui/card'
import {Button} from './ui/button'
import {Input} from './ui/input'
import ResultsTabs from './ResultsTabs'
import {Scan, ArrowDown} from 'lucide-react'
import {apiService} from "../services/api.js";

const NetworkChecker = () => {
    const [target, setTarget] = useState('')
    const [port, setPort] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [resultsKey, setResultsKey] = useState(0)
    const [targetError, setTargetError] = useState('')
    const portInputRef = useRef(null)

    const validateInput = (input) => {
        const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
        const ipPattern = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
        const domainPattern = /^([\w\d-]+\.)+[\w]{2,}$/i;

        if (urlPattern.test(input)) {
            if (/^https?:\/\//i.test(input)) {
                return 'url';
            } else if (ipPattern.test(input)) {
                return 'ip';
            } else if (domainPattern.test(input)) {
                return 'domain';
            }
        }
        return 'string';
    }


    const handleTargetChange = (e) => {
        const value = e.target.value
        setTarget(value)
        setTargetError('')
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

        const targetType = validateInput(target);

        if (targetType === 'string') {
            setTargetError('Please enter a valid URL or IP address')
            return
        }

        if (port && (parseInt(port) < 1 || parseInt(port) > 65535)) {
            setTargetError('Port must be between 1 and 65535')
            return
        }

        setIsLoading(true)

        setResults(null)
        setResultsKey(prev => prev + 1);

        const checkData = await apiService.createIPURLCheck(
            targetType === 'ip' ? [target] : null,
            targetType === 'url' || targetType === 'domain' ? target : null, 'geoip');

        console.log(checkData);

        setTimeout(() => {
            setResults({
                target,
                port: port || 'N/A',
                timestamp: new Date().toISOString(),
                info: null,
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

    const handleFetchTabData = async (tabId) => {
        if (!results) return null;

        // switch (tabId) {
        //     case "http":
        //         ...
        //     case "ping":
        //         ...
        //     case "traceroute":
        //         ...
        //     case "tcp":
        //         ...
        //     case "udp":
        //         ...
        //     case "dns":
        //         ...

        // }

        // return await fetchMockTabData(tabId, results.target, results.port)
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
                <div className="max-w-lg mx-auto space-y-6">
                    <div className="relative">
                        <Scan className="h-24 w-24 text-muted-foreground/40 mx-auto mb-4 scan-svg"/>
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
