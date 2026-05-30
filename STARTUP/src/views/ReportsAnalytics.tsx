import React from 'react';
import { 
  BookOpen, 
  Archive, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  MoreVertical,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ChartTooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

const ReportsAnalytics: React.FC = () => {
  // KPI Metrics Data
  const kpis = [
    {
      id: 'sops',
      title: 'Total SOPs Generated',
      value: '128 Procedures',
      change: '+14% this month',
      icon: BookOpen,
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      borderLight: 'border-emerald-100'
    },
    {
      id: 'decisions',
      title: 'Decisions Archived',
      value: '342 Milestones',
      change: '+8% this month',
      icon: Archive,
      color: 'text-blue-600',
      bgLight: 'bg-blue-50',
      borderLight: 'border-blue-100'
    },
    {
      id: 'training',
      title: 'Active Training Modules',
      value: '5 Core Modules',
      change: '94% SLA Met',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      borderLight: 'border-indigo-100'
    },
    {
      id: 'capture',
      title: 'Staff Capture Rate',
      value: '48 Sessions',
      change: '+18% this month',
      icon: Users,
      color: 'text-amber-600',
      bgLight: 'bg-amber-50',
      borderLight: 'border-amber-100'
    }
  ];

  // Recharts Category Pie Data
  const categoryPieData = [
    { name: 'Operations', value: 45, color: '#0a2540' },      // Navy
    { name: 'Risk Management', value: 30, color: '#10b981' }, // Emerald
    { name: 'Financial', value: 15, color: '#6366f1' },       // Indigo
    { name: 'Customers', value: 10, color: '#0ea5e9' },       // Sky
  ];

  // Recharts Area Volume Data
  const volumeLineData = [
    { name: 'Q1 25', volume: 110 },
    { name: 'Q2 25', volume: 170 },
    { name: 'Q3 25', volume: 240 },
    { name: 'Q4 25', volume: 210 },
    { name: 'Q1 26', volume: 342 }
  ];

  // Department Memory Gaps Progress
  const departmentGaps = [
    {
      name: 'Customer Support',
      digitized: 90,
      status: 'High Digitization',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      name: 'Human Resources',
      digitized: 75,
      status: 'In-Progress',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      name: 'Sales & Outreach',
      digitized: 55,
      status: 'Intake Needed',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      name: 'Logistics & Supply Chain',
      digitized: 35,
      status: 'Critical Gap',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse'
    }
  ];

  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-50 flex flex-col gap-6 font-sans">
      
      {/* Dashboard Top Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time breakdown of digitized business memory, SOP coverage, and operational gaps.
          </p>
        </div>
        
        {/* Sync Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-xl text-brand-700 text-xs font-bold">
          <TrendingUp className="w-4 h-4 text-brand-600" />
          <span>Institutional Memory Sync: 91.4%</span>
        </div>
      </div>

      {/* KPI METRICS GRID ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={kpi.id} 
              className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl border ${kpi.bgLight} ${kpi.borderLight}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  Digitization KPI
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <span className="block text-lg font-bold text-slate-900 font-outfit mt-0.5">
                  {kpi.value}
                </span>
                <span className={`inline-block text-[9px] font-extrabold mt-1 text-emerald-600`}>
                  ✓ {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DATA VISUALIZATION GRID ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart: Decisions by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Decisions by Category
              </h3>
              <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Distribution of captured milestonse entries</p>
            </div>
            <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="h-48 w-full md:w-1/2 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ background: '#fff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center donut text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-[#0a2540]">45%</span>
                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider -mt-0.5">Operations</span>
              </div>
            </div>

            {/* Custom Interactive Legend */}
            <div className="flex-1 w-full space-y-2.5">
              {categoryPieData.map((d, index) => (
                <div key={index} className="flex items-center justify-between text-xs border-b border-slate-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                    <span className="font-semibold text-slate-700">{d.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Area Chart: Decision Volume Over Time */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Decision Volume Over Time
              </h3>
              <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Timeline volume counts digitized by AI</p>
            </div>
            <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeLineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolumeReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a2540" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0a2540" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} />
                <ChartTooltip 
                  contentStyle={{ background: '#fff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#0a2540" strokeWidth={2} fillOpacity={1} fill="url(#colorVolumeReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* DEPARTMENT MEMORY GAPS & DIGITIZATION WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Matrix: Institutional Memory Gaps */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Institutional Memory Gaps
              </h3>
              <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Digitization coverage matrix by corporate department</p>
            </div>
            <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-extrabold uppercase">
              Action Required
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {departmentGaps.map((dept, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-850">{dept.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 border rounded text-[9px] font-extrabold uppercase ${dept.badgeColor}`}>
                      {dept.status}
                    </span>
                    <span className="font-extrabold text-slate-900">{dept.digitized}% Digitized</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.digitized >= 80 ? 'bg-emerald-500' :
                      dept.digitized >= 60 ? 'bg-blue-500' :
                      dept.digitized >= 40 ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`} 
                    style={{ width: `${dept.digitized}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & SOC2 Compliance Audit Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-slate-850 uppercase tracking-wider">Audit & Compliance Lock</span>
              </div>
              <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
                <span className="block text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider leading-none">SOC2 Compliance Status</span>
                <span className="block font-extrabold text-slate-900 text-xs mt-1">✓ Audit Readiness Met</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Institutional memory backups of priority AWS replicas, Zero-Trust structures, and SLA contracts are verified SOC2 audit-ready.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-wider leading-none">Upcoming Audit</span>
                <span className="block font-bold text-slate-700 text-xs mt-1">ISO 27001 Validation</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  SOP catalogs and capture session histories are automatically archived and formatted for security auditors.
                </p>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-2 px-4 bg-[#0a2540] hover:bg-slate-950 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/5 transition-colors cursor-pointer text-center">
            Export Complete Archive (PDF/ZIP)
          </button>
        </div>

      </div>

    </div>
  );
};

export default ReportsAnalytics;
