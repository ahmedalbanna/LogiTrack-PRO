/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Receipt, 
  Users, 
  BarChart3, 
  Search, 
  Bell, 
  Settings, 
  HelpCircle,
  Plus,
  Warehouse,
  Construction,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  History,
  Info,
  ChevronLeft,
  Save,
  Trash2,
  CalendarDays,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calculator,
  Download,
  Filter,
  Bolt,
  Calendar,
  AlertCircle,
  MapPin,
  CalendarCheck,
  RefreshCw,
  Sun,
  Moon,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  ArrowRightLeft,
  FileText,
  X,
  Layers,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  User,
  ShieldAlert,
  Map as MapIcon,
  Navigation,
  Activity,
  Star
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';

// --- Types ---
type View = 'dashboard' | 'inventory' | 'shipments' | 'invoices' | 'suppliers' | 'reports';
type Theme = 'light' | 'dark';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning';
  time: string;
}

// --- Shared Components ---

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  title: string, 
  message: string 
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-surface border border-border w-full max-w-md p-8 rounded-sm relative z-10 shadow-2xl"
      >
        <div className="flex items-center gap-4 text-red-500 mb-6">
          <AlertTriangle className="w-8 h-8" />
          <h3 className="text-xl font-bold uppercase tracking-widest">{title}</h3>
        </div>
        <p className="text-sm text-on-background opacity-60 mb-10 leading-relaxed font-medium">
          {message}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 border border-border text-on-background opacity-40 hover:opacity-100 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            إلغاء
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-4 bg-red-500 text-black hover:bg-red-600 transition-all text-[10px] font-bold uppercase tracking-widest shadow-lg"
          >
            تأكيد الحذف
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ currentView, onViewChange }: { currentView: View, onViewChange: (v: View) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'inventory', label: 'المخزون', icon: Package },
    { id: 'shipments', label: 'الشحنات', icon: Truck },
    { id: 'invoices', label: 'الفواتير', icon: Receipt },
    { id: 'suppliers', label: 'الموردين', icon: Users },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 h-full fixed right-0 top-0 bg-surface border-l border-border z-50 flex flex-col transition-colors duration-300">
      <div className="p-6 border-b border-border h-24 flex items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-sm shadow-sm flex items-center justify-center">
            <Warehouse className="text-black w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-background tracking-widest uppercase">Lumina</h2>
            <p className="text-[10px] text-accent font-bold uppercase tracking-[0.2em] mt-0.5">لوجستيات برو</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-12 px-4 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-300 text-[11px] uppercase tracking-[0.2em] font-medium rounded-sm ${
              currentView === item.id 
                ? 'text-accent bg-accent/5 border-r border-accent' 
                : 'text-on-background opacity-60 hover:opacity-100 hover:bg-surface-secondary'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-border">
        <div className="bg-surface-secondary p-6 rounded-sm text-on-background border border-border">
          <p className="text-[10px] text-accent font-bold mb-2 uppercase tracking-[0.3em]">ملف الاستخدام</p>
          <div className="w-full bg-border h-1 rounded-full overflow-hidden mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              className="bg-accent h-full" 
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-[10px] opacity-40 uppercase tracking-widest">حالة التخزين</span>
            <span className="text-[10px] font-bold uppercase text-accent">72% نشط</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ theme, toggleTheme, notifications }: { 
  theme: Theme, 
  toggleTheme: () => void,
  notifications: Notification[] 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-24 w-full fixed top-0 right-64 left-0 bg-background border-b border-border z-40 flex items-center justify-between px-12 transition-colors duration-300">
      <div className="flex items-center gap-12">
        <h1 className="text-xl font-bold text-on-background uppercase tracking-[0.2em] shrink-0">مركز العمليات</h1>
        <div className="relative group hidden md:block">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent opacity-60 group-focus-within:opacity-100 transition-opacity" />
          <input 
            type="text" 
            placeholder="البحث في المخزون العالمي..."
            className="w-96 bg-surface-secondary border border-border rounded-sm py-2.5 pr-12 pl-4 text-[11px] uppercase tracking-widest text-on-background focus:border-accent focus:ring-0 outline-none transition-all placeholder:opacity-40"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-on-background opacity-40 hover:opacity-100 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-on-background opacity-40 hover:opacity-100 transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 left-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-80 bg-surface border border-border rounded-sm shadow-2xl z-50 p-4"
                >
                  <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">التنبيهات</span>
                    <button className="text-[9px] opacity-40 hover:opacity-100 uppercase" onClick={() => setShowNotifications(false)}>إغلاق</button>
                  </div>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-center opacity-40 py-8">لا توجد تنبيهات جديدة</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="flex gap-4 p-3 hover:bg-surface-secondary rounded-sm transition-colors border-b border-border last:border-0 pb-3">
                          <div className={`mt-1 shrink-0 ${n.type === 'alert' ? 'text-red-500' : n.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`}>
                            {n.type === 'alert' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-on-background">{n.title}</p>
                            <p className="text-[10px] opacity-60 mt-1 leading-relaxed">{n.message}</p>
                            <span className="text-[9px] opacity-30 mt-2 block uppercase tracking-widest">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="p-2 text-on-background opacity-40 hover:opacity-100 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-10 w-px bg-border mx-2 hidden md:block"></div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-on-background uppercase tracking-widest leading-none">أحمد المحمد</p>
            <p className="text-[10px] text-accent mt-1 uppercase tracking-luxury font-bold">المدير الرئيسي</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-accent flex items-center justify-center text-[11px] font-bold tracking-tighter shrink-0 bg-surface-secondary">
            AM
          </div>
        </div>
      </div>
    </header>
  );
};

