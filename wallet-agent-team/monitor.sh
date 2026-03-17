#!/bin/bash
# CrewAI V3 团队监控脚本

cd "$(dirname "$0")"

echo "═══════════════════════════════════════════════════════════"
echo "                🤖 CrewAI V3 团队监控"
echo "═══════════════════════════════════════════════════════════"
echo ""

# 检查进程
echo "📊 运行状态:"
PIDS=$(pgrep -f "crew_v3.py --mission verify_screen" | head -1)
if [ -n "$PIDS" ]; then
    echo "✅ 进程运行中，PID: $PIDS"
    echo ""
    echo "⏱️  运行时长:"
    ps -o pid,etime,command -p $PIDS 2>/dev/null | tail -1
else
    echo "❌ 进程未运行"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# 检查日志
if [ -f "crew_output.log" ]; then
    echo "📝 最新日志 (最近 30 行):"
    echo "─────────────────────────────────────────────────────────"
    tail -30 crew_output.log 2>/dev/null
    echo ""
    echo "─────────────────────────────────────────────────────────"
    echo "📄 日志文件: $(pwd)/crew_output.log"
    echo "📊 日志大小: $(ls -lh crew_output.log 2>/dev/null | awk '{print $5}')"
else
    echo "❌ 日志文件不存在"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🛠️  快捷命令:"
echo "   ./monitor.sh      # 查看状态"
echo "   ./stop.sh         # 停止团队"
echo "   tail -f crew_output.log  # 实时查看日志"
echo ""
