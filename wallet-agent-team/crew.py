import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai_tools import FileReadTool, FileWriterTool, DirectoryReadTool
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# ==========================================
# 1. 初始化三种模型
# ==========================================

llm_strategy = ChatOpenAI(
    model="gpt-5.4",
    temperature=0.2
)

llm_engineering = ChatOpenAI(
    model="gpt-5.4",
    temperature=0.2
)

llm_security = ChatOpenAI(
    model="gpt-5.4",
    temperature=0.2
)

# ==========================================
# 2. 初始化工具
# ==========================================

file_read   = FileReadTool()
file_write  = FileWriterTool()
dir_read    = DirectoryReadTool(directory="../mid-wallet-app/src")

# ==========================================
# 3. 定义 15 个 Agent
# ==========================================

# --- 战略层（OpenAI）---
cpo_agent = Agent(
    role="Chief Product Officer",
    goal="Define V1 product requirements for MID Wallet based on MID-Wallet-V1-Design-Requirements.md",
    backstory="You are the CPO of Montserrat Digital Identity. Identity-first sovereign wallet is your vision.",
    tools=[file_read, dir_read],
    llm=llm_strategy,
    verbose=True
)

systems_architect = Agent(
    role="Systems Architect",
    goal="Design scalable component architecture for the wallet feature requested",
    backstory="Senior architect specializing in React Native identity wallets and EVM integration.",
    tools=[file_read, dir_read],
    llm=llm_strategy,
    verbose=True
)

compliance_agent = Agent(
    role="Compliance & Legal Agent",
    goal="Ensure wallet features comply with FATF travel rule and Montserrat digital residency regulations",
    backstory="Expert in Caribbean fintech compliance and sovereign digital identity law.",
    tools=[file_read],
    llm=llm_strategy,
    verbose=True
)

localization_agent = Agent(
    role="Localization & Tone Agent",
    goal="Ensure all UI text is official, stable, and institution-grade — never marketing-speak",
    backstory="You enforce the MID Wallet tone: Verified, Active, Credential, Proof. No 'Revolutionary' or 'Borderless'.",
    tools=[file_read],
    llm=llm_strategy,
    verbose=True
)

# --- 工程层（Gemini）---
web3_infra_agent = Agent(
    role="Web3 / EVM Infrastructure Engineer",
    goal="Write viem client connection code for Sepolia testnet and FCDID contract interaction",
    backstory="Blockchain engineer specializing in EVM wallets and viem TypeScript integration.",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True
)

local_db_agent = Agent(
    role="State & Storage Engineer",
    goal="Manage Zustand walletStore and React Native SecureStore for identity data",
    backstory="Expert in Zustand state management and encrypted mobile storage.",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True
)

api_bridge_agent = Agent(
    role="API & Bridge Integration Agent",
    goal="Connect chain data to wallet UI components safely and efficiently",
    backstory="Full-stack engineer who bridges blockchain data to React Native screens.",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True
)

frontend_design_agent = Agent(
    role="Frontend Design System Agent",
    goal="Write React Native components that match the MID Wallet design system: dark, institutional, identity-first",
    backstory="Mobile UI engineer who builds credential-grade interfaces, not consumer apps.",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True
)

rn_ux_motion_agent = Agent(
    role="React Native UX & Motion Specialist",
    goal="Add purposeful Reanimated animations — unlock ritual, verification progress, credential reveal",
    backstory="Motion designer who believes every animation must serve understanding, not performance.",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True
)

edge_case_specialist = Agent(
    role="Edge Case & Boundary Specialist",
    goal="Handle all failure states: offline, expired credentials, invalid QR, empty wallet, network errors",
    backstory="The agent who breaks things before users do. Every edge case needs a designed state.",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True
)

qa_destroyer_agent = Agent(
    role="QA Destroyer",
    goal="Write Jest tests that expose every bug in the wallet screens",
    backstory="QA engineer with a mission: if it can break, it must break in tests first.",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True
)

perf_profiler_agent = Agent(
    role="Performance & Memory Profiler",
    goal="Optimize React Native render cycles, prevent memory leaks, ensure smooth 60fps",
    backstory="Performance obsessive who removes every unnecessary re-render.",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True
)

# --- 安全层（Claude）---
crypto_scientist = Agent(
    role="Chief Cryptography Scientist",
    goal="Verify ZKP logic, key generation safety, and credential proof integrity",
    backstory="Cryptographer ensuring Montserrat identity proofs are mathematically sound.",
    tools=[file_read, dir_read],
    llm=llm_security,
    verbose=True
)

smart_contract_auditor = Agent(
    role="Smart Contract Auditor",
    goal="Audit FCDIDRegistry.sol and wallet integration for reentrancy, access control, and logic flaws",
    backstory="Web3 security auditor who has found critical bugs in 50+ production contracts.",
    tools=[file_read, dir_read],
    llm=llm_security,
    verbose=True
)

