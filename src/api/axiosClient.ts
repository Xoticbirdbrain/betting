
import axios from 'axios';

export const api = axios.create({

  baseURL: '/.netlify/function/api', 
  
  headers: {
     
    'Content-Type': 'application/json'

  }
});
