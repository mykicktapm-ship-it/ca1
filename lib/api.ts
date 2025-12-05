interface ApiRequestOptions {
  initData?: string;
  headers?: HeadersInit;
  method?: string;
  body?: unknown;
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    let message = '';

    if (isJson) {
      try {
        const payload = (await response.json()) as { message?: string };
        message = payload?.message ?? '';
      } catch {
        message = '';
      }
    } else {
      message = await response.text();
    }

    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (!isJson) {
    return (await response.text()) as T;
  }

  return (await response.json()) as T;
};

export const apiFetch = async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { initData, headers, method = 'GET', body } = options;
  const hasBody = body !== undefined && body !== null;

  const requestHeaders = new Headers(headers);
  if (initData) {
    requestHeaders.set('x-telegram-init', initData);
  }
  if (hasBody) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: hasBody ? JSON.stringify(body) : undefined
  });

  return parseResponse<T>(response);
};

export const apiGet = async <T>(url: string, options?: Omit<ApiRequestOptions, 'method'>) =>
  apiFetch<T>(url, options);

export const apiPost = async <T>(
  url: string,
  body: unknown,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
) => apiFetch<T>(url, { ...options, method: 'POST', body });
