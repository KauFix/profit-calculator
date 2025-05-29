import { useState } from "react";
import {
  FaTag,
  FaBoxes,
  FaTruck,
  FaPercentage,
  FaWarehouse,
  FaShoppingCart,
  FaTools,
  FaCog,
  FaChartBar,
  FaCheck,
  FaTimes,
  FaLock
} from "react-icons/fa";

export default function ProfitCalculator() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

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
  const [selectedComparison, setSelectedComparison] = useState([]);

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

    const minSellingPrice =
      totalCost + emagCommission / quantityNum;
    const recommendedSellingPrice =
      minSellingPrice / (1 - minMarginNum / 100);

    const result = {
      name: productName || "Produs",
      costPerUnit: costPerUnit.toFixed(2),
      totalCost: totalCost.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      estimatedProfit: estimatedProfit.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
      status,
      recommendedPrice: recommendedSellingPrice.toFixed(2)
    };

    setResults(result);
    setHistory((prev) => [result, ...prev.slice(0, 9)]);
  };

  const resetForm = () => {
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

  const clearHistory = () => setHistory([]);

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <FaLock /> Introdu parola
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
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Restul aplicației tale vine aici: form, rezultate, istoric etc. */}
      <h1 className="text-center font-bold text-xl mb-4 flex items-center justify-center gap-2">
        <FaChartBar /> Calculator Profit
      </h1>
    </div>
  );
} 
