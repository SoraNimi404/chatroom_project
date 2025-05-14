document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const changeUsernameBtn = document.getElementById('changeUsernameBtn');
    
    let username = '';
    let userColor = '';
    
    // 获取用户名
    fetch('/getUsername')
        .then(response => response.json())
        .then(data => {
            username = data.username;
            usernameDisplay.textContent = username;
            connectWebSocket();
        });
    
    // 连接WebSocket
    function connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
        
        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'system') {
                addSystemMessage(data.message);
            } else if (data.type === 'chat') {
                addChatMessage(data.sender, data.message, data.color);
            }
        };
        
        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            addSystemMessage('与服务器的连接已断开，正在尝试重新连接...');
            setTimeout(connectWebSocket, 3000);
        };
        
        // 暴露给全局用于发送消息
        window.sendChatMessage = (message) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    message: message
                }));
            }
        };
        
        // 暴露给全局用于更改用户名
        window.changeUsername = (newUsername) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'setUsername',
                    username: newUsername
                }));
            }
        };
    }
    
    // 更改用户名
    changeUsernameBtn.addEventListener('click', () => {
        const newUsername = prompt('请输入新的用户名:', username);
        if (newUsername && newUsername.trim() !== '') {
            window.changeUsername(newUsername.trim());
            username = newUsername.trim();
            usernameDisplay.textContent = username;
        }
    });
    
    // 发送消息
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            window.sendChatMessage(message);
            messageInput.value = '';
        }
    }
    
    // 添加系统消息
    function addSystemMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'system-message');
        messageElement.innerHTML = message;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // 添加聊天消息
    function addChatMessage(sender, message, color) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        
        const senderSpan = document.createElement('span');
        senderSpan.classList.add('sender');
        senderSpan.textContent = sender + ': ';
        senderSpan.style.color = color;
        
        const contentSpan = document.createElement('span');
        contentSpan.classList.add('content');
        contentSpan.textContent = message;
        
        messageElement.appendChild(senderSpan);
        messageElement.appendChild(contentSpan);
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // 事件监听
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
