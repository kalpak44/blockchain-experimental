import './App.css';
import PaymentButton from "./components/PaymentButton";

function App() {
  return (
    <div className="App">
      <PaymentButton paymentId='payment-id' amount={1000000}>Pay</PaymentButton>
    </div>
  );
}

export default App;
