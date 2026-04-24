type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, string | number | boolean | (string | number | boolean)[]>;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export async function fetcher<T>(url: string, {
  method = "GET",
  params,
  body,
  signal,
  headers,
}: FetchOptions = {}): Promise<T> {
  let finalUrl = url;

  if (params) {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((v) => p.append(key, String(v)));
      } else {
        p.set(key, String(value));
      }
    });
    finalUrl += `?${p}`;
  }

  const res = await fetch(finalUrl, {
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
