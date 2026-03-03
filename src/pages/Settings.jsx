import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Mail, Phone, MapPin, Calendar, Save, Loader2, 
  ShieldCheck, Smartphone, GraduationCap, Building2, BadgeCheck 
} from 'lucide-react';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        emergency_contact: profile.emergency_contact || '',
        emergency_phone: profile.emergency_phone || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      if (refreshProfile) await refreshProfile();
      
      setMessage({ text: 'Changes saved successfully ✨', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Shared class for the deep dark cards
  const cardStyle = "bg-[#0a0c14] border border-[#1a1d29] rounded-[2rem] p-8 shadow-2xl transition-all hover:border-[#2a2f42]";
  const inputStyle = "w-full px-4 py-3 bg-[#131622] border border-[#1f2335] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm text-slate-200 transition-all outline-none placeholder:text-slate-600";
  const labelStyle = "text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-2 block";

  return (
    <Layout title="Account Settings">
      <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4">
        
        {/* Profile Hero Section */}
        <div className="relative overflow-hidden bg-[#0a0c14] border border-[#1a1d29] rounded-[2.5rem] p-10 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-black shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                {formData.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-full border-[6px] border-[#0a0c14]">
                <BadgeCheck className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-100">{formData.full_name || 'New Student'}</h2>
              <p className="text-blue-400 font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" /> {user?.email}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400">ID: {profile?.student_id || '---'}</span>
                <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full text-[10px] font-bold uppercase tracking-wider">{profile?.department || 'General'}</span>
              </div>
            </div>
          </div>
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Details */}
              <div className={cardStyle}>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-10 flex items-center gap-3">
                  <span className="h-px w-8 bg-blue-500/30"></span> Personal Profile
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelStyle}>Full Name</label>
                    <input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Residential Address</label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-4 h-4 w-4 text-slate-600" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className={`${inputStyle} resize-none`}
                        placeholder="Complete Address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={cardStyle}>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-10 flex items-center gap-3">
                  <span className="h-px w-8 bg-emerald-500/30"></span> Contact & Emergency
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelStyle}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="+63 000 000 0000"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Emergency Contact</label>
                    <input
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="Guardian name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Emergency Phone</label>
                    <input
                      type="tel"
                      name="emergency_phone"
                      value={formData.emergency_phone}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="Guardian contact number"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-6 p-4">
                {message.text && (
                  <div className={`flex items-center gap-2 text-sm font-bold ${
                    message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    <ShieldCheck className="h-4 w-4" /> {message.text}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto flex items-center gap-3 px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Configuration
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0a0c14] border border-[#1a1d29] rounded-[2rem] p-8 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">System Records</h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Year Level', val: `Year ${profile?.year_level || 1}`, icon: GraduationCap, color: 'text-blue-400' },
                  { label: 'Department', val: profile?.department || 'Not Set', icon: Building2, color: 'text-indigo-400' },
                  { label: 'Registration', val: profile?.created_at ? new Date(profile.created_at).getFullYear() : '2024', icon: Calendar, color: 'text-emerald-400' }
                ].map((item, idx) => (
                  <div key={idx} className="group p-4 bg-[#131622] border border-[#1f2335] rounded-2xl flex items-center gap-4 transition-all hover:border-blue-500/30">
                    <div className={`p-3 bg-[#1a1d29] rounded-xl ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</p>
                      <p className="text-sm font-bold text-slate-200">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Student</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Academic records are synced with the University registrar. Contact support for ID corrections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}