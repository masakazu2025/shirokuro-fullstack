@echo off
cd /d %~dp0backend
poetry run flask run
