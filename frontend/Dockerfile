# Stage 1: Build the React application
FROM node:21-alpine AS build

WORKDIR /frontend

COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:1.25-alpine

COPY --from=build /frontend/build /usr/share/nginx/html
COPY --from=build /frontend/nginx.conf /etc/nginx/conf.d/default.conf
