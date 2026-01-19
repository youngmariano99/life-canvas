@echo off
echo Iniciando Life-Canvas...

:: Iniciar Backend (Puerto 3000)
echo [1/3] Iniciando Servidor Backend...
start "LifeCanvas Server" /min cmd /k "cd server && npm run start:dev"

:: Iniciar Frontend (Puerto 8080)
echo [2/3] Iniciando Cliente Frontend...
start "LifeCanvas Client" /min cmd /k "cd client && npm run dev"

:: Esperar a que los servicios arranquen
echo [3/3] Esperando a que los servicios esten listos (10 seg)...
timeout /t 10 /nobreak >nul

:: Abrir navegador
echo Abriendo aplicacion...
start http://localhost:8080

echo.
echo Todo listo! 
echo Minimiza las ventanas negras, pero NO las cierres.
pause
