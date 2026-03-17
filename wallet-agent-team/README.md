# 🤖 MID Wallet - CrewAI 特工团队

使用 CrewAI 框架构建的多 Agent AI 团队，为 Montserrat 数字身份钱包提供全自动开发、审计和优化。

## 🏗️ 团队架构

### 战略层（OpenAI GPT-5.4）
| Agent | 角色 | 职责 |
|-------|------|------|
| CPO | 首席产品官 | 定义产品需求，确保身份优先设计理念 |
| 系统架构师 | 系统架构师 | 设计可扩展的技术架构 |
| 合规顾问 | 合规与法律顾问 | 确保 FATF 和 Montserrat 法规合规 |

### 工程层（Google Gemini 3.1 Pro Preview）
| Agent | 角色 | 职责 |
|-------|------|------|
| 前端工程师 | 前端设计系统工程师 | 编写 React Native 组件 |
| Web3 工程师 | Web3/EVM 基础设施工程师 | 编写 viem 集成代码 |
| 存储工程师 | 状态与存储工程师 | 管理 Zustand 和 SecureStore |
| 边界专家 | 边界情况专家 | 处理所有失败状态 |
| 动效专家 | React Native UX/动效专家 | 添加有意义的动画 |
| QA 工程师 | QA 毁灭者 | 编写全面的测试 |

### 安全层（GPT-5.4）
| Agent | 角色 | 职责 |
|-------|------|------|
| 红队 | 红队攻击者 | 尝试利用和攻击系统 |
| 合约审计 | 智能合约审计师 | 审计 Solidity 合约 |

## 🚀 快速开始

### 1. 环境准备

```bash
cd wallet-agent-team

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置 API Keys

在项目根目录创建 `.env` 文件：

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
```

### 3. 运行任务

#### 方式一：完整任务（VerifyScreen 升级）
```bash
./run.sh
# 或
python crew_v2.py --mission verify_screen
```

#### 方式二：快速演示
```bash
python demo.py
```

## 📋 可用任务

### `verify_screen` - VerifyScreen 凭证展示流程升级
9 个 Agent 协作完成：
1. **CPO** - 定义产品需求
2. **系统架构师** - 设计组件架构
3. **合规顾问** - 审查选择性披露
4. **前端工程师** - 实现 VerifyScreen
5. **动效专家** - 添加动画
6. **边界专家** - 处理错误状态
7. **红队** - 安全审查
8. **合约审计** - 审计 FCDIDRegistry
9. **QA 工程师** - 编写测试

### `wallet_v1` - 完整钱包 V1 开发（计划中）
### `security_audit` - 全面安全审计（计划中）

## 🔧 自定义任务

在 `crew_v2.py` 中添加新的任务函数：

```python
def create_custom_tasks():
    task1 = Task(
        description="任务描述...",
        expected_output="期望输出...",
        agent=frontend_design_agent
    )
    return [task1]
```

然后在 `run_crew_mission()` 中添加对应的分支。

## 📁 项目结构

```
wallet-agent-team/
├── crew_v2.py          # 主程序（9-Agent 团队）
├── demo.py             # 快速演示
├── run.sh              # 启动脚本
├── requirements.txt    # Python 依赖
├── .env                # API Keys（不提交到 Git）
└── README.md           # 本文档
```

## 🎯 工作流程

```
用户请求
    ↓
[Phase 1: 产品定义]
    CPO → 合规顾问 → 系统架构师
    ↓
[Phase 2: 核心开发]
    前端工程师 → Web3 工程师 → 存储工程师
    ↓
[Phase 3: 质量提升]
    动效专家 → 边界专家 → QA 工程师
    ↓
[Phase 4: 安全审计]
    红队 → 合约审计师
    ↓
输出结果
```

## ⚠️ 注意事项

1. **API 费用**：运行完整任务链会消耗多个模型的 Token，注意成本控制
2. **文件权限**：Agent 会读取和写入项目文件，请确保已备份
3. **审查结果**：AI 生成的代码需要人工审查后再合并到主分支

## 🛠️ 故障排除

### 依赖安装失败
```bash
pip install --upgrade pip
pip install crewai crewai-tools -q
```

### API Key 错误
```bash
# 检查环境变量
python -c "import os; print(os.getenv('OPENAI_API_KEY')[:20])"
```

### Google API 问题
如果使用 Gemini 遇到问题，确保：
1. 启用了 Gemini API
2. 使用了正确的 API Key 格式
3. 或者切换到备用模型（gpt-4o）

## 📚 相关文档

- [CrewAI 文档](https://docs.crewai.com/)
- [MID Wallet V1 设计需求](../MID-Wallet-V1-Design-Requirements.md)
- [MID Wallet 差距分析](../MID-Wallet-Gap-Analysis-v2.md)
