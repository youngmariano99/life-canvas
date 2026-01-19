@echo off
echo OJO: Esto cerrará TODOS los procesos de Node.js en tu maquina.
echo (Es la forma segura de detener los servidores "invisibles" de LifeCanvas).
echo.
pause
taskkill /f /im node.exe
echo.
echo Servidores detenidos.
pause
