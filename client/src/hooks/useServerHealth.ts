import { useState, useEffect } from 'react';
import { API_URL } from '../lib/api';

type ServerStatus = 'connected' | 'connecting' | 'error';

export function useServerHealth() {
    const [status, setStatus] = useState<ServerStatus>('connecting');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                const res = await fetch(`${API_URL}/health`, {
                    signal: controller.signal,
                    headers: { 'Content-Type': 'application/json' }
                });

                clearTimeout(timeoutId);

                if (res.ok) {
                    setStatus('connected');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                setStatus('error');
            }
        };

        // Check immediately
        checkHealth();

        // Then interval
        const interval = setInterval(checkHealth, 10000); // Check every 10s

        return () => clearInterval(interval);
    }, []);

    return status;
}
