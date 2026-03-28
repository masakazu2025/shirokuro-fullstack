@echo off
start "backend" cmd /k "%~dp0dev-back.bat"
start "frontend" cmd /k "%~dp0dev-front.bat"
