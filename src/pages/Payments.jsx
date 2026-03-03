import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle, Download } from 'lucide-react';

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPayments(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setLoading(false);
      }
    };

    fetchPayments();

    const channel = supabase
      .channel('payment_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid':
        return { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', text: 'Paid' };
      case 'pending':
        return { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', text: 'Pending' };
      case 'overdue':
        return { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', text: 'Overdue' };
      default:
        return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', text: status };
    }
  };

  const totalPending = payments
    .filter((p) => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  if (loading) {
    return (
      <Layout title="Payments">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-card border border-border rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Payments">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Payment Management</h2>
          <p className="text-muted-foreground mt-1">View and manage your tuition and fees</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-2xl font-bold text-foreground">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid This Semester</p>
                <p className="text-2xl font-bold text-foreground">${totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">
                  {payments.filter((p) => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((payment) => {
                  const statusConfig = getStatusConfig(payment.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={payment.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {payment.description || payment.payment_type}
                          </p>
                          <p className="text-xs text-muted-foreground">{payment.semester}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-foreground">
                          ${parseFloat(payment.amount || 0).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">
                          {payment.due_date
                            ? new Date(payment.due_date).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.status === 'paid' ? (
                          <button className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            Receipt
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                            Pay Now
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
            <div className="p-12 text-center">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No payment records</h3>
              <p className="text-muted-foreground">Your payment history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