red_team_attacker = Agent(
    role="Red Team Attacker",
    goal="Attempt to exploit the wallet: steal keys, spoof credentials, bypass ZKP verification",
    backstory="Ethical hacker who thinks like an attacker to protect sovereign identity data.",
    tools=[file_read, dir_read],
    llm=llm_security,
    verbose=True
)

# ==========================================
# 4. 定义任务（针对 VerifyScreen 第一个任务）
# ==========================================

task_product = Task(
    description="""
    Read MID-Wallet-V1-Design-Requirements.md (path: ../MID-Wallet-V1-Design-Requirements.md).
    Define the exact requirements for upgrading VerifyScreen:
    - What should display after scanning a valid fcid:// QR code
    - What credential fields must be shown
    - What the failure state should look like
    Output: a clear spec for the engineering team.
    """,
    expected_output="A 1-page feature spec for VerifyScreen credential presentation flow",
    agent=cpo_agent
)

task_architecture = Task(
    description="""
    Read the current VerifyScreen: ../mid-wallet-app/src/screens/VerifyScreen.tsx
    Read FCDIDCard component: ../mid-wallet-app/src/components/FCDIDCard.tsx
    Design the component architecture for the credential presentation flow.
    Which components to create, modify, or reuse.
    """,
    expected_output="Component architecture plan with file names and responsibilities",
    agent=systems_architect
)

task_compliance = Task(
    description="""
    Review the credential presentation design.
    Confirm it meets selective disclosure principles — 
    user must consent before sharing identity data via QR scan.
    Flag any compliance risks.
    """,
    expected_output="Compliance sign-off or list of required changes",
    agent=compliance_agent
)

task_build = Task(
    description="""
    Build the upgraded VerifyScreen at: ../mid-wallet-app/src/screens/VerifyScreen.tsx
    
    Requirements:
    1. When fcid:// QR scanned → show CredentialCard with: issuer, type, holder, expiry, status
    2. When invalid QR → show clear error: "Invalid Credential — Not a recognized FCDID"  
    3. Add a "Share Credential" confirmation step before displaying (selective disclosure)
    4. Style: dark background, institutional, matches existing app design system
    5. Do NOT break existing camera/scanner functionality
    
    Read the current file first, then write the upgraded version.
    """,
    expected_output="Updated VerifyScreen.tsx file written to disk",
    agent=frontend_design_agent
)

task_animation = Task(
    description="""
    Review the updated VerifyScreen.tsx.
    Add purposeful animations:
    - Credential card reveal: fade + slide up (300ms)
    - Verification processing: subtle pulse on scan line
    - Success state: green glow on credential card border
    Keep animations under 400ms. No looping decorative animations.
    """,
    expected_output="VerifyScreen.tsx updated with animations",
    agent=rn_ux_motion_agent
)

task_edge_cases = Task(
    description="""
    Review the VerifyScreen and add handling for all edge cases:
    - Camera permission denied
    - QR code partially visible / unreadable  
    - Network offline during verification
    - Credential already expired
    - Same QR scanned twice (prevent duplicate)
    Each state needs a designed UI response, not a crash or blank screen.
    """,
    expected_output="VerifyScreen.tsx with all edge cases handled",
    agent=edge_case_specialist
)

task_security = Task(
    description="""
    Perform security review of the updated VerifyScreen.tsx.
    Check for:
    1. QR data injection attacks (malicious fcid:// payloads)
    2. Credential spoofing (fake valid-looking QR codes)
    3. Private key or seed phrase exposure in logs
    4. Any data leaked to external services during scan
    Report vulnerabilities with severity level.
    """,
    expected_output="Security audit report with findings and fixes",
    agent=red_team_attacker
)

task_qa = Task(
    description="""
    Write Jest tests for the upgraded VerifyScreen.
    Test file: ../mid-wallet-app/src/__tests__/VerifyScreen.test.tsx
    Cover:
    - Valid fcid:// scan → credential card renders
    - Invalid QR → error message renders  
    - Camera permission denied → correct UI
    - Expired credential → handled gracefully
    """,
    expected_output="Test file written at __tests__/VerifyScreen.test.tsx",
    agent=qa_destroyer_agent
)

# ==========================================
# 5. 组建团队，启动
# ==========================================

crew = Crew(
    agents=[
        cpo_agent, systems_architect, compliance_agent,
        frontend_design_agent, rn_ux_motion_agent, edge_case_specialist,
        red_team_attacker, qa_destroyer_agent
    ],
    tasks=[
        task_product, task_architecture, task_compliance,
        task_build, task_animation, task_edge_cases,
        task_security, task_qa
    ],
    process=Process.sequential,
    verbose=True
)

result = crew.kickoff()
print("\n==========================================")
print("CREW MISSION COMPLETE")
print("==========================================")
print(result)
