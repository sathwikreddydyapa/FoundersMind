import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DecisionArchive from './views/DecisionArchive';
import KnowledgeCapture from './views/KnowledgeCapture';
import SuccessorTraining from './views/SuccessorTraining';
import ExpertisePortal from './views/ExpertisePortal';
import StrategyMap from './views/StrategyMap';
import ReportsAnalytics from './views/ReportsAnalytics';
import { 
  HelpCircle, 
  Settings as SettingsIcon, 
  Bot,
  BrainCircuit,
  ArrowRight,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';


function App() {
  const [activeTab, setActiveTab] = useState<string>('archive'); // Default to archive matching screenshot
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('foundersmind_gemini_api_key') || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  });

  // Renders pages with professional enterprise layouts matching FoundersMind
  const renderContent = () => {
    switch (activeTab) {
      case 'archive':
        return <DecisionArchive apiKey={geminiApiKey} />;
      case 'capture':
        return <KnowledgeCapture apiKey={geminiApiKey} />;
      case 'expertise':
        return <ExpertisePortal />;
      case 'strategy':
        return <StrategyMap />;
      case 'training':
        return <SuccessorTraining apiKey={geminiApiKey} />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'dashboard':
        return (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex flex-col gap-6 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">
                  Business Memory Dashboard
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Synthesized organizational intelligence and strategic continuity metrics.
                </p>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/10 cursor-pointer hover:bg-brand-700 transition-colors"
                   onClick={() => setActiveTab('capture')}>
                <BrainCircuit className="w-4 h-4" />
                <span>Trigger Interview Session</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100 text-brand-600">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Synced Milestones</span>
                  <span className="block text-xl font-bold text-slate-950 font-outfit mt-0.5">24 Active</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Drafted SOPs</span>
                  <span className="block text-xl font-bold text-slate-950 font-outfit mt-0.5">18 Procedures</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Memory Capture Rate</span>
                  <span className="block text-xl font-bold text-slate-950 font-outfit mt-0.5">94.8% SLA</span>
                </div>
              </div>
            </div>

            {/* Banner Section */}
            <div className="bg-gradient-to-r from-brand-900 to-brand-850 rounded-2xl p-6 text-white border border-brand-800 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl"></div>
              <div className="space-y-2 z-10">
                <span className="inline-flex px-2 py-0.5 bg-brand-500/20 text-brand-200 border border-brand-500/30 rounded text-[9px] font-bold uppercase tracking-wider">
                  Featured Module
                </span>
                <h2 className="text-lg font-bold font-outfit">Active Founder Knowledge Capture</h2>
                <p className="text-xs text-brand-100 leading-relaxed max-w-xl">
                  Prevent institutional brain drain. FoundersMind evaluates spoken founder experience via advanced LLM engines, drafting structured operations maps, procedure repositories, and decision cards dynamically.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('capture')}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-brand-900 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 shadow-sm z-10 transition-colors"
              >
                <span>Launch AI Interview</span>
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex flex-col gap-6 font-sans">
            <div>
              <h1 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">System Settings</h1>
              <p className="text-xs text-slate-500 mt-1">Configure LLM prompts, model selection, API tokens, and sync integrations.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm max-w-2xl space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-4.5 h-4.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Configuration Parameters</span>
                </div>
                <div className="px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-600 rounded text-[10px] font-bold">
                  Gemini API
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Model Engine Selection</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-1 focus:ring-brand-500">
                    <option>Gemini 2.5 Flash (Default - Rapid Extraction)</option>
                    <option>Gemini 2.5 Pro (Deep Context Analytical Reasoning)</option>
                    <option>Custom LLM Endpoint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Google Gemini API Key</label>
                  <input
                    type="password"
                    placeholder="Enter your Gemini API Key (Enables Live AI Mode)..."
                    value={geminiApiKey}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      setGeminiApiKey(newKey);
                      localStorage.setItem('foundersmind_gemini_api_key', newKey);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder:text-slate-400"
                  />
                  {geminiApiKey ? (
                    <span className="block text-[10px] text-emerald-600 mt-1.5 font-semibold">
                      ✓ Live Gemini Mode Active. Settings will persist in local storage.
                    </span>
                  ) : (
                    <span className="block text-[10px] text-slate-400 mt-1.5 font-medium">
                      Fallback Mode Active: Simulates LLM responses. Enter a Gemini API Key to enable live capture.
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex flex-col gap-6 font-sans">
            <div>
              <h1 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">Customer Support & Help</h1>
              <p className="text-xs text-slate-500 mt-1">Get immediate operational and tactical backing from our support desk.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl shadow-sm flex items-start gap-4">
              <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-brand-600 shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Need Operational Assistance?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We are here to support your team during system migrations, data exports, or general AI customization queries. Open a priority ticket or browse our system documentation below.
                </p>
                <div className="flex items-center gap-3">
                  <button className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors">
                    Contact Support
                  </button>
                  <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
                    System Guides
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <DecisionArchive />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans flex-col lg:flex-row">
      {/* Mobile Top Bar Header */}
      <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 lg:hidden z-30">
        <div className="flex items-center gap-2">
          {/* Monogram matching Logo.tsx */}
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center border border-brand-100">
            <svg className="w-5 h-5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="font-bold font-outfit text-sm text-slate-900 tracking-tight">FoundersMind</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 border border-slate-200 cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Active Tab View */}
      {renderContent()}
    </div>
  );
}

export default App;
