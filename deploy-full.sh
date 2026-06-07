#!/usr/bin/env bash
set -euo pipefail

cd /tmp/ziwei-doushu/bot

echo "=== 初始化 Git 仓库 ==="
git init
git config user.email "bot@ziwei.dev"
git config user.name "Ziwei Bot"

# Add all files
git add -A
git commit -m "initial: 紫微斗数·八字·易经·黄历 Telegram Bot"

echo ""
echo "=== 创建 GitHub 仓库 ==="
echo "需要 GitHub 个人访问令牌 (classic)"
echo "  创建地址: https://github.com/settings/tokens"
echo "  权限: repo (全部)"
echo ""
read -p "输入 GitHub Token: " GH_TOKEN

# Create repo via API
curl -s -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{"name":"ziwei-bot","private":false,"description":"紫微斗数·八字·易经·黄历 Telegram 全能 Bot"}' \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('✅ 仓库创建成功:', d.get('html_url','?')) if 'html_url' in d else print('❌ 失败:', d.get('message','?')); sys.exit(0 if 'html_url' in d else 1)"

git remote add origin "https://$GH_TOKEN@github.com/$(git config user.name)/ziwei-bot.git"
git push -u origin main

echo ""
echo "=== 部署到 Render.com ==="
echo "1. 打开 https://dashboard.render.com/blueprints"
echo "2. 点击 New Blueprint"
echo "3. 连接 GitHub 仓库: $(git config user.name)/ziwei-bot"
echo "4. Render 会自动读取 render.yaml 并部署"
echo ""
echo "✅ 部署完成！Bot 将自动运行"
