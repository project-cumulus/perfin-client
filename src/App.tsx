import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";
import Landing from './pages/landing/Landing';
import RootLayout from "./layout/RootLayout";
import './App.css';
import Subscriptions from './pages/subscriptions/Subscriptions';
import Transactions from './pages/budget/Transactions';
import Wealth from './pages/wealth/Wealth';
import Investments from "./pages/investments/Investments";

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Landing />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="wealth" element={<Wealth />} />
        <Route path="budget" element={<Transactions />} />
        <Route path="investments" element={<Investments />} />
      </Route>
    )
  );

  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;