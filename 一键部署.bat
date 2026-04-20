@echo off
chcp 65001 >nul
echo ========================================
echo    Vercel+GitHub 部署 - Git 推送脚本
echo ========================================
echo.
cd /d "C:\Users\asd\Desktop\新建文件夹"
echo [1/3] 已切换到项目目录
echo.
echo [2/3] 关联远程仓库 (xmlcjc/ningxia-silk-heritage-gis)...
git remote add origin https://github.com/xmlcjc/ningxia-silk-heritage-gis.git 2>nul || echo "远程仓库已存在"
echo.
echo [3/3] 推送到 GitHub...
echo ========================================
echo.
echo !!! 请确认网络连接正常，如果提示错误请重试 !!!
echo ========================================
echo.
git branch -M main
git push -u origin main
echo.
echo ========================================
echo    推送完成！
echo ========================================
echo.
echo 接下来请访问 https://vercel.com/new 登录你的 GitHub 账号，
echo 然后导入仓库：xmlcjc/ningxia-silk-heritage-gis
echo.
pause
