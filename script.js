document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const newChatBtn = document.getElementById('new-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const historyContainer = document.getElementById('history-container');

    let currentChatId = null;
    let chats = JSON.parse(localStorage.getItem('cyberbuddy_chats')) || [];

    const welcomeMessageHTML = `
        <div class="flex gap-4 max-w-[85%] self-start ai-message">
            <div class="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                <span class="material-symbols-outlined text-slate-600 text-sm">shield_lock</span>
            </div>
            <div class="flex flex-col gap-1.5 pt-1">
                <div class="text-slate-700 leading-relaxed text-base">
                    Hello, I'm CyberBuddy — your AI Cybersecurity Assistant. I can help you understand vulnerabilities, analyze code security, suggest penetration testing commands, and test your cybersecurity knowledge.
                </div>
            </div>
        </div>
    `;

    function generateId() {
        return Math.random().toString(36).substring(2, 15);
    }

    function saveChats() {
        localStorage.setItem('cyberbuddy_chats', JSON.stringify(chats));
        renderSidebarHistory();
    }

    function initNewChat() {
        currentChatId = generateId();
        chats.unshift({
            id: currentChatId,
            title: 'New Conversation',
            messages: []
        });
        saveChats();
        chatMessages.innerHTML = welcomeMessageHTML;
        scrollToBottom();
    }

    function loadChat(chatId) {
        currentChatId = chatId;
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
            chatMessages.innerHTML = welcomeMessageHTML;
            chat.messages.forEach(msg => {
                appendMessageToUI(msg.role, msg.content, false);
            });
            scrollToBottom();
        }
    }

    function renderSidebarHistory() {
        if (!historyContainer) return;
        historyContainer.innerHTML = '';
        chats.forEach(chat => {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors truncate';
            a.innerHTML = `<span class="truncate">${chat.title}</span>`;
            a.onclick = (e) => {
                e.preventDefault();
                loadChat(chat.id);
            };
            historyContainer.appendChild(a);
        });
    }

    // Helper syntax parsing: basic markdown for Bold and blocks
    function parseContent(content) {
        let parsed = content.replace(/\\n/g, '<br>');
        // Convert basic code blocks
        parsed = parsed.replace(/```(.*?)```/gs, '<pre class="bg-slate-100 p-4 rounded-xl text-sm overflow-x-auto my-2 border border-slate-200"><code>$1</code></pre>');
        // Convert inline code
        parsed = parsed.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">$1</code>');
        // Convert bold
        parsed = parsed.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
        return parsed;
    }

    function appendMessageToUI(role, content, animate = true) {
        const div = document.createElement('div');
        if (role === 'user') {
            div.className = 'flex gap-4 max-w-[85%] self-end flex-row-reverse';
            div.innerHTML = `
                <div class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                    <span class="material-symbols-outlined text-slate-500 text-sm">person</span>
                </div>
                <div class="flex flex-col gap-1.5 items-end pt-1">
                    <div class="rounded-2xl rounded-tr-none bg-slate-100 px-5 py-3 text-slate-800 leading-relaxed text-base">
                        ${content.replace(/\\n/g, '<br>')}
                    </div>
                </div>
            `;
        } else {
            div.className = 'flex gap-4 max-w-[85%] self-start ai-message w-full';
            div.innerHTML = `
                <div class="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                    <span class="material-symbols-outlined text-slate-600 text-sm">shield_lock</span>
                </div>
                <div class="flex flex-col gap-1.5 pt-1 w-full overflow-hidden">
                    <div class="text-slate-700 leading-relaxed text-base">
                        ${parseContent(content)}
                    </div>
                </div>
            `;
        }
        chatMessages.appendChild(div);
        if (animate) scrollToBottom();
    }

    function showTypingIndicator() {
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'flex gap-4 max-w-[85%] self-start ai-message';
        div.innerHTML = `
            <div class="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                <span class="material-symbols-outlined text-slate-600 text-sm">shield_lock</span>
            </div>
            <div class="flex flex-col gap-1.5 pt-3">
                <div class="flex items-center gap-1.5 bg-slate-50 px-4 py-2.5 rounded-2xl rounded-tl-none border border-slate-100 w-fit">
                    <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite]"></div>
                    <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                    <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) {
            typing.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.parentElement.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        chatInput.value = '';
        chatInput.style.height = 'auto'; // Reset height

        appendMessageToUI('user', text);

        // Add to current chat storage
        const currentChat = chats.find(c => c.id === currentChatId);
        if (currentChat) {
            // update title if it's the first message
            if (currentChat.messages.length === 0) {
                currentChat.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
            }
            currentChat.messages.push({ role: 'user', content: text });
            saveChats();
        }

        showTypingIndicator();

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            removeTypingIndicator();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const aiText = data.response;

            appendMessageToUI('ai', aiText);

            if (currentChat) {
                currentChat.messages.push({ role: 'ai', content: aiText });
                saveChats();
            }

        } catch (error) {
            removeTypingIndicator();
            appendMessageToUI('ai', 'Sorry, there was an error communicating with the backend API. Please ensure it is running on http://localhost:8000.');
            console.error(error);
        }
    }

    // Event Listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        chatInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    if (newChatBtn) {
        newChatBtn.addEventListener('click', initNewChat);
    }

    // Initialization
    if (chats.length === 0) {
        initNewChat();
    } else {
        renderSidebarHistory();
        loadChat(chats[0].id); // Load most recent chat
    }
});
