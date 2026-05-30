import type { Decision, Milestone, ChatMessage, ExtractionSOP, ExtractionMapNode, ExtractionMapEdge, ExtractionDoc } from '../types';


export const mockMilestones: Milestone[] = [
  {
    id: 'm1',
    quarter: 'Q3 2023',
    title: 'Cloud Migration',
    description: 'Migrated infrastructure from legacy on-premise servers to AWS enterprise cloud, improving system uptime by 99.99%.',
    date: 'July 2023'
  },
  {
    id: 'm2',
    quarter: 'Q4 2023',
    title: 'Market Entry',
    description: 'Expanded strategic B2B sales operations into Northern European markets, establishing local logistical partnerships.',
    date: 'October 2023'
  },
  {
    id: 'm3',
    quarter: 'Q4 2023',
    title: 'Decision',
    description: 'Activated secondary supplier agreements due to localized shipping blockages in primary transit lanes.',
    date: 'November 2023'
  },
  {
    id: 'm4',
    quarter: 'Q1 2024',
    title: 'Security Protocol Plan',
    description: 'Drafted and implemented enterprise-wide Zero Trust network policies and automated security incident drills.',
    date: 'January 2024'
  },
  {
    id: 'm5',
    quarter: 'Q1 2024',
    title: 'Bilderling Integration',
    description: 'Conducted commercial merger and onboarding of Bilderling logistics systems into the core database.',
    date: 'February 2024'
  },
  {
    id: 'm6',
    quarter: 'Q1 2024',
    title: 'Secondary Supplier Org',
    description: 'Onboarded secondary and tertiary suppliers under a unified SLA dashboard for instant failover routing.',
    date: 'March 2024'
  }
];

export const mockDecisions: Decision[] = [
  {
    id: 'd1',
    title: 'Secondary Supplier Onboarding',
    category: 'Operations',
    decisionMade: 'Activated pre-approved secondary supplier agreements to mitigate inventory disruption. Identified alternative sourcing. Verified delivery channels.',
    whyItWasMade: 'To diversify supply chain risk and ensure inventory stability during potential primary supplier outages. Critical raw materials were verified for alternate sources.',
    alternativesRejected: [
      'Rejected higher-cost air freight solutions',
      'Rejected manual inventory tracking',
      'Rejected maintaining single-source procurement'
    ],
    timestamp: 'Oct 2023',
    milestoneId: 'm3',
    author: 'Sarah J. (Admin)',
    status: 'active'
  },
  {
    id: 'd2',
    title: 'Q3 Marketing Pivot',
    category: 'Customers',
    decisionMade: 'Redirected 40% of standard outbound ad-spend to high-intent LinkedIn conversational marketing and account-based plays.',
    whyItWasMade: 'To combat declining performance in traditional display ad networks and maximize retention among enterprise tech buyers.',
    alternativesRejected: [
      'Rejected general budget cuts across advertising',
      'Rejected outsourcing marketing to external agencies',
      'Rejected launching aggressive Google Search bidding wars'
    ],
    timestamp: 'Sep 2023',
    milestoneId: 'm1',
    author: 'Sarah J. (Admin)',
    status: 'active'
  },
  {
    id: 'd3',
    title: 'Security Protocol Update',
    category: 'Risk Management',
    decisionMade: 'Enforced hardware-backed multi-factor authentication (YubiKeys) for all departments with access to client data repositories.',
    whyItWasMade: 'To secure sensitive intellectual property and align with strict SOC2 Type II audit requirements for Fortune 500 customers.',
    alternativesRejected: [
      'Rejected SMS-based verification systems due to vulnerability to SIM-swapping',
      'Rejected purely software-based authenticator apps',
      'Rejected delaying enforcement until Q4 audits'
    ],
    timestamp: 'Jan 2024',
    milestoneId: 'm4',
    author: 'Sarah J. (Admin)',
    status: 'active'
  },
  {
    id: 'd4',
    title: 'Bilderling Operations Integration',
    category: 'Financial',
    decisionMade: 'Transferred financial ledgers and logistical records onto an encrypted, unified SaaS accounting and clearing infrastructure.',
    whyItWasMade: 'To speed up cross-border vendor clearing timelines from 5 business days down to under 2 hours.',
    alternativesRejected: [
      'Rejected continuing with regional banks using manual SWIFT clearings',
      'Rejected building an in-house blockchain ledger system',
      'Rejected delaying operations clearing upgrades'
    ],
    timestamp: 'Feb 2024',
    milestoneId: 'm5',
    author: 'Sarah J. (Admin)',
    status: 'active'
  },
  {
    id: 'd5',
    title: 'AWS Enterprise Migration',
    category: 'Operations',
    decisionMade: 'Completed legacy on-prem database migration to highly scalable AWS Aurora clusters under multi-region replication.',
    whyItWasMade: 'To eliminate periodic page load spikes and achieve guaranteed 99.99% service availability during business hours.',
    alternativesRejected: [
      'Rejected upgrading local server nodes (insufficient scalability)',
      'Rejected migrating to single-region Azure instances',
      'Rejected co-location data centers due to high overhead maintenance cost'
    ],
    timestamp: 'Aug 2023',
    milestoneId: 'm1',
    author: 'Sarah J. (Admin)',
    status: 'active'
  },
  {
    id: 'd6',
    title: 'Enterprise Price Restructuring',
    category: 'Financial',
    decisionMade: 'Implemented usage-based tiers with a predictable enterprise baseline contract minimum.',
    whyItWasMade: 'To stabilize monthly recurring revenue while providing scaling flexibility for our fastest growing high-volume customer accounts.',
    alternativesRejected: [
      'Rejected flat seat-based pricing structures',
      'Rejected hyper-custom contract negotiations for all buyers',
      'Rejected aggressive introductory discounting plans'
    ],
    timestamp: 'Nov 2023',
    milestoneId: 'm2',
    author: 'Sarah J. (Admin)',
    status: 'active'
  }
];

