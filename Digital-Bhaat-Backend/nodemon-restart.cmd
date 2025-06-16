@echo off
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4000" ^| find "LISTENING"') do taskkill /f /pid %%a
npx serverless offline --stage development --httpPort 4000
