# ---------- 构建阶段 ----------
FROM node:18-alpine AS builder
WORKDIR /app

# 复制依赖列表并安装
COPY package.json package-lock.json ./
RUN npm ci

# 复制项目源代码 & 构建
COPY . .
RUN npm run build

# ---------- 运行阶段 ----------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 复制构建产物与必要文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# 这里把 data 也复制一份；后面容器启动时会被 volume 覆盖
COPY --from=builder /app/data ./data

EXPOSE 3000
CMD ["npm", "start"]
