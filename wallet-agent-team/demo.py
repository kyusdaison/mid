#!/usr/bin/env python3
"""
MID Wallet - CrewAI 快速演示
单任务演示，验证配置是否正确
"""
import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from crewai_tools import FileReadTool
from langchain_openai import ChatOpenAI

load_dotenv()

# 检查 API Key
if not os.getenv("OPENAI_API_KEY"):
    print("❌ 错误：请设置 OPENAI_API_KEY 环境变量")
    exit(1)

# 初始化 LLM
llm = ChatOpenAI(model="gpt-5.4", temperature=0.3)

# 初始化工具
file_read = FileReadTool()

# 创建 Agent
architect = Agent(
    role="系统架构师",
    goal="分析项目结构并提供架构建议",
    backstory="资深全栈架构师，专精于 React Native 和 Web3 项目",
    tools=[file_read],
    llm=llm,
    verbose=True
)

# 创建任务
task = Task(
    description="""分析 ../mid-wallet-app/src 的项目结构：
1. 读取目录结构
2. 分析当前架构
3. 指出潜在改进点
4. 给出 3-5 条具体建议

输出格式：
## 项目结构概览
...

## 架构分析
...

## 改进建议
1. ...
2. ...
3. ...
""",
    expected_output="项目架构分析报告",
    agent=architect
)

# 创建 Crew
crew = Crew(
    agents=[architect],
    tasks=[task],
    verbose=True
)

print("\n" + "="*60)
print("🚀 MID Wallet - CrewAI 快速演示")
print("="*60 + "\n")

# 运行
result = crew.kickoff()

print("\n" + "="*60)
print("✅ 演示完成")
print("="*60)
print(result)
