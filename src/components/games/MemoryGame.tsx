'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Card {
  id: number;
  type: 'term' | 'definition';
  content: string;
  pairId: number;
}

interface MemoryGameProps {
  onGameComplete?: (score: number) => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onGameComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const financialTerms = [
    { term: 'Compound Interest', definition: 'Interest earned on both the principal and accumulated interest' },
    { term: 'Dividend', definition: 'A portion of a company\'s profits paid to shareholders' },
    { term: 'ROI', definition: 'Return on Investment - measure of profitability' },
    { term: 'ETF', definition: 'Exchange Traded Fund - tracks an index or sector' },
    { term: 'Bull Market', definition: 'Market trend characterized by rising prices' },
    { term: 'Bear Market', definition: 'Market trend characterized by falling prices' },
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newCards: Card[] = [];
    financialTerms.forEach((item, index) => {
      newCards.push(
        { id: index * 2, type: 'term', content: item.term, pairId: index },
        { id: index * 2 + 1, type: 'definition', content: item.definition, pairId: index }
      );
    });
    setCards(shuffleArray(newCards));
  };

  const shuffleArray = (array: Card[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (cardId: number) => {
    if (isChecking || flippedCards.includes(cardId) || matchedPairs.includes(cards[cardId].pairId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const [firstCard, secondCard] = newFlippedCards.map(id => cards[id]);
      
      if (firstCard.pairId === secondCard.pairId) {
        setMatchedPairs([...matchedPairs, firstCard.pairId]);
        setFlippedCards([]);
        setIsChecking(false);

        if (matchedPairs.length + 1 === financialTerms.length) {
          onGameComplete?.(moves + 1);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (cardId: number) => {
    return flippedCards.includes(cardId) || matchedPairs.includes(cards[cardId].pairId);
  };

  const getCardStatus = (cardId: number) => {
    if (matchedPairs.includes(cards[cardId].pairId)) {
      return 'matched';
    }
    if (flippedCards.includes(cardId)) {
      return 'flipped';
    }
    return 'hidden';
  };

  return (
    <div className="relative bg-gray-800 rounded-lg p-6 shadow-xl text-white">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Memory Cards</h2>
        <p className="text-gray-400">Match financial terms with their definitions</p>
        <div className="mt-2 text-gray-300">Moves: {moves}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="relative aspect-[3/4] cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCardClick(card.id)}
          >
            <div className={`w-full h-full transition-all duration-500 transform-style-3d ${
              isCardFlipped(card.id) ? 'rotate-y-180' : ''
            }`}>
              {/* Front of card */}
              <div className={`absolute w-full h-full rounded-lg p-4 flex items-center justify-center backface-hidden ${
                getCardStatus(card.id) === 'matched' ? 'bg-green-600' : 'bg-indigo-600'
              }`}>
                <div className="text-center">
                  <FontAwesomeIcon 
                    icon={getCardStatus(card.id) === 'matched' ? faCheck : faTimes} 
                    className="text-2xl mb-2"
                  />
                  <p className="text-sm font-medium">Click to flip</p>
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute w-full h-full rounded-lg p-4 bg-gray-700 backface-hidden rotate-y-180">
                <div className="h-full flex flex-col">
                  <div className="text-xs font-medium text-gray-400 mb-2">
                    {card.type === 'term' ? 'Term' : 'Definition'}
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-sm">{card.content}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx global>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default MemoryGame; 