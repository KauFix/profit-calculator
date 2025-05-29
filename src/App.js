import { useState, useEffect } from "react";
import {
  FaTag,
  FaBoxes,
  FaTruck,
  FaPercentage,
  FaWarehouse,
  FaShoppingCart,
  FaTools,
  FaChartBar,
  FaCog,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

export default function ProfitCalculator() {
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
  const [compareSelection, setCompareSelection] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profit-history")) || [];
    setHistory(saved);
  }, []);

  const saveToHistory = (entry) => {
    const updated = [entry, ...history.slice(0, 9)];
    setHistory(updated);
    localStorage.setItem("profit-history", JSON.stringify(updated));
  };

  const calculateProfit = () => {
    const q = parseFloat(quantity);
    const p = parseFloat(pricePerUnit);
    const s = parseFloat(sellingPrice);
    const t = parseFloat(transportCost);
    const tv = parseFloat(tva);
    const c = parseFloat(customTax);
    const e = parseFloat(emagFee);
    const o = parseFloat(otherCosts);
    const mm = parseFloat(minMargin);

    const costPerUnit = p + t / q + (p * tv) / 100 + (p * c) / 100 + o / q;
    const totalCost = costPerUnit * q;
    const totalRevenue = s * q;
    const emagCommission = (s * e) / 100 * q;
    const estimatedProfit = totalRevenue - totalCost - emagCommission;
    const profitMargin = totalRevenue === 0 ? 0 : (estimatedProfit / totalRevenue) * 100;
    const minSellingPrice = ((totalCost + emagCommission) * 100) / (100 - mm);

    const status = estimatedProfit < 0 ? "pierdere" : profitMargin < mm ? "sub" : "ok";

    const result = {
      productName,
      costPerUnit: costPerUnit.toFixed(2),
      totalCost: totalCost.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      estimatedProfit: estimatedProfit.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
      status,
      minSellingPrice: minSellingPrice.toFixed(2),
    };

    setResults(result);
    saveToHistory(result);
  };

  const resetFields = () => {
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
    setCompareSelection([]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("profit-history");
  };

  const toggleCompare = (index) => {
    const selected = [...compareSelection];
    if (selected.includes(index)) {
      setCompareSelection(selected.filter((i) => i !== index));
    } else if (selected.length < 2) {
      setCompareSelection([...selected, index]);
    }
  };

  const compared = compareSelection.map((i) => history[i]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <FaChartBar className="text-green-600" /> Calculator Profit
        </h1>

        <InputField icon={<FaTag className="text-blue-500" />} label="Nume produs" value={productName} onChange={setProductName} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField icon={<FaTag className="text-blue-500" />} label="Preț achiziție / unitate (RON)" value={pricePerUnit} onChange={setPricePerUnit} />
          <InputField icon={<FaTag className="text-blue-700" />} label="Preț de vânzare (RON)" value={sellingPrice} onChange={setSellingPrice} />
          <InputField icon={<FaBoxes className="text-yellow-600" />} label="Cantitate" value={quantity} onChange={setQuantity} />
          <InputField icon={<FaTruck className="text-orange-600" />} label="Transport total (RON)" value={transportCost} onChange={setTransportCost} />
          <InputField icon={<FaPercentage className="text-purple-600" />} label="TVA (%)" value={tva} onChange={setTva} />
          <InputField icon={<FaWarehouse className="text-gray-600" />} label="Taxă vamală (%)" value={customTax} onChange={setCustomTax} />
          <InputField icon={<FaShoppingCart className="text-pink-500" />} label="Comision eMAG (%)" value={emagFee} onChange={setEmagFee} />
          <InputField icon={<FaTools className="text-red-500" />} label="Alte costuri (RON)" value={otherCosts} onChange={setOtherCosts} />
        </div>
        <InputField icon={<FaPercentage className="text-black" />} label="Marjă minimă dorită (%)" value={minMargin} onChange={setMinMargin} />

        <button onClick={calculateProfit} className="w-full bg-green-600 hover:brightness-110 text-white py-2 rounded-lg font-semibold transition duration-300 mt-2 flex items-center justify-center gap-2">
          <FaCog className="text-white" /> Calculează
        </button>

        <button onClick={resetFields} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2">
          🔄 Resetează
        </button>

        {results && (
          <div className={`mt-4 p-4 rounded-lg text-sm font-medium border ${
            results.status === "pierdere" ? "bg-red-100 text-red-800 border-red-300" : results.status === "sub" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-green-100 text-green-800 border-green-300"
          }`}>
            <strong>{results.productName}</strong>
            <p>Cost per unitate: {results.costPerUnit} RON</p>
            <p>Cost total: {results.totalCost} RON</p>
            <p>Venit total: {results.totalRevenue} RON</p>
            <p>Profit estimat: {results.estimatedProfit} RON</p>
            <p>Marjă profit: {results.profitMargin}%</p>
            <p>Status: {results.status === "pierdere" ? <><FaTimesCircle className="inline text-red-600" /> Pierdere</> : results.status === "sub" ? <><FaTimesCircle className="inline text-yellow-600" /> Sub marjă</> : <><FaCheckCircle className="inline text-green-600" /> Profitabil</>}</p>
            <p className="italic text-sm mt-2 text-gray-600">Preț minim recomandat pentru marjă {minMargin}%: <strong>{results.minSellingPrice} RON</strong></p>
          </div>
        )}

        <details className="mt-6">
          <summary className="cursor-pointer font-semibold text-blue-600">📘 Istoric ultimele 10 calcule:</summary>
          <ul className="mt-2 space-y-1">
            {history.map((item, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <label className="flex-1 cursor-pointer">
                  <input type="checkbox" className="mr-2" checked={compareSelection.includes(index)} onChange={() => toggleCompare(index)} />
                  <strong>{item.productName}</strong>: Profit {item.estimatedProfit} RON – Marjă {item.profitMargin}% – {item.status === "ok" ? "✅" : "⚠️"}
                </label>
              </li>
            ))}
          </ul>
          {compareSelection.length === 2 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2">🔍 Comparație produse:</h3>
              {compared.map((item, idx) => (
                <div key={idx} className="bg-white rounded border p-2 mb-2">
                  <strong>{item.productName}</strong><br />
                  Profit: {item.estimatedProfit} RON, Marjă: {item.profitMargin}%
                </div>
              ))}
            </div>
          )}
          <button onClick={clearHistory} className="text-sm text-red-500 mt-2 hover:underline">Șterge istoric</button>
        </details>
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
