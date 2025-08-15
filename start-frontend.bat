@echo off
echo Starting Connect Digitals Frontend Server...
echo.
echo Starting Python HTTP server on port 8000...
echo Frontend will be available at: http://localhost:8000
echo.
python -m http.server 8000
pause
