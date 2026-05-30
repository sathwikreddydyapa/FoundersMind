import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  User, 
  Tag, 
  Clock, 
  Sparkles,
  ArrowRight,
  MoreVertical,
  SlidersHorizontal,
  BrainCircuit,
  RefreshCw
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
import { mockMilestones, mockDecisions } from '../data/mockData';
import type { Decision } from '../types';
import { generateArchiveCritique } from '../services/geminiService';

interface DecisionArchiveProps {
  apiKey?: string;
}

const DecisionArchive: React.FC<DecisionArchiveProps> = ({ apiKey = '' }) => {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineSearch, setTimelineSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>('m3'); // Default to Q4 2023 Decision matching screenshot

  // Detail popup state matching screenshot
  const [showPopup, setShowPopup] = useState(true);
  const [popupDecision, setPopupDecision] = useState<Decision | null>(
    mockDecisions.find(d => d.id === 'd1') || null
  );

  // Visionary Advisor details modal states
  const [consultAdvisor, setConsultAdvisor] = useState(false);
  const [selectedArchivePersonas, setSelectedArchivePersonas] = useState<('Musk' | 'Jobs')[]>(['Musk']);
  const [archiveAdvisorCritiques, setArchiveAdvisorCritiques] = useState<{ Musk?: string; Jobs?: string }>({});
  const [isArchiveCritiqueLoading, setIsArchiveCritiqueLoading] = useState(false);
  const [archiveCritiqueError, setArchiveCritiqueError] = useState<string | null>(null);

  // Hook to generate critique automatically when advisors are toggled/selected
  useEffect(() => {
    if (!consultAdvisor || !popupDecision) {
      setArchiveAdvisorCritiques({});
      return;
    }

    const fetchCritiques = async () => {
      setIsArchiveCritiqueLoading(true);
      setArchiveCritiqueError(null);
      try {
        const promises: Promise<any>[] = [];
        const activePersonas = [...selectedArchivePersonas];

        activePersonas.forEach(p => {
          promises.push(
            generateArchiveCritique(
              popupDecision.title,
              popupDecision.decisionMade,
              popupDecision.whyItWasMade,
              p,
              apiKey
            )
          );
        });

        const resolved = await Promise.all(promises);
        const critiques: { Musk?: string; Jobs?: string } = {};
        activePersonas.forEach((p, idx) => {
          critiques[p] = resolved[idx];
        });

        setArchiveAdvisorCritiques(critiques);
      } catch (err: any) {
        setArchiveCritiqueError(err.message || 'Failed to fetch critique');
      } finally {
        setIsArchiveCritiqueLoading(false);
      }
    };

    fetchCritiques();
  }, [consultAdvisor, selectedArchivePersonas, popupDecision, apiKey]);

  const toggleArchivePersona = (p: 'Musk' | 'Jobs') => {
    setSelectedArchivePersonas(prev => {
      if (prev.includes(p)) {
        if (prev.length === 1) return prev;
        return prev.filter(x => x !== p);
      } else {
        return [...prev, p];
      }
    });
  };


  // Recharts Seed Data
  const pieData = [
    { name: 'Operations', value: 45, color: '#3b82f6' }, // Blue
    { name: 'Risk', value: 30, color: '#0ea5e9' },       // Light blue
    { name: 'Financial', value: 15, color: '#6366f1' },  // Indigo
    { name: 'Others', value: 10, color: '#f59e0b' },     // Orange
  ];

  const lineData = [
    { quarter: 'Q1 23', volume: 80 },
    { quarter: 'Q2 23', volume: 140 },
    { quarter: 'Q3 23', volume: 210 },
    { quarter: 'Q4 23', volume: 180 },
    { quarter: 'Q1 24', volume: 260 },
  ];

  // Filtering Milestones
  const filteredMilestones = useMemo(() => {
    return mockMilestones.filter(m => 
      m.title.toLowerCase().includes(timelineSearch.toLowerCase()) ||
      m.quarter.toLowerCase().includes(timelineSearch.toLowerCase())
    );
  }, [timelineSearch]);

  // Filtering Decisions
  const filteredDecisions = useMemo(() => {
    return mockDecisions.filter(d => {
      const matchesSearch = 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.decisionMade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.whyItWasMade.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
      
      const matchesMilestone = !selectedMilestone || d.milestoneId === selectedMilestone;

      return matchesSearch && matchesCategory && matchesMilestone;
    });
  }, [searchQuery, selectedCategory, selectedMilestone]);

  const categories = ['Operations', 'Customers', 'Risk Management', 'Financial'];

  const handleTimelineClick = (milestoneId: string) => {
    setSelectedMilestone(selectedMilestone === milestoneId ? null : milestoneId);
    
    // Auto-fill popup based on selected milestone
    const decision = mockDecisions.find(d => d.milestoneId === milestoneId);
    if (decision) {
      setPopupDecision(decision);
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleCardClick = (decision: Decision) => {
    setPopupDecision(decision);
    setShowPopup(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden font-sans relative">
      {/* Top Search bar - Business Memory AI */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Ask Business Memory AI: 'How do we handle inventory shortages?'"
            className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-lg text-brand-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
            <span>AI Memory Synced</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        
        {/* Left Side: Archive + Timeline Grid */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Header & Filter Dropdowns */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold font-outfit text-slate-900 tracking-tight">
                Decision Intelligence Archive
              </h1>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Sort & Filter Matrix</span>
              </div>
            </div>

            {/* Custom Sort Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sort by:
              </span>
              
              {/* Category selector dropdowns matching ContinuityOS design */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="relative flex-1 sm:max-w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Milestones..."
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Milestone Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Historical Milestone Timeline
              </span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timeline Line Grid */}
            <div className="relative pt-6 pb-2 px-8 flex items-center justify-between">
              {/* Horizontal Connecting Dash Line */}
              <div className="absolute top-1/2 -translate-y-1/2 left-12 right-12 h-0.5 border-t-2 border-dashed border-slate-200 z-0"></div>

              {filteredMilestones.map((m) => {
                const isSelected = selectedMilestone === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleTimelineClick(m.id)}
                    className="relative flex flex-col items-center group z-10 focus:outline-none max-w-[120px]"
                  >
                    {/* Node Dot */}
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-brand-600 border-brand-600 scale-125 shadow-lg shadow-brand-500/30' 
                        : 'bg-white border-slate-400 hover:border-brand-500'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>

                    {/* Quarter Label */}
                    <span className={`block text-[10px] font-bold mt-2 tracking-tight transition-colors ${
                      isSelected ? 'text-brand-600' : 'text-slate-400'
                    }`}>
                      {m.quarter}
                    </span>

                    {/* Milestone Name */}
                    <span className={`block text-[11px] font-semibold text-center mt-0.5 truncate w-full ${
                      isSelected ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-950'
                    }`}>
                      {m.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strategic Decision Grid Cards */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Strategic Decisions ({filteredDecisions.length})
              </h2>
              {selectedMilestone && (
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="text-xs text-brand-600 font-semibold hover:underline"
                >
                  Clear Milestone Filter
                </button>
              )}
            </div>

            {filteredDecisions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
                <Tag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">No decisions match your active search or filters.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedMilestone(null); }}
                  className="mt-3 text-xs text-brand-600 font-semibold hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDecisions.map((decision) => (
                  <div
                    key={decision.id}
                    onClick={() => handleCardClick(decision)}
                    className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm glass-card-hover cursor-pointer space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          decision.category === 'Operations' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          decision.category === 'Risk Management' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                          decision.category === 'Financial' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {decision.category}
                        </span>
                        <h3 className="font-bold text-slate-900 mt-1.5 text-sm tracking-tight hover:text-brand-600 transition-colors">
                          {decision.title}
                        </h3>
                      </div>
                      <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mandatory display segments */}
                    <div className="space-y-2.5 text-xs text-slate-700">
                      <div>
                        <span className="font-bold text-slate-900">1. Decision Made:</span>{' '}
                        <p className="inline text-slate-600 line-clamp-2">{decision.decisionMade}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">2. Why it was made:</span>{' '}
                        <p className="inline text-slate-600 line-clamp-2">{decision.whyItWasMade}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">3. Alternatives Rejected:</span>{' '}
                        <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-500">
                          {decision.alternativesRejected.slice(0, 2).map((alt, idx) => (
                            <li key={idx} className="truncate">{alt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        <span>{decision.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{decision.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Analytics Panel Widgets */}
        <div className="w-80 shrink-0 flex flex-col gap-6 overflow-y-auto">
          
          {/* Card: Decisions by Category Pie Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Decisions by Category
              </h3>
              <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ background: '#fff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center overlay percentage text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-extrabold text-slate-800">45%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">Operations</span>
              </div>
            </div>

            {/* Custom chart legend matches ContinuityOS */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-semibold text-slate-600">
              {pieData.map((d, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="truncate">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Decision Volume Over Time Line Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Decision Volume Over Time
              </h3>
              <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5c75fb" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#5c75fb" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} />
                  <ChartTooltip 
                    contentStyle={{ background: '#fff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#5c75fb" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* PopUp Detail Modal - Matching center popup on the user's design image */}
      {showPopup && popupDecision && (
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col animate-slide-up relative">
            <button 
              onClick={() => {
                setShowPopup(false);
                setConsultAdvisor(false);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Popup content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  popupDecision.category === 'Operations' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  popupDecision.category === 'Risk Management' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                  popupDecision.category === 'Financial' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                  'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {popupDecision.category}
                </span>
                <h3 className="font-outfit font-bold text-slate-900 text-base mt-2">
                  {popupDecision.title} ({popupDecision.timestamp})
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  Strategic Event Archive Detail
                </p>
              </div>

              {/* Exact sections displayed beautifully */}
              <div className="space-y-4 text-xs text-slate-700">
                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <span className="block font-bold text-slate-900 mb-1">1. Decision Made:</span>
                  <p className="text-slate-600 leading-relaxed">{popupDecision.decisionMade}</p>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <span className="block font-bold text-slate-900 mb-1">2. Why it was made:</span>
                  <p className="text-slate-600 leading-relaxed">{popupDecision.whyItWasMade}</p>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <span className="block font-bold text-slate-900 mb-1">3. Alternatives Rejected:</span>
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-500">
                    {popupDecision.alternativesRejected.map((alt, idx) => (
                      <li key={idx} className="leading-relaxed">{alt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Consult Visionary Advisor Panel */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4.5 h-4.5 text-brand-600" />
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Consult Visionary Advisor</span>
                  </div>
                  <button
                    onClick={() => {
                      setConsultAdvisor(!consultAdvisor);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      consultAdvisor ? 'bg-[#0a2540]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        consultAdvisor ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {consultAdvisor && (
                  <div className="space-y-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Personas (Choose one or both)</span>
                      <span className={`text-[9px] font-extrabold flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                        apiKey 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`}></span>
                        {apiKey ? 'Live Advisor' : 'Mock Advisor'}
                      </span>
                    </div>

                    {/* Selector */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleArchivePersona('Musk')}
                        className={`flex-1 py-1.5 px-3 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          selectedArchivePersonas.includes('Musk')
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>Elon Musk</span>
                      </button>
                      <button
                        onClick={() => toggleArchivePersona('Jobs')}
                        className={`flex-1 py-1.5 px-3 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          selectedArchivePersonas.includes('Jobs')
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>Steve Jobs</span>
                      </button>
                    </div>

                    {/* Loading indicator */}
                    {isArchiveCritiqueLoading && (
                      <div className="flex items-center justify-center gap-2 py-4">
                        <RefreshCw className="w-4 h-4 text-brand-500 animate-spin" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Generating Advisor Critique...</span>
                      </div>
                    )}

                    {/* Error display */}
                    {archiveCritiqueError && (
                      <div className="text-[10px] text-rose-600 font-semibold leading-relaxed py-2">
                        ⚠️ Error: {archiveCritiqueError}
                      </div>
                    )}

                    {/* Critique Content */}
                    {!isArchiveCritiqueLoading && !archiveCritiqueError && (
                      <div className="space-y-3">
                        {/* Elon Musk Card */}
                        {archiveAdvisorCritiques.Musk && (
                          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm space-y-1">
                            <span className="font-extrabold text-[9px] text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-indigo-500" />
                              Elon Musk (First-Principles)
                            </span>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                              {archiveAdvisorCritiques.Musk}
                            </p>
                          </div>
                        )}

                        {/* Steve Jobs Card */}
                        {archiveAdvisorCritiques.Jobs && (
                          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm space-y-1">
                            <span className="font-extrabold text-[9px] text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-emerald-500" />
                              Steve Jobs (Design-Centric)
                            </span>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                              {archiveAdvisorCritiques.Jobs}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons including Gemini Capture trigger */}
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    setShowPopup(false);
                    setConsultAdvisor(false);
                  }}
                  className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close Archive
                </button>
                <div className="flex-1 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-indigo-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
                  <button 
                    onClick={() => {
                      setShowPopup(false);
                      // Trigger routing transition to Knowledge Capture screen for deep contexts
                      const captureBtn = document.getElementById('capture-tab-btn');
                      if (captureBtn) captureBtn.click();
                    }}
                    className="relative w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Extract Context</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionArchive;
