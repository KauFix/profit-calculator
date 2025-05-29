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
  const [selected, setSelected] = useState([]);

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
    setHistory([result, ...history.slice(0, 9)]);
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
    setSelected([]);
  };

  const toggleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index].slice(-2)
    );
  };

  const getComparison = () => {
    if (selected.length !== 2) return null;
    const [a, b] = selected.map((i) => history[i]);
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
        <h4 className="font-bold text-lg mb-2 text-blue-700">Comparare produse:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>{a.productName}</strong></p>
            <p>Cost unitar: {a.costPerUnit} RON</p>
            <p>Profit: {a.estimatedProfit} RON</p>
            <p>Marjă: {a.profitMargin}%</p>
          </div>
          <div>
            <p><strong>{b.productName}</strong></p>
            <p>Cost unitar: {b.costPerUnit} RON</p>
            <p>Profit: {b.estimatedProfit} RON</p>
            <p>Marjă: {b.profitMargin}%</p>
          </div>
        </div>
      </div>
    );
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
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2 text-green-600">
          <FaChartBar /> Calculator Profit
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Nume produs" value={productName} onChange={setProductName} icon={<FaTag className="text-gray-600" />} />
          <InputField label="Preț achiziție / unitate (RON)" value={pricePerUnit} onChange={setPricePerUnit} icon={<FaTag className="text-blue-500" />} />
          <InputField label="Preț de vânzare (RON)" value={sellingPrice} onChange={setSellingPrice} icon={<FaTag className="text-black" />} />
          <InputField label="Cantitate" value={quantity} onChange={setQuantity} icon={<FaBoxes className="text-yellow-600" />} />
          <InputField label="Transport total (RON)" value={transportCost} onChange={setTransportCost} icon={<FaTruck className="text-orange-500" />} />
          <InputField label="TVA (%)" value={tva} onChange={setTva} icon={<FaPercentage className="text-purple-600" />} />
          <InputField label="Taxă vamală (%)" value={customTax} onChange={setCustomTax} icon={<FaWarehouse className="text-gray-700" />} />
          <InputField label="Comision eMAG (%)" value={emagFee} onChange={setEmagFee} icon={<FaShoppingCart className="text-pink-500" />} />
          <InputField label="Alte costuri (RON)" value={otherCosts} onChange={setOtherCosts} icon={<FaTools className="text-red-500" />} />
          <InputField label="Marjă minimă dorită (%)" value={minMargin} onChange={setMinMargin} icon={<FaPercentage className="text-black" />} />
        </div>

        <button
          onClick={calculateProfit}
          className="w-full bg-green-600 hover:brightness-110 text-white py-2 rounded-lg font-semibold transition duration-300 mt-2 flex items-center justify-center gap-2"
        >
          <FaCog className="text-white" /> Calculează
        </button>

        <button
          onClick={resetAll}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-300 mt-2 flex items-center justify-center gap-2"
        >
          <FaBroom /> Resetează
        </button>

        {results && (
          <div className={`mt-4 p-4 rounded-lg text-sm font-medium border ${
            results.status === "pierdere"
              ? "bg-red-100 text-red-800 border-red-300"
              : results.status === "sub marjă"
              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
              : "bg-green-100 text-green-800 border-green-300"
          }`}>
            <p><strong>{results.productName}</strong></p>
            <p>Cost per unitate: {results.costPerUnit} RON</p>
            <p>Cost total: {results.totalCost} RON</p>
            <p>Venit total: {results.totalRevenue} RON</p>
            <p>Profit estimat: {results.estimatedProfit} RON</p>
            <p>Marjă profit: {results.profitMargin}%</p>
            <p>
              Status: <strong>{
                results.status === "pierdere"
                  ? "Pierdere!"
                  : results.status === "sub marjă"
                  ? "Sub marja minimă!"
                  : "Profitabil!"
              }</strong>
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2 flex justify-between items-center">
              Istoric ultimele calcule:
              <button
                onClick={clearHistory}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md flex items-center gap-1"
              >
                <FaTrashAlt /> Șterge istoricul
              </button>
            </h3>
            <ul className="space-y-1 text-sm">
              {history.map((item, idx) => (
                <li key={idx} className="border p-2 rounded-md bg-gray-50 flex justify-between items-center">
                  <div>
                    <input
                      type="checkbox"
                      checked={selected.includes(idx)}
                      onChange={() => toggleSelect(idx)}
                      className="mr-2"
                    />
                    <strong>{item.productName}</strong>: {item.estimatedProfit} RON profit, {item.profitMargin}% marjă – <em>{item.status}</em>
                  </div>
                </li>
              ))}
            </ul>
            {getComparison()}
          </div>
        )}
      </div>
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
