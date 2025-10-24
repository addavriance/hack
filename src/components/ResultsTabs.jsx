import React, { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import InfoTab from './tabs/InfoTab'
import HttpTab from './tabs/HttpTab'
import PingTab from './tabs/PingTab'
import TcpTab from './tabs/TcpTab'
import UdpTab from './tabs/UdpTab'
import DnsTab from './tabs/DnsTab'

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
        dns: results.dns
    })

    // сброс при новом запросе
    useEffect(() => {
        setTabData({
            info: results.info,
            http: results.http,
            ping: results.ping,
            tcp: results.tcp,
            udp: results.udp,
            dns: results.dns
        })
        setLoadingTabs({})
        setTabErrors({})
        setActiveTab('info') // возвращаем на первую вкладку
    }, [results])

    const tabs = [
        { id: 'info', label: 'Basic Info', component: InfoTab },
        { id: 'http', label: 'HTTP(S)', component: HttpTab },
        { id: 'ping', label: 'Ping', component: PingTab },
        { id: 'tcp', label: 'TCP', component: TcpTab },
        { id: 'udp', label: 'UDP', component: UdpTab },
        { id: 'dns', label: 'DNS', component: DnsTab }
    ]

    const handleTabChange = async (tabId) => {
        setActiveTab(tabId)

        if (tabData[tabId] !== null || tabId === 'info') return

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

    const activeTabData = tabs.find(tab => tab.id === activeTab)

    return (
        <Card>
            <CardContent className="p-0">
                {/* Tab Headers */}
                <div className="flex border-b overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tab.label}
                            {loadingTabs[tab.id] && (
                                <span className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                            )}
                            {tabErrors[tab.id] && (
                                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTabData && (
                        <activeTabData.component
                            data={tabData[activeTabData.id]}
                            loading={loadingTabs[activeTabData.id]}
                            error={tabErrors[activeTabData.id]}
                            onRetry={() => handleRetry(activeTabData.id)}
                            target={results.target}
                            port={results.port}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ResultsTabs
