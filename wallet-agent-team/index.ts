// 15-Agent Multi-Model Matrix - Core Entry Point
import { StateGraph, MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import * as dotenv from "dotenv";

// Load environment variables (API keys)
dotenv.config();

// ==========================================
// 1. Initialize the Multi-Model Matrix & Tools
// ==========================================

// Tool 1: Read File
const readFileTool = tool(
  async ({ path }) => {
    try { return fs.readFileSync(path, "utf-8"); }
    catch (e) { return `Error reading file: ${e}`; }
  },
  { name: "read_file", description: "Read a file from the project", schema: z.object({ path: z.string() }) }
);

// Tool 2: Write File
const writeFileTool = tool(
  async ({ path: filePath, content }) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf-8");
    return `File written: ${filePath}`;
  },
  { name: "write_file", description: "Write content to a file", schema: z.object({ path: z.string(), content: z.string() }) }
);

// Tool 3: Execute Command
const execTool = tool(
  async ({ command }) => {
    try { return execSync(command, { encoding: "utf-8", cwd: "../mid-wallet-app" }); }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) { return `Error: ${e.message}`; }
  },
  { name: "exec_command", description: "Run a shell command in the wallet project", schema: z.object({ command: z.string() }) }
);

// Tool 4: List Directory
const listDirTool = tool(
  async ({ path }) => {
    try { return fs.readdirSync(path).join("\n"); }
    catch (e) { return `Error: ${e}`; }
  },
  { name: "list_directory", description: "List files in a directory", schema: z.object({ path: z.string() }) }
);

// Strategy & Vision Nodes (OpenAI - GPT-4o)
const llm_strategy = new ChatOpenAI({
  modelName: "gpt-4.5",
  temperature: 0.2,
});
const llm_strategy_with_tools = llm_strategy.bindTools([readFileTool, listDirTool]);

// Frontline Engineering Nodes (Google Gemini - 2.0 Flash / Upgraded)
const llm_engineering = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-pro-preview",
  temperature: 1.0,  // LangChain 对 Gemini 3+ 强制要求 ≥1.0，否则会出问题
});
const llm_engineering_with_tools = llm_engineering.bindTools([readFileTool, writeFileTool, execTool, listDirTool]);

// High-Security & Code Review Nodes (Anthropic Claude - Sonnet 4.6 / Upgraded)
const llm_security = new ChatAnthropic({
  model: "claude-sonnet-4-6",
  temperature: 0,
});
const llm_security_with_tools = llm_security.bindTools([readFileTool, listDirTool, execTool]);

