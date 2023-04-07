import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Checkout from './components/Checkout';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            // staleTime: 10000,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <div className='bg-slate-100 m-auto'>
            <QueryClientProvider client={queryClient}>
                <Checkout />
            </QueryClientProvider>
        </div>
    );
}

export default App;
