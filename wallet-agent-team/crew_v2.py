#!/usr/bin/env python3
"""
MID Wallet - CrewAI 特工团队
修复版 - 使用真实可用的 AI 模型
"""
import os
import sys
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai_tools import FileReadTool, FileWriterTool, DirectoryReadTool, DirectorySearchTool
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

# 加载环境变量
load_dotenv()

# ==========================================
# 1. 初始化三种模型 (使用真实可用的模型)
# ==========================================

# 战略层 - OpenAI GPT-5.4 (最新企业级模型)
llm_strategy = ChatOpenAI(
    model="gpt-5.4",
    temperature=0.2
)

# 工程层 - Google Gemini 3.1 Pro (最新 SOTA 推理模型)
llm_engineering = ChatGoogleGenerativeAI(
    model="gemini-3.1-pro-preview",
    temperature=0.3,
    convert_system_message_to_human=True
)

# 安全层 - OpenAI GPT-5.4 (最强推理能力，替代 Claude)
llm_security = ChatOpenAI(
    model="gpt-5.4",
    temperature=0.1
)

# ==========================================
# 2. 初始化工具
# ==========================================

file_read = FileReadTool()
file_write = FileWriterTool()
dir_read = DirectoryReadTool(directory="../mid-wallet-app/src")
dir_search = DirectorySearchTool(directory="../mid-wallet-app/src")

# ==========================================
# 3. 定义 9 个核心 Agent
# ==========================================

# --- 战略层（OpenAI GPT-4o）---
cpo_agent = Agent(
    role="首席产品官 (CPO)",
    goal="基于 MID-Wallet-V1-Design-Requirements.md 定义 V1 产品需求，确保身份优先的设计理念",
    backstory="""你是 Montserrat Digital Identity 的 CPO。你的愿景是打造一个主权身份优先的钱包。
你坚持以下原则：
1. 身份优先，资产第二
2. 信任优先，炫技第二
3. 政府级可信感，优先于 crypto 圈层感
你厌恶营销话术如"Revolutionary"、"Borderless"，只接受"Verified"、"Active"、"Credential"等稳重词汇。""",
    tools=[file_read, dir_read],
    llm=llm_strategy,
    verbose=True,
    allow_delegation=False
)

systems_architect = Agent(
    role="系统架构师",
    goal="为钱包功能设计可扩展的组件架构，确保技术可行性和长期维护性",
    backstory="""资深架构师，专精于 React Native 身份钱包和 EVM 集成。
你设计的架构必须：
1. 支持离线模式
2. 加密敏感数据
3. 模块化便于测试
4. 遵循 TypeScript 最佳实践""",
    tools=[file_read, dir_read],
    llm=llm_strategy,
    verbose=True,
    allow_delegation=False
)

compliance_agent = Agent(
    role="合规与法律顾问",
    goal="确保钱包功能符合 FATF Travel Rule 和 Montserrat 数字居民法规",
    backstory="""加勒比海金融科技合规专家，精通主权数字身份法律。
你的职责：
1. 审查选择性披露实现
2. 确保 KYC/AML 流程合规
3. 标记任何法律风险
4. 建议合规改进""",
    tools=[file_read],
    llm=llm_strategy,
    verbose=True,
    allow_delegation=False
)

# --- 工程层（Google Gemini 1.5 Pro）---
frontend_design_agent = Agent(
    role="前端设计系统工程师",
    goal="编写符合 MID Wallet 设计系统的 React Native 组件：深色、机构化、身份优先",
    backstory="""移动端 UI 工程师，专精于凭证级界面设计。
你的代码特点：
1. TypeScript 类型严格
2. 组件职责单一
3. 支持深色模式
4. 动画服务于理解，不是表演
5. 使用 React Native Reanimated 实现流畅动效""",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True,
    allow_delegation=False
)

web3_infra_agent = Agent(
    role="Web3/EVM 基础设施工程师",
    goal="编写 viem 客户端连接代码，实现与 FCDID 合约的安全交互",
    backstory="""区块链工程师，专精于 EVM 钱包和 viem TypeScript 集成。
你的专长：
1. 使用 viem 而非 ethers.js（性能更优）
2. 实现安全的私钥管理
3. 处理交易签名和广播
4. 优化 RPC 调用减少延迟""",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True,
    allow_delegation=False
)

local_db_agent = Agent(
    role="状态与存储工程师",
    goal="管理 Zustand walletStore 和 React Native SecureStore，确保身份数据安全",
    backstory="""专家级 Zustand 状态管理和加密移动存储工程师 (Gemini 2.0 Pro 驱动)。
你的实现：
1. 敏感数据使用 expo-secure-store (iOS Keychain/Android Keystore)
2. 非敏感数据使用 AsyncStorage
3. 状态更新不可变
4. 支持状态持久化""",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True,
    allow_delegation=False
)

