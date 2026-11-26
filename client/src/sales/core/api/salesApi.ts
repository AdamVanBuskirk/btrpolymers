import { supabase } from '../../../Core/supabase';

export class SalesApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function salesRequest<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> {
  let token = accessToken;

  if (!token) {
    const { data } =
      await supabase.auth.getSession();

    token = data.session?.access_token;
  }

  if (!token) {
    throw new SalesApiError(
      'Please log in again.',
      401
    );
  }

  const headers = new Headers(options.headers);

  headers.set(
    'Authorization',
    `Bearer ${token}`
  );

  if (!(options.body instanceof FormData)) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  const response = await fetch(
    `/api/sales${path}`,
    {
      ...options,
      headers,
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const body = await response
      .json()
      .catch(() => ({}));

    throw new SalesApiError(
      body.message ||
        `Request failed (${response.status})`,
      response.status
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}