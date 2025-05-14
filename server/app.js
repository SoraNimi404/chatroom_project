const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 存储所有连接的客户端和用户信息
const clients = new Map();

// 静态文件服务
app.use(express.static(path.join(__dirname, '../client')));

// 处理用户名请求
app.get('/getUsername', (req, res) => {
    const username = generateUsername();
    res.json({ username });
});

// 生成随机用户名
function generateUsername() {
    const adjectives = ['Happy', 'Sleepy', 'Funny', 'Clever', 'Brave', 'Gentle', 'Lucky'];
    const nouns = ['Panda', 'Tiger', 'Elephant', 'Dolphin', 'Phoenix', 'Dragon', 'Unicorn'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdj}${randomNoun}${Math.floor(Math.random() * 1000)}`;
}

// WebSocket连接处理
wss.on('connection', (ws) => {
    // 为新连接生成临时用户名
    const tempUsername = `User${Math.floor(Math.random() * 10000)}`;
    clients.set(ws, { username: tempUsername, color: getRandomColor() });
    
    // 通知新用户连接
    broadcastSystemMessage(`${tempUsername} 加入了聊天室`);
    
    // 接收消息
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'setUsername') {
                // 设置用户名
                const oldUsername = clients.get(ws).username;
                clients.set(ws, { 
                    username: data.username, 
                    color: clients.get(ws).color 
                });
                broadcastSystemMessage(`${oldUsername} 改名为 ${data.username}`);
            } else {
                // 普通聊天消息
                const userData = clients.get(ws);
                broadcastMessage({
                    sender: userData.username,
                    message: data.message,
                    color: userData.color,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });
    
    // 连接关闭
    ws.on('close', () => {
        const userData = clients.get(ws);
        if (userData) {
            broadcastSystemMessage(`${userData.username} 离开了聊天室`);
        }
        clients.delete(ws);
    });
});

// 广播系统消息
function broadcastSystemMessage(message) {
    const data = {
        type: 'system',
        message: message,
        timestamp: new Date().toISOString()
    };
    broadcast(JSON.stringify(data));
}

// 广播普通消息
function broadcastMessage(message) {
    const data = {
        type: 'chat',
        ...message
    };
    broadcast(JSON.stringify(data));
}

// 通用广播方法
function broadcast(data) {
    clients.forEach((_, client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// 生成随机颜色
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