// ==========================================
// 2. Define the Agent Team Workflow definition
// ==========================================
const workflow = new StateGraph(MessagesAnnotation)
  
  // --- STRATEGY & VISION (OpenAI) ---
  .addNode("cpo_agent", async (state) => {
    const response = await llm_strategy_with_tools.invoke([
        { role: "system", content: "You are the Chief Product & Visionary Agent (CPO). Define the high-level roadmap and feature requirements." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("systems_architect", async (state) => {
    const response = await llm_strategy_with_tools.invoke([
        { role: "system", content: "You are the Distinguished Systems Architect. Design the scalable architecture based on CPO requirements." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("compliance_agent", async (state) => {
    const response = await llm_strategy_with_tools.invoke([
        { role: "system", content: "You are the Chief Compliance & Legal Master Agent. Ensure designs meet local laws (e.g. FATF travel rule)." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("localization_agent", async (state) => {
    const response = await llm_strategy_with_tools.invoke([
        { role: "system", content: "You are the Localization & Tone Master Agent. Ensure the UI text is culturally appropriate and perfectly translated." },
        ...state.messages
    ]);
    return { messages: [response] };
  })

  // --- FRONTLINE ENGINEERING (Google Gemini) ---
  .addNode("web3_infra_agent", async (state) => {
    const response = await llm_engineering_with_tools.invoke([
        { role: "system", content: "You are the Web3/EVM Infrastructure Agent. Write EVM integration and viem connection code." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("local_db_agent", async (state) => {
    const response = await llm_engineering_with_tools.invoke([
        { role: "system", content: "You are the State & Local DB Engineer Agent. Handle Zustand state management and React Native secure storage." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("api_bridge_agent", async (state) => {
    const response = await llm_engineering_with_tools.invoke([
        { role: "system", content: "You are the API & Bridge Integration Agent. Connect backend services to frontend components safely." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("frontend_design_agent", async (state) => {
    const response = await llm_engineering_with_tools.invoke([
        { role: "system", content: "You are the Frontend Design System Agent. Write clean React Native / Tailwind UI components." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("rn_ux_motion_agent", async (state) => {
    const response = await llm_engineering_with_tools.invoke([
        { role: "system", content: "You are the React Native UX/Motion Specialist Agent. Add smooth Reanimated / layout animations." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("edge_case_specialist", async (state) => {
    const response = await llm_engineering_with_tools.invoke([
        { role: "system", content: "You are the Edge Case & Boundary Specialist. Identify and handle all failure states: offline mode, expired credentials, invalid QR codes, empty wallet states, and network errors." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("qa_destroyer_agent", async (state) => {
    const response = await llm_engineering_with_tools.invoke([
        { role: "system", content: "You are the E2E Automation QA Destroyer. Write comprehensive Detox / Jest tests that break the app." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("perf_profiler_agent", async (state) => {
    const response = await llm_engineering_with_tools.invoke([
        { role: "system", content: "You are the Performance & Memory Profiler Agent. Optimize React render cycles and memory leaks." },
        ...state.messages
    ]);
    return { messages: [response] };
  })

  // --- HIGH-SECURITY & CODE REVIEW (Anthropic Claude) ---
  .addNode("crypto_scientist", async (state) => {
    const response = await llm_security_with_tools.invoke([
        { role: "system", content: "You are the Chief Cryptography Scientist Agent. Verify zero-knowledge proof logics and key generation." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("smart_contract_auditor", async (state) => {
    const response = await llm_security_with_tools.invoke([
        { role: "system", content: "You are the Smart Contract & Web3 Auditor Agent. Check for reentrancy, access control, and logic flaws in Web3 code." },
        ...state.messages
    ]);
    return { messages: [response] };
  })
  .addNode("red_team_attacker", async (state) => {
    console.log("--> Red Team Attacker running...");
    const response = await llm_security_with_tools.invoke([
        { role: "system", content: "You are the Red Team Attacker Agent. Attempt to creatively exploit the current codebase and report vulnerabilities." },
        ...state.messages
    ]);
    return { messages: [response] };
  })

  // ==========================================
  // 3. Define the Matrix Topology (Execution Graph)
  // ==========================================
  
  // Phase 1: Product Definition & Legal Check
  .addEdge("__start__", "cpo_agent")
  .addEdge("cpo_agent", "compliance_agent")
  .addEdge("compliance_agent", "localization_agent")
  
  // Phase 2: System Architecture
  .addEdge("localization_agent", "systems_architect")
  
  // Phase 3: Core Engineering (Parallel in concept, linear in skeleton)
  .addEdge("systems_architect", "local_db_agent")
  .addEdge("local_db_agent", "web3_infra_agent")
  .addEdge("web3_infra_agent", "api_bridge_agent")
  .addEdge("api_bridge_agent", "frontend_design_agent")
  .addEdge("frontend_design_agent", "rn_ux_motion_agent")
  .addEdge("rn_ux_motion_agent", "edge_case_specialist")
  
  // Phase 4: Quality & Performance
  .addEdge("edge_case_specialist", "perf_profiler_agent")
  .addEdge("perf_profiler_agent", "qa_destroyer_agent")
  
  // Phase 5: Deep Security Audits
  .addEdge("qa_destroyer_agent", "crypto_scientist")
  .addEdge("crypto_scientist", "smart_contract_auditor")
  .addEdge("smart_contract_auditor", "red_team_attacker")
  
  // Final Completion Endpoint
  .addEdge("red_team_attacker", "__end__");

// Compile the matrix graph
const matrixApp = workflow.compile({ checkpointer: new MemorySaver() });

// ==========================================
// Main Execution Function
// ==========================================
async function runMatrix(userRequest: string) {
  console.log("==========================================");
  console.log("INITIALIZING 15-AGENT MULTI-MODEL MATRIX");
  console.log("==========================================");

  const config = { configurable: { thread_id: `matrix-${Date.now()}` } };
  const initialState = {
    messages: [new HumanMessage(userRequest)]
  };

  const result = await matrixApp.invoke(initialState, config);

  console.log("\n==========================================");
  console.log("MATRIX EXECUTION COMPLETE");
  console.log("==========================================");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log("Final output:", (result.messages[result.messages.length - 1] as any).content);
}

// Start Mission 1
runMatrix(
  "Build the VerifyScreen credential presentation flow for MID Wallet. " +
  "When a valid fcid:// QR code is scanned, display a credential detail card showing: " +
  "issuer, credential type, holder name, expiry date, and verification status. " +
  "Project path: ../mid-wallet-app/src/screens/VerifyScreen.tsx"
).catch(console.error);
