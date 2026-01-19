@echo off
echo ==========================================
echo   Life Canvas - Deep Clean & Repair Tool
echo ==========================================
echo.
echo 1. Deteniendo procesos de Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo 2. Limpiando carpeta SERVER...
cd server
if exist node_modules (
    echo    - Borrando node_modules (esto puede tardar)...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo    - Borrando package-lock.json...
    del package-lock.json
)
if exist dist (
    echo    - Borrando dist...
    rmdir /s /q dist
)

echo.
echo 3. Reinstalando dependencias en SERVER...
call npm install

echo.
echo 4. Generando Cliente Prisma...
call npx prisma generate

echo.
echo 5. Compilando Backend...
call npm run build

echo.
echo ==========================================
echo   PROCESO TERMINADO
echo ==========================================
echo Si no hubo errores rojos arriba, ya deberia funcionar.
echo.
pause
