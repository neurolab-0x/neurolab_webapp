import axios from 'axios';

// Use VITE_API_URL (preferred) or Backend_URL (legacy) or fallback to localhost
// Ensure the base URL always ends with a trailing slash so concatenation is safe
const rawApi = import.meta.env.VITE_API_URL || import.meta.env.Backend_URL || 'http://localhost:5000/api/';
export const API_URL = rawApi.endsWith('/') ? rawApi : `${rawApi}/`;

// Set up axios defaults
axios.defaults.baseURL = API_URL;

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('[axios] Received 401 for', originalRequest?.url, 'attempting token refresh');

      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('/auth/refresh', { refreshToken: storedRefreshToken });

        // Support multiple possible response shapes from backend:
        // - { accessToken, refreshToken }
        // - { token }
        const accessToken = response.data?.accessToken || response.data?.token;
        const newRefreshToken = response.data?.refreshToken || response.data?.refresh_token || storedRefreshToken;

        if (!accessToken) {
          throw new Error('Invalid refresh response');
        }

        localStorage.setItem('token', accessToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Clear auth data and broadcast a logout event so the app can handle navigation gracefully
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // Attempt a single retry after a short delay in case the refresh failure was transient.
        try {
          const storedRefreshToken = localStorage.getItem('refreshToken');
          const resp = refreshError?.response;
          const status = resp?.status ?? null;
          const requestId = resp?.headers?.['x-render-request-id'] || resp?.headers?.['rndr-id'] || resp?.headers?.['cf-ray'] || null;
          let responseBody = null;
          try {
            if (resp?.data) {
              responseBody = typeof resp.data === 'string' ? resp.data.slice(0, 1024) : JSON.stringify(resp.data).slice(0, 1024);
            }
          } catch (e) {
            responseBody = String(resp?.data).slice(0, 1024);
          }

          console.warn('[axios] Token refresh failed (first attempt) for', originalRequest?.url, 'status=', status, 'requestId=', requestId, ' — attempting one retry after 1s');

          if (storedRefreshToken) {
            // Wait briefly before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));

            try {
              const plain = axios.create({ baseURL: API_URL });
              const retryResp = await plain.post('/auth/refresh', { refreshToken: storedRefreshToken });
              const retryAccess = retryResp.data?.accessToken || retryResp.data?.token;
              const retryRefresh = retryResp.data?.refreshToken || retryResp.data?.refresh_token || storedRefreshToken;

              if (retryAccess) {
                localStorage.setItem('token', retryAccess);
                if (retryRefresh) localStorage.setItem('refreshToken', retryRefresh);
                originalRequest.headers.Authorization = `Bearer ${retryAccess}`;
                console.info('[axios] Token refresh retry succeeded for', originalRequest?.url);
                return axios(originalRequest);
              }
            } catch (secondErr) {
              // Retry failed - fall through to dispatch logout
              const secondResp = secondErr?.response;
              const secondStatus = secondResp?.status ?? null;
              const secondRequestId = secondResp?.headers?.['x-render-request-id'] || secondResp?.headers?.['rndr-id'] || secondResp?.headers?.['cf-ray'] || null;
              let secondResponseBody = null;
              try {
                if (secondResp?.data) {
                  secondResponseBody = typeof secondResp.data === 'string' ? secondResp.data.slice(0, 1024) : JSON.stringify(secondResp.data).slice(0, 1024);
                }
              } catch (e) {
                secondResponseBody = String(secondResp?.data).slice(0, 1024);
              }

              const detail = {
                reason: secondErr?.message || 'refresh_failed_after_retry',
                url: originalRequest?.url || null,
                status: secondStatus,
                requestId: secondRequestId,
                responseBody: secondResponseBody,
              };

              try {
                window.dispatchEvent(new CustomEvent('auth:logout', { detail }));
              } catch (e) {
                window.dispatchEvent(new Event('auth:logout'));
              }

              console.warn('[axios] Token refresh retry failed for', originalRequest?.url, 'status=', secondStatus, 'requestId=', secondRequestId);
              return Promise.reject(secondErr);
            }
          }

          // If we reach here, no stored refresh token or retry didn't succeed - dispatch logout with initial info
          const detail = { reason: refreshError?.message || 'refresh_failed', url: originalRequest?.url || null, status, requestId, responseBody };
          try {
            window.dispatchEvent(new CustomEvent('auth:logout', { detail }));
          } catch (e) {
            window.dispatchEvent(new Event('auth:logout'));
          }

          console.warn('[axios] Token refresh ultimately failed for', originalRequest?.url, 'status=', status, 'requestId=', requestId);
          return Promise.reject(refreshError);
        } catch (e) {
          // If unexpected errors happen while retrying, dispatch logout as a fallback
          console.error('[axios] Error during refresh retry flow', e);
          try {
            window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: e?.message || 'refresh_retry_error' } }));
          } catch (err) {
            window.dispatchEvent(new Event('auth:logout'));
          }
          return Promise.reject(e);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axios; 