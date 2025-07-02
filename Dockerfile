FROM node:18-alpine

WORKDIR /app

# 启用 corepack 和 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 先只复制锁文件和package.json，安装依赖，利用缓存
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# 再复制其他文件，执行构建
COPY . .

RUN pnpm build

# 生产环境只保留生产依赖
RUN pnpm prune --prod

EXPOSE 3000

CMD ["pnpm", "start"]
