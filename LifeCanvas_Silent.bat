@echo off
:: Navegar al directorio del script
cd /d "%~dp0"

:: Iniciar Backend (Silencioso)
cd server
start /b npm run start:dev > nul 2>&1

:: Iniciar Frontend (Silencioso)
cd ..\client
start /b npm run dev > nul 2>&1

:: Esperar 10 segundos para que arranquen
timeout /t 10 /nobreak > nul

:: Abrir navegador
start http://localhost:8080

exit
