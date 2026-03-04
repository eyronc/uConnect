import { useState } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';

const FAQ_ITEMS = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to the Settings page and click the "Change Password" link. Follow the instructions sent to your email.',
  },
  {
    question: 'Where can I find my enrollment information?',
    answer: 'All of your classes and enrollment details are available on the Enrollment page under the Academics section.',
  },
  {
    question: 'Who do I contact for billing issues?',
    answer: 'You can chat with the AI assistant below or email finance@uconnect.example.com for help with payments.',
  },
  {
    question: 'How do I update my profile information?',
    answer: 'Visit the Settings page and edit any of your personal or contact details, then hit Save.',
  },
];

export default function Support() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setChat([...chat, userMessage]);

    try {
      const res = await axios.post('http://localhost:5000/chat', { message });
      const aiMessage = { sender: 'ai', text: res.data.reply };
      setChat(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setChat(prev => [...prev, { sender: 'ai', text: 'Sorry, something went wrong. Please try again later.' }]);
    }

    setMessage('');
  };

  return (
    <Layout title="Customer Support">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .chat-box {
          background: #faf8f5;
          border: 1px solid #ddd8d0;
          padding: 1rem;
          height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .user-message {
          align-self: flex-end;
          background: #1955e6;
          color: #fff;
          padding: 0.5rem 0.75rem;
          border-radius: 12px 12px 0 12px;
          max-width: 70%;
          word-break: break-word;
        }
        .ai-message {
          align-self: flex-start;
          background: #e8e2db;
          color: #1a1510;
          padding: 0.5rem 0.75rem;
          border-radius: 12px 12px 12px 0;
          max-width: 70%;
          word-break: break-word;
        }
        .input-area {
          display: flex;
          gap: 0.5rem;
        }
        .input { flex: 1; padding: 0.5rem 0.75rem; border: 1.5px solid #ddd8d0; background: #faf8f5; }
        .button {
          padding: 0 1.5rem;
          background: #1a1510;
          color: #f7f3ee;
          border: none;
          cursor: pointer;
        }
      `}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1 className="f-display" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', margin: 0 }}>Customer Support</h1>

        {/* FAQ section */}
        <section>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '1.125rem', color: '#1a1510', marginBottom: '0.75rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQ_ITEMS.map((item, idx) => (
              <details key={idx} style={{ background: '#fff', border: '1px solid #ddd8d0', padding: '0.75rem 1rem', borderRadius: 4 }}>
                <summary style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, cursor: 'pointer' }}>{item.question}</summary>
                <p style={{ marginTop: '0.5rem', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#4a4540' }}>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Chatbot section */}
        <section>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '1.125rem', color: '#1a1510', marginBottom: '0.75rem' }}>AI Chat Helper</h2>
          <div className="chat-box">
            {chat.map((msg, index) => (
              <div key={index} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              className="input"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            />
            <button className="button" onClick={sendMessage}>Send</button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
