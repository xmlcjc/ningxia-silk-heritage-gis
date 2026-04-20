@echo off
chcp 65001 >nul
echo ========================================
echo   宁夏丝路非遗地理志 - 上传到 GitHub
echo ========================================
echo.
echo 正在推送到 GitHub...
echo （如果弹出浏览器，请选择你的 GitHub 账号登录）
echo.

cd /d "C:\Users\asd\Desktop\新建文件夹"
git push -u origin main

echo.
echo ========================================
if %errorlevel% equ 0 (
    echo ✅ 推送成功！
    echo.
    echo 请去 Vercel 部署:
    echo https://vercel.com/new
    echo.
    echo 选择 Import Git Repository → 选择 ningxia-silk-heritage-gis
) else (
    echo ❌ 推送失败，请检查网络或 GitHub 登录状态
)
echo ========================================
pause
