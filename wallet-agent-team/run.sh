#!/bin/bash
# MID Wallet CrewAI 特工团队启动脚本

cd "$(dirname "$0")"

# 激活虚拟环境
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "❌ 虚拟环境不存在，请先运行: python3 -m venv venv"
    exit 1
fi

# 检查依赖
if ! python -c "import crewai" 2>/dev/null; then
    echo "📦 安装依赖..."
    pip install crewai crewai-tools langchain-openai langchain-google-genai python-dotenv -q
fi

# 显示菜单
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║          🤖 MID WALLET - CREWAI 特工团队                        ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║                                                                  ║"
echo "║  选择版本：                                                       ║"
echo "║                                                                  ║"
echo "║  [1] V2 基础版  - 11 Agent，线性流程，快速迭代                   ║"
echo "║      模型: GPT-5.4 × 5 + Gemini 3.1 Pro × 6                      ║"
echo "║                                                                  ║"
echo "║  [2] V3 进阶版  - 14 Agent，分层流程，完整交付 ⭐推荐            ║"
echo "║      模型: GPT-5.4 × 6 + Gemini 3.1 Pro × 7 + 人类反馈          ║"
echo "║      新增: DevOps + 文档 + 国际化 + 项目经理                    ║"
echo "║                                                                  ║"
echo "║  [3] 快速演示  - 单 Agent 测试配置                                ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 读取用户选择
read -p "请选择 [1/2/3] (默认: 2): " choice
choice=${choice:-2}

case $choice in
    1)
        echo ""
        echo "🚀 启动 V2 基础版..."
        echo ""
        python crew_v2.py --mission verify_screen
        ;;
    2)
        echo ""
        echo "🚀 启动 V3 进阶版（分层流程 + 人类反馈）..."
        echo ""
        python crew_v3.py --mission verify_screen
        ;;
    3)
        echo ""
        echo "🚀 启动快速演示..."
        echo ""
        python demo.py
        ;;
    *)
        echo ""
        echo "❌ 无效选择，默认启动 V3 进阶版..."
        echo ""
        python crew_v3.py --mission verify_screen
        ;;
esac
