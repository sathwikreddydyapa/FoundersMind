import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Send, 
  Sparkles, 
  FileText, 
  GitFork, 
  Bot, 
  User as UserIcon, 
  Volume2,
  ListOrdered,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { 
  mockChatHistory, 
  initialExtractedSOPs, 
  initialExtractedNodes, 
  initialExtractedEdges, 
  initialExtractedDocs 
} from '../data/mockData';
import type { ChatMessage, ExtractionSOP, ExtractionMapNode, ExtractionMapEdge, ExtractionDoc } from '../types';
import { generateInterviewResponse, extractStructuredKnowledge } from '../services/geminiService';

interface KnowledgeCaptureProps {
  apiKey: string;
}

const KnowledgeCapture: React.FC<KnowledgeCaptureProps> = ({ apiKey }) => {
  // Chat History & Voice States
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Real-time Extracted Data States
  const [extractedSOPs, setExtractedSOPs] = useState<ExtractionSOP[]>(initialExtractedSOPs);
  const [extractedNodes, setExtractedNodes] = useState<ExtractionMapNode[]>(initialExtractedNodes);
  const [extractedEdges, setExtractedEdges] = useState<ExtractionMapEdge[]>(initialExtractedEdges);
  const [extractedDocs, setExtractedDocs] = useState<ExtractionDoc[]>(initialExtractedDocs);
  const [activeRightTab, setActiveRightTab] = useState<'all' | 'sop' | 'map' | 'doc'>('all');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any | null>(null);


  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Audio recording timer simulation
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

  // Google Gemini API integration hook placeholders
  /*
    ========================================================================
    GOOGLE GEMINI API INTEGRATION BLUEPRINT
    ========================================================================
    To enable real-time conversational interviews and structured knowledge parsing,
    integrate the Gemini API by taking the following steps:

    1. Install the SDK:
       $ npm install @google/generative-ai

    2. Initialize the Gemini Client:
       import { GoogleGenAI } from '@google/generative-ai';
       const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    3. For Conversational AI Interviewer (Use Gemini 2.5 Flash / Pro):
       Use a system prompt guiding the model to act as a structured business memory interviewer.
       systemInstruction: "You are the FoundersMind AI Memory Capture agent. Your job is to conduct active interviews to extract operational, tactical, and strategic business data from founders. Ask targeted follow-ups about supplier choices, negotiation parameters, and alternative paths."

    4. For Structured Extraction (JSON Schema Mode):
       When a user submits an answer, call a secondary prompt with responseSchema to parse the transcript:
       const model = genAI.getGenerativeModel({
         model: "gemini-2.5-flash",
         generationConfig: {
           responseMimeType: "application/json",
           responseSchema: {
             type: "object",
             properties: {
               sop: {
                 type: "object",
                 properties: {
                   title: { type: "string" },
                   steps: { type: "array", items: { type: "string" } }
                 }
               },
               knowledgeNodes: {
                 type: "array",
                 items: {
                   type: "object",
                   properties: {
                     id: { type: "string" },
                     label: { type: "string" },
                     type: { type: "string", enum: ["trigger", "decision", "action", "outcome"] }
                   }
                 }
               },
               documentText: { type: "string" }
             }
           }
         }
       });
  */

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsAiTyping(true);

    if (apiKey) {
      // Live Gemini Mode
      try {
        // Run chat response and JSON extraction in parallel for instant updates!
        const [aiText, extraction] = await Promise.all([
          generateInterviewResponse(updatedMessages, apiKey),
          extractStructuredKnowledge(textToSend, apiKey)
        ]);

        setIsAiTyping(false);

        const aiReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiReply]);
        setExtractedSOPs(prev => [extraction.sop, ...prev]);
        setExtractedNodes(prev => [...prev, ...extraction.nodes]);
        setExtractedEdges(prev => [...prev, ...extraction.edges]);
        setExtractedDocs(prev => [extraction.doc, ...prev]);

      } catch (error: any) {
        setIsAiTyping(false);
        const errorReply: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Gemini Integration Error: ${error.message || 'Verification of API Key failed. Please ensure the key entered in Settings is correct.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorReply]);
      }
    } else {
      // Graceful Fallback simulation
      setTimeout(() => {
        setIsAiTyping(false);
        
        const aiReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Fascinating insight. Regarding this, how do you enforce this supply buffer? If a secondary supplier fails, do you have standard pricing caps or tier thresholds in place?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, aiReply]);

        const newSOP: ExtractionSOP = {
          id: `sop-${Date.now()}`,
          title: 'Buffer Pricing Cap Protocol',
          category: 'Financial Operations',
          steps: [
            'Audit secondary billing against original SLA matrix monthly.',
            'Enforce hard caps of max 15% deviation over baseline.',
            'Execute tertiary escalation if pricing exceeds limit for two cycles.'
          ]
        };

        const newNodes: ExtractionMapNode[] = [
          { id: `n-${Date.now()}-1`, label: 'SLA Deviated >15%', type: 'trigger' },
          { id: `n-${Date.now()}-2`, label: 'Check pricing cap agreements', type: 'decision' },
          { id: `n-${Date.now()}-3`, label: 'Enforce Cap / Escalate', type: 'action' }
        ];

        const newEdges: ExtractionMapEdge[] = [
          { from: 'n4', to: `n-${Date.now()}-1` },
          { from: `n-${Date.now()}-1`, to: `n-${Date.now()}-2` },
          { from: `n-${Date.now()}-2`, to: `n-${Date.now()}-3` }
        ];

        const newDoc: ExtractionDoc = {
          id: `doc-${Date.now()}`,
          title: 'Tier-2 Vendor Billing Policy',
          category: 'Financial Strategy',
          content: `All secondary SLAs must incorporate locked-in ground clearing fees. Transgressions above 15% of initial baseline require administrative clearance by Sarah J. or designated operations controllers.`
        };

        setExtractedSOPs(prev => [newSOP, ...prev]);
        setExtractedNodes(prev => [...prev, ...newNodes]);
        setExtractedEdges(prev => [...prev, ...newEdges]);
        setExtractedDocs(prev => [newDoc, ...prev]);

      }, 2200);
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stopped recording - input a simulated transcribed spoken answer
      setIsRecording(false);
      handleSendMessage("Our tier thresholds are set at 15% variance. If the secondary vendor invoices us for more than a 15% spike, it triggers an automatic review by the finance director before payment processing.");
    } else {
      setIsRecording(true);
    }
  };

  const suggestions = [
    { label: 'Ask me about pricing logic', text: 'How do we structure our enterprise usage-based pricing logic and contract tiers?' },
    { label: 'Ask me what mistakes successors should avoid', text: 'What core operational and strategic pitfalls must my successors avoid when scaling our logistics network?' },
    { label: 'Explain client onboarding SLA rules', text: 'What are the exact step-by-step SLA rules we guarantee during client onboarding?' }
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden h-full bg-slate-50 font-sans">
      
      {/* Central Section: The AI Interviewer Chat */}
      <div className="flex-1 flex flex-col min-h-[550px] lg:h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100">
              <Bot className="w-5 h-5 text-brand-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight font-outfit">
                Business Memory AI Interviewer
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                  apiKey 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`}></span>
                  {apiKey ? 'Live Gemini AI Mode' : 'Mock Demo Mode'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Active Knowledge Capture Session
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1.5 border border-slate-200/50 rounded-lg flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interactive Interview Module</span>
          </div>
        </div>

        {/* Conversation Bubbles Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          
          {/* Welcome Alert */}
          <div className="p-4 bg-brand-50/60 border border-brand-100/50 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div className="text-xs text-brand-950">
              <span className="font-bold block text-brand-900 mb-0.5">Gemini-Powered Capture Stream</span>
              This active interview automatically translates your spoken or written transcript into structured business procedures, workflow nodes, and document archives in real-time. Try clicking suggestions below to see the parser in action!
            </div>
          </div>

          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isAI ? '' : 'ml-auto flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border ${
                  isAI 
                    ? 'bg-brand-50 border-brand-100 text-brand-700' 
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {isAI ? <Bot className="w-4.5 h-4.5 text-brand-600" /> : <UserIcon className="w-4 h-4 text-slate-600" />}
                </div>

                {/* Message Box */}
                <div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    isAI 
                      ? 'bg-white border border-slate-200 text-slate-800' 
                      : 'bg-brand-600 text-white border border-brand-700'
                  }`}>
                    {msg.isAudio && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-brand-500/30 text-[10px] text-brand-100 font-semibold">
                        <Volume2 className="w-3.5 h-3.5 text-brand-200" />
                        <span>Voice Recording Transcribed ({msg.audioDuration})</span>
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>
                  <span className={`block text-[9px] text-slate-400 mt-1 ${isAI ? '' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isAiTyping && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full border bg-brand-50 border-brand-100 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-brand-600" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-pulse"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-pulse"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full dot-pulse"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Contextual Suggestion Prompt Chips */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1">
            Suggestions:
          </span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug.text)}
              className="text-[11px] font-semibold text-brand-600 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-200 px-3 py-1.5 rounded-lg transition-all shadow-sm shrink-0"
            >
              {sug.label}
            </button>
          ))}
        </div>

        {/* Chat Input & Microphone Recording panel */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            
            {/* Pulsing microphone recording wrapper */}
            <button
              onClick={handleRecordToggle}
              className={`p-3.5 rounded-xl flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/20 animate-pulse' 
                  : 'bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-100'
              }`}
              title={isRecording ? "Stop and Transcribe" : "Record Spoken Answer"}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-bounce' : ''}`} />
            </button>

            {/* Input Bar or Wave indicator depending on recording state */}
            {isRecording ? (
              <div className="flex-1 h-11 bg-rose-50 border border-rose-100 rounded-xl px-4 flex items-center justify-between text-xs text-rose-800">
                <div className="flex items-center gap-3">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                    RECORDING VOICE...
                  </span>
                  <span>{formatTime(recordingTime)}</span>
                </div>
                {/* Audio Wave Visualizer Simulation */}
                <div className="flex items-center gap-1 h-6">
                  {[...Array(7)].map((_, i) => (
                    <span key={i} className="w-0.5 bg-rose-500 rounded wave-bar" style={{ height: `${Math.random() * 100}%` }}></span>
                  ))}
                </div>
                <button
                  onClick={handleRecordToggle}
                  className="text-xs font-bold text-rose-700 bg-white px-3 py-1.5 rounded-lg border border-rose-200 shadow-sm"
                >
                  Complete & Transcribe
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
                  placeholder="Type an answer or use voice record above..."
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
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

      {/* Right Section: Real-Time Output Panel (Live Knowledge Extraction) */}
      <div className="w-full lg:w-[420px] bg-white h-auto lg:h-full border-t lg:border-t-0 border-slate-200 flex flex-col overflow-hidden shrink-0">
        
        {/* Panel Header */}
        <div className="h-16 border-b border-slate-200 px-5 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4.5 h-4.5 text-brand-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-outfit">
              Live Knowledge Extraction
            </h3>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
        </div>

        {/* Tab Filters */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex gap-1.5 bg-slate-50/30 shrink-0">
          {(['all', 'sop', 'map', 'doc'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveRightTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeRightTab === tab
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {tab === 'all' ? 'All Outputs' : 
               tab === 'sop' ? 'Drafted SOPs' :
               tab === 'map' ? 'Knowledge Maps' : 'Process Docs'}
            </button>
          ))}
        </div>

        {/* Live Extraction Feeds */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* A. Drafted SOPs */}
          {(activeRightTab === 'all' || activeRightTab === 'sop') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ListOrdered className="w-4 h-4 text-brand-500" />
                  <span>Drafted SOPs</span>
                </div>
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 animate-pulse">
                  Drafting...
                </span>
              </div>

              {extractedSOPs.map((sop) => (
                <div 
                  key={sop.id} 
                  className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 space-y-3 animate-fade-in"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-800">{sop.title}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold bg-white border px-1.5 py-0.5 rounded">
                      {sop.category}
                    </span>
                  </div>
                  <ol className="space-y-2 text-[11px] text-slate-600 list-decimal pl-4">
                    {sop.steps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {/* B. Knowledge Maps */}
          {(activeRightTab === 'all' || activeRightTab === 'map') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <GitFork className="w-4 h-4 text-brand-500" />
                  <span>Knowledge Maps</span>
                </div>
                <span className="text-[9px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded border border-brand-100 animate-pulse">
                  Mapping...
                </span>
              </div>

              {/* Graphic Representation Grid */}
              <div className="grid-bg border border-slate-200 rounded-xl p-4 min-h-[220px] flex flex-col justify-between space-y-4 animate-fade-in relative">
                <div className="flex flex-col gap-3 z-10">
                  {extractedNodes.map((node) => {
                    const nextEdge = extractedEdges.find(e => e.from === node.id);
                    return (
                      <div key={node.id} className="flex flex-col items-center">
                        <div className={`px-3 py-2 rounded-lg border text-[10px] font-semibold flex items-center gap-2 shadow-sm w-full max-w-[280px] justify-between ${
                          node.type === 'trigger' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                          node.type === 'decision' ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold' :
                          node.type === 'action' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                          'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              node.type === 'trigger' ? 'bg-amber-500' :
                              node.type === 'decision' ? 'bg-indigo-500' :
                              node.type === 'action' ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}></span>
                            <span className="truncate">{node.label}</span>
                          </div>
                          <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-60">
                            {node.type}
                          </span>
                        </div>
                        {nextEdge && (
                          <div className="w-0.5 h-4 bg-slate-300 relative my-0.5">
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 border-t-4 border-t-slate-400 border-x-4 border-x-transparent"></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* C. Process Documentation */}
          {(activeRightTab === 'all' || activeRightTab === 'doc') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <FileText className="w-4 h-4 text-brand-500" />
                  <span>Process Documentation</span>
                </div>
                <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 animate-pulse">
                  Archiving...
                </span>
              </div>

              {extractedDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 space-y-2.5 animate-fade-in"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-800">{doc.title}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold bg-white border px-1.5 py-0.5 rounded">
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
                    {doc.content}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default KnowledgeCapture;
