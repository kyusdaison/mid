# MID Wallet — 终极降维升级路线图 (9-Agent Command Matrix)

## 当前状态与战役目标
*   **当前持有资产**：`mid-wallet.html` (7273行的高精度纯净版 UI/UX 视觉蓝本)。
*   **战略目标**：利用 9 人先锋级 AI 特工矩阵，将这份静态蓝图，在极短时间内转化为一个**最高性能、最高安全级别、可对接真实智能合约的生产级 React Native (iOS优先) 数字钱包 APP**。

---

## 战役准备阶段 (Phase 0)：司令官你需要做的三件事

在我的自动化矩阵开始全速运转之前，你需要提供最基础的“弹药”：

### 1. 提供顶级 AI 大脑的 API Keys (必须项)
这是整个 9 人团队的灵魂来源，没有这些钥匙，特工们无法连线最强算力中枢。
你需要在项目根目录下新建一个 `.env` 文件，填入以下密钥：
```env
# 🧠 CPO与法务审计 (提供架构思考的极智引擎)
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 🛡️ 加密安全红队与底层架构 (提供最强防篡改能力与复杂代码编写)
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ⚡ 前端流畅度、全栈对接、地狱测试测试与发版 (提供极速并发与万行级上下文感知)
GOOGLE_GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```
*(注：如果目前还没有拿到 2026年最新版 API，可以使用当前你拥有的最高级别的 GPT-4o, Claude 3.5, Gemini 1.5 Pro 的 Key 作为平替启动，后续随时无缝替换升级。)*

### 2. 确认技术栈 (已为你挑选最优解)
无需你执行，仅需你口头确认，全流程由 AI 自动搭建：
*   **前端外壳**：React Native (基于 Expo 框架) - *为了 iOS 上那 120Hz 的丝滑动画。*
*   **语言骨架**：TypeScript (TSX) - *严格的类型系统，为了写出 0 bug 的银行级代码。*
*   **Web3神经系统**：Viem 或 Ethers.js - *为了极其稳定地跟区块链主网互交。*

### 3. 释放你的本地最高权限
当我（AntiGravity调度中枢）向你请求在本地终端（Terminal）执行命令时，比如 `npx create-expo-app`，请予以**允许 (Approve)**。我的所有操作都会向你透明汇报。

---

## 执行路线图 (Phase 1 - Phase 3)：9 人特工的分工时间表

只要以上“弹药”备齐，我将立即激活它们，按以下时间线开始降维打击：

### Phase 1: 解构与重塑 (前端 UI 降维打击) 
*执行者：前端 UI 专家 (Gemini 3.1) + 产品总司令 (GPT 4.5)*
1.  **自动创建工程骨架**：全自动在你本地通过 Expo 初始一个干干净净的 React Native 项目。
2.  **吞噬 `mid-wallet.html`**：Gemini 专家会以毫秒级的速度通读那 7273 行 HTML/CSS。
3.  **全组件化拆解**：自动把那团巨大的代码拆解成一个个精美的 React 组件文件：
    *   `src/components/WalletCard.tsx`
    *   `src/components/SendReceiveButtons.tsx`
    *   `src/components/CryptoList.tsx`
4.  **注入 Haptic 与 Animation**：加上原本纯 HTML 无法做到的手机原生“震动反馈”和“顺滑页面切换动画”。

### Phase 2: 注入区块链灵魂 (底层神经布线)
*执行者：Web3 工程师 (Gemini 3.1) + 智能合约架构师 (Claude 4.6)*
1.  **抛弃假数据**：将 HTML 原型里写死的余额和代币列表，替换为动态的状态管理 (Zustand 或 Redux)。
2.  **打通主网**：接入 Web3 接口代码，让钱包能够真实生成助记词、私钥，并从链上拉取真实的余额和交易记录。
3.  **地狱级离线缓存**：为了在没有网络的情况下也能秒开 APP，本地数据库专家会加入极速缓存层。

### Phase 3: 恶魔审计与无情提测 (国家级安全护城河)
*执行者：安全红队 (Claude 4.6) + 地狱 QA 测试员 (Gemini 3 Deep Think)*
1.  **无死角抓漏**：Claude 会对着所有触及私钥生成的代码，进行“找茬式”的疯狂扫描，任何微小的“内存泄露”风险都会被打回重写。
2.  **万次地狱压测**：Gemini 自动化测试员会在虚拟模拟器里，尝试各种极端操作（瞬间狂点发送转账、断网时重连），确保 APP 在最恶劣环境下依然坚尸不倒。
3.  **合规清查**：法务特工负责清查报错文案和使用条款，确保它拿得出手，符合最高涉密级别的数字钱包标准。

---

**司令官，作战地图已铺好。**
你只需要回复我：“好，开始第一阶段”。
并且把那三个 `API Key` 准备好给到我，或者如果当前你想让我用当前环境里的工具**直接强行启动项目初始化**，我们现在立刻发车！