const ShipmentDetailModal = ({ isOpen, onClose, shipment }: { 
  isOpen: boolean, 
  onClose: () => void, 
  shipment: any 
}) => {
  if (!isOpen || !shipment) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-surface border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm relative z-10 shadow-luxury"
      >
        <div className="sticky top-0 bg-surface border-b border-border p-8 flex justify-between items-center z-20">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-sm flex items-center justify-center">
                    <Truck className="text-black w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold uppercase tracking-widest text-on-background">تفاصيل البيان #{shipment.id}</h3>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">تتبع المسار والتحقق من الامتثال</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-on-background/5 rounded-full transition-all">
                <X className="w-6 h-6 opacity-40 hover:opacity-100" />
            </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-10">
                <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6 border-b border-border pb-2">المعلومات اللوجستية</h4>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="text-[9px] opacity-40 uppercase tracking-widest block mb-1">المنشأ</span>
                            <p className="font-bold text-sm">{shipment.from}</p>
                        </div>
                        <div>
                            <span className="text-[9px] opacity-40 uppercase tracking-widest block mb-1">الوجهة</span>
                            <p className="font-bold text-sm">{shipment.to}</p>
                        </div>
                        <div>
                            <span className="text-[9px] opacity-40 uppercase tracking-widest block mb-1">الحمولة</span>
                            <p className="font-bold text-sm font-mono">{shipment.qty}</p>
                        </div>
                        <div>
                            <span className="text-[9px] opacity-40 uppercase tracking-widest block mb-1">تاريخ العمل</span>
                            <p className="font-bold text-sm font-mono">{shipment.date}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6 border-b border-border pb-2">سجل التسليم (History)</h4>
                    <div className="space-y-4">
                        {[
                            { time: '10:00 AM', event: 'مغادرة نقطة الأصل', status: 'مكتمل' },
                            { time: '02:30 PM', event: 'الوصول لنقطة التفتيش 1', status: 'مكتمل' },
                            { time: '05:45 PM', event: 'دخول السياج الجغرافي للمستودع', status: 'قيد المعالجة' },
                        ].map((h, i) => (
                            <div key={i} className="flex gap-4 items-center p-4 bg-on-background/5 border border-border rounded-sm">
                                <span className="text-[10px] font-mono opacity-40">{h.time}</span>
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-tight">{h.event}</p>
                                </div>
                                <span className="text-[9px] px-2 py-0.5 bg-accent/10 text-accent font-bold uppercase">{h.status}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="space-y-10">
                <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6 border-b border-border pb-2">المستندات المرفقة</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {['MANIFEST_A.pdf', 'CUSTOMS_CERT.pdf', 'INSURANCE_DOC.jpg'].map((doc, i) => (
                            <div key={i} className="p-6 bg-surface-secondary border border-border rounded-sm flex flex-col items-center gap-3 group hover:border-accent transition-all cursor-pointer">
                                <FileText className="w-8 h-8 text-accent opacity-20 group-hover:opacity-100 transition-all" />
                                <span className="text-[10px] font-bold opacity-40 group-hover:opacity-100">{doc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-accent/5 border border-accent/20 p-8 rounded-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">تفاصيل السائق والرسائل</h4>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-[9px] font-bold uppercase tracking-widest text-green-500">متصل</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-surface border border-accent/40 flex items-center justify-center font-bold text-accent">FS</div>
                        <div>
                            <p className="text-sm font-bold">فهد السعدون</p>
                            <p className="text-[10px] opacity-40 uppercase tracking-widest">توجيه: مركبة النقل الثقيل #12</p>
                        </div>
                    </div>
                    <button className="w-full py-4 bg-accent text-black font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg hover:bg-accent/80 transition-all">تواصل فوري</button>
                </section>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardView = () => {
  const warehouses = [
    { id: 'WH-001', name: 'المستودع المركزي - الرياض', loc: 'المنطقة الصناعية الثانية', type: 'أساسي', status: 'نشط', statusColor: 'bg-accent' },
    { id: 'WH-042', name: 'مستودع جدة البحري', loc: 'ميناء جدة الإسلامي', type: 'ثانوي', status: 'ممتلئ', statusColor: 'bg-red-500' },
    { id: 'WH-089', name: 'مركز توزيع الدمام', loc: 'حي الخالدية', type: 'مؤقت', status: 'صيانة', statusColor: 'bg-amber-500' },
    { id: 'WH-112', name: 'مخزن التبريد - أبها', loc: 'طريق الملك فهد', type: 'أساسي', status: 'نشط', statusColor: 'bg-accent' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-[64px] font-light text-on-background leading-none mb-4 font-serif transition-colors">مركز <span className="italic text-accent">التحكم</span></h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-on-background opacity-40">توزيع لوجستي متكامل ومستودعات في الوقت الفعلي</p>
        </div>
        <button className="bg-accent hover:bg-accent/80 text-black px-12 py-4 rounded-sm flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          إضافة مستودع
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المستودعات', val: '24', icon: Warehouse, color: 'text-accent', secondary: 'الإجمالي' },
          { label: 'مستودعات نشطة', val: '18', icon: CheckCircle2, color: 'text-on-background', secondary: 'نشط' },
          { label: 'تحت الصيانة', val: '04', icon: Construction, color: 'text-accent', secondary: 'خدمة' },
          { label: 'مستودعات ممتلئة', val: '02', icon: AlertTriangle, color: 'text-red-500', secondary: 'الحد' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface border border-border p-8 rounded-sm relative overflow-hidden group transition-colors duration-300">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-1.5 rounded-sm bg-surface-secondary ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 border border-border rounded-full tracking-widest uppercase opacity-60 ${stat.color}`}>{stat.secondary}</span>
            </div>
            <h3 className="text-4xl font-light text-on-background font-serif relative z-10 transition-colors">{stat.val}</h3>
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mt-2 relative z-10">{stat.label}</p>
            <div className="absolute inset-0 bg-gradient-to-br from-on-background/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-surface border border-border rounded-sm overflow-hidden flex flex-col transition-colors duration-300">
          <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-on-background/[0.02]">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">ملف مخزون المستودعات</h3>
            <div className="flex gap-4">
              <button className="text-on-background opacity-40 hover:opacity-100 transition-all"><Filter className="w-4 h-4" /></button>
              <button className="text-on-background opacity-40 hover:opacity-100 transition-all"><Download className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-on-background opacity-40 uppercase tracking-[0.25em]">
                  <th className="px-8 py-4">المعرف</th>
                  <th className="px-8 py-4">المنشأة</th>
                  <th className="px-8 py-4">الموقع</th>
                  <th className="px-8 py-4">النوع</th>
                  <th className="px-8 py-4">الحالة</th>
                  <th className="px-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {warehouses.map((w) => (
                  <tr key={w.id} className="hover:bg-on-background/[0.02] transition-colors group">
                    <td className="px-8 py-5 text-[10px] font-mono opacity-40 transition-colors">{w.id}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-on-background group-hover:text-accent transition-colors">{w.name}</p>
                    </td>
                    <td className="px-8 py-5 text-xs opacity-60 text-on-background transition-colors">{w.loc}</td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold px-2 py-0.5 border border-border text-on-background opacity-60 uppercase transition-colors">{w.type}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1 h-1 rounded-full ${w.statusColor}`}></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-background opacity-80 transition-colors">{w.status}</span>
                      </div>
                    </td>
                    <td className="px-8">
                       <button className="opacity-0 group-hover:opacity-100 text-accent transition-all"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-sm overflow-hidden flex flex-col h-[500px] transition-colors duration-300">
          <div className="px-8 py-6 border-b border-border">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">تصور الشبكة</h3>
          </div>
          <div className="flex-1 relative bg-black">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale opacity-20 mix-blend-screen"
              alt="Map" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            <div className="absolute top-[40%] right-[45%]">
              <MapPin className="text-accent w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="p-8 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-background opacity-40">التشبع الإقليمي</h4>
            <div className="space-y-4">
              {[
                { label: 'الوسطى', val: 92 },
                { label: 'الغربية', val: 65 },
              ].map((reg, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2 font-medium">
                    <span className="opacity-60">أرشيف {reg.label}</span>
                    <span className="text-accent">{reg.val}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-border overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${reg.val}%` }} className="h-full bg-accent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryView = () => {
  const items = [
    { id: 'SKU-98012', name: 'محرك كهربائي توربيني X2', cat: 'قطع غيار ثقيلة', recorded: 145, actual: 145, diff: 0 },
    { id: 'SKU-77231', name: 'كابلات ألياف بصرية 50م', cat: 'شبكات', recorded: 420, actual: 412, diff: -8 },
    { id: 'SKU-10294', name: 'محول جهد عالي 500W', cat: 'طاقة', recorded: 88, actual: 88, diff: 0 },
    { id: 'SKU-55421', name: 'طقم براغي صلب مجلفن', cat: 'أدوات تثبيت', recorded: 1215, actual: 1215, diff: 0 },
    { id: 'SKU-33290', name: 'مستشعر حرارة صناعي', cat: 'إلكترونيات', recorded: 64, actual: 64, diff: 0 },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-[64px] font-light text-on-background leading-none mb-4 font-serif">تسوية <span className="italic text-accent">المخزون</span></h2>
          <div className="flex flex-wrap items-center gap-6 text-on-background opacity-40">
            <div className="flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest">المستودع المركزي الرئيسي (A12)</span>
            </div>
            <div className="flex items-center gap-2 border-r pr-6 border-border">
              <CalendarDays className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest">المصالحة: أكتوبر 2024</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 font-bold text-[10px] border border-border text-on-background rounded-sm hover:bg-on-background/5 transition-all uppercase tracking-[0.3em] flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            حساب الفروقات
          </button>
          <button className="px-12 py-4 font-bold text-[10px] bg-accent text-black rounded-sm hover:bg-accent/80 flex items-center gap-2 uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95">
            <CheckCircle2 className="w-4 h-4" />
            تأكيد التسوية
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الأصناف', val: '1,284', icon: Package, color: 'text-accent', bg: 'bg-on-background/5' },
          { label: 'فائض إيجابي', val: '+42', icon: TrendingUp, color: 'text-green-500', bg: 'bg-on-background/5' },
          { label: 'عجز سلبي', val: '-18', icon: TrendingDown, color: 'text-red-500', bg: 'bg-on-background/5' },
          { label: 'دقة الجرد', val: '98.4%', icon: Info, color: 'text-accent', bg: 'bg-on-background/5' },
        ].map((stat, i) => (
          <div key={i} className={`bg-surface border border-border p-8 rounded-sm overflow-hidden relative group transition-colors duration-300`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-2 rounded-sm bg-surface-secondary ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className={`text-4xl font-light font-serif ${stat.color} mb-2`}>{stat.val}</h3>
            <p className="text-[10px] font-bold text-on-background opacity-40 uppercase tracking-[0.3em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-sm overflow-hidden flex flex-col transition-colors duration-300">
        <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-on-background/[0.02]">
          <div className="flex items-center gap-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">سجل تسوية المخزون النشط</h3>
            <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-accent/10 text-accent border border-accent/20 font-bold">24 صنفاً بانتظار المراجعة</span>
          </div>
          <div className="flex gap-4">
            <button className="text-on-background opacity-40 hover:opacity-100 transition-all"><Filter className="w-4 h-4" /></button>
            <button className="text-on-background opacity-40 hover:opacity-100 transition-all"><Download className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold text-on-background opacity-20 uppercase tracking-[0.25em]">
                <th className="px-8 py-4 w-32">رقم البيان</th>
                <th className="px-8 py-4">اسم الصنف في الكتالوج</th>
                <th className="px-8 py-4">الفئة</th>
                <th className="px-8 py-4 text-center">سجل النظام</th>
                <th className="px-8 py-4 text-center w-48">الفحص الفعلي</th>
                <th className="px-8 py-4 text-center">التباين</th>
                <th className="px-8 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className={`hover:bg-on-background/[0.02] transition-colors group ${item.diff < 0 ? 'bg-red-500/[0.02]' : item.diff > 0 ? 'bg-green-500/[0.02]' : ''}`}>
                  <td className="px-8 py-6 font-mono text-[10px] opacity-40">#{item.id}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium text-on-background group-hover:text-accent transition-colors">{item.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-on-background opacity-40 border border-border px-2 py-0.5 rounded-sm uppercase tracking-widest">{item.cat}</span>
                  </td>
                  <td className="px-8 py-6 text-center text-sm text-on-background opacity-60 font-medium">{item.recorded} وحدة</td>
                  <td className="px-8 py-6">
                    <input 
                      type="number" 
                      defaultValue={item.actual}
                      className={`w-full text-center py-3 bg-surface-secondary border border-border rounded-sm focus:border-accent outline-none text-xs font-bold transition-all ${
                        item.diff === 0 ? 'text-on-background/60' : item.diff < 0 ? 'text-red-500' : 'text-green-500'
                      }`}
                    />
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-xs font-bold font-mono tracking-widest ${item.diff === 0 ? 'text-on-background/20' : item.diff < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {item.diff === 0 ? '0' : item.diff > 0 ? `+${item.diff}` : item.diff}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <button className="text-accent opacity-0 group-hover:opacity-100 transition-all">
                      {item.diff !== 0 ? <History className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="px-8 py-6 border-t border-border flex justify-between items-center text-[9px] font-bold text-on-background opacity-20 uppercase tracking-[0.3em]">
          <span>عرض 5 من أصل 1,284 صنف</span>
          <div className="flex gap-1 h-8">
            <button className="px-4 border border-border flex items-center justify-center hover:bg-on-background/5 transition-all">السابق</button>
            <button className="w-8 border border-accent text-accent flex items-center justify-center bg-accent/10">1</button>
            <button className="w-8 border border-border flex items-center justify-center hover:bg-on-background/5 transition-all">2</button>
            <button className="px-4 border border-border flex items-center justify-center hover:bg-on-background/5 transition-all">التالي</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

const InvoiceView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
  
  const [invoices, setInvoices] = useState([
    { id: 'INV-2024-001', supplier: 'اللوجستيات العالمية', amount: '50,400.00', status: 'مدفوع', date: '2024-10-01' },
    { id: 'INV-2024-002', supplier: 'مجموعة الخليج', amount: '12,250.00', status: 'قيد الانتظار', date: '2024-10-05' },
    { id: 'INV-2024-003', supplier: 'الموردين العرب', amount: '8,750.00', status: 'متأخر', date: '2024-09-20' },
  ]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => 
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.amount.includes(searchTerm)
    );
  }, [searchTerm, invoices]);

  const handleDelete = () => {
    if (deleteModal.id) {
      setInvoices(invoices.filter(inv => inv.id !== deleteModal.id));
    }
  };

  return (
    <div className="space-y-12">
      <ConfirmationModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null })} 
        onConfirm={handleDelete}
        title="تأكيد حذف الفاتورة"
        message="هل أنت متأكد أنك تريد حذف هذه الفاتورة؟ هذه العملية لا يمكن التراجع عنها وسيتم فقدان البيانات المالية المرتبطة بها نهائياً."
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-[64px] font-light text-on-background leading-none mb-4 font-serif">مركز <span className="italic text-accent">الفواتير</span></h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-on-background opacity-40">التوثيق المالي والأرشفة المؤسسية</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 font-bold text-[10px] border border-border text-on-background rounded-sm hover:bg-on-background/5 transition-all uppercase tracking-[0.3em]">إلغاء</button>
          <button className="bg-accent hover:bg-accent/80 text-black px-12 py-4 rounded-sm text-[10px] uppercase font-bold tracking-[0.3em] transition-all shadow-lg flex items-center gap-4 active:scale-95">
            <Save className="w-4 h-4" />
            أرشفة المستند
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-surface border border-border rounded-sm p-6 md:p-12 transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-border pb-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">سجل الهوية الأساسي</h3>
              <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent opacity-40" />
                <input 
                  type="text"
                  placeholder="ابحث برقم الفاتورة أو المورد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-sm py-2 pr-10 pl-3 text-[10px] uppercase tracking-widest text-on-background focus:border-accent outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold text-on-background opacity-20 uppercase tracking-[0.25em]">
                    <th className="px-4 py-4">رقم الفاتورة</th>
                    <th className="px-4 py-4">المورد</th>
                    <th className="px-4 py-4 text-center">المبلغ</th>
                    <th className="px-4 py-4 text-center">التاريخ</th>
                    <th className="px-4 py-4 text-center">الحالة</th>
                    <th className="px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-on-background/[0.02] transition-colors group">
                      <td className="px-4 py-6 font-mono text-[10px] opacity-40">{inv.id}</td>
                      <td className="px-4 py-6 font-medium text-on-background group-hover:text-accent transition-all">{inv.supplier}</td>
                      <td className="px-4 py-6 text-center text-sm font-bold text-on-background">{inv.amount}</td>
                      <td className="px-4 py-6 text-center text-[10px] opacity-40 uppercase tracking-widest">{inv.date}</td>
                      <td className="px-4 py-6 text-center">
                        <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${
                          inv.status === 'مدفوع' ? 'bg-green-500/10 text-green-500' :
                          inv.status === 'قيد الانتظار' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-6">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="text-accent ring-1 ring-border p-1 rounded-sm"><MoreVertical className="w-3.5 h-3.5" /></button>
                            <button 
                                onClick={() => setDeleteModal({ isOpen: true, id: inv.id })}
                                className="text-red-500 ring-1 ring-border p-1 rounded-sm hover:bg-red-500/10"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[10px] opacity-40 uppercase tracking-[0.2em]">لا توجد فواتير تطابق بحثك</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-sm overflow-hidden flex flex-col transition-colors duration-300">
            <div className="px-12 py-6 border-b border-border flex justify-between items-center bg-on-background/[0.02]">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">بيان حيازة المخزون</h3>
              <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-background opacity-40 hover:opacity-100 flex items-center gap-2 transition-all">
                <Plus className="w-3 h-3" />
                إنشاء إدخال جديد
              </button>
            </div>
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-on-background opacity-20 uppercase tracking-[0.25em]">
                  <th className="px-12 py-4">سجل SKU</th>
                  <th className="px-12 py-4">المواصفات</th>
                  <th className="px-12 py-4 text-center">عدد الوحدات</th>
                  <th className="px-12 py-4 text-center">التقييم</th>
                  <th className="px-12 py-4 text-center">الإجمالي</th>
                  <th className="px-12 whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-on-background/[0.02] transition-colors group">
                  <td className="px-12 py-6 font-mono text-[10px] opacity-40 transition-colors">SKU-8821</td>
                  <td className="px-12 py-6 font-medium text-on-background group-hover:text-accent transition-all transition-colors ">وحدات تبريد صناعية - X5</td>
                  <td className="px-12 py-6 text-center text-sm font-medium text-on-background/60 transition-colors">12</td>
                  <td className="px-12 py-6 text-center text-sm font-medium text-on-background/60 transition-colors">4,200.00</td>
                  <td className="px-12 py-6 text-center font-bold text-on-background tracking-widest transition-colors">50,400.00</td>
                  <td className="px-12 py-6">
                    <button 
                        onClick={() => setDeleteModal({ isOpen: true, id: 'SKU-8821' })}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="bg-surface border border-border rounded-sm p-12 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-12 pb-6 border-b border-border">
              <RefreshCw className="w-4 h-4 text-accent" />
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">المعايير المالية</h3>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold text-on-background opacity-40 uppercase tracking-widest mb-4">بنية العملة</label>
                <div className="grid grid-cols-2 gap-1 bg-surface-secondary p-1 rounded-sm border border-border">
                  <button className="py-3 rounded-sm font-bold text-[10px] bg-accent text-black shadow-lg uppercase tracking-widest">USD ($)</button>
                  <button className="py-3 rounded-sm font-bold text-[10px] text-on-background opacity-40 hover:opacity-100 transition-all uppercase tracking-widest">SAR (﷼)</button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-on-background opacity-40 uppercase tracking-widest">توقعات أسعار الصرف</label>
                <div className="relative">
                  <input className="w-full bg-surface-secondary border border-border rounded-sm p-4 font-bold text-accent focus:border-accent outline-none text-sm transition-all" type="number" defaultValue="3.75" />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-40 uppercase tracking-widest">SAR</span>
                </div>
              </div>
              <div className="pt-12 space-y-4">
                 <div className="flex justify-between items-baseline mb-6">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">المعادل المحلي (SAR)</span>
                    <span className="text-[32px] font-light font-serif text-on-background leading-none transition-colors">221,812.<span className="text-lg opacity-40 transition-colors">50</span></span>
                 </div>
                 <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                   <span className="opacity-40">مساهمة ضريبة القيمة المضافة (15%)</span>
                   <span className="text-accent">33,271.88</span>
                 </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-on-background/5 border-2 border-dashed border-border rounded-sm py-16 flex flex-col items-center gap-6 hover:border-accent hover:bg-on-background/10 transition-all group">
            <UploadCloud className="w-10 h-10 text-on-background/20 group-hover:text-accent transition-all" />
            <div className="text-center">
              <p className="text-[11px] font-bold text-on-background uppercase tracking-[0.3em] group-hover:text-accent transition-colors">إرفاق ملف PDF آمن</p>
              <p className="text-[9px] text-on-background opacity-20 mt-1 uppercase tracking-widest transition-colors">يدعم التشفير حتى 10 ميجابايت</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const ShipmentsView = () => {
    const [selectedTrack, setSelectedTrack] = useState<string | null>('TRK-98210');
    const [zoom, setZoom] = useState(1);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // Filtering states
    const [statusFilter, setStatusFilter] = useState('الكل');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState('جميع التواريخ');

    const [savedRoutes, setSavedRoutes] = useState([
        { id: 'R1', name: 'خط الإمداد السريع - الرياض/جدة', type: 'رئيسي' },
        { id: 'R2', name: 'مسار التوزيع الحدودي', type: 'ثانوي' }
    ]);

    const drivers = [
        { name: 'فهد السعدون', efficiency: 98, deliveries: 124, incidents: 0, avatar: 'FS' },
        { name: 'خالد اليوسف', efficiency: 92, deliveries: 89, incidents: 1, avatar: 'KY' },
        { name: 'محمد القاسم', efficiency: 86, deliveries: 215, incidents: 3, avatar: 'MQ' },
    ];
    
    const shipments = useMemo(() => [
        { id: 'TRK-98210', from: 'ميناء جدة الإسلامي', to: 'مستودع الرياض المركزي', qty: '450 وحدة', date: '2023/10/24', status: 'قيد العبور', statusColor: 'text-accent border-accent/20 bg-accent/5', x: 45, y: 55, route: [[45, 55], [52, 48], [60, 40]] },
        { id: 'TRK-98209', from: 'منطقة جبل علي', to: 'توزيع الدمام', qty: '1.2k وحدة', date: '2023/10/23', status: 'قيد الانتقال', statusColor: 'text-amber-500 border-amber-500/20 bg-amber-500/5', x: 25, y: 70, route: [[25, 70], [35, 65], [45, 60]] },
        { id: 'TRK-98208', from: 'مستودع دبي الجنوبي', to: 'المركز الرئيسي', qty: '85 وحدة', date: '2023/10/24', status: 'تم التسليم', statusColor: 'text-green-500 border-green-500/20 bg-green-500/5', x: 60, y: 40, route: [[60, 40], [65, 35], [70, 30]] },
    ], []);

    const filteredShipments = useMemo(() => {
        return shipments.filter(s => {
            const matchesStatus = statusFilter === 'الكل' || s.status === statusFilter;
            const matchesSearch = s.from.includes(searchQuery) || s.to.includes(searchQuery) || s.id.includes(searchQuery);
            return matchesStatus && matchesSearch;
        });
    }, [shipments, statusFilter, searchQuery]);

    const clusteredShipments = useMemo(() => {
        if (zoom > 0.6) return filteredShipments.map(s => ({ ...s, cluster: false }));
        return [
            { id: 'cluster-1', count: filteredShipments.length, x: 43, y: 55, cluster: true, status: 'توزيع كثيف' }
        ];
    }, [zoom, filteredShipments]);

    const activeShipment = useMemo(() => shipments.find(s => s.id === selectedTrack), [selectedTrack, shipments]);

    const handleMarkerClick = (s: any) => {
        if (!s.cluster) {
            setSelectedTrack(s.id);
            setIsDetailModalOpen(true);
        }
    };

    return (
        <div className="space-y-12 pb-12">
            <ShipmentDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                shipment={activeShipment} 
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl md:text-[64px] font-light text-on-background leading-none mb-4 font-serif transition-colors">إدارة <span className="italic text-accent">الخدمات</span></h2>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-on-background opacity-40">تتبع الشحنات الديناميكي وتحسين الأسطول</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-surface border border-border text-on-background rounded-sm flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-on-background/5 transition-all">
                        <Navigation className="w-4 h-4 text-accent" />
                        اقتراح المسار الأمثل
                    </button>
                    <button className="bg-accent hover:bg-accent/80 text-black px-12 py-4 rounded-sm flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95 whitespace-nowrap">
                        <Plus className="w-4 h-4" />
                        إنشاء شحنة جديدة
                    </button>
                </div>
            </div>

            {/* Drivers & Route Optimization */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 bg-surface border border-border p-8 rounded-sm relative overflow-hidden transition-colors duration-300">
                    <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-3">
                            <Activity className="w-4 h-4" />
                            مراقبة أداء السائقين (Driver Radar)
                        </h5>
                        <button className="text-[9px] font-bold text-on-background opacity-40 hover:opacity-100 uppercase tracking-widest">تصدير التقرير</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {drivers.map((d, i) => (
                            <div key={i} className="bg-surface-secondary p-6 border border-border rounded-sm group hover:border-accent/40 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-surface border border-accent flex items-center justify-center font-bold text-accent shadow-sm">{d.avatar}</div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-on-background">{d.name}</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className={`w-2.5 h-2.5 ${j < 4 ? 'text-accent fill-accent' : 'text-on-background opacity-10'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[9px] font-bold ${d.incidents > 0 ? 'text-red-500' : 'text-green-500'} uppercase`}>
                                            {d.incidents === 0 ? 'خالٍ من الحوادث' : `${d.incidents} حوادث`}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-40 mb-1 font-bold">
                                            <span>كفاءة التسليم</span>
                                            <span className="text-accent">{d.efficiency}%</span>
                                        </div>
                                        <div className="h-1 bg-border w-full rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${d.efficiency}%` }} className="bg-accent h-full" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold pt-2 border-t border-border mt-3">
                                        <span className="opacity-40 uppercase">إجمالي الشحنات</span>
                                        <span className="font-mono">{d.deliveries}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-surface border border-border p-8 rounded-sm relative overflow-hidden transition-colors duration-300">
                    <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6 border-b border-border pb-4 flex items-center gap-3">
                        <MapIcon className="w-4 h-4" />
                        المسارات المحفوظة
                    </h5>
                    <div className="space-y-4">
                        {savedRoutes.map(route => (
                            <button key={route.id} className="w-full text-right p-4 bg-surface-secondary border border-border rounded-sm hover:border-accent transition-all group">
                                <p className="text-[11px] font-bold text-on-background group-hover:text-accent transition-colors">{route.name}</p>
                                <span className="text-[8px] opacity-20 uppercase font-black tracking-widest mt-1 block">{route.type}</span>
                            </button>
                        ))}
                        <button className="w-full py-4 border border-dashed border-border text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:border-accent transition-all">+ حفظ المسار الحالي</button>
                    </div>
                </div>
            </div>

            {/* Geofencing Alerts (Mocked for UI) */}
            <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1">تنبيه السياج الجغرافي (Geofencing)</p>
                        <p className="text-sm font-medium text-on-background">الشحنة <span className="font-bold text-red-500">TRK-98210</span> غادرت المنطقة الصناعية المحددة في الرياض (قطاع B).</p>
                    </div>
                </div>
                <button className="px-6 py-2 bg-red-500 text-black text-[9px] font-bold uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all">مراجعة المسار</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-12">
                    <div className="bg-surface border border-border rounded-sm overflow-hidden flex flex-col transition-colors duration-300">
                        {/* Table Filters */}
                        <div className="px-8 py-6 border-b border-border grid grid-cols-1 md:grid-cols-4 gap-6 bg-on-background/[0.02]">
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent opacity-40" />
                                <input 
                                    type="text"
                                    placeholder="البحث (ID/مدينة)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface-secondary border border-border rounded-sm py-2 pr-10 pl-3 text-[10px] uppercase tracking-widest text-on-background outline-none focus:border-accent transition-all"
                                />
                            </div>
                            <div className="flex gap-1 h-full items-center px-4">
                                <Filter className="w-3.5 h-3.5 text-accent opacity-40" />
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="flex-1 bg-transparent text-[10px] font-bold uppercase tracking-widest text-on-background outline-none border-none py-2 cursor-pointer"
                                >
                                    <option className="bg-surface">الكل</option>
                                    <option className="bg-surface">قيد العبور</option>
                                    <option className="bg-surface">قيد الانتقال</option>
                                    <option className="bg-surface">تم التسليم</option>
                                </select>
                            </div>
                            <div className="flex gap-1 h-full items-center px-4">
                                <Calendar className="w-3.5 h-3.5 text-accent opacity-40" />
                                <select 
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="flex-1 bg-transparent text-[10px] font-bold uppercase tracking-widest text-on-background outline-none border-none py-2 cursor-pointer"
                                >
                                    <option className="bg-surface">جميع التواريخ</option>
                                    <option className="bg-surface">اليوم</option>
                                    <option className="bg-surface">آخر 7 أيام</option>
                                    <option className="bg-surface">مخصص...</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button className="px-6 py-2 bg-on-background/5 border border-border rounded-sm font-bold text-[10px] text-on-background opacity-40 uppercase tracking-widest hover:opacity-100 transition-all">تصدير الأرشيف</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-[10px] font-bold text-on-background opacity-20 uppercase tracking-[0.25em]">
                                        <th className="px-8 py-4">معرف البيان</th>
                                        <th className="px-8 py-4">المنشأ</th>
                                        <th className="px-8 py-4">الوجهة</th>
                                        <th className="px-8 py-4 text-center">حمولة الوحدة</th>
                                        <th className="px-8 py-4">تاريخ التنفيذ</th>
                                        <th className="px-8 py-4">الحالة</th>
                                        <th className="px-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredShipments.map((row, i) => (
                                        <tr 
                                            key={i} 
                                            onClick={() => setSelectedTrack(row.id)}
                                            className={`hover:bg-on-background/[0.02] transition-colors group cursor-pointer ${selectedTrack === row.id ? 'bg-accent/5' : ''}`}
                                        >
                                            <td className="px-8 py-6 font-mono text-[10px] opacity-40 transition-colors">#{row.id}</td>
                                            <td className="px-8 py-6 text-sm text-on-background group-hover:text-accent transition-all">{row.from}</td>
                                            <td className="px-8 py-6 text-sm text-on-background opacity-60 transition-colors">{row.to}</td>
                                            <td className="px-8 py-6 text-center text-on-background opacity-40 text-xs tracking-widest uppercase transition-colors">{row.qty}</td>
                                            <td className="px-8 py-6 text-on-background opacity-20 text-[10px] uppercase tracking-widest transition-colors">{row.date}</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 border rounded-sm text-[9px] font-bold uppercase tracking-widest ${row.statusColor}`}>{row.status}</span>
                                            </td>
                                            <td className="px-8 py-6 text-left">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setIsDetailModalOpen(true); }}
                                                    className="opacity-0 group-hover:opacity-100 text-accent transition-all p-2 rounded-sm bg-accent/5 flex items-center justify-center"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredShipments.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center text-[11px] opacity-20 italic uppercase tracking-[0.3em]">لا تتوفر شحنات ضمن هذه المعايير</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-surface border border-border rounded-sm p-6 md:p-12 overflow-hidden flex flex-col transition-colors duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">تصور المسار النشط</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">مباشر</span>
                                </div>
                                <button className="text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all border-b border-border pb-1">فتح الخريطة الرئيسية</button>
                            </div>
                        </div>
                        <div className="h-96 rounded-sm overflow-hidden relative bg-black border border-border shadow-inner group/map">
                            <motion.div 
                                animate={{ scale: zoom }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                className="w-full h-full relative"
                            >
                                <img 
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                                className="w-full h-full object-cover opacity-25 grayscale transition-opacity duration-300 pointer-events-none"
                                alt="Map View" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent transition-colors duration-300"></div>
                                
                                {/* Route Visualization */}
                                {activeShipment && (
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                                        <motion.polyline
                                            points={activeShipment.route.map(p => `${p[0]}%,${p[1]}%`).join(' ')}
                                            fill="none"
                                            stroke="var(--color-accent)"
                                            strokeWidth="2"
                                            strokeDasharray="4 4"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            className="opacity-40"
                                        />
                                        <motion.circle
                                            cx={`${activeShipment.x}%`}
                                            cy={`${activeShipment.y}%`}
                                            r="4"
                                            fill="var(--color-accent)"
                                            className="animate-pulse"
                                        />
                                    </svg>
                                )}

                                {clusteredShipments.map((s: any) => (
                                    <motion.div 
                                        key={s.id}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute cursor-pointer group/marker"
                                        style={{ left: `${s.x}%`, top: `${s.y}%` }}
                                        onClick={() => handleMarkerClick(s)}
                                    >
                                        <div className="relative flex flex-col items-center">
                                            {s.cluster ? (
                                                <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center font-bold text-xs border-2 border-white shadow-xl animate-bounce">
                                                    {s.count}
                                                </div>
                                            ) : (
                                                <div className={`p-1.5 rounded-full border transition-all ${selectedTrack === s.id ? 'bg-accent border-white scale-125 z-20 shadow-lg' : 'bg-surface border-accent opacity-60 hover:opacity-100'}`}>
                                                    <MapPin className={`w-4 h-4 ${selectedTrack === s.id ? 'text-black' : 'text-accent'}`} />
                                                </div>
                                            )}
                                            <div className={`absolute bottom-full mb-3 bg-surface border border-border text-on-background px-4 py-2 rounded-sm text-[10px] font-bold whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all z-30 pointer-events-none shadow-luxury`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${s.cluster ? 'bg-accent' : 'bg-green-500'}`}></span>
                                                    {s.id}: {s.status}
                                                </div>
                                                <p className="opacity-40 uppercase tracking-widest">{s.from || 'منطقة مركزية'}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Map Controls */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                                <button 
                                    onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
                                    className="p-3 bg-surface/80 backdrop-blur-md border border-border rounded-sm hover:bg-accent hover:text-black transition-all"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                                    className="p-3 bg-surface/80 backdrop-blur-md border border-border rounded-sm hover:bg-accent hover:text-black transition-all"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <button 
                                    className="p-3 bg-surface/80 backdrop-blur-md border border-border rounded-sm opacity-40 hover:opacity-100 transition-all"
                                >
                                    <Layers className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="absolute bottom-8 right-8 bg-surface/90 backdrop-blur-md border border-border p-6 rounded-sm transition-colors duration-300 text-right shadow-2xl z-20 min-w-48">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-3 border-b border-border pb-2">وضعية المراقبة</p>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest font-black opacity-20 mb-1">المعرف النشط</p>
                                        <p className="text-sm font-bold text-on-background tracking-tighter">{selectedTrack || '--'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] opacity-40 uppercase font-black tracking-widest">السرعة</span>
                                            <span className="text-[11px] font-mono text-accent">85 كم/س</span>
                                        </div>
                                        <div className="flex flex-col border-r pr-4 border-border">
                                            <span className="text-[8px] opacity-40 uppercase font-black tracking-widest">الوقود</span>
                                            <span className="text-[11px] font-mono text-accent">62%</span>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button 
                                            onClick={() => setIsDetailModalOpen(true)}
                                            className="text-[9px] font-bold text-accent uppercase tracking-luxury hover:underline flex items-center gap-2"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            فتح الملف الكامل
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-4 flex flex-col">
                    <div className="bg-surface-secondary p-8 md:p-12 rounded-sm text-on-background border border-border relative overflow-hidden flex-1 transition-colors duration-300">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-accent">بروتوكول الإرسال</h5>
                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 opacity-60" />
                                <p className="text-[11px] leading-relaxed text-on-background opacity-60 tracking-wide font-medium">تم اكتشاف تقلبات في سوق الوقود. تم اقتراح التحسين للمنطقة ديلطا.</p>
                            </li>
                            <li className="flex gap-4 items-start">
                                <Bolt className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                <p className="text-[11px] leading-relaxed text-on-background opacity-60 tracking-wide font-medium">زادت كفاءة المسار بنسبة 15% عبر إعادة التوجيه الديناميكي على محور الرياض-جدة.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-surface border border-border p-8 md:p-12 rounded-sm shadow-sm transition-colors duration-300">
                        <h5 className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-6 text-right">تحليلات التنفيذ</h5>
                        <div className="space-y-6">
                            {[
                                { label: 'دقة الاستقرار', val: 94, color: 'bg-accent' },
                                { label: 'سلامة الشحن', val: 99, color: 'bg-accent' },
                            ].map((perf, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] font-bold text-on-background opacity-40 mb-2 uppercase tracking-widest font-sans transition-colors">
                                        <span>{perf.label}</span>
                                        <span className="text-accent">{perf.val}%</span>
                                    </div>
                                    <div className="h-[2px] w-full bg-border overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${perf.val}%` }} className={`h-full ${perf.color}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SuppliersView = () => {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
    const [suppliers, setSuppliers] = useState([
        { id: 'SUP-001', name: 'اللوجستيات العالمية', contact: 'أحمد علي', email: 'ahmed@global.com', phone: '+966 50 123 4567', poCount: 24, status: 'نشط', documents: ['عقد سنوي.pdf', 'شهادة الأيزو.jpg'] },
        { id: 'SUP-002', name: 'مجموعة الخليج للتوريد', contact: 'خالد عمر', email: 'khaled@gulf.com', phone: '+966 55 987 6543', poCount: 12, status: 'نشط', documents: ['ترخيص_التجارة.pdf'] },
        { id: 'SUP-003', name: 'الموردين العرب المحدودة', contact: 'سارة حسن', email: 'sarah@arab.com', phone: '+966 59 456 7890', poCount: 0, status: 'غير نشط', documents: [] },
    ]);

    const handleDelete = () => {
        if (deleteModal.id) {
            setSuppliers(suppliers.filter(s => s.id !== deleteModal.id));
        }
    };

    const handleUpload = (supId: string) => {
        // UI trigger for simulated upload
        alert('تم فتح مدير الملفات لـ ' + supId);
    };

  return (
    <div className="space-y-12 pb-12">
      <ConfirmationModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null })} 
        onConfirm={handleDelete}
        title="حذف المورد استراتيجياً"
        message="سيتم حذف هذا المورد من قائمة الشركاء المعتمدين. هل أنت متأكد من تصفية هذا السجل؟"
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-[64px] font-light text-on-background leading-none mb-4 font-serif transition-colors">إدارة <span className="italic text-accent">الموردين</span></h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-on-background opacity-40">دليل الشركاء وسجل أوامر الشراء</p>
        </div>
        <button className="bg-accent hover:bg-accent/80 text-black px-12 py-4 rounded-sm flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          إضافة مورد جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-surface border border-border p-8 rounded-sm group hover:border-accent transition-all transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-surface-secondary border border-border rounded-sm flex items-center justify-center group-hover:border-accent/40 transition-colors">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${sup.status === 'نشط' ? 'bg-green-500/10 text-green-500' : 'bg-on-background/5 text-on-background/40'}`}>
                {sup.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-on-background mb-4 group-hover:text-accent transition-colors">{sup.name}</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-on-background opacity-60">
                <Mail className="w-4 h-4 text-accent/60" />
                <span className="text-xs transition-colors">{sup.email}</span>
              </div>
              <div className="flex items-center gap-3 text-on-background opacity-60">
                <Phone className="w-4 h-4 text-accent/60" />
                <span className="text-xs transition-colors">{sup.phone}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black opacity-40">المستندات القانونية</p>
                    <button 
                        onClick={() => handleUpload(sup.id)}
                        className="text-[8px] font-bold text-accent uppercase tracking-luxury hover:underline"
                    >
                        رفع مستند
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {sup.documents.length > 0 ? sup.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-surface-secondary border border-border rounded-sm group/doc hover:border-accent/40 transition-all">
                            <FileText className="w-3 h-3 text-accent opacity-40" />
                            <span className="text-[9px] font-medium opacity-60 truncate max-w-[80px]">{doc}</span>
                            <X className="w-2.5 h-2.5 opacity-0 group-hover/doc:opacity-100 text-red-500 cursor-pointer" />
                        </div>
                    )) : (
                        <p className="text-[9px] opacity-20 italic">لا توجد مستندات مؤرشفة</p>
                    )}
                </div>
              </div>

              <div className="flex justify-between items-center transition-colors">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 mb-1">أوامر الشراء</p>
                  <div className="flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5 text-accent opacity-60" />
                    <span className="text-sm font-bold text-on-background transition-colors">{sup.poCount} طلب</span>
                  </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-border rounded-sm hover:bg-accent/10 hover:text-accent transition-all">
                        <ArrowRightLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setDeleteModal({ isOpen: true, id: sup.id })}
                        className="p-2 border border-border rounded-sm text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-sm overflow-hidden transition-colors duration-300">
        <div className="px-8 py-6 border-b border-border bg-on-background/[0.02]">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">سجل أوامر الشراء النشطة</h3>
        </div>
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-border text-[10px] font-bold text-on-background opacity-20 uppercase tracking-[0.25em]">
              <th className="px-8 py-4">رقم الأمر</th>
              <th className="px-8 py-4 text-right">المورد</th>
              <th className="px-8 py-4 text-center">القيمة</th>
              <th className="px-8 py-4 text-center">التاريخ</th>
              <th className="px-8 py-4 text-center">الحالة</th>
              <th className="px-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="hover:bg-on-background/[0.02] transition-colors group">
              <td className="px-8 py-6 font-mono text-[10px] opacity-40 transition-colors">#PO-2401</td>
              <td className="px-8 py-6 font-medium text-on-background group-hover:text-accent transition-all transition-colors ">اللوجستيات العالمية</td>
              <td className="px-8 py-6 text-center text-sm font-bold text-accent transition-colors">85,200.00 ر.س</td>
              <td className="px-8 py-6 text-center text-[10px] opacity-40 uppercase tracking-widest transition-colors">2024-10-15</td>
              <td className="px-8 py-6 text-center">
                <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-blue-500/10 text-blue-500 rounded-sm border border-blue-500/20">قيد المعالجة</span>
              </td>
              <td className="px-8"><MoreVertical className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all cursor-pointer transition-colors" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsView = () => {
    const [savedFilters, setSavedFilters] = useState([
        { id: '1', name: 'أداء المنطقة الوسطى', config: { range: '30 يوم', cat: 'شحن' } },
        { id: '2', name: 'تقرير الربع المالي', config: { range: '90 يوم', cat: 'مالي' } },
    ]);
    const [isSaving, setIsSaving] = useState(false);

    const saveCurrentFilter = () => {
        const name = prompt('أدخل اسماً لهذا الفلتر:');
        if (name) {
            setSavedFilters([...savedFilters, { id: Date.now().toString(), name, config: { range: 'مخصص', cat: 'الكل' } }]);
        }
    };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-[64px] font-light text-on-background leading-none mb-4 font-serif transition-colors">تحليلات <span className="italic text-accent">الأداء</span></h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-on-background opacity-40">البيانات الاستراتيجية وتقارير الكفاءة عبر الشبكة</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={saveCurrentFilter}
            className="px-8 py-4 font-bold text-[10px] bg-accent/5 border border-accent/20 text-accent rounded-sm hover:bg-accent/10 transition-all uppercase tracking-[0.3em] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ إعدادات الفلترة
          </button>
          <button className="px-8 py-4 font-bold text-[10px] border border-border text-on-background rounded-sm hover:bg-on-background/5 transition-all uppercase tracking-[0.3em] flex items-center gap-2">
            <Download className="w-4 h-4" />
            تصدير جميع البيانات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
            <div className="bg-surface border border-border rounded-sm p-8 transition-colors duration-300">
                <div className="flex items-center gap-4 mb-8 transition-colors">
                <Filter className="w-4 h-4 text-accent" />
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">المعايير المتقدمة للفلترة</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-on-background opacity-40 uppercase tracking-widest transition-colors">النطاق الزمني</label>
                    <select className="w-full bg-surface-secondary border border-border rounded-sm p-3 text-xs text-on-background outline-none transition-all transition-colors cursor-pointer">
                    <option>آخر 30 يوم</option>
                    <option>آخر 90 يوم</option>
                    <option>السنة الحالية</option>
                    <option>تخصيص...</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-on-background opacity-40 uppercase tracking-widest transition-colors">فئة التشغيل</label>
                    <select className="w-full bg-surface-secondary border border-border rounded-sm p-3 text-xs text-on-background outline-none transition-all transition-colors cursor-pointer">
                    <option>جميع العمليات</option>
                    <option>حركة المخزون</option>
                    <option>كفاءة الشحن</option>
                    <option>الأداء المالي</option>
                    </select>
                </div>
                <div className="flex items-end transition-colors">
                    <button className="w-full py-3 bg-accent/10 border border-accent/20 text-accent font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-accent/20 transition-all">تحديث النتائج</button>
                </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-sm p-8 h-full transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                    <FolderOpen className="w-4 h-4 text-accent opacity-60" />
                    <h4 className="text-[10px] uppercase font-bold tracking-widest">فلاتر مؤرشفة</h4>
                </div>
                <div className="space-y-3">
                    {savedFilters.length > 0 ? savedFilters.map(sf => (
                        <button key={sf.id} className="w-full text-right p-4 bg-surface-secondary border border-border hover:border-accent/40 rounded-sm group transition-all">
                            <p className="text-[11px] font-bold text-on-background group-hover:text-accent transition-colors">{sf.name}</p>
                            <p className="text-[8px] opacity-20 uppercase tracking-widest mt-1">{sf.config.range} • {sf.config.cat}</p>
                        </button>
                    )) : (
                        <p className="text-[10px] opacity-20 italic text-center py-4">لا توجد اختصارات بعد</p>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 transition-colors">
        <div className="bg-surface border border-border rounded-sm p-12 transition-colors duration-300">
           <div className="flex justify-between items-center mb-12">
             <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">كفاءة مسارات الشحن</h4>
             <TrendingUp className="w-5 h-5 text-green-500" />
           </div>
           <div className="space-y-8 transition-colors">
             {[
               { label: 'الرياض - جدة', val: 94, trend: '+4%' },
               { label: 'الدمام - الرياض', val: 88, trend: '+2%' },
               { label: 'جدة - أبها', val: 76, trend: '-3%' },
             ].map((r, i) => (
               <div key={i}>
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3 font-sans transition-colors">
                   <span className="text-on-background opacity-40">{r.label}</span>
                   <span className={r.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{r.val}% ({r.trend})</span>
                 </div>
                 <div className="h-[2px] w-full bg-border rounded-full overflow-hidden transition-colors">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${r.val}%` }} className="h-full bg-accent" />
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-surface border border-border rounded-sm p-12 transition-colors duration-300">
          <div className="flex justify-between items-center mb-12">
             <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">توزيع النفقات التشغيلية</h4>
             <BarChart3 className="w-5 h-5 text-accent opacity-40" />
          </div>
          <div className="flex items-end gap-6 h-48 transition-colors">
            {[65, 40, 85, 30, 55, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }} 
                  className={`w-full ${h > 70 ? 'bg-accent' : 'bg-on-background/5'} group relative cursor-pointer hover:opacity-80 transition-all transition-colors duration-300`}
                >
                  <div className="absolute bottom-full mb-2 bg-on-background text-background text-[9px] font-bold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 transition-colors">{h}%</div>
                </motion.div>
                <span className="text-[9px] font-bold opacity-20 uppercase tracking-widest transition-colors font-sans">Q{i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'dark';
    }
    return 'dark';
  });

  const notifications: Notification[] = [
    { id: '1', title: 'مخزون منخفض', message: 'نقص في كابلات الألياف البصرية في مستودع الرياض.', type: 'alert', time: 'منذ 5 دقائق' },
    { id: '2', title: 'تأخير في الشحن', message: 'تأخر الشحنة TRK-98210 بسبب عاصفة رملية.', type: 'warning', time: 'منذ ساعة' },
    { id: '3', title: 'فاتورة مستحقة', message: 'فاتورة شركة اللوجستيات العالمية تتجاوز الموعد النهائي.', type: 'alert', time: 'منذ 3 ساعات' },
    { id: '4', title: 'تحديث النظام', message: 'تم تحسين خوارزمية المسارات بنجاح.', type: 'info', time: 'منذ يوم' },
  ];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className={`min-h-screen bg-background text-on-background transition-colors duration-300 font-sans selection:bg-accent selection:text-black`}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <Topbar theme={theme} toggleTheme={toggleTheme} notifications={notifications} />
      
      <main className="pr-64 pt-24 min-h-screen transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              {currentView === 'dashboard' && <DashboardView />}
              {currentView === 'inventory' && <InventoryView />}
              {currentView === 'shipments' && <ShipmentsView />}
              {currentView === 'invoices' && <InvoiceView />}
              {currentView === 'suppliers' && <SuppliersView />}
              {currentView === 'reports' && <ReportsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Status Indicator */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-12 left-12 flex items-center gap-4 bg-surface/80 backdrop-blur-md border border-border p-6 rounded-sm z-50 transition-colors shadow-2xl group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse relative z-10"></div>
        <div className="flex flex-col relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-accent transition-colors">بروتوكول المزامنة</span>
          <span className="text-[10px] opacity-40 uppercase tracking-luxury transition-colors">اتصال نشط بآسيا/الرياض</span>
        </div>
      </motion.div>
    </div>
  );
}
