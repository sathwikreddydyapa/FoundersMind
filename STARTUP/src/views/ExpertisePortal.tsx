import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Send, 
  Mic, 
  Bot, 
  User as UserIcon, 
  CheckCircle2, 
  Layers, 
  ClipboardList, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface BestPractice {
  id: string;
  category: string;
  title: string;
  detail: string;
}

interface WorkflowStep {
  id: string;
  phase: string;
  description: string;
}

const ExpertisePortal: React.FC = () => {
  // Preset AI greeting for Sarah
  const initialMessage: Message = {
    id: 'm-init',
    sender: 'ai',
    text: "Hi Sarah, let us document your weekly workflow. What are your best practices for handling standard customer escalations?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // State Management
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const timerRef = useRef<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Extracted Data States (mocked live as the user chats)
  const [bestPractices, setBestPractices] = useState<BestPractice[]>([
    {
      id: 'bp1',
      category: 'Triage',
      title: 'Initial SLA Verification',
      detail: 'Confirm priority tier (Standard vs Enterprise Gold) before assigning to a technician queue.'
    },
    {
      id: 'bp2',
      category: 'Communication',
      title: 'Active Acknowledgment Loop',
      detail: 'Acknowledge client complaints within 15 minutes of trigger, establishing a locked 2-hour status check.'
    }
  ]);

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'ws1',
      phase: 'Step 1: Intake & Triage',
      description: 'Incoming support ticket parsed by severity tier; priority flagged for Bilderling SLA clients.'
    },
    {
      id: 'ws2',
      phase: 'Step 2: Tier 1 Diagnostic Check',
      description: 'Run automated AWS replica diagnostics and review logs for out-of-memory errors.'
    }
  ]);

  // Suggestion Prompt Chips
  const suggestionChips = [
    "Verify priority Gold SLAs",
    "How we route legacy AWS replica lags",
    "Standard ticket handoffs to Tier 2"
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isExtracting]);

  // Recording Simulation Timer
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

  // Handle message sending (AI automatically updates right panel extraction with new cards!)
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsExtracting(true);

    // Simulate AI thinking and extracting structured knowledge
    setTimeout(() => {
      setIsExtracting(false);
      
      // Dynamic simulated AI response
      const aiReplyText = "Understood. That is a solid operational framework. I've logged this protocol and synthesized your triage sequence. Let's document how you hand off critical database escalations to the backend engineering team.";
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);

      // Add a newly extracted best practice
      const newBp: BestPractice = {
        id: `bp-${Date.now()}`,
        category: 'Escalation',
        title: 'Bilderling Hand-off Rules',
        detail: 'Always route Bilderling ledger mismatches directly to Level 3 DevOps engineers via our secure Slack bridge.'
      };
      setBestPractices(prev => [...prev, newBp]);

      // Add a newly extracted workflow step
      const newWs: WorkflowStep = {
        id: `ws-${Date.now()}`,
        phase: 'Step 3: Level 3 Slack Ping',
        description: 'Publish critical Bilderling SLA alert with raw AWS replicas diagnostics attached.'
      };
      setWorkflowSteps(prev => [...prev, newWs]);
    }, 1500);
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSendMessage("For Tier 2 escalations, we perform a log consolidation trace, verify backup node sync, and ensure Bilderling ledger mismatches are routed within 10 minutes.");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full bg-slate-50 font-sans">
      
      {/* LEFT PANEL: AI Chat Interface for Employees */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-200 bg-slate-50/20 overflow-hidden">
        
        {/* Portal Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight font-outfit uppercase">
                Employee Expertise Capture
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-normal mt-0.5 leading-none">
                Digitizing Sarah J.'s Escalation Best Practices
              </p>
            </div>
          </div>
          <span className="text-[9px] bg-brand-50 border border-brand-100 text-brand-700 px-2 py-0.5 rounded font-extrabold uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping"></span>
            Operational Intake Active
          </span>
        </header>

        {/* Conversation Dialogue Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Context Advisory Alert */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 shadow-inner">
            <Bot className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0a2540] uppercase tracking-wider block">Intelligent Interviewer</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                FoundersMind is capturing Sarah's daily operational workflows. Every response is dynamically compiled into the strategy blueprint and SOP catalogs.
              </p>
            </div>
          </div>

          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[90%] ${isAI ? '' : 'ml-auto flex-row-reverse'}`}>
                {/* User/Bot Avatar */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-bold ${
                  isAI 
                    ? 'bg-brand-50 border-brand-100 text-brand-600' 
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {isAI ? <Bot className="w-4.5 h-4.5" /> : <UserIcon className="w-4 h-4" />}
                </div>

                {/* Text Bubble */}
                <div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    isAI 
                      ? 'bg-white border border-slate-200 text-slate-800' 
                      : 'bg-brand-600 text-white border border-brand-700'
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`block text-[8px] text-slate-400 mt-1 ${isAI ? '' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* AI Live Parser thinking indicator */}
          {isExtracting && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full border bg-brand-50 border-brand-100 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-brand-600 animate-bounce" />
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-2 shrink-0 w-52 shadow-sm">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-brand-500 animate-spin" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    Analyzing Transcript...
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Suggestion prompt chips */}
        <div className="px-6 py-2 border-t border-slate-150 bg-white/50 flex gap-2 overflow-x-auto shrink-0">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-full shadow-sm cursor-pointer whitespace-nowrap transition-colors"
            >
              🚀 {chip}
            </button>
          ))}
        </div>

        {/* Chat Control Input Deck */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            
            {/* Record spoken workflow toggle */}
            <button
              onClick={handleRecordToggle}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/20 animate-pulse' 
                  : 'bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-100'
              }`}
              title={isRecording ? "Stop and Transcribe" : "Record Operational Answer"}
            >
              <Mic className={`w-4.5 h-4.5 ${isRecording ? 'animate-bounce' : ''}`} />
            </button>

            {/* Input Form Deck */}
            {isRecording ? (
              <div className="flex-1 h-11 bg-rose-50 border border-rose-100 rounded-xl px-4 flex items-center justify-between text-xs text-rose-800 overflow-hidden shrink-0">
                <span className="font-bold animate-pulse uppercase tracking-wider text-[10px]">Active Recording... {formatTime(recordingTime)}</span>
                <div className="flex items-center gap-0.5 h-6">
                  {[...Array(8)].map((_, i) => (
                    <span 
                      key={i} 
                      className="w-0.5 bg-rose-500 rounded transition-all duration-300"
                      style={{ height: `${20 + Math.random() * 80}%` }}
                    ></span>
                  ))}
                </div>
                <button
                  onClick={handleRecordToggle}
                  className="text-[9px] font-extrabold uppercase tracking-wider text-rose-700 bg-white px-2 py-1 rounded border border-rose-200 shadow-sm cursor-pointer"
                >
                  Transcribe
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
                  placeholder="Document escalation logs, priority checks, or Bilderling SLAs..."
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    inputText.trim() 
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT PANEL: Real-time Extraction Panel */}
      <div className="w-[450px] bg-white h-full border-l border-slate-200 flex flex-col overflow-hidden shrink-0">
        
        {/* Panel Header */}
        <div className="h-16 border-b border-slate-200 px-5 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ClipboardList className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-outfit">
                Live Extraction Canvas
              </h3>
              <span className="block text-[9px] text-emerald-600 font-extrabold tracking-normal mt-0.5 leading-none uppercase">
                AI Structured Synthesis
              </span>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-extrabold uppercase animate-pulse">
            Syncing SOPs
          </span>
        </div>

        {/* Extracted Data Containers */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/10">
          
          {/* Section 1: Best Practices Logged */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                  Best Practices Logged
                </span>
              </div>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-extrabold">
                {bestPractices.length} Extracted
              </span>
            </div>

            <div className="space-y-3">
              {bestPractices.map((bp) => (
                <div 
                  key={bp.id} 
                  className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm space-y-2 hover:border-brand-500 transition-colors animate-fade-in relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  <div className="flex justify-between items-start pl-1">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-bold uppercase">
                      {bp.category}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs pl-1">{bp.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-1">{bp.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Operational Workflows Documented */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-brand-600" />
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                  Operational Workflows
                </span>
              </div>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-extrabold">
                {workflowSteps.length} Active Steps
              </span>
            </div>

            <div className="space-y-3">
              {workflowSteps.map((ws) => (
                <div 
                  key={ws.id} 
                  className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm space-y-2 hover:border-brand-500 transition-colors animate-fade-in relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                  <div className="flex justify-between items-center pl-1">
                    <span className="font-extrabold text-[10px] text-brand-700">
                      {ws.phase}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-1">{ws.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ExpertisePortal;
