import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckCircle2,
  Clock,
  CircleAlert as AlertCircle,
  Download,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Receipt
} from 'lucide-react';

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [payingId, setPayingId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const paymentMethods = [
    { value: 'gcash', label: 'Gcash', icon: Smartphone },
    { value: 'bank', label: 'Bank Transfer', icon: Banknote },
    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
  ];

  const fetchPayments = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid': return { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', text: 'Confirmed' };
      case 'pending': return { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', text: 'Processing' };
      case 'overdue': return { icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', text: 'Outstanding' };
      default: return { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700', text: status };
    }
  };

  const handlePayment = async (paymentId, method) => {
    setProcessingId(paymentId);
    try {
      await supabase.from('payments').update({ status: 'pending', payment_method: method }).eq('id', paymentId);
      
      // Simulated processing
      setTimeout(async () => {
        await supabase.from('payments').update({ status: 'paid', transaction_id: `TXN-${Math.random().toString(36).toUpperCase().slice(2, 9)}` }).eq('id', paymentId);
        setProcessingId(null);
        setPayingId(null);
      }, 2500);
    } catch (err) {
      console.error(err);
      setProcessingId(null);
    }
  };

  const totals = {
    due: payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    paid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  };

  if (loading) return (
    <Layout title="Payments">
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-medium">Loading ledger...</p>
      </div>
    </Layout>
  );

  return (
    <Layout title="Payments">
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white">Billing & Ledger</h2>
            <p className="text-slate-400 max-w-md">Manage your academic investments and track tuition status in real-time.</p>
          </div>
          
          <div className="flex items-center gap-3 p-1 bg-slate-900/50 border border-slate-800 rounded-2xl">
             <div className="px-6 py-3">
                <p className="text-[10px] font-black text-slate-500 uppercase">Balance Due</p>
                <p className="text-2xl font-black text-rose-400 font-mono">₱{totals.due.toLocaleString()}</p>
             </div>
             <div className="w-px h-10 bg-slate-800" />
             <div className="px-6 py-3 text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase">Settled</p>
                <p className="text-2xl font-black text-emerald-400 font-mono">₱{totals.paid.toLocaleString()}</p>
             </div>
          </div>
        </div>

        {/* Desktop Table Design */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-slate-950 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Receipt className="text-primary h-6 w-6" />
                Transaction History
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Billing Details</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Amount</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {payments.map((payment) => {
                    const config = getStatusConfig(payment.status);
                    const StatusIcon = config.icon;
                    const isProcessing = processingId === payment.id;

                    return (
                      <tr key={payment.id} className="hover:bg-slate-900/30 transition-all duration-300">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-100 mb-1 capitalize text-base">
                            {payment.description || payment.payment_type}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium italic">
                            {payment.semester} • Due {payment.due_date ? new Date(payment.due_date).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-lg font-black text-white font-mono">
                            ₱{parseFloat(payment.amount || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${config.bg} ${config.color} ${config.border}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-wider">{config.text}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {payment.status === 'paid' ? (
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700">
                              <Download className="h-4 w-4" /> Receipt
                            </button>
                          ) : payingId === payment.id ? (
                            <div className="flex items-center justify-end gap-2">
                               <select 
                                 className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 ring-primary"
                                 onChange={(e) => setSelectedMethod(e.target.value)}
                               >
                                 <option value="">Select Method</option>
                                 {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                               </select>
                               <button 
                                 disabled={!selectedMethod || isProcessing}
                                 onClick={() => handlePayment(payment.id, selectedMethod)}
                                 className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl disabled:opacity-50"
                               >
                                 {isProcessing ? '...' : 'PAY'}
                               </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setPayingId(payment.id)}
                              className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-primary hover:text-white rounded-xl text-xs font-black transition-all transform hover:scale-105"
                            >
                              PAY NOW <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {payments.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800">
                  <span className="text-2xl font-black text-slate-700 italic">₱</span>
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No entries found in ledger</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}