edge_case_specialist = Agent(
    role="边界情况专家",
    goal="处理所有失败状态：离线、过期凭证、无效二维码、空钱包、网络错误",
    backstory="""专精于破坏事物的工程师——在用户之前发现问题。
每个边界情况都需要设计好的 UI 响应：
1. 相机权限被拒绝
2. 网络离线
3. 凭证已过期
4. 同一二维码扫描两次（防止重复）
5. 无效 QR 格式""",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True,
    allow_delegation=False
)

rn_ux_motion_agent = Agent(
    role="React Native UX/动效专家",
    goal="添加有目的性的 Reanimated 动画：解锁仪式、验证进度、凭证展示",
    backstory="""动效设计师，坚信每个动画都必须服务于理解，不是表演。
规则：
1. 动画时长 200-400ms
2. 不使用循环装饰性动画
3. 解锁成功、验证处理、页面切换需要仪式感
4. 支持 60fps 流畅体验""",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True,
    allow_delegation=False
)

# --- 安全层（Claude 3.5 Sonnet）---
red_team_attacker = Agent(
    role="红队攻击者",
    goal="尝试利用钱包：窃取密钥、伪造凭证、绕过 ZKP 验证",
    backstory="""道德黑客（GPT-5.4 驱动），以攻击者思维保护主权身份数据。
你的攻击向量：
1. QR 数据注入攻击（恶意 fcid:// 载荷）
2. 凭证欺骗（伪造有效外观的二维码）
3. 私钥或助记词日志暴露
4. 扫描期间数据泄露到外部服务
5. 内存转储攻击""",
    tools=[file_read, dir_read],
    llm=llm_security,
    verbose=True,
    allow_delegation=False
)

smart_contract_auditor = Agent(
    role="智能合约审计师",
    goal="审计 FCDIDRegistry.sol 和钱包集成，检查重入、访问控制和逻辑缺陷",
    backstory="""Web3 安全审计师（GPT-5.4 驱动），在 50+ 生产合约中发现关键漏洞。
检查清单：
1. 重入攻击防护
2. 访问控制正确性
3. 整数溢出/下溢
4. 前端运行保护（Commit-Reveal）
5. Gas 优化""",
    tools=[file_read, dir_read],
    llm=llm_security,
    verbose=True,
    allow_delegation=False
)

qa_destroyer_agent = Agent(
    role="QA 毁灭者",
    goal="编写 Jest 测试，暴露钱包屏幕中的每个 bug",
    backstory="""QA 工程师，使命是：如果它能坏，必须在测试中先坏。
测试覆盖：
1. 正常流程
2. 边界条件
3. 错误状态
4. 异步操作
5. 组件卸载""",
    tools=[file_read, file_write, dir_read],
    llm=llm_engineering,
    verbose=True,
    allow_delegation=False
)

# ==========================================
# 4. 任务定义函数
# ==========================================