export const mockChatHistory: ChatMessage[] = [
  {
    id: 'c1',
    sender: 'ai',
    text: "Let's document your vendor relations. How do you choose suppliers, and how do you handle negotiations?",
    timestamp: '10:42 AM'
  },
  {
    id: 'c2',
    sender: 'user',
    text: "We evaluate suppliers primarily on supply chain stability, SLA history, and geographical redundancy. During negotiations, we secure pre-approved secondary contracts. For example, in Q3, we activated backup SLAs with local logistics groups when shipping lanes were blocked. We explicitly rejected higher-cost air freight because it would destroy our margin, preferring structured multi-source routing.",
    timestamp: '10:44 AM',
    isAudio: true,
    audioDuration: '0:34'
  }
];

export const initialExtractedSOPs: ExtractionSOP[] = [
  {
    id: 'sop1',
    title: 'Failover Supplier Activation',
    category: 'Supply Chain Operations',
    steps: [
      'Monitor shipping delay metrics; trigger warning if logistics exceed 48-hour SLAs.',
      'Notify chief operating officer and activate secondary contract pipeline within 4 hours.',
      'Reroute inventory orders through regional ground channels, locking in pre-approved pricing grids.',
      'Conduct final quality inspection of primary shipments upon clearing customs.'
    ]
  }
];

export const initialExtractedNodes: ExtractionMapNode[] = [
  { id: 'n1', label: 'Primary Route Blockage', type: 'trigger' },
  { id: 'n2', label: 'Evaluate Air Freight vs failover', type: 'decision' },
  { id: 'n3', label: 'Activate Pre-approved SLA', type: 'action' },
  { id: 'n4', label: 'Diversified Logistics Risk', type: 'outcome' }
];

export const initialExtractedEdges: ExtractionMapEdge[] = [
  { from: 'n1', to: 'n2' },
  { from: 'n2', to: 'n3' },
  { from: 'n3', to: 'n4' }
];

export const initialExtractedDocs: ExtractionDoc[] = [
  {
    id: 'doc1',
    title: 'Vendor Sourcing Risk Assessment',
    category: 'Risk Management Strategy',
    content: "FoundersMind policy dictates that no single component supplier shall comprise >60% of quarterly component procurement. In case of logistical gridlock in the primary maritime corridor, operations must auto-switch order dispatching to secondary local agreements. High-cost expedites (e.g., air routes) must be vetted by the finance chair and are rejected by default unless the delay exceeds 10 calendar days."
  }
];
