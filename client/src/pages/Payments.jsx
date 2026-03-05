import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckCircle2, Clock, CircleAlert as AlertCircle,
  Download, CreditCard, Banknote, Smartphone,
  ChevronRight, Receipt, ShieldCheck
} from 'lucide-react';

const paymentMethods = [
  { value: 'gcash',       label: 'GCash',          icon: Smartphone },
  { value: 'bank',        label: 'Bank Transfer',   icon: Banknote   },
  { value: 'credit_card', label: 'Credit Card',     icon: CreditCard },
];

const statusConfig = {
  paid:    { icon: CheckCircle2, label: 'Confirmed',   color: '#1a7a4a', bg: '#f0faf4', border: '#a8dfc0' },
  pending: { icon: Clock,        label: 'Processing',  color: '#b07020', bg: '#fffbeb', border: '#f5d87a' },
  overdue: { icon: AlertCircle,  label: 'Outstanding', color: '#c83030', bg: '#fff4f4', border: '#f8c8c8' },
};

export default function Payments() {
  const { user } = useAuth();
  const [payments,      setPayments]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [payingId,      setPayingId]      = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processingId,  setProcessingId]  = useState(null);

  const fetchPayments = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPayments();
    const channel = supabase.channel('payment_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, fetchPayments)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, fetchPayments]);

  const handlePayment = async (paymentId, method) => {
    setProcessingId(paymentId);
    try {
      await supabase.from('payments').update({ status: 'pending', payment_method: method }).eq('id', paymentId);
      setTimeout(async () => {
        await supabase.from('payments').update({
          status: 'paid',
          transaction_id: `TXN-${Math.random().toString(36).toUpperCase().slice(2, 9)}`
        }).eq('id', paymentId);
        setProcessingId(null);
        setPayingId(null);
        setSelectedMethod('');
      }, 2500);
    } catch (err) {
      console.error(err);
      setProcessingId(null);
    }
  };

  const due  = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const paid = payments.filter(p => p.status === 'paid').reduce((s, p)  => s + parseFloat(p.amount || 0), 0);

  if (loading) return (
    <Layout title="Payments">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#b0aba5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Loading ledger…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout title="Payments">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .tbl-row { transition: background 0.15s; }
        .tbl-row:hover { background: #f7f3ee !important; }
        .pay-btn:hover { background: #1a1510 !important; color: #F7F3EE !important; border-color: #1a1510 !important; }
        .receipt-btn:hover { border-color: #1a1510 !important; color: #1a1510 !important; }
        .method-select { appearance: none; outline: none; cursor: pointer; }
        .method-select:focus { border-color: #1955e6 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease both; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header banner */}
        <div style={{ background: '#1a1510', padding: '2rem 2.25rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 500, color: '#5a5550', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Financial Records
            </p>
            <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Billing &amp; Ledger
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#5a5550', marginTop: '0.5rem' }}>
              Track your tuition and transaction history.
            </p>
          </div>

          {/* Balance summary */}
          <div style={{ display: 'flex', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#8a857f', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                Balance Due
              </p>
              <span className="f-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f87171', letterSpacing: '-0.02em' }}>
                ₱{due.toLocaleString()}
              </span>
            </div>
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#8a857f', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                Settled
              </p>
              <span className="f-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#34d399', letterSpacing: '-0.02em' }}>
                ₱{paid.toLocaleString()}
              </span>
            </div>
          </div>

          <Receipt size={110} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', right: -16, bottom: -20 }} />
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #ddd8d0' }}>

          {/* Table header bar */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #ddd8d0', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Receipt size={15} color="#1955e6" />
            <h3 className="f-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.01em', margin: 0 }}>
              Transaction History
            </h3>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <ShieldCheck size={13} color="#1a7a4a" />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#8a857f', fontWeight: 500 }}>Secured by Supabase</span>
            </div>
          </div>

          {payments.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', fontWeight: 700, color: '#c0bbb5', fontStyle: 'italic' }}>₱</span>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#b0aba5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                No entries found in ledger
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans',sans-serif" }}>
                <thead>
                  <tr style={{ background: '#F7F3EE', borderBottom: '1px solid #ddd8d0' }}>
                    {['Billing Details', 'Amount', 'Status', 'Actions'].map((col, i) => (
                      <th key={col} style={{
                        padding: '0.75rem 1.25rem',
                        fontSize: '0.65rem', fontWeight: 700,
                        color: '#a0a09c', letterSpacing: '0.1em', textTransform: 'uppercase',
                        textAlign: i === 1 ? 'center' : i === 3 ? 'right' : 'left',
                        whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif",
                      }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => {
                    const cfg          = statusConfig[payment.status] || statusConfig.pending;
                    const StatusIcon   = cfg.icon;
                    const isProcessing = processingId === payment.id;
                    const isPaying     = payingId === payment.id;

                    return (
                      <tr key={payment.id} className="tbl-row fade-in" style={{
                        background: idx % 2 === 0 ? '#fff' : '#faf8f5',
                        borderBottom: '1px solid #e8e2db',
                        animationDelay: `${idx * 40}ms`,
                      }}>

                        {/* Details */}
                        <td style={{ padding: '1rem 1.25rem', maxWidth: 280 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1510', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {payment.description || payment.payment_type}
                          </p>
                          <p style={{ fontSize: '0.72rem', color: '#a0a09c', fontStyle: 'italic', margin: 0 }}>
                            {payment.semester}{payment.due_date ? ` · Due ${new Date(payment.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}
                          </p>
                        </td>

                        {/* Amount */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                          <span className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.01em' }}>
                            ₱{parseFloat(payment.amount || 0).toLocaleString()}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                            padding: '0.25rem 0.625rem',
                            background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
                          }}>
                            <StatusIcon size={12} />
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                              {cfg.label}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          {payment.status === 'paid' ? (
                            <button className="receipt-btn" style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                              background: 'transparent', border: '1.5px solid #ddd8d0',
                              fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600,
                              color: '#8a857f', padding: '0.4rem 0.875rem', cursor: 'pointer',
                              letterSpacing: '0.04em', textTransform: 'uppercase',
                              transition: 'border-color 0.15s, color 0.15s',
                            }}>
                              <Download size={12} /> Receipt
                            </button>
                          ) : isPaying ? (
                            <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <select
                                className="method-select"
                                value={selectedMethod}
                                onChange={e => setSelectedMethod(e.target.value)}
                                style={{
                                  height: 34, padding: '0 0.75rem',
                                  fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem',
                                  background: '#F7F3EE', border: '1.5px solid #ddd8d0', color: '#1a1510',
                                  transition: 'border-color 0.2s',
                                }}
                              >
                                <option value="">Select method…</option>
                                {paymentMethods.map(m => (
                                  <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                              </select>
                              <button
                                disabled={!selectedMethod || isProcessing}
                                onClick={() => handlePayment(payment.id, selectedMethod)}
                                style={{
                                  height: 34, padding: '0 1rem',
                                  background: selectedMethod && !isProcessing ? '#1a1510' : '#e8e2db',
                                  border: 'none', color: selectedMethod && !isProcessing ? '#F7F3EE' : '#b0aba5',
                                  fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700,
                                  letterSpacing: '0.06em', textTransform: 'uppercase', cursor: selectedMethod && !isProcessing ? 'pointer' : 'not-allowed',
                                  transition: 'background 0.2s',
                                }}>
                                {isProcessing ? '…' : 'Pay'}
                              </button>
                              <button onClick={() => { setPayingId(null); setSelectedMethod(''); }} style={{
                                height: 34, width: 34, background: 'transparent',
                                border: '1.5px solid #ddd8d0', color: '#b0aba5',
                                cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>×</button>
                            </div>
                          ) : (
                            <button className="pay-btn" onClick={() => { setPayingId(payment.id); setSelectedMethod(''); }} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                              background: 'transparent', border: '1.5px solid #1a1510',
                              fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700,
                              color: '#1a1510', padding: '0.4rem 1rem', cursor: 'pointer',
                              letterSpacing: '0.06em', textTransform: 'uppercase',
                              transition: 'background 0.15s, color 0.15s',
                            }}>
                              Pay Now <ChevronRight size={11} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1rem', background: '#fff', border: '1px solid #e8e2db' }}>
          <ShieldCheck size={14} color="#1a7a4a" />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#8a857f', margin: 0 }}>
            All transactions are encrypted and logged. For disputes, contact the registrar's office.
          </p>
        </div>

      </div>
    </Layout>
  );
}