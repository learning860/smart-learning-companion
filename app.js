class SmartLearningCompanion {
    constructor() {
        this.currentPage = 'loadingPage';
        this.init();
    }

    init() {
        console.log('学霸伙伴初始化成功！');
        
        // 3秒后显示主页面
        setTimeout(() => {
            this.showMainPage();
        }, 3000);
    }

    showMainPage() {
        const mainHTML = `
            <div id="mainPage" class="page" style="display: none; padding: 2rem; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                <h1 style="color: #6366f1; margin-bottom: 1rem;">学霸伙伴</h1>
                <p style="color: #666; margin-bottom: 2rem;">您的智能学习助手已就绪！</p>
                
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 15px; margin-bottom: 2rem;">
                    <h3 style="color: #6366f1; margin-bottom: 1rem;">✨ 功能特色</h3>
                    <p>🤖 智能AI对话辅导</p>
                    <p>🎯 个性化学习路径</p>
                    <p>📚 全学科知识支持</p>
                    <p>🏆 游戏化学习激励</p>
                </div>
                
                <button id="startLearningBtn" 
                        style="background: linear-gradient(135deg, #6366f1, #8b5cf6); 
                               color: white; border: none; padding: 1rem 2rem; 
                               border-radius: 25px; font-size: 1.1rem; cursor: pointer; 
                               width: 100%; margin-bottom: 1rem;">
                    开始智能学习之旅
                </button>
                
                <button id="tryDemoBtn"
                        style="background: #f1f5f9; color: #6366f1; border: 2px solid #6366f1; 
                               padding: 1rem 2rem; border-radius: 25px; font-size: 1rem; 
                               cursor: pointer; width: 100%;">
                    🎮 体验学习游戏
                </button>
            </div>
        `;
        
        // 添加到页面
        document.querySelector('.app-container').innerHTML += mainHTML;
        
        // 显示主页面，隐藏加载页面
        setTimeout(() => {
            document.getElementById('loadingPage').style.display = 'none';
            document.getElementById('mainPage').style.display = 'block';
            
            // 绑定按钮事件
            this.bindEvents();
        }, 500);
    }

    bindEvents() {
        // 开始学习按钮
        document.getElementById('startLearningBtn').addEventListener('click', () => {
            this.showChatPage();
        });
        
        // 体验demo按钮
        document.getElementById('tryDemoBtn').addEventListener('click', () => {
            this.showDemoPage();
        });
    }

    showChatPage() {
        const chatHTML = `
            <div id="chatPage" class="page" style="display: none; height: 100vh; display: flex; flex-direction: column;">
                <div style="background: #6366f1; color: white; padding: 1rem; text-align: center;">
                    <h2>💬 智能学习对话</h2>
                </div>
                
                <div id="chatMessages" style="flex: 1; padding: 1rem; overflow-y: auto; background: #f8fafc;">
                    <div style="background: white; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                        <strong>学霸伙伴：</strong> 你好！我是你的学习助手，可以帮你解答各学科问题，制定学习计划，或者聊聊学习方法哦！
                    </div>
                </div>
                
                <div style="padding: 1rem; border-top: 1px solid #e2e8f0;">
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <button class="quick-btn" data-question="帮我制定数学学习计划">📐 数学计划</button>
                        <button class="quick-btn" data-question="讲解科学知识">🔬 科学知识</button>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="messageInput" placeholder="输入你的问题..." 
                               style="flex: 1; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 20px;">
                        <button id="sendMessage" style="background: #6366f1; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 20px;">发送</button>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.app-container').innerHTML += chatHTML;
        document.getElementById('mainPage').style.display = 'none';
        document.getElementById('chatPage').style.display = 'flex';
        
        this.bindChatEvents();
    }

    bindChatEvents() {
        // 快速问题按钮
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.addMessage('user', question);
                this.generateResponse(question);
            });
        });
        
        // 发送消息按钮
        document.getElementById('sendMessage').addEventListener('click', () => {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (message) {
                this.addMessage('user', message);
                this.generateResponse(message);
                input.value = '';
            }
        });
        
        // 回车发送
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('sendMessage').click();
            }
        });
    }

    addMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.style.background = sender === 'user' ? '#e3f2fd' : 'white';
        messageDiv.style.padding = '1rem';
        messageDiv.style.borderRadius = '10px';
        messageDiv.style.marginBottom = '1rem';
        messageDiv.innerHTML = `<strong>${sender === 'user' ? '你' : '学霸伙伴'}：</strong> ${message}`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateResponse(userMessage) {
        // 模拟AI思考
        setTimeout(() => {
            const responses = [
                "这是一个很好的问题！学习的关键是要理解概念，而不是死记硬背。",
                "我建议你先制定一个学习计划，每天坚持学习一小段时间。",
                "对于这个问题，我们可以从基础开始，一步步深入理解。",
                "记住，每个人都有自己的学习节奏，重要的是保持热情和好奇心！",
                "学习就像探险，每个新知识都是一个宝藏等待发现！"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage('companion', randomResponse);
        }, 1000);
    }

    showDemoPage() {
        alert('🎮 学习游戏功能开发中...\n即将推出有趣的知识挑战游戏！');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new SmartLearningCompanion();
});

// 添加一些基础样式
const style = document.createElement('style');
style.textContent = `
    .quick-btn {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        cursor: pointer;
        font-size: 0.9rem;
    }
    .quick-btn:active {
        background: #6366f1;
        color: white;
    }
`;
document.head.appendChild(style);
