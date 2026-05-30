import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage, ExtractionSOP, ExtractionMapNode, ExtractionMapEdge, ExtractionDoc } from '../types';

export interface ExtractedData {
  sop: ExtractionSOP;
  nodes: ExtractionMapNode[];
  edges: ExtractionMapEdge[];
  doc: ExtractionDoc;
}

/**
 * Service to connect directly with the Google Gemini API to drive 
 * conversational interviews and real-time structured knowledge extractions.
 */

/**
 * 1. Conversational AI Interviewer Chat
 * Asks the founder professional, context-aware follow-up questions based on chat history.
 */
export async function generateInterviewResponse(
  chatHistory: ChatMessage[],
  apiKey: string
): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 
        'You are the FoundersMind AI Memory Capture agent. Your task is to conduct active accounts and operations interviews to extract tactical, operational, and strategic business knowledge from founders. ' +
        'Ask exactly ONE targeted, analytical, and short follow-up question. Probe deeper into their supplier choices, pricing metrics, component redundancies, trade-offs, and why they rejected specific high-cost options. ' +
        'Maintain a highly professional, elite digital butler tone. Be very concise (max 2-3 sentences).'
    });

    // Format chat history for Gemini API
    const contents = chatHistory.map(msg => ({
      role: msg.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const result = await model.generateContent({ contents });
    const responseText = result.response.text();
    return responseText.trim();
  } catch (error) {
    console.error('Error in generateInterviewResponse:', error);
    throw new Error('Could not reach Gemini API. Please verify your API key and network connection.');
  }
}

/**
 * 2. Live Structured Knowledge Extractor
 * Parses the founder's dialogue using JSON Mode to generate SOPs, process workflows, and documentation.
 */
export async function extractStructuredKnowledge(
  userInput: string,
  apiKey: string
): Promise<ExtractedData> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We request the model to return JSON directly matching our dashboard structure
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
      You are an expert full-stack business analyst. Analyze the following transcript of a founder explaining a company process/decision.
      
      TRANSCRIPT:
      "${userInput}"
      
      Generate a structured JSON output representing the captured business memory.
      You must respond with valid JSON ONLY. Do not write any explanations. Do not include markdown codeblocks (e.g. \`\`\`json).
      
      The JSON MUST strictly conform to the following interface:
      {
        "sop": {
          "title": "Title of the SOP",
          "category": "Department or Area (e.g. Supply Chain, Customer Success)",
          "steps": ["Step 1 description", "Step 2 description", "Step 3 description"]
        },
        "knowledgeNodes": [
          {
            "id": "node-unique-id (e.g. n1, n2)",
            "label": "Short description of this step/state (max 4 words)",
            "type": "trigger" | "decision" | "action" | "outcome"
          }
        ],
        "knowledgeEdges": [
          {
            "from": "node-id-1",
            "to": "node-id-2"
          }
        ],
        "documentText": "A comprehensive process documentation article summarizing policy guidelines, risks, context, and operational details from the transcript."
      }
      
      Strict Formatting Rules:
      1. Choose node types accurately:
         - "trigger": The initial event/blockage.
         - "decision": Evaluating options or routing.
         - "action": Core operational step taken.
         - "outcome": The business risk mitigated or goal achieved.
      2. Ensure nodes are sequentially connected via edges from start to finish.
      3. The steps in the SOP must represent detailed, numbered tactical protocols.
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    
    // Clean up any potential markdown encapsulation the model might return
    const cleanedJsonText = rawText
      .replace(/```json/i, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedJsonText);

    // Transform parsed fields to fit React view states
    const sop: ExtractionSOP = {
      id: `sop-${Date.now()}`,
      title: parsed.sop?.title || 'Extracted SOP Draft',
      category: parsed.sop?.category || 'Operations',
      steps: parsed.sop?.steps || ['Review operational transcripts for detailed steps.']
    };

    const uniquePrefix = `live-${Date.now()}-`;

    const nodes: ExtractionMapNode[] = (parsed.knowledgeNodes || []).map((n: any, idx: number) => ({
      id: n.id ? `${uniquePrefix}${n.id}` : `n-${Date.now()}-${idx}`,
      label: n.label || 'Workflow Node',
      type: n.type || 'action'
    }));

    const edges: ExtractionMapEdge[] = (parsed.knowledgeEdges || []).map((e: any) => ({
      from: e.from ? `${uniquePrefix}${e.from}` : '',
      to: e.to ? `${uniquePrefix}${e.to}` : ''
    }));

    const doc: ExtractionDoc = {
      id: `doc-${Date.now()}`,
      title: parsed.sop?.title ? `${parsed.sop.title} Policy` : 'Process Document',
      category: parsed.sop?.category || 'Strategy',
      content: parsed.documentText || 'Detailed policies will appear as operational context is captured.'
    };

    return { sop, nodes, edges, doc };
  } catch (error) {
    console.error('Error in extractStructuredKnowledge:', error);
    throw new Error('Failed to extract structured intelligence from transcript via Gemini.');
  }
}