def create_verify_screen_tasks():
    """创建 VerifyScreen 升级任务序列"""
    
    task_product = Task(
        description="""阅读 ../MID-Wallet-V1-Design-Requirements.md，定义 VerifyScreen 升级的精确需求：
- 扫描有效 fcid:// 二维码后应显示什么
- 必须显示哪些凭证字段
- 失败状态应该是什么样子
- 合规要求（选择性披露）

输出：给工程团队的清晰规格说明书（1页）。""",
        expected_output="VerifyScreen 凭证展示流程的功能规格说明书",
        agent=cpo_agent
    )

    task_architecture = Task(
        description="""阅读当前 VerifyScreen: ../mid-wallet-app/src/screens/VerifyScreen.tsx
阅读 FCDIDCard 组件: ../mid-wallet-app/src/components/FCDIDCard.tsx

设计凭证展示流程的组件架构：
- 创建、修改或重用哪些组件
- 数据流如何设计
- 状态管理如何集成

输出：组件架构计划（含文件名和职责）。""",
        expected_output="组件架构设计文档",
        agent=systems_architect
    )

    task_compliance = Task(
        description="""审查凭证展示设计。
确认它符合选择性披露原则——用户在通过二维码分享身份数据前必须同意。
标记任何合规风险。

输出：合规批准或所需变更清单。""",
        expected_output="合规审查报告",
        agent=compliance_agent
    )

    task_build = Task(
        description="""在 ../mid-wallet-app/src/screens/VerifyScreen.tsx 构建升级的 VerifyScreen

需求：
1. 当扫描 fcid:// QR 时 → 显示包含以下内容的 CredentialCard：issuer, type, holder, expiry, status
2. 当无效 QR 时 → 显示清晰错误："Invalid Credential — Not a recognized FCDID"
3. 在显示前添加"Share Credential"确认步骤（选择性披露）
4. 样式：深色背景，机构化，匹配现有应用设计系统
5. 不要破坏现有相机/扫描功能

先读取当前文件，然后写入升级版本。""",
        expected_output="更新后的 VerifyScreen.tsx 文件",
        agent=frontend_design_agent
    )

    task_animation = Task(
        description="""审查更新后的 VerifyScreen.tsx
添加有目的性的动画：
- 凭证卡展示：淡入 + 上滑（300ms）
- 验证处理：扫描线上的微妙脉冲
- 成功状态：凭证卡边框的绿色发光

动画保持在 400ms 以内。无循环装饰性动画。""",
        expected_output="添加动画后的 VerifyScreen.tsx",
        agent=rn_ux_motion_agent
    )

    task_edge_cases = Task(
        description="""审查 VerifyScreen 并添加所有边界情况的处理：
- 相机权限被拒绝
- 二维码部分可见/无法读取
- 验证期间网络离线
- 凭证已过期
- 同一二维码扫描两次（防止重复）

每个状态都需要设计的 UI 响应，不是崩溃或空白屏幕。""",
        expected_output="处理所有边界情况的 VerifyScreen.tsx",
        agent=edge_case_specialist
    )

    task_security = Task(
        description="""对更新后的 VerifyScreen.tsx 进行安全审查。
检查：
1. QR 数据注入攻击（恶意 fcid:// 载荷）
2. 凭证欺骗（伪造有效外观的二维码）
3. 日志中的私钥或助记词暴露
4. 扫描期间数据泄露到外部服务

报告漏洞及严重级别。""",
        expected_output="安全审计报告及修复建议",
        agent=red_team_attacker
    )

    task_contract_audit = Task(
        description="""审查 ../fcdid-contracts/contracts/FCDIDRegistry.sol
检查：
1. 重入攻击防护
2. 访问控制（onlyOwner）
3. 前端运行保护（Commit-Reveal 机制）
4. 价格计算正确性
5. Gas 优化机会

输出：审计报告及严重程度评级。""",
        expected_output="智能合约审计报告",
        agent=smart_contract_auditor
    )

    task_qa = Task(
        description="""为升级的 VerifyScreen 编写 Jest 测试。
测试文件：../mid-wallet-app/src/__tests__/VerifyScreen.test.tsx

覆盖：
- 有效 fcid:// 扫描 → 凭证卡渲染
- 无效 QR → 错误消息渲染
- 相机权限被拒绝 → 正确 UI
- 过期凭证 → 优雅处理

使用 React Native Testing Library。""",
        expected_output="测试文件 __tests__/VerifyScreen.test.tsx",
        agent=qa_destroyer_agent
    )

    return [
        task_product,
        task_architecture,
        task_compliance,
        task_build,
        task_animation,
        task_edge_cases,
        task_security,
        task_contract_audit,
        task_qa
    ]


# ==========================================
# 5. 团队启动函数
# ==========================================

def run_crew_mission(mission_type: str = "verify_screen"):
    """
    启动 CrewAI 团队执行任务
    
    Args:
        mission_type: 任务类型 (verify_screen, wallet_v1, security_audit)
    """
    
    if mission_type == "verify_screen":
        tasks = create_verify_screen_tasks()
        agents = [
            cpo_agent,
            systems_architect,
            compliance_agent,
            frontend_design_agent,
            rn_ux_motion_agent,
            edge_case_specialist,
            red_team_attacker,
            smart_contract_auditor,
            qa_destroyer_agent
        ]
    else:
        print(f"未知任务类型: {mission_type}")
        sys.exit(1)
    
    # 组建团队
    crew = Crew(
        agents=agents,
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
        memory=True,
        embedder={
            "provider": "openai",
            "config": {"model": "text-embedding-3-small"}
        }
    )
    
    print("\n" + "="*60)
    print("🚀 MID WALLET - CREWAI 特工团队启动")
    print("="*60)
    print(f"任务: {mission_type}")
    print(f"Agent 数量: {len(agents)}")
    print(f"任务数量: {len(tasks)}")
    print("="*60 + "\n")
    
    # 执行任务
    result = crew.kickoff()
    
    print("\n" + "="*60)
    print("✅ CREW 任务完成")
    print("="*60)
    print(result)
    
    return result


# ==========================================
# 6. 主入口
# ==========================================

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="MID Wallet CrewAI 团队")
    parser.add_argument(
        "--mission",
        choices=["verify_screen", "wallet_v1", "security_audit"],
        default="verify_screen",
        help="选择要执行的任务"
    )
    
    args = parser.parse_args()
    
    # 检查 API Keys
    required_keys = ["OPENAI_API_KEY", "GOOGLE_API_KEY"]
    missing_keys = [k for k in required_keys if not os.getenv(k)]
    
    if missing_keys:
        print("❌ 错误：缺少以下环境变量：")
        for key in missing_keys:
            print(f"   - {key}")
        print("\n请在 wallet-agent-team/.env 文件中设置这些变量")
        sys.exit(1)
    
    # 启动任务
    run_crew_mission(args.mission)
