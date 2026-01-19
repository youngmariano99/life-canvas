@echo off
echo Updating Life Canvas Local Environment...
echo ----------------------------------------
echo 1. Building Frontend (Client)...
cd client
call npm install
call npm run build
cd ..

echo.
echo 2. Building Backend (Server)...
cd server
call npm install
call npx prisma generate
call npm run build
cd ..

echo.
echo ----------------------------------------
echo SUCCESS! Life Canvas is ready.
echo You can now use 'LaunchLifeCanvas.vbs' to start the app.
pause