/**
 * 3. Successor Training Scenario Generator
 * Generates dynamic, topic-specific leadership challenges.
 */
export async function generateTutorScenario(
  topic: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    // Graceful fallback scenarios matching core topics
    switch (topic) {
      case 'Operations':
        return "Today we are reviewing Cloud Infrastructure Scale. Due to an unexpected surge in consumer traffic, our secondary database replica is throwing out-of-memory errors. The founder's past decision was to immediately execute pre-provisioned AWS Aurora scale-up scripts instead of auditing legacy query logs. What is your immediate tactical action?";
      case 'Customers':
        return "Today we are reviewing Ad-Spend Optimizations. Enterprise buyer acquisitions have dropped by 25% this quarter, while traditional search ad-spend has reached record bidding costs. Based on company history, how would you restructure the outreach budget to safeguard enterprise lead pipelines?";
      case 'Suppliers':
        return "Today we are reviewing Supplier Negotiations. Based on the founder's past decisions, what would you do if our primary raw materials provider increased prices by 15%?";
      case 'Business History':
        return "Today we are reviewing Corporate Mergers & Database Integrations. We are onboarding the Bilderling logistics ledger into our database, but vendor SLA definitions are conflicting, resulting in clearance delays. The founder rejected a custom blockchain build, preferring locked-in API schemas. How do you resolve the mismatch?";
      case 'Risk Management':
        return "Today we are reviewing SOC2 & Security Enforcement. A major enterprise prospect demands immediate delay exceptions on our Zero-Trust multi-factor hardware policies as a condition to close the contract. Founder history dictates zero policy exceptions. How do you negotiate this trade-off?";
      default:
        return "Today we are reviewing general leadership strategy. How do you evaluate components redundancy vs high-cost expedite options when shipping lanes face blockages?";
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction:
        'You are the FoundersMind AI Leadership Tutor. Your job is to train successor executives using challenging, realistic business challenges. ' +
        'Generate a short, concise leadership challenge and ask the successor what they would do. Keep it under 3 sentences.'
    });

    const prompt = `Generate a realistic B2B SaaS role-play challenge for a successor training under the topic: "${topic}". Reference historical operational concepts like supply chains, AWS scale-up, or Zero-Trust protocols. Ask: What is your operational play?`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error in generateTutorScenario:', error);
    throw new Error('Failed to generate training scenario via Gemini API.');
  }
}

/**
 * 4. Successor Response Grader & Evaluator
 * Grades and critques successor answers against founder historical values using Gemini JSON mode.
 */
export interface EvaluationResult {
  grade: number;
  feedback: string;
  followUp: string;
}

