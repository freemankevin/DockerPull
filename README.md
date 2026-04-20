# DockerPull

Docker 镜像拉取和导出管理工具。

![Login](public/demo/login.png)


![Home](public/demo/home.png)



## 快速开始

### 环境要求

- Docker 20.10+
- Go 1.21+ (开发环境)
- Node.js 18+ (前端开发)

### Docker 部署（推荐）

```bash
# 构建并启动
docker compose up -d --build

# 访问
http://localhost:9238
```

### 开发模式

```bash
# 启动后端（端口 9238）
cd app && ./startup.sh

# 启动前端（端口 8212）
./startup.sh
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！