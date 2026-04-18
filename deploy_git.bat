@echo off
echo ========================================
echo    Vercel+GitHub 部署准备 - Git 初始化
echo ========================================
echo.
echo [1] 正在检查 git 状态...
git status
echo.
echo [2] 添加远程仓库地址 (请将下面命令中的括号内容替换为你的实际仓库信息):
echo    git remote add origin https://github.com/你的用户名/你的仓库名.git
echo.
echo [3] 执行以下命令将项目推送到 GitHub:
echo ========================================
echo git add .
echo git commit -m "Initial commit - Vercel deployment ready"
echo git push -u origin main
echo ========================================
echo.
echo 完成！现在可以在 Vercel 部署了。
echo.
pause
