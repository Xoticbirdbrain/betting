
import { api } from './axiosClient';

export async function fetchFromHub<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  try {
  
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    
    const res = await api.get<T>(cleanEndpoint, { params });

    return res.data;
  } catch (error: any) {
    const serverMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    console.error(`Central Hub Error running endpoint [${endpoint}]:`, serverMessage);
    throw new Error(serverMessage); 
  }
}
