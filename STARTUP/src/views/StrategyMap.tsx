import React, { useState, useRef } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Info,
  X
} from 'lucide-react';

interface StrategyNode {
  id: string;
  label: string;
  category: 'core' | 'suppliers' | 'customers' | 'risk';
  description: string;
  digitized: boolean;
  sopTitle?: string;
  x: number;
  y: number;
}

interface StrategyEdge {
  from: string;
  to: string;
}

const StrategyMap: React.FC = () => {
  // Strategy Map seed nodes
  const initialNodes: StrategyNode[] = [
    {
      id: 'core-ops',
      label: 'Company Operations',
      category: 'core',
      description: 'The operational core coordinating database scaling, supply logistics, customer acquisitions, and compliance.',
      digitized: true,
      x: 350,
      y: 250
    },
    // Suppliers branch
    {
      id: 'suppliers',
      label: 'Suppliers SLA Network',
      category: 'suppliers',
      description: 'Directs logistics partners, ground expedites, backup freight, and primary component SLA agreements.',
      digitized: true,
      sopTitle: 'Secondary Supplier Onboarding SOP',
      x: 100,
      y: 100
    },
    {
      id: 'transit-redirect',
      label: 'Freight Redirect Protocol',
      category: 'suppliers',
      description: 'Protocols to handle supplier price surges or ocean carrier delays using pre-approved backup SLA transit.',
      digitized: true,
      sopTitle: 'Backup SLA Transit Trigger',
      x: 100,
      y: 220
    },
    // Customers branch
    {
      id: 'customers',
      label: 'Customers Acquisition',
      category: 'customers',
      description: 'Controls enterprise conversion pipelines, ad-spend campaigns, and customer escalation SLA procedures.',
      digitized: true,
      sopTitle: 'Enterprise Escalations Routing',
      x: 600,
      y: 100
    },
    {
      id: 'ad-spend',
      label: 'Ad-Spend Optimization',
      category: 'customers',
      description: 'Founder decisions locking acquisition budgets to safe margins when ad bidding costs escalate.',
      digitized: false,
      x: 600,
      y: 220
    },
    // Risk Management branch
    {
      id: 'risk',
      label: 'Risk & Zero-Trust Architecture',
      category: 'risk',
      description: 'Enforces corporate SOC2 type II compliances, YubiKey hardware requirements, and Zero-Trust user locks.',
      digitized: true,
      sopTitle: 'MFA Hardware Policy Lock',
      x: 350,
      y: 430
    }
  ];

  const edges: StrategyEdge[] = [
    { from: 'core-ops', to: 'suppliers' },
    { from: 'suppliers', to: 'transit-redirect' },
    { from: 'core-ops', to: 'customers' },
    { from: 'customers', to: 'ad-spend' },
    { from: 'core-ops', to: 'risk' }
  ];

  // Canvas States
  const [nodes] = useState<StrategyNode[]>(initialNodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<StrategyNode | null>(initialNodes[0]);
  
  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Zoom Helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click drag
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Search Filter
  const filteredNodes = nodes.filter(n => 
    n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEdgeCoordinates = (edge: StrategyEdge) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    if (!fromNode || !toNode) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    return {
      x1: fromNode.x,
      y1: fromNode.y,
      x2: toNode.x,
      y2: toNode.y
    };
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full bg-slate-50 font-sans relative">
      
      {/* Search overlay & Filters Panel (Top Left) */}
      <div className="absolute top-6 left-6 z-10 w-72 bg-white rounded-2xl border border-slate-200 shadow-lg p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Network className="w-5 h-5 text-brand-600 shrink-0" />
          <div>
            <h1 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Strategic Knowledge Map
            </h1>
            <span className="block text-[9px] text-slate-400 font-semibold uppercase leading-none mt-0.5">
              Institutional Graph View
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search processes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <span className="block border-b border-slate-50 pb-1 text-slate-400">Map Legend</span>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span> Core Operations
            </span>
            <span className="text-[9px] font-bold text-slate-400">Core</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-650"></span> Logistics & Sourcing
            </span>
            <span className="text-[9px] font-bold text-indigo-600">Suppliers</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Enterprise Customer Success
            </span>
            <span className="text-[9px] font-bold text-blue-600">Customers</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Compliance & Security
            </span>
            <span className="text-[9px] font-bold text-emerald-600">Risk</span>
          </div>
        </div>
      </div>

      {/* LARGE INTERACTIVE CANVAS */}
      <div 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 h-full select-none cursor-grab bg-slate-100/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] relative overflow-hidden ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        
        {/* State bound SVG/Node transform wrapper */}
        <div 
          className="absolute origin-center transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            width: '800px',
            height: '600px'
          }}
        >
          {/* Connection Lines (SVGs) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker 
                id="arrow" 
                viewBox="0 0 10 10" 
                refX="20" 
                refY="5" 
                markerWidth="6" 
                markerHeight="6" 
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
              </marker>
            </defs>
            {edges.map((edge, idx) => {
              const coords = getEdgeCoordinates(edge);
              const isSelected = selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);
              return (
                <line
                  key={idx}
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke={isSelected ? '#5c75fb' : '#e2e8f0'}
                  strokeWidth={isSelected ? 3.5 : 2}
                  strokeDasharray={isSelected ? '0' : '4 4'}
                  markerEnd="url(#arrow)"
                  className="transition-colors duration-300"
                />
              );
            })}
          </svg>

          {/* Interactive Flow Nodes */}
          {filteredNodes.map((n) => {
            const isSelected = selectedNode?.id === n.id;
            const matchesSearch = searchQuery && n.label.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Color Mapping
            const colorClass = 
              n.category === 'core' ? 'bg-[#0a2540] border-[#0a2540] text-white shadow-[#0a2540]/10' :
              n.category === 'suppliers' ? 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-indigo-500/5' :
              n.category === 'customers' ? 'bg-blue-50 border-blue-200 text-blue-950 shadow-blue-500/5' :
              'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-emerald-500/5';

            return (
              <div
                key={n.id}
                onClick={(e) => { e.stopPropagation(); setSelectedNode(n); }}
                style={{ left: `${n.x}px`, top: `${n.y}px` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-5 py-3 rounded-2xl border-2 text-center cursor-pointer transition-all duration-300 shadow-md ${colorClass} ${
                  isSelected 
                    ? 'ring-4 ring-brand-500/25 scale-110 z-20 border-brand-500' 
                    : 'hover:scale-105 z-10 hover:shadow-lg'
                } ${
                  matchesSearch ? 'ring-4 ring-amber-500/35 border-amber-500' : ''
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-bold font-outfit tracking-tight block w-44 truncate">
                    {n.label}
                  </span>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${n.digitized ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                      {n.digitized ? 'Digitized' : 'SOP Gap'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* FLOAT PANNING ZOOM CONTROLS (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-10 bg-white border border-slate-200 shadow-lg p-2 rounded-2xl flex items-center gap-1.5">
        <button
          onClick={handleZoomIn}
          className="p-2.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-150"></div>
        <button
          onClick={handleZoomReset}
          className="p-2.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Recenter Map"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* SLIDING DETAIL DRAWER (Right Sidebar) */}
      {selectedNode && (
        <div className="w-80 bg-white border-l border-slate-200 h-full flex flex-col overflow-hidden shrink-0 animate-fade-in relative z-25">
          
          <button 
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Header details */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                selectedNode.category === 'core' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                selectedNode.category === 'suppliers' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                selectedNode.category === 'customers' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {selectedNode.category === 'core' ? 'System Base' : selectedNode.category}
              </span>
              <h3 className="font-outfit font-extrabold text-slate-900 text-base leading-tight">
                {selectedNode.label}
              </h3>
            </div>

            {/* Description */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/60 shadow-inner">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Operational Role
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                {selectedNode.description}
              </p>
            </div>

            {/* SLA / Digitization Info */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="font-bold text-slate-450 uppercase text-[9px] tracking-wider">Digitization Status:</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedNode.digitized 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${selectedNode.digitized ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  {selectedNode.digitized ? '100% Digitized' : 'Gap Flagged'}
                </span>
              </div>

              {selectedNode.digitized && selectedNode.sopTitle ? (
                <div className="space-y-2 bg-emerald-50/50 p-3.5 border border-emerald-150 rounded-xl">
                  <span className="font-extrabold text-[9px] text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Linked SOP Document
                  </span>
                  <span className="block font-bold text-slate-900 text-xs mt-1">
                    {selectedNode.sopTitle}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    This procedure maps critical workflows captured from founder memories and senior engineer logs.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 bg-amber-50/40 p-3.5 border border-amber-150 rounded-xl">
                  <span className="font-extrabold text-[9px] text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Pending AI Intake
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    No active SOP registered for this process. Schedule an employee interview or import corporate logs to close this gap.
                  </p>
                  <button className="w-full mt-2.5 py-1.5 px-3 bg-amber-600 hover:bg-amber-750 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm shadow-amber-600/10">
                    <span>Initiate AI Interview</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StrategyMap;
