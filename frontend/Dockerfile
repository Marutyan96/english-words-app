# Этап сборки
FROM node:18-alpine as build-stage

WORKDIR /app

# Сначала копируем только файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости (чистая установка)
RUN npm ci

# Копируем ВСЕ остальные файлы (исключая node_modules через .dockerignore)
COPY . .

# Сборка проекта
RUN npm run build

# Этап production
FROM nginx:stable-alpine as production-stage

# Копируем собранные файлы из build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Копируем конфиг nginx (убедитесь, что файл существует)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Указываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]