import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  credentials: 'include',  // This tells browser to send cookies
  prepareHeaders: (headers) => {
    // Don't need to manually set Authorization header
    // Browser automatically sends the JWT cookie
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User'],
  // it like a parent to other api
  // it a built-in builder
  endpoints: (builder) => ({}),
});