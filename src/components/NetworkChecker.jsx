import React, {useState, useRef} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from './ui/card'
import {Button} from './ui/button'
import {Input} from './ui/input'
import ResultsTabs from './ResultsTabs'
import {Scan, ArrowDown, RefreshCw} from 'lucide-react'
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

    const normalizeInput = (input) => {
        const trimmedInput = input.trim();
        
        // Если это IP адрес, возвращаем как есть
        const ipPattern = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
        if (ipPattern.test(trimmedInput)) {
            return trimmedInput;
        }
        
        // Если это домен без протокола, добавляем https://
        const domainPattern = /^([\w\d-]+\.)+[\w]{2,}$/i;
        if (domainPattern.test(trimmedInput)) {
            return `https://${trimmedInput}`;
        }
        
        // Если уже есть протокол, возвращаем как есть
        if (/^https?:\/\//i.test(trimmedInput)) {
            return trimmedInput;
        }
        
        // Для остальных случаев возвращаем как есть
        return trimmedInput;
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

        // Нормализуем ввод (добавляем https:// если нужно)
        const normalizedTarget = normalizeInput(target);
        const targetType = validateInput(normalizedTarget);

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

        try {
            // Создаем комплексную проверку с нормализованным target
            const checkResults = await apiService.createComprehensiveCheck(normalizedTarget, port);
            
            console.log('Check results:', checkResults);

            // Инициализируем результаты с базовой информацией
            setResults({
                target: normalizedTarget, // Используем нормализованный target
                originalTarget: target, // Сохраняем оригинальный ввод пользователя
                port: port || 'N/A',
                timestamp: new Date().toISOString(),
                checkUids: checkResults.map(result => result.uid), // Сохраняем UID проверок
                info: null,
                http: null,
                ping: null,
                tcp: null,
                udp: null,
                dns: null,
                traceroute: null,
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Error creating checks:', error);
            setTargetError('Failed to create checks. Please try again.');
            setIsLoading(false);
        }
    }

    const handleFetchTabData = async (tabId) => {
        if (!results || !results.checkUids) {
            console.log('No results or checkUids available');
            return null;
        }

        console.log(`Fetching data for tab: ${tabId}`, results.checkUids);

        try {
            // Получаем данные для конкретной вкладки
            let checkUid = null;
            let checkType = null;

            // Определяем какой UID использовать для каждой вкладки
            switch (tabId) {
                case "info":
                    // Для info используем GeoIP данные
                    checkUid = results.checkUids.find((uid, index) => {
                        // Предполагаем, что GeoIP это 4-й элемент (индекс 3)
                        return index === 3;
                    });
                    checkType = "geoip";
                    console.log(`Info tab - using checkUid: ${checkUid}, type: ${checkType}`);
                    break;
                case "http":
                    // Для HTTP используем HTTP данные
                    checkUid = results.checkUids.find((uid, index) => {
                        // Предполагаем, что HTTP это 2-й элемент (индекс 1)
                        return index === 1;
                    });
                    checkType = "http";
                    break;
                case "ping":
                    // Для ping используем ping данные
                    checkUid = results.checkUids.find((uid, index) => {
                        // Предполагаем, что ping это 3-й элемент (индекс 2)
                        return index === 2;
                    });
                    checkType = "ping";
                    break;
                case "traceroute":
                    // Для traceroute используем traceroute данные
                    checkUid = results.checkUids.find((uid, index) => {
                        // Предполагаем, что traceroute это 5-й элемент (индекс 4)
                        return index === 4;
                    });
                    checkType = "traceroute";
                    break;
                case "tcp":
                    // Для TCP используем tcp_and_udp данные
                    // TCP проверка создается только если указан порт
                    if (results.port && results.port !== 'N/A') {
                        // TCP проверка - предпоследний элемент (индекс length-2)
                        checkUid = results.checkUids[results.checkUids.length - 2];
                    } else {
                        // Если порт не указан, TCP проверка не создается
                        console.log('No port specified, TCP check not available');
                        return null;
                    }
                    checkType = "tcp_and_udp";
                    break;
                case "udp":
                    // Для UDP используем tcp_and_udp данные с протоколом UDP
                    // UDP проверка создается только если указан порт
                    if (results.port && results.port !== 'N/A') {
                        // UDP проверка - последний элемент (индекс length-1)
                        checkUid = results.checkUids[results.checkUids.length - 1];
                    } else {
                        // Если порт не указан, UDP проверка не создается
                        console.log('No port specified, UDP check not available');
                        return null;
                    }
                    checkType = "tcp_and_udp";
                    break;
                case "dns":
                    // Для DNS используем DNS данные
                    checkUid = results.checkUids.find((uid, index) => {
                        // Предполагаем, что DNS это 1-й элемент (индекс 0)
                        return index === 0;
                    });
                    checkType = "dns";
                    break;
                default:
                    return null;
            }

            if (!checkUid) {
                console.warn(`No check UID found for tab: ${tabId}`);
                return null;
            }

            // Получаем данные проверки
            const checkData = await apiService.getCheck(checkUid);
            
            // Обрабатываем данные в зависимости от типа
            return processCheckData(checkData, checkType, tabId);
        } catch (error) {
            console.error(`Error fetching data for tab ${tabId}:`, error);
            throw error;
        }
    }

    // Функция для обработки данных проверки
    const processCheckData = (checkData, checkType, tabId) => {
        console.log(`Processing check data for ${tabId}:`, checkData);
        
        if (!checkData || !checkData.tasks || checkData.tasks.length === 0) {
            console.log(`No tasks found in check data for ${tabId}`);
            return null;
        }

        // Находим все задачи с нужным типом
        const tasks = checkData.tasks.filter(t => t.payload && t.payload.type === checkType);
        if (!tasks || tasks.length === 0) {
            console.log(`No tasks found for type ${checkType} in ${tabId}`);
            return null;
        }

        console.log(`Found ${tasks.length} tasks for ${tabId}:`, tasks);

        // Преобразуем данные в формат, ожидаемый компонентами вкладок
        switch (tabId) {
            case "info":
                return processGeoIPData(tasks);
            case "http":
                return processHTTPData(tasks);
            case "ping":
                return processPingData(tasks);
            case "traceroute":
                return processTracerouteData(tasks);
            case "tcp":
                return processTCPData(tasks);
            case "udp":
                return processUDPData(tasks);
            case "dns":
                return processDNSData(tasks);
            default:
                return tasks;
        }
    }

    // Обработчики для каждого типа данных
    const processGeoIPData = (tasks) => {
        if (!tasks || tasks.length === 0) return null;
        
        // Обрабатываем данные от всех агентов
        return tasks.map((task, index) => {
            const result = task.result;
            const agentName = task.bound_to_agent?.name || `Agent ${index + 1}`;
            
            if (!result || !result.items || result.items.length === 0) {
                return {
                    agent: agentName,
                    ip: 'N/A',
                    hostname: 'N/A',
                    ipRange: 'N/A',
                    asn: 'N/A',
                    isp: 'N/A',
                    country: 'N/A',
                    region: 'N/A',
                    city: 'N/A',
                    postalCode: 'N/A',
                    timezone: 'N/A',
                    localTime: new Date().toLocaleString(),
                    coordinates: { lat: 0, lng: 0 }
                };
            }
            
            const item = result.items[0]; // Берем первый элемент из items
            return {
                agent: agentName,
                ip: item.ip || 'N/A',
                hostname: item.hostname || 'N/A',
                ipRange: item.ipRange || 'N/A',
                asn: item.asn || 'N/A',
                isp: item.organization || 'N/A',
                country: item.country || 'N/A',
                region: item.region || 'N/A',
                city: item.city || 'N/A',
                postalCode: item.postal_code || 'N/A',
                timezone: item.time_zone || 'N/A',
                localTime: new Date().toLocaleString(),
                coordinates: {
                    lat: item.latitude || 0,
                    lng: item.longitude || 0
                }
            };
        });
    }

    const processHTTPData = (tasks) => {
        if (!tasks || tasks.length === 0) return null;
        
        return tasks.map((task, index) => {
            const result = task.result;
            const agentName = task.bound_to_agent?.name || `Agent ${index + 1}`;
            
            return {
                location: agentName,
                result: result?.error ? 'Failed' : 'Success',
                code: result?.status_code || 'N/A',
                responseTime: 'N/A',
                ip: 'N/A',
                ssl: result?.final_url && result.final_url.startsWith('https://'),
                headers: result?.headers || {},
                server: result?.headers?.server || 'N/A'
            };
        });
    }

    const processPingData = (tasks) => {
        if (!tasks || tasks.length === 0) return null;
        
        return tasks.map((task, index) => {
            const result = task.result;
            const agentName = task.bound_to_agent?.name || `Agent ${index + 1}`;
            
            return {
                location: agentName,
                packetsSent: result?.total || 0,
                packetsReceived: result?.live || 0,
                packetLoss: result?.total ? `${Math.round(((result.total - (result.live || 0)) / result.total) * 100)}%` : '0%',
                minTime: result?.min_delay ? `${result.min_delay.toFixed(2)}ms` : 'N/A',
                avgTime: result?.average_delay ? `${result.average_delay.toFixed(2)}ms` : 'N/A',
                maxTime: result?.max_delay ? `${result.max_delay.toFixed(2)}ms` : 'N/A',
                ip: 'N/A'
            };
        });
    }

    const processTracerouteData = (tasks) => {
        if (!tasks || tasks.length === 0) return null;
        
        // Для traceroute возвращаем данные от первого агента
        const firstTask = tasks[0];
        const result = firstTask?.result;
        
        return {
            target: result?.target || 'N/A',
            hops: result?.hops || [],
            error: result?.error || null
        };
    }

    const processTCPData = (tasks) => {
        if (!tasks || tasks.length === 0) return null;
        
        return tasks.map((task, index) => {
            const result = task.result;
            const agentName = task.bound_to_agent?.name || `Agent ${index + 1}`;
            
            return {
                location: agentName,
                port: result?.port || 'N/A',
                protocol: result?.protocol || 'tcp',
                reachable: result?.reachable || false,
                latency: result?.latency_ms ? `${result.latency_ms.toFixed(2)}ms` : 'N/A',
                ip: result?.ip || 'N/A'
            };
        });
    }

    const processUDPData = (tasks) => {
        if (!tasks || tasks.length === 0) return null;
        
        return tasks.map((task, index) => {
            const result = task.result;
            const agentName = task.bound_to_agent?.name || `Agent ${index + 1}`;
            
            return {
                location: agentName,
                port: result?.port || 'N/A',
                protocol: result?.protocol || 'udp',
                reachable: result?.reachable || false,
                latency: result?.latency_ms ? `${result.latency_ms.toFixed(2)}ms` : 'N/A',
                ip: result?.ip || 'N/A'
            };
        });
    }

    const processDNSData = (tasks) => {
        if (!tasks || tasks.length === 0) return null;
        
        // Для DNS возвращаем данные от первого агента
        const firstTask = tasks[0];
        const result = firstTask?.result;
        
        return {
            a_records: result?.a_records || [],
            aaaa_records: result?.aaaa_records || [],
            mx_records: result?.mx_records || [],
            ns_records: result?.ns_records || [],
            cname_records: result?.cname_records || [],
            txt_records: result?.txt_records || []
        };
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

    const handleRefreshAll = async () => {
        if (!results || !results.checkUids) {
            console.log('No results to refresh');
            return;
        }

        setIsLoading(true);
        setTargetError('');

        try {
            // Используем нормализованный target из результатов
            const normalizedTarget = results.target;
            const checkResults = await apiService.createComprehensiveCheck(normalizedTarget, port);
            
            console.log('Refreshed check results:', checkResults);

            // Обновляем результаты с новыми UID проверок
            setResults(prev => ({
                ...prev,
                checkUids: checkResults.map(result => result.uid),
                timestamp: new Date().toISOString(),
            }));

            setIsLoading(false);
        } catch (error) {
            console.error('Error refreshing checks:', error);
            setTargetError('Failed to refresh checks. Please try again.');
            setIsLoading(false);
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
                                        placeholder="google.com, https://example.com, or 192.168.1.1"
                                        value={target}
                                        onChange={handleTargetChange}
                                        onKeyPress={handleTargetKeyPress}
                                        className={targetError ? 'border-destructive' : ''}
                                    />
                                    {targetError && (
                                        <p className="text-sm text-destructive">{targetError}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Tip: You can enter just the domain (e.g., google.com) - we'll add https:// automatically
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
                        {/* Results Header with Refresh Button */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">Diagnostic Results</h2>
                                <p className="text-sm text-muted-foreground">
                                    Target: {results.target} {results.port !== 'N/A' && `:${results.port}`}
                                    {results.originalTarget && results.originalTarget !== results.target && (
                                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            Auto-corrected from: {results.originalTarget}
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Last updated: {new Date(results.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleRefreshAll}
                                disabled={isLoading}
                                className="flex items-center space-x-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                <span>Refresh All</span>
                            </Button>
                        </div>
                        
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
