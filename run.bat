@echo off
rem Скрипт для сборки front и back и запуска одним шагом
pushd %~dp0front
call npm install
call npm run build
rem Копируем сборку фронтенда в папку static бэкенда
xcopy /E /Y /I "dist\store-frontend\*" "..\back\src\main\resources\static\"
popd
pushd %~dp0back
call mvn clean package -DskipTests
call java -jar target/store-backend-0.0.1-SNAPSHOT.jar
popd
