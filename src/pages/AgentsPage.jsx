import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import AgentsTable from '../components/AgentsTable'
import CreateAgentModal from '../components/modals/CreateAgentModal'

const AgentsPage = () => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [agents, setAgents] = useState([ // todo: mock данные, заменить на api
        {
            id: 1,
            name: 'Primary Server',
            ip: '192.168.1.100',
            port: '8080',
            status: 'active',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Backup Node',
            ip: '192.168.1.101',
            port: '8081',
            status: 'inactive',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Monitoring Agent',
            ip: '192.168.1.102',
            port: '8082',
            status: 'suspended',
            createdAt: new Date().toISOString()
        }
    ])

    const handleAgentUpdate = (agentId, updates) => {
        setAgents(prev => prev.map(agent =>
            agent.id === agentId ? { ...agent, ...updates } : agent
        ))
    }

    const handleAgentDelete = (agentId) => {
        setAgents(prev => prev.filter(agent => agent.id !== agentId))
    }

    const handleAgentCreate = (newAgent) => {
        const agent = {
            ...newAgent,
            id: Date.now(),
            status: 'inactive',
            createdAt: new Date().toISOString()
        }
        setAgents(prev => [...prev, agent])
        setShowCreateModal(false)
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-[45rem]">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Agents Management</h1>
                <Button onClick={() => setShowCreateModal(true)}>
                    Add New Agent
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Agents</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <AgentsTable
                        agents={agents}
                        onUpdate={handleAgentUpdate}
                        onDelete={handleAgentDelete}
                    />
                </CardContent>
            </Card>

            {showCreateModal && (
                <CreateAgentModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleAgentCreate}
                />
            )}
        </div>
    )
}

export default AgentsPage
