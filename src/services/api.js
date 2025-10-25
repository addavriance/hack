const API_BASE_URL = 'https://api.lvalue.dev';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    getToken() {
        return this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token && endpoint !== '/register' && endpoint !== '/login') {
            headers['X-Login-Session-Token'] = this.token;
        }

        const config = {
            headers,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (endpoint === '/register') {
                if (response.status === 201) {
                    return { success: true };
                } else {
                    throw new Error(`Registration failed with status: ${response.status}`);
                }
            }

            const data = await response.json();

            if (!response.ok) {
                const details = data && data.detail || `HTTP error! status: ${response.status}`
                throw new Error(details);
            }

            if (endpoint === '/login') {
                if (data && data.login_session_token) {
                    this.setToken(data.login_session_token);
                    return data;
                } else {
                    throw new Error('Invalid login response');
                }
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async register(username, password) {
        return this.request('/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    async login(username, password) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    // agents methods (будут работать с X-Login-Session-Token), но пока фейк роуты
    // todo: обновить роутинг
    async getAgents() {
        return this.request('/agents');
    }

    async createAgent(agentData) {
        return this.request('/agents', {
            method: 'POST',
            body: JSON.stringify(agentData),
        });
    }

    async updateAgent(agentId, updates) {
        return this.request(`/agents/${agentId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteAgent(agentId) {
        return this.request(`/agents/${agentId}`, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService();
