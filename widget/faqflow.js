(function() {
    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
      #faqflow-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      #faqflow-bubble {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #2563eb;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: transform 0.2s;
      }
      #faqflow-bubble:hover {
        transform: scale(1.05);
      }
      #faqflow-chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid #e5e7eb;
      }
      #faqflow-chat-header {
        background: #2563eb;
        color: white;
        padding: 16px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #faqflow-close-btn {
        cursor: pointer;
        font-size: 20px;
      }
      #faqflow-chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #f9fafb;
      }
      .faqflow-msg {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
      }
      .faqflow-msg.user {
        background: #2563eb;
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 2px;
      }
      .faqflow-msg.assistant {
        background: white;
        color: #1f2937;
        align-self: flex-start;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 2px;
      }
      #faqflow-chat-input-container {
        padding: 12px;
        border-top: 1px solid #e5e7eb;
        background: white;
        display: flex;
        gap: 8px;
      }
      #faqflow-chat-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        outline: none;
        font-size: 14px;
      }
      #faqflow-chat-send {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #faqflow-chat-send:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  
    // Create DOM
    const container = document.createElement('div');
    container.id = 'faqflow-widget-container';
    
    const orgId = document.currentScript?.getAttribute('data-org-id') || 'demo';
  
    container.innerHTML = `
      <div id="faqflow-chat-window">
        <div id="faqflow-chat-header">
          <span>Support Chat</span>
          <span id="faqflow-close-btn">&times;</span>
        </div>
        <div id="faqflow-chat-messages">
          <div class="faqflow-msg assistant">Hello! How can I help you today?</div>
        </div>
        <div id="faqflow-chat-input-container">
          <input type="text" id="faqflow-chat-input" placeholder="Type a message..." />
          <button id="faqflow-chat-send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
      <div id="faqflow-bubble">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </div>
    `;
    
    document.body.appendChild(container);
  
    // Logic
    const bubble = document.getElementById('faqflow-bubble');
    const windowEl = document.getElementById('faqflow-chat-window');
    const closeBtn = document.getElementById('faqflow-close-btn');
    const input = document.getElementById('faqflow-chat-input');
    const sendBtn = document.getElementById('faqflow-chat-send');
    const messagesContainer = document.getElementById('faqflow-chat-messages');
    
    let sessionId = null;
    let isOpen = false;
  
    const toggleChat = () => {
      isOpen = !isOpen;
      windowEl.style.display = isOpen ? 'flex' : 'none';
      if (isOpen) input.focus();
    };
  
    bubble.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
  
    const addMessage = (role, content) => {
      const msg = document.createElement('div');
      msg.className = \`faqflow-msg \${role}\`;
      msg.innerText = content;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
  
    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text) return;
  
      addMessage('user', text);
      input.value = '';
      sendBtn.disabled = true;
      
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'faqflow-msg assistant';
      loadingMsg.innerText = '...';
      loadingMsg.id = 'faqflow-loading';
      messagesContainer.appendChild(loadingMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
      try {
        const res = await fetch('http://localhost:8000/api/v1/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            session_id: sessionId,
            org_id: orgId
          })
        });
        const data = await res.json();
        sessionId = data.session_id;
        
        document.getElementById('faqflow-loading').remove();
        addMessage('assistant', data.message);
      } catch (err) {
        document.getElementById('faqflow-loading').remove();
        addMessage('assistant', 'Sorry, I am currently unavailable.');
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    };
  
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  })();
