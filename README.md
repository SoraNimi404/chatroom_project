# WebSocket 实时聊天室项目
## 项目简介
这是一个基于 WebSocket 技术的多用户实时聊天室应用，部署在 Ubuntu 云服务器上，使用 Node.js 作为后端，Nginx 作为反向代理服务器。

## 技术栈
前端: HTML5, CSS3, JavaScript (ES6)

后端: Node.js (Express + ws 库)

服务器: Ubuntu 22.04 LTS

代理服务器: Nginx

进程管理: PM2

## 主要功能
多用户实时文字聊天

自动分配随机用户名

用户可自定义用户名

消息广播机制

用户加入/离开通知

## 部署要求
硬件要求
云服务器 (1核CPU, 1GB内存以上)

## 公网IP地址
自定义
## 软件依赖
Node.js 14+

Nginx

PM2 (可选)

## 快速启动
克隆仓库
``` bash
git clone https://github.com/yourusername/websocket-chatroom.git
cd websocket-chatroom
```
安装依赖

``` bash
cd server
npm install
```
启动服务

```bash
pm2 start app.js --name chatroom-server
```
配置Nginx (参考项目中的nginx-config/chatroom.conf)

项目结构
```bash
websocket-chatroom/
├── server/               # 服务器端代码
│   ├── app.js           # 主服务器文件
│   └── package.json     # 依赖配置
├── client/              # 客户端代码
│   ├── index.html       # 主界面
│   ├── style.css        # 样式表
│   └── chat.js          # 客户端逻辑
└── nginx-config/        # Nginx配置
    └── chatroom.conf    # 站点配置
```
访问方式
确保服务器安全组已开放80端口

在浏览器访问: http://your-server-ip


