'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowUp, faArrowDown, faWallet, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  history: number[];
}

interface Portfolio {
  cash: number;
  stocks: { [key: string]: number };
}

const TradingSimulator: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([
    {
      id: '1',
      name: 'Tech Corp',
      symbol: 'TECH',
      price: 150.00,
      change: 2.5,
      history: [145, 148, 146, 150]
    },
    {
      id: '2',
      name: 'Finance Inc',
      symbol: 'FINC',
      price: 75.50,
      change: -1.2,
      history: [76, 75, 74, 75.5]
    },
    {
      id: '3',
      name: 'Energy Co',
      symbol: 'ENRG',
      price: 120.75,
      change: 0.8,
      history: [120, 119, 121, 120.75]
    }
  ]);

  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: 10000,
    stocks: {}
  });

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [timeScale, setTimeScale] = useState<'1D' | '1W' | '1M'>('1D');

  useEffect(() => {
    const interval = setInterval(() => {
      updateStockPrices();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateStockPrices = () => {
    setStocks(prevStocks => 
      prevStocks.map(stock => {
        const change = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(1, stock.price * (1 + change / 100));
        const newHistory = [...stock.history, newPrice].slice(-20);
        
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: Number(change.toFixed(2)),
          history: newHistory
        };
      })
    );
  };

  const handleBuy = () => {
    if (!selectedStock) return;
    
    const totalCost = selectedStock.price * quantity;
    if (totalCost > portfolio.cash) {
      alert('Insufficient funds!');
      return;
    }

    setPortfolio(prev => ({
      cash: Number((prev.cash - totalCost).toFixed(2)),
      stocks: {
        ...prev.stocks,
        [selectedStock.symbol]: (prev.stocks[selectedStock.symbol] || 0) + quantity
      }
    }));
  };

  const handleSell = () => {
    if (!selectedStock) return;
    
    const currentShares = portfolio.stocks[selectedStock.symbol] || 0;
    if (quantity > currentShares) {
      alert('Not enough shares!');
      return;
    }

    setPortfolio(prev => ({
      cash: Number((prev.cash + selectedStock.price * quantity).toFixed(2)),
      stocks: {
        ...prev.stocks,
        [selectedStock.symbol]: currentShares - quantity
      }
    }));
  };

  const calculatePortfolioValue = () => {
    const stockValue = Object.entries(portfolio.stocks).reduce((total, [symbol, shares]) => {
      const stock = stocks.find(s => s.symbol === symbol);
      return total + (stock ? stock.price * shares : 0);
    }, 0);
    return Number((portfolio.cash + stockValue).toFixed(2));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Summary */}
        <div className="lg:col-span-3 bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faWallet} className="text-indigo-400" />
                <span>Cash Balance</span>
              </div>
              <p className="text-2xl font-bold mt-2">${portfolio.cash.toFixed(2)}</p>
            </div>
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faChartLine} className="text-indigo-400" />
                <span>Portfolio Value</span>
              </div>
              <p className="text-2xl font-bold mt-2">${calculatePortfolioValue().toFixed(2)}</p>
            </div>
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faExchangeAlt} className="text-indigo-400" />
                <span>Total Positions</span>
              </div>
              <p className="text-2xl font-bold mt-2">{Object.keys(portfolio.stocks).length}</p>
            </div>
          </div>
        </div>

        {/* Stock List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Available Stocks</h2>
          <div className="space-y-4">
            {stocks.map(stock => (
              <motion.div
                key={stock.id}
                className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedStock?.id === stock.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedStock(stock)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{stock.name}</h3>
                    <p className="text-sm text-gray-400">{stock.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${stock.price.toFixed(2)}</p>
                    <p className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <FontAwesomeIcon icon={stock.change >= 0 ? faArrowUp : faArrowDown} />
                      {Math.abs(stock.change)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Trading Panel</h2>
            {selectedStock ? (
              <div className="space-y-4">
                <div className="bg-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold">{selectedStock.name}</h3>
                  <p className="text-2xl font-bold mt-2">${selectedStock.price.toFixed(2)}</p>
                  <p className={`text-sm ${selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <FontAwesomeIcon icon={selectedStock.change >= 0 ? faArrowUp : faArrowDown} />
                    {Math.abs(selectedStock.change)}%
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleBuy}
                    className="bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 font-semibold transition-colors"
                  >
                    Buy
                  </button>
                  <button
                    onClick={handleSell}
                    className="bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 font-semibold transition-colors"
                  >
                    Sell
                  </button>
                </div>

                <div className="bg-gray-600 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Your Position</h4>
                  <p className="text-lg">
                    {portfolio.stocks[selectedStock.symbol] || 0} shares
                  </p>
                  <p className="text-sm text-gray-400">
                    Value: ${((portfolio.stocks[selectedStock.symbol] || 0) * selectedStock.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Select a stock to start trading</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSimulator; 