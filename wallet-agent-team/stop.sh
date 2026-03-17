#!/bin/bash
# 停止 CrewAI V3 团队

echo "🛑 正在停止 CrewAI V3 团队..."

# 查找并停止进程
PIDS=$(pgrep -f "crew_v3.py --mission verify_screen")

if [ -n "$PIDS" ]; then
    echo "找到进程: $PIDS"
    echo "发送停止信号..."
    echo "$PIDS" | xargs kill -TERM 2>/dev/null
    sleep 2
    
    # 检查是否还在运行
    STILL_RUNNING=$(pgrep -f "crew_v3.py --mission verify_screen")
    if [ -n "$STILL_RUNNING" ]; then
        echo "强制停止..."
        echo "$STILL_RUNNING" | xargs kill -KILL 2>/dev/null
    fi
    
    echo "✅ 已停止"
else
    echo "ℹ️  没有运行中的进程"
fi

# 清理
echo ""
echo "🧹 清理完成"
