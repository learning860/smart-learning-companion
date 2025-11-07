// 学霸伙伴 - 核心应用逻辑
class SmartLearningCompanion {
    constructor() {
        this.currentPage = 'loadingPage';
        this.selectedRole = null;
        this.userDream = null;
        this.conversationHistory = [];
        this.userData = {
            points: 100,
            level: 1,
            streak: 7,
            apiKey: null
        };
        
        this.init();
    }

    async init() {
        // 加载用户数据
        this.loadUserData();
        
        // 模拟加载过程
        setTimeout(() => {
            this.showPage('welcomePage');
        }, 2000);
        
        // 初始化事件监听
        this.bindEvents();
        
        // 检查网络状态
        this.initNetworkMonitoring();
        
        // 注册Service Worker（离线支持）
        this.registerServiceWorker();
    }

    bindEvents() {
        // 开始按钮
        document.getElementById('getStarted').addEventListener('click', () => {
            this.showPage('roleSelectionPage');
        });

        // 角色选择
        document.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', () => this.selectRole(card));
        });

        // 梦想选择
        document.querySelectorAll('.dream-option').forEach(option => {
            option.addEventListener('click', () => this.selectDream(option));
        });

        // 确认选择
        document.getElementById('confirmSelection').addEventListener('click', () => {
            this.confirmSelection();
        });

        // 发送消息
        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // 自定义梦想输入
        document.getElementById('customDream').addEventListener('input', (e) => {
            this.userDream = e.target.value;
        });
    }

    selectRole(card) {
        document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedRole = card.dataset.role;
    }

    selectDream(option) {
        document.querySelectorAll('.dream-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        this.userDream = option.dataset.dream;
        document.getElementById('customDream').value = '';
    }

    confirmSelection() {
        if (!this.selectedRole || !this.userDream) {
            this.showNotification('请先选择学习伙伴和梦想目标！', 'warning');
            return;
        }

        // 更新界面显示
        document.getElementById('currentRole').textContent = this.selectedRole;
        document.getElementById('userDream').textContent = `目标：${this.userDream}`;

        this.showPage('mainChatPage');
        this.sendWelcomeMessage();
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message) return;

        // 添加用户消息到聊天
        this.addMessage('user', message);
        input.value = '';

        // 显示输入指示器
        this.showTypingIndicator();

        try {
            // 生成AI回复
            const response = await this.generateAIResponse(message);
            this.addMessage('companion', response);
            
            // 奖励积分
            this.addPoints(5);
            
        } catch (error) {
            console.error('发送消息错误:', error);
            this.addMessage('companion', 
                '抱歉，我暂时无法回复。请检查网络连接或稍后再试。\n\n' +
                '💡 小贴士：你可以尝试以下问题：\n' +
                '• "帮我制定学习计划"\n' +
                '• "讲解数学应用题"\n' +
                '• "推荐学习方法"'
            );
        } finally {
            this.hideTypingIndicator();
        }
    }

    async generateAIResponse(userMessage) {
        // 添加到对话历史
        this.conversationHistory.push({ role: 'user', content: userMessage });

        // 构建上下文
        const context = this.buildContext(userMessage);

        try {
            // 如果有API密钥，使用AI服务
            if (this.userData.apiKey) {
                return await this.callAIAPI(context);
            } else {
                // 否则使用本地回复库
                return this.getLocalResponse(userMessage);
            }
        } catch (error) {
            // 如果AI服务失败，使用本地回复
            return this.getLocalResponse(userMessage);
        }
    }

    buildContext(userMessage) {
        const context = `
        你是一个专业的AI学习教练，正在与一个梦想成为"${this.userDream}"的学生交流。
        你的角色是：${this.selectedRole}
        
        对话历史：
        ${this.conversationHistory.slice(-5).map(msg => 
            `${msg.role}: ${msg.content}`
        ).join('\n')}
        
        当前问题：${userMessage}
        
        请用以下方式回复：
        1. 亲切友好，适合学生理解
        2. 结合学生的梦想目标
        3. 提供实用的学习建议
        4. 可以适当使用表情符号
        5. 鼓励学生继续努力
        `;

        return context;
    }

    async callAIAPI(context) {
        // 这里使用DeepSeek API作为示例
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.userData.apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "你是一个专业的学习教练，擅长用生动有趣的方式帮助学生解决学习问题。"
                    },
                    {
                        role: "user",
                        content: context
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // 保存到对话历史
        this.conversationHistory.push({ role: 'assistant', content: aiResponse });
        
        return aiResponse;
    }

    getLocalResponse(userMessage) {
        // 本地回复库 - 基础版本
        const responses = {
            '数学': [
                '数学其实很有趣！比如我们可以把应用题想象成解谜游戏 🎮',
                '学习数学的关键是理解概念，多做练习。我来帮你分析这道题...',
                '记住数学公式的小技巧：把它编成口诀或者故事 📚'
            ],
            '学习计划': [
                '好的学习计划应该包括：明确目标、合理时间安排、定期复习 📅',
                '建议每天固定时间学习，保持连续性。比如晚饭后1小时做作业...',
                '学习计划要灵活调整，重要的是养成好习惯 🌟'
            ],
            '游戏': [
                '我们来玩个知识问答游戏吧！第一题：中国的首都是哪里？🎯',
                '学习也可以很有趣！试试"单词接龙"或者"数学速算比赛" 🏆',
                '游戏化学习能让知识记得更牢，我们来设计一个学习挑战吧！'
            ],
            '默认': [
                '这个问题问得很好！学习需要循序渐进，我们一起探索答案 🔍',
                '你的好奇心是学习的最好动力！让我来帮你分析这个问题...',
                '每个人都有自己的学习节奏，重要的是保持热情和坚持 💪'
            ]
        };

        // 关键词匹配
        let category = '默认';
        if (userMessage.includes('数学') || userMessage.includes('计算')) category = '数学';
        else if (userMessage.includes('计划') || userMessage.includes('安排')) category = '学习计划';
        else if (userMessage.includes('游戏') || userMessage.includes('玩')) category = '游戏';

        const possibleResponses = responses[category];
        const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
        
        // 保存到对话历史
        this.conversationHistory.push({ role: 'assistant', content: randomResponse });
        
        return randomResponse;
    }

    addMessage(sender, content) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${sender === 'user' ? '👤' : '🤖'}
            </div>
            <div class="message-bubble">
                ${content.replace(/\n/g, '<br>')}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendWelcomeMessage() {
        const welcomeMessages = {
            'AI学习教练': `👋 你好！我是你的AI学习教练。听说你的梦想是${this.userDream}，太棒了！我会帮你制定学习计划，解答学习问题，让学习之路更轻松愉快！`,
            '梦想导师': `🌟 欢迎！我是你的梦想导师。实现${this.userDream}这个目标需要一步步来，我会陪伴你成长，提供个性化指导！`,
            '知识探险家': `🗺️ 探险开始！我是知识探险家。让我们一起探索学习的奥秘，在知识的海洋中航行，向着${this.userDream}前进！`
        };

        const welcomeMsg = welcomeMessages[this.selectedRole] || welcomeMessages['AI学习教练'];
        this.addMessage('companion', welcomeMsg);
    }

    showTypingIndicator() {
        document.getElementById('typingIndicator').classList.add('active');
    }

    hideTypingIndicator() {
        document.getElementById('typingIndicator').classList.remove('active');
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        this.currentPage = pageId;
    }

    addPoints(points) {
        this.userData.points += points;
        document.getElementById('userPoints').textContent = this.userData.points;
        this.saveUserData();
        
        // 显示积分获得动画
        this.showPointsAnimation(points);
    }

    showPointsAnimation(points) {
        const pointsDisplay = document.getElementById('userPoints');
        const animation = pointsDisplay.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.5)' },
            { transform: 'scale(1)' }
        ], {
            duration: 500
        });
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'warning' ? 'var(--warning-color)' : 'var(--success-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: var(--shadow);
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    initNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
            this.showNotification('网络连接已恢复', 'success');
        });

        window.addEventListener('offline', () => {
            this.updateConnectionStatus(false);
            this.showNotification('网络连接中断，使用本地模式', 'warning');
        });

        // 初始状态
        this.updateConnectionStatus(navigator.onLine);
    }

    updateConnectionStatus(online) {
        const statusElement = document.getElementById('connectionStatus');
        if (online) {
            statusElement.innerHTML = '<i class="fas fa-wifi"></i>';
            statusElement.style.color = 'var(--success-color)';
        } else {
            statusElement.innerHTML = '<i class="fas fa-wifi-slash"></i>';
            statusElement.style.color = 'var(--warning-color)';
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker 注册成功');
            } catch (error) {
                console.log('Service Worker 注册失败:', error);
            }
        }
    }

    loadUserData() {
        const saved = localStorage.getItem('smartLearningCompanion');
        if (saved) {
            this.userData = { ...this.userData, ...JSON.parse(saved) };
            this.updateUIFromData();
        }
    }

    saveUserData() {
        localStorage.setItem('smartLearningCompanion', JSON.stringify(this.userData));
        this.updateUIFromData();
    }

    updateUIFromData() {
        document.getElementById('userPoints').textContent = this.userData.points;
        document.getElementById('statPoints').textContent = this.userData.points;
        document.getElementById('statLevel').textContent = this.userData.level;
        document.getElementById('statDays').textContent = this.userData.streak;
    }
}

// 全局函数
function showPage(pageId) {
    window.companion.showPage(pageId);
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function askQuestion(question) {
    document.getElementById('messageInput').value = question;
    window.companion.sendMessage();
}

function showLearningGames() {
    window.companion.showNotification('学习游戏功能开发中...', 'info');
}

function showStudyPlan() {
    window.companion.showNotification('学习计划功能开发中...', 'info');
}

function showProgress() {
    window.companion.showNotification('学习报告功能开发中...', 'info');
}

function showSettings() {
    window.companion.showNotification('设置功能开发中...', 'info');
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.companion = new SmartLearningCompanion();
});
