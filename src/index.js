import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const testEnv = process.env.REACT_APP_TEST === "true";
let queryClient, persister;

if (testEnv) {
  // Tanstack query with local storage:
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false,
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        staleTime: Infinity,
      },
    },
  });

  persister = createSyncStoragePersister({
    storage: window.localStorage,
  });
} else {
  // Regular tanstack query
  queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false}}});
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {
      testEnv ?
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
          <App />
        </PersistQueryClientProvider>
      :
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
    }
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
