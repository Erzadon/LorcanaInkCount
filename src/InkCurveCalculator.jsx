import { useState } from "react";

export default function InkCurveCalculator() {
  const [cardCounts, setCardCounts] = useState(Array(11).fill(0));
  const [deckSize, setDeckSize] = useState(60);
  const [targetAccuracy, setTargetAccuracy] = useState(75);
  const [result, setResult] = useState(null);

  const handleCardCountChange = (cost, value) => {
    const newCounts = [...cardCounts];
    newCounts[cost] = Number(value);
    setCardCounts(newCounts);
  };

  function calculateCurve() {
    const totalCards = cardCounts.reduce((sum, count) => sum + count, 0);
    if (totalCards !== deckSize) {
      setResult({ error: `Deck must have exactly ${deckSize} cards. Currently has ${totalCards}.` });
      return;
    }

    const totalCost = cardCounts.reduce((sum, count, cost) => sum + cost * count, 0);
    const averageCost = totalCost / deckSize;

    const targetTurn = Math.ceil(averageCost);
    const openingHand = 7;
    const drawsByTurn = targetTurn - 1;
    const cardsSeen = openingHand + drawsByTurn;

    let inkablesNeeded = 0;
    let probability = 0;
    for (let inkables = 1; inkables <= deckSize; inkables++) {
      probability = 1 - cumulativeHypergeometric(targetTurn - 1, deckSize, inkables, cardsSeen);
      if (probability >= targetAccuracy / 100) {
        inkablesNeeded = inkables;
        break;
      }
    }

    const maxNonInkables = deckSize - inkablesNeeded;

    setResult({
      averageCost: averageCost.toFixed(2),
      targetTurn,
      cardsSeen,
      inkablesNeeded,
      maxNonInkables,
      probability: (probability * 100).toFixed(1),
    });
  }

  function cumulativeHypergeometric(k, N, K, n) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += hypergeometricPMF(i, N, K, n);
    }
    return sum;
  }

  function hypergeometricPMF(k, N, K, n) {
    return (
      (combination(K, k) * combination(N - K, n - k)) / combination(N, n)
    );
  }

  function combination(n, k) {
    if (k > n || k < 0) return 0;
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result *= (n - i + 1) / i;
    }
    return result;
  }

  return (
    <div>
      <h1>Lorcana Ink Curve Calculator</h1>
      <div>
        <label>Deck Size:</label>
        <input type="number" value={deckSize} onChange={(e) => setDeckSize(Number(e.target.value))} />
      </div>
      <div>
        <p>Enter Card Counts by Cost (0–10):</p>
        {cardCounts.map((count, cost) => (
          <div key={cost}>
            <label>{cost}:</label>
            <input
              type="number"
              value={count}
              min={0}
              onChange={(e) => handleCardCountChange(cost, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div>
        <label>Target Accuracy (%):</label>
        <input
          type="number"
          value={targetAccuracy}
          onChange={(e) => setTargetAccuracy(Number(e.target.value))}
        />
      </div>
      <button onClick={calculateCurve}>Calculate</button>
      {result && (
        <div>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p>Average Card Cost: {result.averageCost}</p>
              <p>Target Ink: {result.targetTurn}</p>
              <p>Cards Seen by Turn {result.targetTurn}: {result.cardsSeen}</p>
              <p>Inkables Needed for {targetAccuracy}%: {result.inkablesNeeded}</p>
              <p>Max Non-Inkables: {result.maxNonInkables}</p>
              <p>Estimated Success Rate: {result.probability}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}