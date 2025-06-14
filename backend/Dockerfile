FROM node:18-alpine

WORKDIR /app

# Сначала копируем только файлы зависимостей
COPY package*.json ./

# Чистая установка зависимостей (без devDependencies)
RUN npm ci --only=production

# Копируем остальные файлы
COPY . .

# Указываем порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]