#!/bin/bash
# Fly.io 一键部署脚本
# 用法: bash deploy.sh

set -e

echo "🚀 部署紫微斗数 Bot 到 Fly.io"
echo "================================"

# 检查 flyctl
if ! command -v flyctl &>/dev/null && ! [ -f /Users/midas/.fly/bin/flyctl ]; then
  echo "📥 安装 flyctl..."
  curl -fsSL https://fly.io/install.sh | sh
  export FLYCTL_INSTALL="$HOME/.fly"
  export PATH="$FLYCTL_INSTALL/bin:$PATH"
fi

FLY_CMD="/Users/midas/.fly/bin/flyctl"

echo "🔑 请登录 Fly.io（会在浏览器打开）"
echo "   如果没有账号，会自动跳转到注册页"
echo "   注册不需要信用卡，免费额度足够"
echo ""
echo "   登录后命令会自动继续..."
$FLY_CMD auth login

echo "🚀 启动应用..."
$FLY_CMD launch \
  --name ziwei-doushu-bot \
  --region hkg \
  --dockerfile Dockerfile \
  --no-deploy

echo "🔐 设置 Bot Token..."
$FLY_CMD secrets set BOT_TOKEN=8936592956:AAE1h-S8HSHaQu66aQWtXLCPvWJyq1c3FQU

echo "📦 部署..."
$FLY_CMD deploy

echo ""
echo "✅ 部署完成！"
echo "   在 Telegram 中打开你的 Bot 即可使用"
echo "   查看日志: $FLY_CMD logs"
