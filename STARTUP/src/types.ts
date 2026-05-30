export interface Decision {
  id: string;
  title: string;
  category: 'Operations' | 'Customers' | 'Risk Management' | 'Financial';
  decisionMade: string;
  whyItWasMade: string;
  alternativesRejected: string[];
  timestamp: string;
  milestoneId?: string;
  author: string;
  status: 'active' | 'archived';
}

export interface Milestone {
  id: string;
  quarter: string;
  title: string;
  description: string;
  date: string;
  isActive?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
}

export interface ExtractionSOP {
  id: string;
  title: string;
  category: string;
  steps: string[];
}

export interface ExtractionMapNode {
  id: string;
  label: string;
  type: 'trigger' | 'decision' | 'action' | 'outcome';
}

export interface ExtractionMapEdge {
  from: string;
  to: string;
}

export interface ExtractionDoc {
  id: string;
  title: string;
  category: string;
  content: string;
}
