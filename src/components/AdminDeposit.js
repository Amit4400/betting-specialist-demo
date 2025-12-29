import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { approveDeposit } from '../store/slices/depositsSlice';
import { addToWallet } from '../store/slices/bettingSlice';
import './AdminDeposit.css';

const AdminDeposit = () => {
  const allDepositRequests = useSelector((state) => state.deposits.depositRequests);
  const depositRequests = allDepositRequests.filter(r => r.status === 'pending');
  const dispatch = useDispatch();

  const handleApprove = (requestId) => {
    const request = depositRequests.find(r => r.id === requestId);
    if (!request) {
      toast.error('Deposit request not found');
      return;
    }

    if (window.confirm('Are you sure you want to approve this deposit request?')) {
      dispatch(approveDeposit(requestId));
      // Update user wallet balance
      console.log('Approving deposit, adding amount:', request.amount);
      dispatch(addToWallet(request.amount));
      console.log('Wallet update dispatched');
      
      // Verify the update
      setTimeout(() => {
        const currentBalance = JSON.parse(localStorage.getItem('walletBalance') || '0');
        console.log('Wallet balance after approval (from localStorage):', currentBalance);
      }, 100);
      
      toast.success(`✅ Deposit of ₹${request.amount.toLocaleString()} approved! User wallet has been updated.`);
    }
  };

  return (
    <div className="admin-deposit">
      <div className="admin-header">
        <h1>Manual Deposit Management</h1>
        <p>Review and approve user deposit requests</p>
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.5rem', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <strong>Debug:</strong> Total Requests: {allDepositRequests.length} | Pending: {depositRequests.length}
        </div>
      </div>

      {depositRequests.length === 0 ? (
        <div className="no-requests">
          <p>No pending deposit requests</p>
        </div>
      ) : (
        <div className="requests-list">
          {depositRequests.map(request => (
            <div key={request.id} className="deposit-card">
              <div className="card-header">
                <div>
                  <h3>Request #{request.id}</h3>
                  <p className="user-info">
                    <strong>User:</strong> {request.userName} ({request.userId})
                  </p>
                </div>
                <div className="amount-badge">
                  ₹{request.amount.toLocaleString()}
                </div>
              </div>

              <div className="screenshot-section">
                <h4>Payment Screenshot:</h4>
                <div className="screenshot-container">
                  <img 
                    src={request.screenshot} 
                    alt="Payment screenshot" 
                    className="screenshot-image"
                  />
                </div>
              </div>

              <div className="request-details">
                <div className="detail-item">
                  <span className="label">Requested Amount:</span>
                  <span className="value">₹{request.amount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Request Date:</span>
                  <span className="value">
                    {new Date(request.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${request.status}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(request.id)}
                >
                  ✓ Approve Deposit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDeposit;

