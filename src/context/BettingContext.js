import React, { createContext, useContext, useState } from 'react';

const BettingContext = createContext();

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error('useBetting must be used within BettingProvider');
  }
  return context;
};

export const BettingProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [depositRequests, setDepositRequests] = useState([
    {
      id: 1,
      userId: 'user123',
      userName: 'John Doe',
      amount: 5000,
      screenshot: '/assets/rs-5000.png',
      status: 'pending',
      timestamp: new Date().toISOString()
    }
  ]);
  const [bets, setBets] = useState([]);
  const [lockedAmount] = useState(0);

  const approveDeposit = (requestId) => {
    const request = depositRequests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
      setDepositRequests(prev => 
        prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r)
      );
      setWalletBalance(prev => prev + request.amount);
    }
  };

  const placeBackBet = (stake, odds, matchName) => {
    if (walletBalance - lockedAmount >= stake) {
      const bet = {
        id: Date.now(),
        type: 'back',
        stake,
        odds,
        matchName,
        potentialWin: stake * (odds - 1),
        timestamp: new Date().toISOString()
      };
      setBets(prev => [...prev, bet]);
      setWalletBalance(prev => prev - stake);
      return true;
    }
    return false;
  };

  const placeLayBet = (stake, odds, matchName) => {
    // Liability = Stake × (Odds - 1)
    const liability = stake * (odds - 1);
    const requiredBalance = walletBalance - lockedAmount;
    
    if (requiredBalance >= liability) {
      const bet = {
        id: Date.now(),
        type: 'lay',
        stake,
        odds,
        matchName,
        liability,
        potentialWin: stake, // If lay wins, you win the stake
        timestamp: new Date().toISOString()
      };
      setBets(prev => [...prev, bet]);
      setWalletBalance(prev => prev - liability);
      return true;
    }
    return false;
  };

  const value = {
    walletBalance,
    lockedAmount,
    depositRequests: depositRequests.filter(r => r.status === 'pending'),
    bets,
    approveDeposit,
    placeBackBet,
    placeLayBet
  };

  return (
    <BettingContext.Provider value={value}>
      {children}
    </BettingContext.Provider>
  );
};

