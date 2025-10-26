const API_BASE_URL = 'https://api.lvalue.dev';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.uid = localStorage.getItem('uid');
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
        localStorage.removeItem('uid');
    }

    setUID(uid) {
        this.uid = uid;
        localStorage.setItem('uid', uid);
    }

    getUID() {
        return this.uid;
    }

    clearUID() {
        this.uid = null;
        localStorage.removeItem('uid');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token && endpoint !== '/register' && endpoint !== '/login') {
            headers['X-Login-Session-Token'] = this.token;
            headers['X-Login-Session-Uid'] = this.uid;
        }

        const config = {
            headers,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                if (response.status === 422) {
                    const errorData = await response.json();
                    const formattedErrors = this.formatValidationError(errorData);
                    throw formattedErrors;
                } else if (response.status === 401) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Unknown error');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    formatValidationError(errorData) {
        if (errorData.detail && Array.isArray(errorData.detail)) {
            const errorMessages = errorData.detail.map(err => {
                const field = err.loc[err.loc.length - 1];

                let message = err.msg;

                if (message.startsWith('Input ')) {
                    message = message.substring(6);
                    message = message.charAt(0).toLowerCase() + message.slice(1);
                }

                switch (err.type) {
                    case 'ip_v4_address':
                        message = 'Must be a valid IPv4 address';
                        break;
                    case 'int_parsing':
                        message = 'Must be a valid integer';
                        break;
                    case 'string_type':
                        message = 'Must be a string';
                        break;
                    case 'missing':
                        message = 'This field is required';
                        break;
                }

                return {
                    field: field,
                    message: message,
                    originalError: err
                };
            });

            return errorMessages;
        }

        if (typeof errorData.detail === 'string') {
            return [{ field: 'general', message: errorData.detail }];
        }

        return [{ field: 'general', message: 'Validation error' }];
    }

    async register(username, password) {
        return this.request('/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    async login(username, password) {
        const response = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        if (response && response.login_session_token && response.login_session_uid) {
            this.setToken(response.login_session_token);
            this.setUID(response.login_session_uid);
            return response;
        }
        throw new Error('No login session token received');
    }

    async createCheck(payload) {
        return this.request('/checks', {
            method: 'POST',
            body: JSON.stringify({ payload }),
        });
    }

    async createIPURLCheck(url = null, type = "") {
        const payload = {
            type: type,
            url: url
        };

        return this.createCheck(payload);
    }

    async createDomainCheck(domain = null, type = "") {
        const payload = {
            type: type,
            domain: domain,
        };

        return this.createCheck(payload);
    }

    async getCheck(checkUid) {
        return this.request(`/checks/${checkUid}`);
    }

    async checksPolling(checkUid, callback) {
        let retries = 0;
        const maxRetries = 10;

        const pollInterval = setInterval(() => {
            const checkData = this.getCheck(checkUid);

            callback(checkData);

            retries++

            if (retries > maxRetries) {
                clearInterval(pollInterval);
            }

        }, 800);
    }

    async getAgents() {
        return this.request('/agents');
    }

    async createAgent(agentData) {
        return this.request('/agents', {
            method: 'POST',
            body: JSON.stringify(agentData),
        });
    }

    async updateAgent(agentId, agentData) {
        return this.request(`/agents/${agentId}`, {
            method: 'PUT',
            body: JSON.stringify(agentData),
        });
    }

    async deleteAgent(agentId) {
        return this.request(`/agents/${agentId}`, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService();