export async function evaluateSuccessorResponse(
  scenario: string,
  successorResponse: string,
  apiKey: string
): Promise<EvaluationResult> {
  if (!apiKey) {
    // Graceful fallback grading simulation
    const grade = successorResponse.toLowerCase().includes('secondary') || 
                  successorResponse.toLowerCase().includes('sla') || 
                  successorResponse.toLowerCase().includes('aws') ||
                  successorResponse.toLowerCase().includes('redundancy')
                    ? 92 
                    : 74;

    return {
      grade,
      feedback: grade >= 90
        ? "Excellent operational insight, successor! You aligned perfectly with the founder's core strategic playbook by selecting structured failover channels, safeguarding component margins, and enforcing system SLAs over expensive ad-hoc fixes."
        : "Operational trade-off mismatch. Your answer prioritizes high-cost custom expedites or ad-hoc overrides, which goes against the founder's strict values of automated redundancy, locked-in SLA clearings, and cost discipline.",
      followUp: "How will you present this strategic play to the advisory board, and what metrics will you track to measure the risk?"
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
      You are the FoundersMind AI Successor Evaluator. Grade the successor's response against the given strategic scenario.
      
      SCENARIO:
      "${scenario}"
      
      SUCCESSOR RESPONSE:
      "${successorResponse}"
      
      You must respond with valid JSON ONLY. Do not write any explanations or markdown.
      
      The JSON MUST strictly conform to the following interface:
      {
        "grade": number (a score between 1 and 100 representing how well their answer matches core business principles like automated redundancy, cost control, and strict SLA enforcement),
        "feedback": "string (a professional, constructive critique from the board/founder point of view. Max 3 sentences)",
        "followUp": "string (exactly ONE challenging follow-up question related to their answer. Max 2 sentences)"
      }
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanedJsonText = rawText
      .replace(/```json/i, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleanedJsonText) as EvaluationResult;
  } catch (error) {
    console.error('Error in evaluateSuccessorResponse:', error);
    throw new Error('Failed to evaluate successor training response via Gemini API.');
  }
}

/**
 * 5. Visionary Advisor Persona Simulator
 * Generates strategic critiques simulating Elon Musk or Steve Jobs logic.
 */
export async function generateVisionaryResponse(
  scenario: string,
  successorResponse: string,
  persona: 'Musk' | 'Jobs',
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    // Graceful fallback simulated persona reviews
    if (persona === 'Musk') {
      return "Elon Musk (First-Principles): Let's deconstruct this to raw physics and first-principles. Why negotiate standard ground clears when you can directly integrate and automate the components sourcing? Lock in raw commodity supply pipelines directly at the source. Automated software-defined routing overrides standard human broker negotiations.";
    } else {
      return "Steve Jobs (Design-Centric): Simplicity is the ultimate sophistication. Why overcomplicate negotiations with multiple redundant SLAs and dashboard grids? Focus on the product experience. Settle on ONE stellar supplier that cares about uncompromising quality, and create insane value for your users.";
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = persona === 'Musk'
      ? 'You are Elon Musk. Respond using strict First-Principles Thinking. Deconstruct the business challenge to its absolute fundamentals (physics, raw materials, manufacturing constraints). Be blunt, highly analytical, and promote hyper-scalable, automated, software-defined systems. Keep your answer under 3 sentences.'
      : 'You are Steve Jobs. Respond using strict User-Centric, Design-First Thinking. Focus on absolute simplicity, human experience, uncompromising product quality, and creating insane value that surprises and delights customers. Settle on a single perfect partner rather than redundant networks. Keep your answer under 3 sentences.';

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const prompt = `
      Critique the successor's response to this strategic scenario from your unique perspective.
      
      SCENARIO:
      "${scenario}"
      
      SUCCESSOR RESPONSE:
      "${successorResponse}"
      
      Respond directly as yourself. Do not include introductory phrases (like "As Elon Musk...").
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error in generateVisionaryResponse:', error);
    throw new Error('Failed to simulate visionary advisor persona via Gemini API.');
  }
}


/**
 * 6. Historical Decision Critique Generator for Decision Archive
 * Generates external visionary critiques on specific historical decision details.
 */
export async function generateArchiveCritique(
  decisionTitle: string,
  decisionMade: string,
  whyMade: string,
  persona: 'Musk' | 'Jobs',
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    if (persona === 'Musk') {
      return `Elon Musk (First-Principles): Building custom adapters for "${decisionTitle}" is an unnecessary intermediate layer. Why have API wrappers when you can unify the schema completely down to raw memory structs? Hyper-scale is achieved by deleting code and steps, not by adding complexity. Focus on raw hardware-bound database synchronization.`;
    } else {
      return `Steve Jobs (Design-Centric): The choice to reject custom blockchain builds for "${decisionTitle}" was correct to focus your precious energy. But the resulting workflow lacks simplicity. Why expose complex schema adapters and SLA grids to the operator? Make the database integration invisible and magical. Focus on the human element, not the technology matrix.`;
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = persona === 'Musk'
      ? 'You are Elon Musk. Critique this historical company decision using strict First-Principles Thinking. Analyze the trade-offs brutally and deconstruct it to absolute fundamentals (cost, efficiency, scalability). Be extremely blunt and direct. Keep your answer under 3 sentences.'
      : 'You are Steve Jobs. Critique this historical company decision using strict Design-Centric, User-Experience Thinking. Evaluate if it focuses the company on core simplicity and premium experience, or if it adds human friction and technological clutter. Keep your answer under 3 sentences.';

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const prompt = `
      Critique the following historical decision made by our company:
      
      DECISION: "${decisionTitle}"
      WHAT WE DID: "${decisionMade}"
      WHY WE DID IT: "${whyMade}"
      
      Provide your brutal external strategic review from your unique perspective.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error in generateArchiveCritique:', error);
    throw new Error('Failed to generate archive critique via Gemini API.');
  }
}
