import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { placeBackBet, placeLayBet } from '../store/slices/bettingSlice';
import { createDepositRequest } from '../store/slices/depositsSlice';
import './MatchPage.css';

const MatchPage = () => {
  const walletBalance = useSelector((state) => state.betting.walletBalance);
  const lockedAmount = useSelector((state) => state.betting.lockedAmount);
  const user = useSelector((state) => state.auth.user);
  const depositRequests = useSelector((state) => state.deposits.depositRequests);
  const dispatch = useDispatch();

  // Debug: Log wallet balance changes and sync with localStorage
  useEffect(() => {
    console.log('Wallet balance updated:', walletBalance);
    console.log('Full betting state:', { walletBalance, lockedAmount });
    
    // Sync Redux state with localStorage on mount
    const savedBalance = localStorage.getItem('walletBalance');
    if (savedBalance !== null) {
      const parsedBalance = parseFloat(savedBalance);
      if (parsedBalance !== walletBalance) {
        console.log('Syncing wallet balance from localStorage:', parsedBalance);
        // The balance should already be loaded from localStorage in the slice,
        // but this ensures it's in sync
      }
    }
  }, [walletBalance, lockedAmount]);
  
  const [stake, setStake] = useState('');
  const [selectedOdds, setSelectedOdds] = useState(1.50);
  const [betType, setBetType] = useState(null);

  const matchName = 'India vs Australia';
  const availableOdds = [1.50];

  const availableBalance = walletBalance - lockedAmount;

  // Debug: Log deposit requests when they change
  useEffect(() => {
    console.log('Deposit requests updated:', depositRequests);
  }, [depositRequests]);

  const handleDeposit = (e) => {
    e.preventDefault();
    console.log('Deposit button clicked!');
    
    if (!user) {
      console.error('No user found');
      toast.error('Error: User not logged in. Please login again.');
      return;
    }

    if (user.role !== 'user') {
      console.error('User role is not "user":', user.role);
      toast.error('Error: Only users can request deposits.');
      return;
    }

    const depositData = {
      userId: user.username,
      userName: user.username,
      amount: 5000,
      screenshot: '/assets/rs-5000.png'
    };
    
    console.log('Creating deposit request:', depositData);
    console.log('User object:', user);
    
    dispatch(createDepositRequest(depositData));
    toast.success('✅ Deposit request of ₹5000 submitted successfully! Please wait for admin approval.');
    
    console.log('Deposit request dispatched');
  };

  const handleBackBet = () => {
    const stakeAmount = parseFloat(stake);
    if (!stakeAmount || stakeAmount <= 0) {
      toast.error('Please enter a valid stake amount');
      return;
    }
    if (stakeAmount > availableBalance) {
      toast.error(`Insufficient balance! Available: ₹${availableBalance.toLocaleString()}`);
      return;
    }
    
    dispatch(placeBackBet({ stake: stakeAmount, odds: selectedOdds, matchName }));
    toast.success(`Back bet placed! Stake: ₹${stakeAmount.toLocaleString()} at odds ${selectedOdds}`);
    setStake('');
  };

  const handleLayBet = () => {
    const stakeAmount = parseFloat(stake);
    if (!stakeAmount || stakeAmount <= 0) {
      toast.error('Please enter a valid stake amount');
      return;
    }
    
    // Calculate liability: Stake × (Odds - 1)
    const liability = stakeAmount * (selectedOdds - 1);
    
    if (liability > availableBalance) {
      toast.error(`Insufficient balance! Required liability: ₹${liability.toLocaleString()}, Available: ₹${availableBalance.toLocaleString()}`);
      return;
    }
    
    dispatch(placeLayBet({ stake: stakeAmount, odds: selectedOdds, matchName }));
    toast.success(`Lay bet placed! Stake: ₹${stakeAmount.toLocaleString()} at odds ${selectedOdds}. Liability locked: ₹${liability.toLocaleString()}`);
    setStake('');
  };

  const calculateLiability = (stakeAmount, odds) => {
    if (!stakeAmount || stakeAmount <= 0) return 0;
    return stakeAmount * (odds - 1);
  };

  const previewLiability = calculateLiability(parseFloat(stake) || 0, selectedOdds);

  return (
    <div className="match-page">
      <div className="match-header">
        <h1>{matchName}</h1>
        <div className="wallet-info">
          <div className="wallet-item">
            <span className="wallet-label">Wallet Balance:</span>
            <span className="wallet-value">₹{walletBalance.toLocaleString()}</span>
          </div>
          <div className="wallet-item">
            <span className="wallet-label">Available:</span>
            <span className="wallet-value available">₹{availableBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="match-content">
        <div className="deposit-section">
          <button 
            type="button"
            className="deposit-btn" 
            onClick={handleDeposit}
          >
            Deposit Rs. 5000
          </button>
          <p className="deposit-note">Request a deposit to add funds to your wallet</p>
        </div>

        <div className="odds-selection">
          <h2>Select Odds</h2>
          <div className="odds-buttons">
            {availableOdds.map(odds => (
              <button
                key={odds}
                className={`odds-btn ${selectedOdds === odds ? 'selected' : ''}`}
                onClick={() => setSelectedOdds(odds)}
              >
                {odds}
              </button>
            ))}
          </div>
        </div>

        <div className="stake-input-section">
          <h2>Enter Stake Amount</h2>
          <div className="stake-input-container">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              className="stake-input"
              placeholder="Enter stake amount"
              value={stake}
              onChange={(e) => {
                setStake(e.target.value);
              }}
              min="1"
              step="1"
            />
          </div>
        </div>

        {betType === 'lay' && stake && parseFloat(stake) > 0 && (
          <div className="liability-preview">
            <div className="liability-info">
              <span className="liability-label">Liability (Amount to Lock):</span>
              <span className="liability-value">₹{previewLiability.toLocaleString()}</span>
            </div>
            <div className="liability-formula">
              Formula: Stake × (Odds - 1) = {parseFloat(stake) || 0} × ({selectedOdds} - 1) = ₹{previewLiability.toLocaleString()}
            </div>
          </div>
        )}

        <div className="bet-buttons">
          <button
            className="bet-btn back-btn"
            onClick={() => {
              setBetType('back');
              handleBackBet();
            }}
          >
            BACK
          </button>
          <button
            className="bet-btn lay-btn"
            onClick={() => {
              setBetType('lay');
              handleLayBet();
            }}
          >
            LAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;

