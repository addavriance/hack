import React, {useState} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from '../components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../components/ui/tabs'
import {Book, Code, Server, Download, Key, Users, Globe} from 'lucide-react'

const DocumentationPage = () => {
    const [activeTab, setActiveTab] = useState('getting-started')

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Book className="h-8 w-8 text-primary"/>
                        <h1 className="text-4xl font-bold">Lvalue Documentation</h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Complete guide to using Lvalue network diagnostics platform, API, and agent system.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
                        <TabsTrigger value="getting-started" className="flex items-center space-x-2">
                            <Users className="h-4 w-4"/>
                            <span className="hidden sm:inline">Getting Started</span>
                        </TabsTrigger>
                        <TabsTrigger value="agents" className="flex items-center space-x-2">
                            <Server className="h-4 w-4"/>
                            <span className="hidden sm:inline">Agents</span>
                        </TabsTrigger>
                        <TabsTrigger value="api" className="flex items-center space-x-2">
                            <Code className="h-4 w-4"/>
                            <span className="hidden sm:inline">API Reference</span>
                        </TabsTrigger>
                        <TabsTrigger value="authentication" className="flex items-center space-x-2">
                            <Key className="h-4 w-4"/>
                            <span className="hidden sm:inline">Auth</span>
                        </TabsTrigger>
                        <TabsTrigger value="checks" className="flex items-center space-x-2">
                            <Globe className="h-4 w-4"/>
                            <span className="hidden sm:inline">Checks</span>
                        </TabsTrigger>
                        <TabsTrigger value="examples" className="flex items-center space-x-2">
                            <Download className="h-4 w-4"/>
                            <span className="hidden sm:inline">Examples</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Getting Started */}
                    <TabsContent value="getting-started" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome to Lvalue</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>
                                    Lvalue is a comprehensive network diagnostics platform that allows you to
                                    monitor and test your network infrastructure from multiple locations worldwide.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <div className="text-center p-4 border rounded-lg">
                                        <Users className="h-8 w-8 text-primary mx-auto mb-2"/>
                                        <h3 className="font-semibold">1. Create Account</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Register for free to access all features
                                        </p>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <Server className="h-8 w-8 text-primary mx-auto mb-2"/>
                                        <h3 className="font-semibold">2. Deploy Agents</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Set up your own monitoring agents
                                        </p>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <Globe className="h-8 w-8 text-primary mx-auto mb-2"/>
                                        <h3 className="font-semibold">3. Run Diagnostics</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Test your network from multiple locations
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Agents */}
                    <TabsContent value="agents" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lvalue Agents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">What are Lvalue Agents?</h3>
                                    <p>
                                        Lvalue Agents are lightweight Docker containers that you can deploy in your
                                        own infrastructure to perform network checks from your private network.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Setting Up an Agent</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center mt-1 flex-shrink-0">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Go to Agents Page</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Navigate to the "Agents" section in the main menu (requires
                                                    authentication)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div
                                                className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center mt-1 flex-shrink-0">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Create New Agent</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Click the "Add New Agent" button and fill in the agent details:
                                                </p>
                                                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                                    <li>• <strong>Agent Name</strong>: Descriptive name for your agent
                                                    </li>
                                                    <li>• <strong>IP Address</strong>: Public IP of your agent server
                                                    </li>
                                                    <li>• <strong>Port</strong>: Port for agent communication (default:
                                                        8080)
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div
                                                className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center mt-1 flex-shrink-0">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Download Docker Compose</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    After creating the agent, download the Docker Compose file that's
                                                    pre-configured with your agent settings.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <div
                                                className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center mt-1 flex-shrink-0">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Deploy Agent</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    On your server, run: <code className="bg-muted px-1 rounded">docker-compose
                                                    up -d</code>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Docker Compose Example</h4>
                                    <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`version: '3.8'
services:
  lvalue-agent:
    image: lvalue/agent:latest
    container_name: my-lvalue-agent
    environment:
      - AGENT_NAME=My Production Agent
      - SERVER_HOST=api.lvalue.dev
      - AGENT_IP=192.168.1.100
      - AGENT_PORT=8080
      - LOGIN_SESSION_TOKEN=your_token_here
    ports:
      - "8080:8080"
    restart: unless-stopped`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* API Reference */}
                    <TabsContent value="api" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>API Reference</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Base URL</h3>
                                    <code className="bg-muted px-2 py-1 rounded text-sm">
                                        https://api.lvalue.dev
                                    </code>
                                </div>

                                <div className="space-y-4">
                                    <div className="border rounded-lg">
                                        <div className="bg-muted px-4 py-2 border-b">
                                            <span className="font-mono text-sm font-semibold">POST /register</span>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-sm text-muted-foreground mb-3">Create a new user account</p>
                                            <div className="space-y-2">
                                                <h4 className="font-medium">Request Body:</h4>
                                                <pre className="text-sm bg-muted p-2 rounded">
{`{
  "username": "string",
  "password": "string"
}`}
                                                </pre>
                                                <h4 className="font-medium">Response (201):</h4>
                                                <pre className="text-sm bg-muted p-2 rounded">{`null`}</pre>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg">
                                        <div className="bg-muted px-4 py-2 border-b">
                                            <span className="font-mono text-sm font-semibold">POST /login</span>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-sm text-muted-foreground mb-3">Authenticate and get session token</p>
                                            <div className="space-y-2">
                                                <h4 className="font-medium">Request Body:</h4>
                                                <pre className="text-sm bg-muted p-2 rounded">
{`{
  "username": "string",
  "password": "string"
}`}
                                                </pre>
                                                <h4 className="font-medium">Response (201):</h4>
                                                <pre className="text-sm bg-muted p-2 rounded">
{`{
  "login_session_uid": "uuid",
  "login_session_token": "string"
}`}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg">
                                        <div className="bg-muted px-4 py-2 border-b">
                                            <span className="font-mono text-sm font-semibold">POST /checks</span>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-sm text-muted-foreground mb-3">Create a new network
                                                check</p>
                                            <div className="space-y-2">
                                                <h4 className="font-medium">Headers:</h4>
                                                <pre
                                                    className="text-sm bg-muted p-2 rounded">{`X-Login-Session-Token: your_session_token`}</pre>
                                                <h4 className="font-medium">Request Body:</h4>
                                                <pre className="text-sm bg-muted p-2 rounded">
{`{
  "payload": {
    "type": "http",
    "url": "https://example.com"
  }
}`}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Authentication */}
                    <TabsContent value="authentication" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Authentication</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Session Tokens</h3>
                                    <p>
                                        Lvalue uses session-based authentication. After logging in, you receive
                                        a session token that must be included in all authenticated requests.
                                    </p>
                                </div>

                                <div className="bg-muted p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Using the Session Token</h4>
                                    <p className="text-sm mb-3">
                                        Include the token in the <code>X-Login-Session-Token</code> header:
                                    </p>
                                    <pre className="text-sm bg-background p-3 rounded">
{`fetch('https://api.lvalue.dev/checks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Login-Session-Token': 'your_session_token_here'
  },
  body: JSON.stringify({
    payload: {
      type: 'http',
      url: 'https://example.com'
    }
  })
})`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Network Checks */}
                    <TabsContent value="checks" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Network Checks</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">HTTP Check</h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Test HTTP/HTTPS endpoints for availability, performance, and security.
                                        </p>
                                        <pre className="text-xs bg-muted p-2 rounded">
{`{
  "type": "http",
  "url": "https://example.com"
}`}</pre>
                                    </div>

                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">DNS Check</h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Query DNS records (A, AAAA, MX, NS, TXT) for a domain.
                                        </p>
                                        <pre className="text-xs bg-muted p-2 rounded">
{`{
  "type": "dns",
  "domain": "example.com"
}`}</pre>
                                    </div>

                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">TCP/UDP Check</h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Test port availability and connectivity for TCP/UDP services.
                                        </p>
                                        <pre className="text-xs bg-muted p-2 rounded">
{`{
  "type": "tcp_and_udp",
  "ip": "192.168.1.1",
  "port": 443,
  "protocol": "tcp"
}`}</pre>
                                    </div>

                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">GeoIP Check</h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Get geographical information and ISP details for an IP address.
                                        </p>
                                        <pre className="text-xs bg-muted p-2 rounded">
{`{
  "type": "geoip",
  "ip": "8.8.8.8"
}`}</pre>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Examples */}
                    <TabsContent value="examples" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Code Examples</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">JavaScript/Node.js</h3>
                                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
{`const API_BASE = 'https://api.lvalue.dev';

// Login and get session token
async function login(username, password) {
  const response = await fetch(\`\${API_BASE}/login\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  const data = await response.json();
  return data.login_session_token;
}

// Create HTTP check
async function createHttpCheck(sessionToken, url) {
  const response = await fetch(\`\${API_BASE}/checks\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Login-Session-Token': sessionToken,
    },
    body: JSON.stringify({
      payload: {
        type: 'http',
        url: url,
      },
    }),
  });
  
  return await response.json();
}

// Usage example
const token = await login('your_username', 'your_password');
const check = await createHttpCheck(token, 'https://example.com');
console.log(check);`}
                                    </pre>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Python</h3>
                                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
{`import requests

API_BASE = "https://api.lvalue.dev"

def login(username, password):
    response = requests.post(
        f"{API_BASE}/login",
        json={"username": username, "password": password}
    )
    data = response.json()
    return data["login_session_token"]

def create_http_check(session_token, url):
    response = requests.post(
        f"{API_BASE}/checks",
        headers={
            "Content-Type": "application/json",
            "X-Login-Session-Token": session_token
        },
        json={
            "payload": {
                "type": "http",
                "url": url
            }
        }
    )
    return response.json()

# Usage example
token = login("your_username", "your_password")
check = create_http_check(token, "https://example.com")
print(check)`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default DocumentationPage
