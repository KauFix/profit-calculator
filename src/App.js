import { useState } from "react";
import {
  FaChartBar,
  FaTag,
  FaBoxes,
  FaTruck,
  FaPercentage,
  FaWarehouse,
  FaShoppingCart,
  FaTools,
  FaCog,
  FaBroom,
  FaTrashAlt
} from "react-icons/fa";

export default function ProfitCalculator() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [productName, setProductName] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [transportCost, setTransportCost] = useState(0);
  const [tva, setTva] = useState(19);
  const [customTax, setCustomTax] = useState(0);
  const [emagFee, setEmagFee] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [minMargin, setMinMargin] = useState(40);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  const handleLogin = () => {
    if (passwordInput === "LEO90") {
      setAuthenticated(true);
    } else {
      alert("Parolă greșită!");
    }
  };

  const toNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const calculateProfit = () => {
    const price = toNumber(pricePerUnit);
    const quantityNum = toNumber(quantity);
    const transport = toNumber(transportCost);
    const tvaNum = toNumber(tva);
    const custom = toNumber(customTax);
    const emag = toNumber(emagFee);
    const others = toNumber(otherCosts);
    const selling = toNumber(sellingPrice);
    const minMarginNum = toNumber(minMargin);

    if (quantityNum <= 0) {
      alert("Cantitatea trebuie să fie mai mare de 0.");
      return;
    }

    const costPerUnit =
      price +
      transport / quantityNum +
      (price * tvaNum) / 100 +
      (price * custom) / 100 +
      others / quantityNum;

    const totalCost = costPerUnit * quantityNum;
    const totalRevenue = selling * quantityNum;
    const emagCommission = (selling * emag) / 100 * quantityNum;
    const estimatedProfit = totalRevenue - totalCost - emagCommission;
    const profitMargin =
      totalRevenue === 0 ? 0 : (estimatedProfit / totalRevenue) * 100;

    let status = "profitabil";
    if (estimatedProfit < 0) status = "pierdere";
    else if (profitMargin < minMarginNum) status = "sub marjă";

    const result = {
      productName,
      costPerUnit: costPerUnit.toFixed(2),
      totalCost: totalCost.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      estimatedProfit: estimatedProfit.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
      status,
    };

    setResults(result);
    setHistory([result, ...history.slice(0, 9)]); // max 10 rezultate
  };

  const resetAll = () => {
    setProductName("");
    setPricePerUnit(0);
    setSellingPrice(0);
    setQuantity(1);
    setTransportCost(0);
    setTva(19);
    setCustomTax(0);
    setEmagFee(0);
    setOtherCosts(0);
    setMinMargin(40);
    setResults(null);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <FaChartBar /> Introdu parola
          </h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Parolă"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300"
          >
            Intră
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* CONTINUTUL UI AICI */}
    </div>
  );
}

function InputField({ label, value, onChange, icon }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        <span className="mr-1 inline-block align-middle">{icon}</span> {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:outline-none"
      />
    </div>
  );
}
