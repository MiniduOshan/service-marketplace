import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ShieldAlert, DollarSign } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../lib/api';

export default function AdminRefunds() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadRefunds = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await apiRequest('/admin/refunds');
      const refundsData = response.data?.data ? response.data.data : response.data;
      setRefunds(Array.isArray(refundsData) ? refundsData : (refundsData?.data || []));
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load refund requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const handleApprove = async (paymentId) => {
    if (!window.confirm('Are you sure you want to approve this refund? This will return the payment amount to the customer\'s wallet.')) {
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await apiRequest(`/admin/refunds/${paymentId}/approve`, {
        method: 'POST',
      });
      setSuccessMessage(res.message || 'Refund request approved successfully.');
      loadRefunds();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to approve refund.');
    }
  };

  const handleReject = async (paymentId) => {
    if (!window.confirm('Are you sure you want to reject this refund request?')) {
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await apiRequest(`/admin/refunds/${paymentId}/reject`, {
        method: 'POST',
      });
      setSuccessMessage(res.message || 'Refund request rejected successfully.');
      loadRefunds();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to reject refund.');
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 border border-red-100/50">
            <DollarSign size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Refund Requests</h2>
            <p className="text-xs text-slate-500">Manage, approve, or reject customer cancellation refund claims.</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
            Loading refund requests...
          </div>
        ) : (
          <>
            {refunds.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="grid gap-4 bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid-cols-[1.5fr_1fr_1fr_1.5fr_1fr] sm:px-6">
                  <span>Customer & Booking</span>
                  <span>Provider</span>
                  <span>Amount</span>
                  <span>Cancel Reason</span>
                  <span>Actions</span>
                </div>
                <div className="divide-y divide-slate-100 bg-white">
                  {refunds.map((refund) => (
                    <div key={refund.id} className="grid gap-4 px-4 py-3 sm:grid-cols-[1.5fr_1fr_1fr_1.5fr_1fr] sm:px-6">
                      <div>
                        <p className="font-semibold text-xs text-slate-900">
                          {refund.booking?.customer?.name || 'Customer'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {refund.booking?.customer?.email || 'N/A'}
                        </p>
                        <p className="mt-1 text-[10px] font-bold text-slate-400">
                          Booking ID: #{refund.booking_id}
                        </p>
                      </div>

                      <div className="text-xs text-slate-600 self-center">
                        {refund.booking?.worker?.name || 'Worker'}
                      </div>

                      <div className="text-xs font-bold text-slate-800 self-center">
                        {refund.currency} {parseFloat(refund.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>

                      <div className="text-xs text-slate-500 self-center italic">
                        {refund.booking?.cancel_reason || 'No cancellation reason specified.'}
                      </div>

                      <div className="flex flex-wrap gap-1.5 self-center">
                        <button
                          type="button"
                          onClick={() => handleApprove(refund.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 px-2.5 py-1 text-xs font-semibold text-emerald-700 cursor-pointer"
                        >
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(refund.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-red-50 hover:bg-red-100 border border-red-200/50 px-2.5 py-1 text-xs font-semibold text-red-700 cursor-pointer"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <ShieldAlert size={36} className="mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-800">No active refund requests found.</p>
                <p className="mt-1 text-xs text-slate-500">All cancellation refund claims are currently settled.</p>
              </div>
            )}
          </>
        )}
      </section>
    </AdminLayout>
  );
}
