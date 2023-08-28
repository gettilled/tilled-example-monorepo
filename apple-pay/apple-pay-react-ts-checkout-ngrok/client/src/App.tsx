import { QueryClient, QueryClientProvider } from "react-query";
import Checkout from "./components/Checkout";
import Shoes from "./assets/shoes.jpg";
import Socks from "./assets/socks.jpg";

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

const cart = [
  {
    name: "Running Shoes",
    price: 9999,
    imagePath: Shoes,
    quantity: 1,
  },
  {
    name: "Socks",
    price: 1999,
    imagePath: Socks,
    quantity: 2,
  }
];

function App() {
  return (
    <div className="bg-slate-100 m-auto">
      <QueryClientProvider client={queryClient}>
        <Checkout cart={cart} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
