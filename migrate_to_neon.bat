
@echo off
setlocal
set PGPASSWORD=Klisten1a3218

echo ==========================================
echo Migrando Base de Datos Local a Neon
echo ==========================================
echo.

REM Configuracion Local
set LOCAL_USER=postgres
set LOCAL_DB=life_canvas
set LOCAL_HOST=127.0.0.1
set LOCAL_PORT=5432

REM Configuracion Neon (Extraida de tu connection string)
set NEON_URL=postgresql://neondb_owner:npg_rgopQ8Mmybv6@ep-falling-silence-aif55144-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

echo 1. Exportando datos locales (schema + data)...
echo Guardando en dump_local.sql...

REM Intentamos usar pg_dump asumiendo que esta en el PATH o en locations comunes
pg_dump -h %LOCAL_HOST% -p %LOCAL_PORT% -U %LOCAL_USER% -F p -b -v -f dump_local.sql %LOCAL_DB%

if %ERRORLEVEL% NEQ 0 (
    echo Error al ejecutar pg_dump. Asegurate de tener PostgreSQL instalado y las herramientas en tu PATH.
    echo Puedes intentar agregar la ruta de bin de postgres al PATH.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo 2. Importando a Neon...
echo Esto puede tardar unos segundos...

psql "%NEON_URL%" -f dump_local.sql

if %ERRORLEVEL% NEQ 0 (
    echo Error al importar a Neon via psql.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ==========================================
echo MIGRACION COMPLETADA EXITOSAMENTE!
echo ==========================================
pause
