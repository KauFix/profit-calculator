import { useState } from "react";
import { FaLock, FaChartBar, FaTag, FaBoxes, FaTruck, FaPercentage, FaWarehouse, FaShoppingCart, FaTools, FaCog, FaExclamationTriangle } from "react-icons/fa";

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
  const [comparison, setComparison] = useState([]);

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
    setHistory((prev) => [result, ...prev.slice(0, 9)]);
  };

  const calculateMinSellingPrice = () => {
    const price = toNumber(pricePerUnit);
    const quantityNum = toNumber(quantity);
    const transport = toNumber(transportCost);
    const tvaNum = toNumber(tva);
    const custom = toNumber(customTax);
    const emag = toNumber(emagFee);
    const others = toNumber(otherCosts);
    const minMarginNum = toNumber(minMargin);

    const costPerUnit =
      price +
      transport / quantityNum +
      (price * tvaNum) / 100 +
      (price * custom) / 100 +
      others / quantityNum;

    const requiredSellingPrice =
      costPerUnit / (1 - (emag / 100) - (minMarginNum / 100));

    return requiredSellingPrice.toFixed(2);
  };

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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <FaChartBar /> Calculator Profit
        </h1>

        <InputField icon={<FaTag />} label="Nume produs" value={productName} onChange={setProductName} text />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField icon={<FaTag />} label="Preț achiziție / unitate (RON)" value={pricePerUnit} onChange={setPricePerUnit} />
          <InputField icon={<FaTag />} label="Preț de vânzare (RON)" value={sellingPrice} onChange={setSellingPrice} />
          <InputField icon={<FaBoxes />} label="Cantitate" value={quantity} onChange={setQuantity} />
          <InputField icon={<FaTruck />} label="Transport total (RON)" value={transportCost} onChange={setTransportCost} />
          <InputField icon={<FaPercentage />} label="TVA (%)" value={tva} onChange={setTva} />
          <InputField icon={<FaWarehouse />} label="Taxă vamală (%)" value={customTax} onChange={setCustomTax} />
          <InputField icon={<FaShoppingCart />} label="Comision eMAG (%)" value={emagFee} onChange={setEmagFee} />
          <InputField icon={<FaTools />} label="Alte costuri (RON)" value={otherCosts} onChange={setOtherCosts} />
        </div>

        <InputField icon={<FaPercentage />} label="Marjă minimă dorită (%)" value={minMargin} onChange={setMinMargin} />

        <button
          onClick={calculateProfit}
          className="w-full bg-green-600 hover:brightness-110 text-white py-2 rounded-lg font-semibold transition duration-300 mt-2 flex items-center justify-center gap-2"
        >
          <FaCog /> Calculează
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
            <p>Status: <strong>{results.status === "pierdere" ? "❌ Pierdere" : results.status === "sub marjă" ? "⚠️ Sub marjă minimă" : "✅ Profitabil"}</strong></p>
            <p className="mt-2 text-xs text-gray-500 italic">
              Preț minim recomandat pentru marjă {minMargin}%: {calculateMinSellingPrice()} RON
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">📘 Istoric ultimele 10 calcule:</h3>
            <ul className="space-y-1 text-sm">
              {history.map((item, idx) => (
                <li key={idx} className="border p-2 rounded bg-gray-50">
                  <strong>{item.productName}</strong>: Profit {item.estimatedProfit} RON – Marjă {item.profitMargin}% – {item.status === "pierdere" ? "❌" : item.status === "sub marjă" ? "⚠️" : "✅"}
                </li>
              ))}
            </ul>
            <button onClick={() => setHistory([])} className="mt-2 text-red-600 hover:underline text-xs">Șterge istoric</button>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, icon, text = false }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        <span className="mr-1 inline-block align-middle">{icon}</span> {label}
      </label>
      <input
        type={text ? "text" : "number"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:outline-none"
        min={text ? undefined : "0"}
      />
    </div>
  );
}
