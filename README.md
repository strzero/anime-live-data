# Anime Live DB

提供上海演出最新信息，方便快速查询演出信息、时间线、场馆排期等数据。  
网站地址：[live.s0tools.cn](https://live.s0tools.cn)

## 主要功能

- **演出列表**：按照审批时间排序，可按名称、国家和日期筛选。
- **时间线**：未来60天演出，按日期分组，支持国家筛选。
- **场馆排期表**：查看各场馆未来和历史的演出列表。
- **演出者出演信息**：通过演出详情页进入，查看出演者历史演出。

## 部署与更新

- 数据自动更新，镜像自动推送至Docker Hub：  
  `stellatezero/anime-live-data`

### Docker Compose 示例配置

```yaml
services:
  anime-live-db:
    image: stellatezero/anime-live-db:latest
    container_name: anime-live-db
    restart: unless-stopped
    ports:
      - '5190:3000'
    environment:
      - NODE_ENV=production