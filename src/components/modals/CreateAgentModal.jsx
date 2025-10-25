import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Download } from 'lucide-react'

const CreateAgentModal = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        name: '',
        ip: '',
        port: '8080'
    })
    const [showDockerCompose, setShowDockerCompose] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        onCreate(formData)
        setShowDockerCompose(true)
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const downloadDockerCompose = () => {
        const dockerCompose = `version: '3.8'
services:
  network-agent:
    image: your-company/network-agent:latest
    container_name: ${formData.name.replace(/\s+/g, '-').toLowerCase()}
    environment:
      - AGENT_NAME=${formData.name}
      - SERVER_HOST=${window.location.hostname}
      - AGENT_IP=${formData.ip}
      - AGENT_PORT=${formData.port}
    ports:
      - "${formData.port}:${formData.port}"
    restart: unless-stopped`

        const blob = new Blob([dockerCompose], { type: 'text/yaml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `docker-compose-${formData.name.replace(/\s+/g, '-').toLowerCase()}.yml`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleClose = () => {
        onClose()
        setShowDockerCompose(false)
    }

    if (showDockerCompose) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Agent Created Successfully!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Download the Docker Compose file to deploy your agent:
                        </p>
                        <div className="flex space-x-3">
                            <Button onClick={downloadDockerCompose} className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Download Docker Compose
                            </Button>
                            <Button variant="outline" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create New Agent</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Agent Name</label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter agent name"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">IP Address</label>
                            <Input
                                name="ip"
                                value={formData.ip}
                                onChange={handleChange}
                                placeholder="192.168.1.100"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Port</label>
                            <Input
                                name="port"
                                value={formData.port}
                                onChange={handleChange}
                                placeholder="8080"
                                required
                            />
                        </div>

                        <div className="flex space-x-3">
                            <Button type="submit" className="flex-1">
                                Create Agent
                            </Button>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateAgentModal
