import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Regular tanstack query:
// const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false}}});

// Tanstack query with local storage:
// TODO: we will probably want to switch back to above regular cache when we are dealing with real/sensitive data. Just using this here to not use too many api calls to my mock data which has limit of 10k calls, otherwise it calls on every refresh.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: Infinity,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </PersistQueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
