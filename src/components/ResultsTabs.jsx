import React, { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { RefreshCw } from 'lucide-react'
import InfoTab from './tabs/InfoTab'
import HttpTab from './tabs/HttpTab'
import PingTab from './tabs/PingTab'
import TcpTab from './tabs/TcpTab'
import UdpTab from './tabs/UdpTab'
import DnsTab from './tabs/DnsTab'
import TracerouteTab from "./tabs/TracerouteTab.jsx";

const ResultsTabs = ({ results, onFetchTabData }) => {
    const [activeTab, setActiveTab] = useState('info')
    const [loadingTabs, setLoadingTabs] = useState({})
    const [tabErrors, setTabErrors] = useState({})
    const [tabData, setTabData] = useState({
        info: results.info,
        http: results.http,
        ping: results.ping,
        tcp: results.tcp,
        udp: results.udp,
        dns: results.dns,
        traceroute: results.traceroute
    })

    // сброс при новом запросе
    useEffect(() => {
        setTabData({
            info: results.info,
            http: results.http,
            ping: results.ping,
            tcp: results.tcp,
            udp: results.udp,
            dns: results.dns,
            traceroute: results.traceroute
        })
        setLoadingTabs({})
        setTabErrors({})
        setActiveTab('info') // возвращаем на первую вкладку
        
        // Автоматически загружаем данные для вкладки info при первом отображении
        if (results && results.checkUids && results.checkUids.length > 0) {
            handleTabChange('info')
        }
    }, [results])

    const tabs = [
        { id: 'info', label: 'Basic Info', component: InfoTab },
        { id: 'http', label: 'HTTP(S)', component: HttpTab },
        { id: 'ping', label: 'Ping', component: PingTab },
        { id: 'traceroute', label: 'Traceroute', component: TracerouteTab },
        { id: 'tcp', label: 'TCP', component: TcpTab },
        { id: 'udp', label: 'UDP', component: UdpTab },
        { id: 'dns', label: 'DNS', component: DnsTab }
    ]

    const handleTabChange = async (tabId) => {
        setActiveTab(tabId)

        // Если данные уже загружены, не делаем повторный запрос
        if (tabData[tabId] !== null) return

        setLoadingTabs(prev => ({ ...prev, [tabId]: true }))
        setTabErrors(prev => ({ ...prev, [tabId]: null }))

        try {
            const data = await onFetchTabData(tabId)
            setTabData(prev => ({ ...prev, [tabId]: data }))
        } catch (error) {
            setTabErrors(prev => ({
                ...prev,
                [tabId]: error.message || 'Failed to fetch data'
            }))
        } finally {
            setLoadingTabs(prev => ({ ...prev, [tabId]: false }))
        }
    }

    const handleRetry = (tabId) => {
        setTabData(prev => ({ ...prev, [tabId]: null }))
        setTabErrors(prev => ({ ...prev, [tabId]: null }))
        handleTabChange(tabId)
    }

    const handleRefresh = async (tabId) => {
        setLoadingTabs(prev => ({ ...prev, [tabId]: true }))
        setTabErrors(prev => ({ ...prev, [tabId]: null }))

        try {
            const data = await onFetchTabData(tabId)
            setTabData(prev => ({ ...prev, [tabId]: data }))
        } catch (error) {
            setTabErrors(prev => ({
                ...prev,
                [tabId]: error.message || 'Failed to fetch data'
            }))
        } finally {
            setLoadingTabs(prev => ({ ...prev, [tabId]: false }))
        }
    }

    const activeTabData = tabs.find(tab => tab.id === activeTab)

    return (
        <Card>
            <CardContent className="p-0">
                {/* Tab Headers */}
                <div className="flex border-b overflow-x-auto">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`flex items-center border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <button
                                onClick={() => handleTabChange(tab.id)}
                                className="flex items-center px-6 py-3 text-sm font-medium whitespace-nowrap"
                            >
                                {tab.label}
                                {loadingTabs[tab.id] && (
                                    <span className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                )}
                                {tabErrors[tab.id] && (
                                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </button>
                            
                            {/* Refresh button - only show if tab has data or is active */}
                            {(tabData[tab.id] !== null || activeTab === tab.id) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRefresh(tab.id)
                                    }}
                                    disabled={loadingTabs[tab.id]}
                                    className="p-1 h-6 w-6 mr-2 hover:bg-muted"
                                >
                                    <RefreshCw className={`h-3 w-3 ${loadingTabs[tab.id] ? 'animate-spin' : ''}`} />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTabData && (
                        <div className="space-y-4">
                            {/* Tab Header with Refresh Button */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{activeTabData.label}</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRefresh(activeTabData.id)}
                                    disabled={loadingTabs[activeTabData.id]}
                                    className="flex items-center space-x-2"
                                >
                                    <RefreshCw className={`h-4 w-4 ${loadingTabs[activeTabData.id] ? 'animate-spin' : ''}`} />
                                    <span>Refresh</span>
                                </Button>
                            </div>
                            
                            <activeTabData.component
                                data={tabData[activeTabData.id]}
                                loading={loadingTabs[activeTabData.id]}
                                error={tabErrors[activeTabData.id]}
                                onRetry={() => handleRetry(activeTabData.id)}
                                target={results.target}
                                port={results.port}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ResultsTabs
