import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Send, 
  Mic, 
  Bot, 
  User as UserIcon, 
  ArrowRight, 
  Award,
  Boxes,
  Users,
  History,
  ShieldAlert,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  generateTutorScenario, 
  evaluateSuccessorResponse, 
  generateVisionaryResponse 
} from '../services/geminiService';
import type { EvaluationResult } from '../services/geminiService';

interface SuccessorTrainingProps {
  apiKey: string;
}

interface CourseModule {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  completion: number;
  description: string;
  defaultScenario: string;
  color: string;
  bgLight: string;
  borderLight: string;
}

const SuccessorTraining: React.FC<SuccessorTrainingProps> = ({ apiKey }) => {
  // Course modules definitions matching prompt
  const courseModules: CourseModule[] = [
    {
      id: 'Operations',
      title: 'Operations',
      icon: Boxes,
      completion: 75,
      description: 'Tactical cloud scaling, failovers, SLA monitors, component redundancies, and uptime management.',
      color: 'text-blue-600',
      bgLight: 'bg-blue-50/50',
      borderLight: 'border-blue-100',
      defaultScenario: "Today we are reviewing Cloud Infrastructure Scale. Due to an unexpected surge in consumer traffic, our secondary database replica is throwing out-of-memory errors. The founder's past decision was to immediately execute pre-provisioned AWS Aurora scale-up scripts instead of auditing legacy query logs. What is your immediate tactical action?"
    },
    {
      id: 'Customers',
      title: 'Customers',
      icon: Users,
      completion: 50,
      description: 'Account-based LinkedIn conversions, enterprise retention metrics, and ad-spend optimization plays.',
      color: 'text-indigo-600',
      bgLight: 'bg-indigo-50/50',
      borderLight: 'border-indigo-100',
      defaultScenario: "Today we are reviewing Ad-Spend Optimizations. Enterprise buyer acquisitions have dropped by 25% this quarter, while traditional search ad-spend has reached record bidding costs. Based on company history, how would you restructure the outreach budget to safeguard enterprise lead pipelines?"
    },
    {
      id: 'Suppliers',
      title: 'Suppliers',
      icon: RefreshCw,
      completion: 90,
      description: 'Backup vendor agreements, localized freight redirects, and pre-approved SLA locks.',
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50/50',
      borderLight: 'border-emerald-100',
      defaultScenario: "Today we are reviewing Supplier Negotiations. Based on the founder's past decisions, what would you do if our primary raw materials provider increased prices by 15%?"
    },
    {
      id: 'Business History',
      title: 'Business History',
      icon: History,
      completion: 40,
      description: 'AWS Aurora DB migrations, log consolidations, logistics clearing mergers, and Bilderling SLA parameters.',
      color: 'text-amber-600',
      bgLight: 'bg-amber-50/50',
      borderLight: 'border-amber-100',
      defaultScenario: "Today we are reviewing Corporate Mergers & Database Integrations. We are onboarding the Bilderling logistics ledger into our database, but vendor SLA definitions are conflicting, resulting in clearance delays. The founder rejected a custom blockchain build, preferring locked-in API schemas. How do you resolve the mismatch?"
    },
    {
      id: 'Risk Management',
      title: 'Risk Management',
      icon: ShieldAlert,
      completion: 85,
      description: 'Hardware multi-factor YubiKey locks, Zero Trust frameworks, SOC2 Type II audit logs, and compliance policy enforcement.',
      color: 'text-rose-600',
      bgLight: 'bg-rose-50/50',
      borderLight: 'border-rose-100',
      defaultScenario: "Today we are reviewing SOC2 & Security Enforcement. A major enterprise prospect demands immediate delay exceptions on our Zero-Trust multi-factor hardware policies as a condition to close the contract. Founder history dictates zero policy exceptions. How do you negotiate this trade-off?"
    }
  ];

  const [activeModule, setActiveModule] = useState<CourseModule>(courseModules[2]); // Default to Suppliers matching prompt
  const [scenario, setScenario] = useState<string>(courseModules[2].defaultScenario);
  
  // Advisor mode states
  const [advisorMode, setAdvisorMode] = useState<'internal' | 'visionary'>('internal');
  const [selectedPersonas, setSelectedPersonas] = useState<('Musk' | 'Jobs')[]>(['Musk']);
  const [visionaryCritiques, setVisionaryCritiques] = useState<{ Musk?: string; Jobs?: string }>({});

  const [messages, setMessages] = useState<any[]>([
    {
      id: 't-init',
      sender: 'ai',
      text: courseModules[2].defaultScenario,
      timestamp: '11:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  
  // Voice Recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<any | null>(null);

  // AI states
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Update tutor scenario when a module card is clicked
  const handleSelectModule = async (mod: CourseModule) => {
    setActiveModule(mod);
    setEvaluation(null);
    setVisionaryCritiques({});
    setIsAiEvaluating(true);

    try {
      const generated = await generateTutorScenario(mod.title, apiKey);
      setScenario(generated);
      setMessages([
        {
          id: `t-${Date.now()}`,
          sender: 'ai',
          text: generated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAiEvaluating(false);
    } catch (error) {
      console.error(error);
      setScenario(mod.defaultScenario);
      setMessages([
        {
          id: `t-${Date.now()}`,
          sender: 'ai',
          text: mod.defaultScenario,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAiEvaluating(false);
    }
  };

  const togglePersona = (p: 'Musk' | 'Jobs') => {
    setSelectedPersonas(prev => {
      if (prev.includes(p)) {
        if (prev.length === 1) return prev;
        return prev.filter(x => x !== p);
      } else {
        return [...prev, p];
      }
    });
  };

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiEvaluating]);

  // Audio timer simulation
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAiEvaluating(true);

    try {
      if (advisorMode === 'visionary' && selectedPersonas.length > 0) {
        // Parallel comparative calls
        // Internal memory goes to secure private database, Visionary goes to external LLM persona API
        const promises: Promise<any>[] = [
          evaluateSuccessorResponse(scenario, textToSend, apiKey)
        ];
        
        const activePersonas = [...selectedPersonas];
        activePersonas.forEach(p => {
          promises.push(generateVisionaryResponse(scenario, textToSend, p, apiKey));
        });

        const resolved = await Promise.all(promises);
        const result = resolved[0];
        const critiques: { Musk?: string; Jobs?: string } = {};
        activePersonas.forEach((p, idx) => {
          critiques[p] = resolved[idx + 1];
        });

        setEvaluation(result);
        setVisionaryCritiques(critiques);
        setIsAiEvaluating(false);

        // Build elegant text fallback for screen readers or logs
        let textSummary = `🎓 COMPARATIVE LEADERSHIP EVALUATION\n\n[Card 1: Our Company History]\nGrade: ${result.grade}/100\n${result.feedback}`;
        if (critiques.Musk) {
          textSummary += `\n\n[Card 2: The Elon Musk Approach]\n${critiques.Musk}`;
        }
        if (critiques.Jobs) {
          textSummary += `\n\n[${critiques.Musk ? 'Card 3' : 'Card 2'}: The Steve Jobs Approach]\n${critiques.Jobs}`;
        }
        textSummary += `\n\nFOLLOW-UP CHALLENGE:\n${result.followUp}`;

        const aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: textSummary,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isComparative: true,
          grade: result.grade,
          feedback: result.feedback,
          visionaryCritiques: critiques,
          personas: activePersonas,
          followUp: result.followUp
        };

        setMessages(prev => [...prev, aiReply]);
      } else {
        // Standard Internal Memory Mode
        const result = await evaluateSuccessorResponse(scenario, textToSend, apiKey);
        setEvaluation(result);
        setVisionaryCritiques({});
        setIsAiEvaluating(false);

        const aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `🎓 BOARD CRITIQUE & GRADE: ${result.grade}/100\n\n${result.feedback}\n\nFOLLOW-UP CHALLENGE:\n${result.followUp}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          grade: result.grade,
          feedback: result.feedback,
          followUp: result.followUp
        };

        setMessages(prev => [...prev, aiReply]);
      }
    } catch (error: any) {
      setIsAiEvaluating(false);
      const errorMsg = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ Evaluation Error: ${error.message || 'Verification of API Key failed. Please ensure the key entered in Settings is correct.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSendMessage("We will immediately activate our pre-approved backup SLA with our secondary ground transit provider to bypass their 15% increase, rather than locking in higher components costs.");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full bg-slate-50 font-sans">
      
      {/* Left Area: Progress Overview & Course Card Grid */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto gap-6 pr-3">
        
        {/* Advisor Mode Toggle Switch (Top Center Dashboard Area) */}
        <div className="flex justify-center shrink-0">
          <div className="bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-1.5">
            <button
              onClick={() => {
                setAdvisorMode('internal');
                setEvaluation(null);
                setVisionaryCritiques({});
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                advisorMode === 'internal'
                  ? 'bg-[#0a2540] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🔒 Internal Memory</span>
            </button>
            <button
              onClick={() => {
                setAdvisorMode('visionary');
                setEvaluation(null);
                setVisionaryCritiques({});
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                advisorMode === 'visionary'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🚀 Visionary Mode</span>
            </button>
          </div>
        </div>

        {/* Visionary Brain Selector Panel */}
        {advisorMode === 'visionary' && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-sm flex flex-col gap-3.5 shrink-0 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select External Decision Frameworks (Choose one or both)</span>
              <span className="text-[9px] bg-brand-50 border border-brand-100 text-brand-700 px-2 py-0.5 rounded font-extrabold uppercase">LLM Persona Dynamic Routing</span>
            </div>
            
            <div className="flex gap-4">
              {/* Elon Musk Card */}
              <div 
                onClick={() => togglePersona('Musk')}
                className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedPersonas.includes('Musk')
                    ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500/10 shadow-sm'
                    : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white overflow-hidden font-outfit shrink-0 transition-colors ${
                    selectedPersonas.includes('Musk') ? 'bg-indigo-600' : 'bg-slate-400'
                  }`}>
                    EM
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Elon Musk</span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">First-Principles Thinking</span>
                  </div>
                </div>
                {selectedPersonas.includes('Musk') && (
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white shadow-sm ring-1 ring-indigo-200"></span>
                )}
              </div>

              {/* Steve Jobs Card */}
              <div 
                onClick={() => togglePersona('Jobs')}
                className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedPersonas.includes('Jobs')
                    ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-500/10 shadow-sm'
                    : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white overflow-hidden font-outfit shrink-0 transition-colors ${
                    selectedPersonas.includes('Jobs') ? 'bg-emerald-600' : 'bg-slate-400'
                  }`}>
                    SJ
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Steve Jobs</span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">Design & User-Centric Thinking</span>
                  </div>
                </div>
                {selectedPersonas.includes('Jobs') && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white shadow-sm ring-1 ring-emerald-200"></span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Top Header & Visual Progress Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 shrink-0 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-52 h-52 bg-brand-50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
            <div>
              <span className="inline-flex px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-600 rounded text-[9px] font-bold uppercase tracking-wider">
                Leadership Successor Portal
              </span>
              <h1 className="text-xl font-bold font-outfit text-slate-900 tracking-tight mt-1">
                Welcome back, Alex. Continue your Leadership Transition Training.
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Train on founder operational memories to secure company continuity.
              </p>
            </div>
            
            {/* Progress Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-full border-4 border-brand-100 border-t-brand-600 flex items-center justify-center font-bold font-outfit text-xs text-brand-700 bg-brand-50">
                68%
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Overall Progress</span>
                <span className="block text-xs font-bold text-slate-700 mt-1">SLA Benchmark Met</span>
              </div>
            </div>
          </div>

          {/* Full Linear Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Transition Milestones Onboarded</span>
              <span>8 / 12 Core Goals</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
              <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500 shadow-sm" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        {/* Core Training Modules Title */}
        <div className="flex justify-between items-center shrink-0">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Core Leadership Modules
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">Click any module to trigger AI Tutor scenario</span>
        </div>

        {/* 5 Course Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
          {courseModules.map((mod) => {
            const Icon = mod.icon;
            const isSelected = activeModule.id === mod.id;
            return (
              <div
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[175px] shadow-sm bg-white ${
                  isSelected 
                    ? 'border-brand-500 ring-2 ring-brand-500/10 shadow-brand-500/5' 
                    : 'border-slate-200/80 hover:border-slate-350 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl border ${mod.bgLight} ${mod.borderLight}`}>
                      <Icon className={`w-5.5 h-5.5 ${mod.color}`} />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-800 bg-slate-50 px-2 py-0.5 border border-slate-150 rounded">
                      {mod.completion}%
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 tracking-tight">{mod.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">{mod.description}</p>
                  </div>
                </div>

                {/* Card progress meter & continue button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                  <div className="w-1/2 space-y-1">
                    <div className="w-full h-1 bg-slate-150 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500" style={{ width: `${mod.completion}%` }}></div>
                    </div>
                  </div>
                  <button 
                    className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                      isSelected ? 'text-brand-600 hover:text-brand-700' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Area: Interactive AI Tutor Chat Panel */}
      <div className="w-[420px] bg-white h-full border-l border-slate-200 flex flex-col overflow-hidden shrink-0">
        
        {/* AI Tutor Panel Header */}
        <div className="h-16 border-b border-slate-200 px-5 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-outfit">
                Interactive AI Tutor
              </h3>
              <span className="block text-[9px] text-slate-400 font-semibold tracking-normal mt-0.5 leading-none">
                Training Module: {activeModule.title}
              </span>
            </div>
          </div>
          <span className={`text-[9px] font-extrabold flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
            apiKey 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
              : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`}></span>
            {apiKey ? 'Live Tutor Active' : 'Mock Tutor Active'}
          </span>
        </div>

        {/* Conversations Dialogue Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/30">
          
          {/* Historical Alert Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
            <Bot className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              <strong>Context Mode:</strong> Running in <span className="font-bold text-[#0a2540]">{advisorMode === 'internal' ? '🔒 Company History (Secure Database)' : `🚀 Visionary Mode (Simulating ${selectedPersonas.map(p => p === 'Musk' ? 'Elon Musk' : 'Steve Jobs').join(' & ')})`}</span>. Respond below to analyze and grade your play.
            </p>
          </div>

          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[95%] ${isAI ? '' : 'ml-auto flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border text-[10px] font-bold ${
                  isAI 
                    ? 'bg-brand-50 border-brand-100 text-brand-600' 
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {isAI ? <Bot className="w-4 h-4" /> : <UserIcon className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div className="overflow-hidden flex-1">
                  {msg.isComparative && msg.grade ? (
                    // Side-by-side comparative bubble render in conversation logs
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2.5">
                        {/* Card 1: Our Company History */}
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] leading-relaxed text-emerald-950 shadow-sm">
                          <span className="font-bold block text-emerald-900 border-b border-emerald-150 pb-1 mb-1.5 uppercase text-[9px] tracking-wider flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            Card 1: Our Company History (Grade: {msg.grade})
                          </span>
                          {msg.feedback}
                        </div>

                        {/* Card 2: Elon Musk Approach */}
                        {msg.visionaryCritiques?.Musk && (
                          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-[11px] leading-relaxed text-indigo-950 shadow-sm">
                            <span className="font-bold block text-indigo-900 border-b border-indigo-150 pb-1 mb-1.5 uppercase text-[9px] tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              Card 2: The Elon Musk Approach
                            </span>
                            {msg.visionaryCritiques.Musk}
                          </div>
                        )}

                        {/* Card 3/2: Steve Jobs Approach */}
                        {msg.visionaryCritiques?.Jobs && (
                          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] leading-relaxed text-blue-950 shadow-sm">
                            <span className="font-bold block text-blue-900 border-b border-blue-150 pb-1 mb-1.5 uppercase text-[9px] tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              {msg.visionaryCritiques?.Musk ? 'Card 3:' : 'Card 2:'} The Steve Jobs Approach
                            </span>
                            {msg.visionaryCritiques.Jobs}
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-650 leading-relaxed shadow-sm">
                        <span className="font-bold block text-slate-900 border-b border-slate-100 pb-1 mb-1 uppercase text-[9px] tracking-wider">Tutor Follow-up:</span>
                        {msg.followUp}
                      </div>
                    </div>
                  ) : (
                    // Standard message rendering
                    <div className={`p-4 rounded-xl text-xs leading-relaxed shadow-sm ${
                      isAI 
                        ? 'bg-white border border-slate-200 text-slate-800 whitespace-pre-line' 
                        : 'bg-brand-600 text-white border border-brand-700'
                    }`}>
                      {msg.text}
                    </div>
                  )}
                  <span className={`block text-[8px] text-slate-400 mt-1 ${isAI ? '' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* AI grading / loading indicator */}
          {isAiEvaluating && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-7 h-7 rounded-full border bg-brand-50 border-brand-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-600" />
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-2 shrink-0 w-48">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-brand-500 animate-spin" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {advisorMode === 'visionary' ? 'Evaluating Brains...' : 'Evaluating Play...'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 animate-pulse" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Real-time comparative panels displayed once analyzed */}
          {evaluation && (
            <div className="space-y-4 animate-fade-in">
              {advisorMode === 'visionary' && Object.keys(visionaryCritiques).length > 0 ? (
                // Side-by-side comparative layout
                <div className="flex flex-col gap-3">
                  {/* Card 1: Our Company History */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2.5 shadow-inner">
                    <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Card 1: Company History</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700">{evaluation.grade} / 100</span>
                    </div>
                    <div className="text-[11px] text-emerald-950 leading-relaxed">
                      <span className="font-bold block text-emerald-900 mb-0.5">Tactical Board Critique:</span>
                      {evaluation.feedback}
                    </div>
                  </div>

                  {/* Card 2: Elon Musk Approach */}
                  {visionaryCritiques.Musk && (
                    <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2.5 shadow-inner">
                      <div className="flex justify-between items-center border-b border-indigo-100 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                          <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">
                            Card 2: The Elon Musk Playbook
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-indigo-950 leading-relaxed">
                        <span className="font-bold block text-indigo-900 mb-0.5">First-Principles Analysis:</span>
                        {visionaryCritiques.Musk}
                      </div>
                    </div>
                  )}

                  {/* Card 3/2: Steve Jobs Approach */}
                  {visionaryCritiques.Jobs && (
                    <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2.5 shadow-inner">
                      <div className="flex justify-between items-center border-b border-blue-100 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                            {visionaryCritiques.Musk ? 'Card 3:' : 'Card 2:'} The Steve Jobs Playbook
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-blue-950 leading-relaxed">
                        <span className="font-bold block text-blue-900 mb-0.5">Design-First Critique:</span>
                        {visionaryCritiques.Jobs}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Standard single card
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2.5 shadow-inner">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Board Grade Card</span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-700">{evaluation.grade} / 100</span>
                  </div>
                  <div className="text-[11px] text-emerald-950 leading-relaxed">
                    <span className="font-bold block text-emerald-900 mb-0.5">Tactical Evaluation:</span>
                    {evaluation.feedback}
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Tutor Dialogue Controls & inputs */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            
            {/* Pulsing micro-phone recorder button */}
            <button
              onClick={handleRecordToggle}
              className={`p-3 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/20 animate-pulse' 
                  : 'bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-100'
              }`}
              title={isRecording ? "Stop and Transcribe" : "Record Spoken Answer"}
            >
              <Mic className={`w-4.5 h-4.5 ${isRecording ? 'animate-bounce' : ''}`} />
            </button>

            {/* Input Bar or Wave visualizer */}
            {isRecording ? (
              <div className="flex-1 h-10 bg-rose-50 border border-rose-100 rounded-xl px-3 flex items-center justify-between text-[11px] text-rose-800 overflow-hidden shrink-0">
                <span className="font-bold animate-pulse">RECORDING... {formatTime(recordingTime)}</span>
                <div className="flex items-center gap-0.5 h-5 shrink-0">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="w-0.5 bg-rose-500 rounded wave-bar" style={{ height: `${Math.random() * 80}%` }}></span>
                  ))}
                </div>
                <button
                  onClick={handleRecordToggle}
                  className="text-[9px] font-extrabold uppercase tracking-wider text-rose-700 bg-white px-2 py-1 rounded border border-rose-200 shadow-sm"
                >
                  Submit
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
                className="flex-1 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Draft your operational play here..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    inputText.trim() 
                      ? 'bg-brand-600 hover:bg-brand-700 text-white' 
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SuccessorTraining;
