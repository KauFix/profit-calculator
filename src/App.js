import { useState } from "react";
import {
  FaLock,
  FaEuroSign,
  FaTag,
  FaBox,
  FaTruck,
  FaPercent,
  FaWarehouse,
  FaShoppingCart,
  FaCog,
  FaChartBar,
} from "react-icons/fa";

export default function ProfitCalculator() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [transportCost, setTransportCost] = useState(0);
  const [tva, setTva] = useState(19);
  const [customTax, setCustomTax] = useState(0);
  const [emagFee, setEmagFee] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [results, setResults] = useState(null);

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

    if (quantityNum <= 0) {
      alert("Cantitatea trebuie să fie mai mare decât 0");
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

    setResults({
      costPerUnit: costPerUnit.toFixed(2),
      totalCost: totalCost.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      estimatedProfit: estimatedProfit.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
    });
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
            Intră în aplicație
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <FaChartBar /> Calculator de Profit
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={
              <>
                <FaEuroSign className="inline mr-2" /> Preț achiziție/unitate
              </>
            }
            value={pricePerUnit}
            onChange={setPricePerUnit}
          />
          <InputField
            label={
              <>
                <FaTag className="inline mr-2" /> Preț de vânzare
              </>
            }
            value={sellingPrice}
            onChange={setSellingPrice}
          />
          <InputField
            label={
              <>
                <FaBox className="inline mr-2" /> Cantitate
              </>
            }
            value={quantity}
            onChange={setQuantity}
          />
          <InputField
            label={
              <>
                <FaTruck className="inline mr-2" /> Transport total
              </>
            }
            value={transportCost}
            onChange={setTransportCost}
          />
          <InputField
            label={
              <>
                <FaPercent className="inline mr-2" /> TVA (%)
              </>
            }
            value={tva}
            onChange={setTva}
          />
          <InputField
            label={
              <>
                <FaWarehouse className="inline mr-2" /> Taxă vamală (%)
              </>
            }
            value={customTax}
            onChange={setCustomTax}
          />
          <InputField
            label={
              <>
                <FaShoppingCart className="inline mr-2" /> Comision eMAG (%)
              </>
            }
            value={emagFee}
            onChange={setEmagFee}
          />
          <InputField
            label={
              <>
                <FaCog className="inline mr-2" /> Alte costuri
              </>
            }
            value={otherCosts}
            onChange={setOtherCosts}
          />
        </div>

        <button
          onClick={calculateProfit}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition duration-300 mt-4 flex items-center justify-center gap-2"
        >
          <FaCog /> Calculează Profitul
        </button>

        {results && (
          <div className="bg-gray-50 rounded-xl p-4 mt-6 border">
            <h2 className="font-bold mb-2 text-lg">📊 Rezultate</h2>
            <Result
              label="Cost per unitate"
              value={results.costPerUnit + " lei"}
            />
            <Result label="Cost total" value={results.totalCost + " lei"} />
            <Result
              label="Venit total"
              value={results.totalRevenue + " lei"}
            />
            <Result
              label="Profit estimat"
              value={results.estimatedProfit + " lei"}
              highlight
            />
            <Result
              label="Marjă profit"
              value={results.profitMargin + " %"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg p-2"
        min="0"
      />
    </div>
  );
}

function Result({ label, value, highlight = false }) {
  return (
    <p className={`text-sm ${highlight ? "font-bold text-green-700" : ""}`}>
      {label}: <span className="ml-1">{value}</span>
    </p>
  );
}
