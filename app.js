console.log('学霸伙伴加载成功！');

setTimeout(() => {
    document.body.innerHTML = `
        <div style="max-width: 400px; margin: 0 auto; padding: 2rem; text-align: center;">
            <h1 style="color: #6366f1;">🎉 学霸伙伴</h1>
            <p style="color: #666;">智能学习助手已就绪！</p>
            <button onclick="alert('欢迎使用学霸伙伴！')" 
                    style="background: #6366f1; color: white; border: none; padding: 1rem 2rem; border-radius: 10px; cursor: pointer;">
                开始学习
            </button>
        </div>
    `;
}, 2000);