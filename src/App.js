import { useState } from "react";

export default function ProfitCalculator() {
  // Protecție cu parolă
  const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    if (passwordInput === "LEO90") {
      setAuthenticated(true);
    } else {
      alert("Parolă greșită!");
    }
  };

  if (!authenticated) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
        <h2>Introdu parola pentru a accesa aplicația</h2>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Parolă"
          style={{ padding: "8px", marginTop: "10px" }}
        />
        <button onClick={handleLogin} style={{ marginTop: "10px", padding: "8px 16px" }}>Intră</button>
      </div>
    );
  }

  // Codul aplicației după autentificare
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [transportCost, setTransportCost] = useState(0);
  const [tva, setTva] = useState(19);
  const [customTax, setCustomTax] = useState(0);
  const [emagFee, setEmagFee] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [results, setResults] = useState(null);

  const calculateProfit = () => {
    const constPerUnit =
      parseFloat(pricePerUnit) +
      parseFloat(transportCost) / quantity +
      (parseFloat(pricePerUnit) * parseFloat(tva)) / 100 +
      (parseFloat(pricePerUnit) * parseFloat(customTax)) / 100 +
      parseFloat(otherCosts) / quantity;

    const totalCost = constPerUnit * quantity;
    const totalRevenue = parseFloat(sellingPrice) * quantity;
    const emagCommission = (parseFloat(sellingPrice) * parseFloat(emagFee)) / 100 * quantity;
    const estimatedProfit = totalRevenue - totalCost - emagCommission;
    const profitMargin = (estimatedProfit / totalRevenue) * 100;

    setResults({
      costPerUnit: constPerUnit.toFixed(2),
      totalCost: totalCost.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      estimatedProfit: estimatedProfit.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Calculator de Profit</h1>

      <label>Preț achiziție/unitate</label>
      <input type="number" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className="w-full border p-2 mb-2" />

      <label>Preț de vânzare</label>
      <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full border p-2 mb-2" />

      <label>Cantitate</label>
      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border p-2 mb-2" />

      <label>Transport total</label>
      <input type="number" value={transportCost} onChange={(e) => setTransportCost(e.target.value)} className="w-full border p-2 mb-2" />

      <label>TVA (%)</label>
      <input type="number" value={tva} onChange={(e) => setTva(e.target.value)} className="w-full border p-2 mb-2" />

      <label>Taxă vamală (%)</label>
      <input type="number" value={customTax} onChange={(e) => setCustomTax(e.target.value)} className="w-full border p-2 mb-2" />

      <label>Comision eMAG (%)</label>
      <input type="number" value={emagFee} onChange={(e) => setEmagFee(e.target.value)} className="w-full border p-2 mb-2" />

      <label>Alte costuri totale</label>
      <input type="number" value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} className="w-full border p-2 mb-2" />

      <button onClick={calculateProfit} className="bg-blue-500 text-white px-4 py-2 mt-4">Calculează</button>

      {results && (
        <div className="mt-4 border-t pt-4">
          <h2 className="font-bold mb-2">Rezultate:</h2>
          <p>Cost per unitate: {results.costPerUnit} lei</p>
          <p>Cost total: {results.totalCost} lei</p>
          <p>Venit total: {results.totalRevenue} lei</p>
          <p>Profit estimat: {results.estimatedProfit} lei</p>
          <p>Marjă profit: {results.profitMargin}%</p>
        </div>
      )}
    </div>
  );
}
