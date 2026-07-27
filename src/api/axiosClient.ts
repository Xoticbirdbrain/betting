
import axios from 'axios';

export const api = axios.create({

  baseURL: '/api', 
  
  headers: {
    
    'X-Auth-Token': import.meta.env.VITE_FOOTBALL_API_KEY,
    'Accept': 'application/json'

  }
});
