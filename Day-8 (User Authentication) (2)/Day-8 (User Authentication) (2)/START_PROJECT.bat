@echo off
echo Starting MongoDB and Server...
echo.
echo Make sure MongoDB is running on port 27017
echo.
cd "Day-8 (User Authentication)\Day-8 (User Authentication)\Server"
start cmd /k "npm start"
echo.
echo Server starting on http://localhost:8080
echo.
timeout /t 3
cd ..\Admin
start cmd /k "npm run dev"
echo.
echo Frontend starting on http://localhost:5173
echo.
echo Both servers are starting in separate windows...
pause