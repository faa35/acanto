// import React, { useState, useRef, useEffect } from 'react';
// import { FaComment, FaPaperPlane, FaTimes } from 'react-icons/fa';
// import axios from 'axios';



// const AiChatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const chatContentRef = useRef<HTMLDivElement>(null);

//   const fetchGeminiApiKey = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/api/details');
//       return response.data.geminiApiKey;
//     } catch (error) {
//       console.error('Error fetching API key:', error);
//       return null;
//     }
//   };

//   const generateContent = async (prompt: string) => {
//     try {
//       const apiKey = await fetchGeminiApiKey();
//       if (!apiKey) {
//         throw new Error('API key not found');
//       }

//       const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
//         contents: [{
//           role: 'user',
//           parts: [{ text: prompt }]
//         }]
//       }, {
//         params: { key: apiKey },
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       return response.data.candidates[0].content.parts[0].text;
//     } catch (error) {
//       console.error('Error generating content:', error);
//       return 'Sorry, I encountered an error generating a response.';
//     }
//   };

//   const handleSendMessage = async () => {
//     if (inputMessage.trim() === '') return;

//     const userMessage = { text: inputMessage, sender: 'user' as const };
//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     const botLoadingMessage = { text: 'Generating response...', sender: 'bot' as const };
//     setMessages(prev => [...prev, botLoadingMessage]);

//     try {
//       const generatedText = await generateContent(inputMessage);
//       setMessages(prev => {
//         const updatedMessages = [...prev];
//         updatedMessages[updatedMessages.length - 1] = { 
//           text: generatedText, 
//           sender: 'bot' 
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       setMessages(prev => {
//         const updatedMessages = [...prev];
//         updatedMessages[updatedMessages.length - 1] = { 
//           text: 'Sorry, I could not generate a response.', 
//           sender: 'bot' 
//         };
//         return updatedMessages;
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div>
//       {/* Chat Icon */}
//       <div
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           left: '20px',
//           backgroundColor: '#FF6A00',
//           borderRadius: '50%',
//           padding: '15px',
//           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//           zIndex: 1000,
//           cursor: 'pointer',
//           transition: 'all 0.3s',
//         }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <FaComment size={30} color="#fff" />
//       </div>

//       {/* Chat Container */}
//       {isOpen && (
//         <div 
//           style={{
//             position: 'fixed',
//             bottom: '80px',
//             left: '20px',
//             width: '300px',
//             height: '400px',
//             backgroundColor: '#f9f9f9',
//             border: '1px solid #ddd',
//             borderRadius: '10px',
//             display: 'flex',
//             flexDirection: 'column',
//             boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//             zIndex: 1001,
//           }}
//         >
//           {/* Chat Header */}
//           <div 
//             style={{
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               padding: '10px', 
//               borderBottom: '1px solid #ddd'
//             }}
//           >
//             <h3 style={{ margin: 0 }}>AI Chatbot</h3>
//             <FaTimes 
//               onClick={() => setIsOpen(false)} 
//               style={{ cursor: 'pointer' }} 
//             />
//           </div>

//           {/* Chat Content */}
//           <div 
//             ref={chatContentRef}
//             style={{
//               flexGrow: 1, 
//               overflowY: 'auto', 
//               padding: '10px'
//             }}
//           >
//             {messages.map((msg, index) => (
//               <div 
//                 key={index}
//                 style={{
//                   textAlign: msg.sender === 'user' ? 'right' : 'left',
//                   marginBottom: '10px',
//                   color: msg.sender === 'user' ? 'blue' : 'green'
//                 }}
//               >
//                 {msg.text}
//               </div>
//             ))}
//           </div>

//           {/* Input Area */}
//           <div style={{ 
//             display: 'flex', 
//             padding: '10px',
//             borderTop: '1px solid #ddd' 
//           }}>
//             <input 
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               placeholder="Type a message..."
//               style={{
//                 flexGrow: 1,
//                 marginRight: '10px',
//                 padding: '8px',
//                 borderRadius: '5px',
//                 border: '1px solid #ddd'
//               }}
//               disabled={isLoading}
//             />
//             <button 
//               onClick={handleSendMessage}
//               disabled={isLoading}
//               style={{
//                 backgroundColor: '#4CAF50',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 padding: '8px 15px',
//                 cursor: isLoading ? 'not-allowed' : 'pointer'
//               }}
//             >
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AiChatbot;



















// import { FaComment, FaPaperPlane, FaTimes } from 'react-icons/fa';


// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import Lottie from 'lottie-web';
// import animationData from '../../lottie/aichat/blep.json'; // Replace with your local JSON path

// const AiChatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const chatContentRef = useRef<HTMLDivElement>(null);
//   const lottieContainerRef = useRef<HTMLDivElement>(null); // Ref for Lottie animation

//   const fetchGeminiApiKey = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/api/details');
//       return response.data.geminiApiKey;
//     } catch (error) {
//       console.error('Error fetching API key:', error);
//       return null;
//     }
//   };

//   const generateContent = async (prompt: string) => {
//     try {
//       const apiKey = await fetchGeminiApiKey();
//       if (!apiKey) {
//         throw new Error('API key not found');
//       }

//       const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
//         contents: [{ role: 'user', parts: [{ text: prompt }] }]
//       }, {
//         params: { key: apiKey },
//         headers: { 'Content-Type': 'application/json' }
//       });

//       return response.data.candidates[0].content.parts[0].text;
//     } catch (error) {
//       console.error('Error generating content:', error);
//       return 'Sorry, I encountered an error generating a response.';
//     }
//   };

//   const handleSendMessage = async () => {
//     if (inputMessage.trim() === '') return;

//     const userMessage = { text: inputMessage, sender: 'user' as const };
//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     const botLoadingMessage = { text: 'Generating response...', sender: 'bot' as const };
//     setMessages(prev => [...prev, botLoadingMessage]);

//     try {
//       const generatedText = await generateContent(inputMessage);
//       setMessages(prev => {
//         const updatedMessages = [...prev];
//         updatedMessages[updatedMessages.length - 1] = { 
//           text: generatedText, 
//           sender: 'bot' 
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       setMessages(prev => {
//         const updatedMessages = [...prev];
//         updatedMessages[updatedMessages.length - 1] = { 
//           text: 'Sorry, I could not generate a response.', 
//           sender: 'bot' 
//         };
//         return updatedMessages;
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (lottieContainerRef.current) {
//       Lottie.loadAnimation({
//         container: lottieContainerRef.current, // The div that will hold the animation
//         animationData, // Your Lottie JSON data
//         renderer: 'svg', // Rendering method
//         loop: true, // Whether the animation should loop
//         autoplay: true, // Whether the animation should start automatically
//       });
//     }

//     return () => {
//       // Clean up animation on component unmount
//       if (lottieContainerRef.current) {
//         Lottie.destroy();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div>
//       {/* Lottie Chat Icon */}
//       <div
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           left: '20px',
//           backgroundColor: '#FF6A00',
//           borderRadius: '50%',
//           padding: '15px',
//           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//           zIndex: 1000,
//           cursor: 'pointer',
//           transition: 'all 0.3s',
//         }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div ref={lottieContainerRef} style={{ width: '30px', height: '30px' }} /> {/* Lottie container */}
//       </div>

//       {/* Chat Container */}
//       {isOpen && (
//         <div
//           style={{
//             position: 'fixed',
//             bottom: '80px',
//             left: '20px',
//             width: '300px',
//             height: '400px',
//             backgroundColor: '#f9f9f9',
//             border: '1px solid #ddd',
//             borderRadius: '10px',
//             display: 'flex',
//             flexDirection: 'column',
//             boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//             zIndex: 1001,
//           }}
//         >
//           {/* Chat Header */}
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               padding: '10px',
//               borderBottom: '1px solid #ddd'
//             }}
//           >
//             <h3 style={{ margin: 0 }}>AI Chatbot</h3>
//             <FaTimes
//               onClick={() => setIsOpen(false)}
//               style={{ cursor: 'pointer' }}
//             />
//           </div>

//           {/* Chat Content */}
//           <div
//             ref={chatContentRef}
//             style={{
//               flexGrow: 1,
//               overflowY: 'auto',
//               padding: '10px'
//             }}
//           >
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 style={{
//                   textAlign: msg.sender === 'user' ? 'right' : 'left',
//                   marginBottom: '10px',
//                   color: msg.sender === 'user' ? 'blue' : 'green'
//                 }}
//               >
//                 {msg.text}
//               </div>
//             ))}
//           </div>

//           {/* Input Area */}
//           <div
//             style={{
//               display: 'flex',
//               padding: '10px',
//               borderTop: '1px solid #ddd'
//             }}
//           >
//             <input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               placeholder="Type a message..."
//               style={{
//                 flexGrow: 1,
//                 marginRight: '10px',
//                 padding: '8px',
//                 borderRadius: '5px',
//                 border: '1px solid #ddd'
//               }}
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={isLoading}
//               style={{
//                 backgroundColor: '#4CAF50',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 padding: '8px 15px',
//                 cursor: isLoading ? 'not-allowed' : 'pointer'
//               }}
//             >
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AiChatbot;

























import { FaComment, FaPaperPlane, FaTimes } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'lottie-web';
import animationData from '../../lottie/aichat/blep.json'; // Replace with your local JSON path

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null); // Ref for Lottie animation
  const lottieInstance = useRef<any>(null); // To store Lottie instance for cleanup

  const fetchGeminiApiKey = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/details');
      return response.data.geminiApiKey;
    } catch (error) {
      console.error('Error fetching API key:', error);
      return null;
    }
  };

  const generateContent = async (prompt: string) => {
    try {
      const apiKey = await fetchGeminiApiKey();
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      }, {
        params: { key: apiKey },
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating content:', error);
      return 'Sorry, I encountered an error generating a response.';
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = { text: inputMessage, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const botLoadingMessage = { text: 'Generating response...', sender: 'bot' as const };
    setMessages(prev => [...prev, botLoadingMessage]);

    try {
      const generatedText = await generateContent(inputMessage);
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = { 
          text: generatedText, 
          sender: 'bot' 
        };
        return updatedMessages;
      });
    } catch (error) {
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = { 
          text: 'Sorry, I could not generate a response.', 
          sender: 'bot' 
        };
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lottieContainerRef.current) {
      lottieInstance.current = Lottie.loadAnimation({
        container: lottieContainerRef.current, // The div that will hold the animation
        animationData, // Your Lottie JSON data
        renderer: 'svg', // Rendering method
        loop: true, // Whether the animation should loop
        autoplay: true, // Whether the animation should start automatically
      });
    }

    // Clean up animation on component unmount
    return () => {
      if (lottieInstance.current) {
        lottieInstance.current.destroy();
      }
    };
  }, []); // Only run once on mount and cleanup on unmount

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {/* Lottie Chat Icon */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px', // Move the icon to the right
          // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
        onClick={() => setIsOpen(!isOpen)} // Toggle chat window on click
      >
        <div ref={lottieContainerRef} style={{ width: '100px', height: '100px' }} /> {/* Lottie container with bigger size */}
      </div>

      {/* Chat Container */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px', // Move the chat window to the right
            width: '300px',
            height: '400px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1001,
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid #ddd'
            }}
          >
            <h3 style={{ margin: 0 }}>AI Chatbot</h3>
            <FaTimes
              onClick={() => setIsOpen(false)}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {/* Chat Content */}
          <div
            ref={chatContentRef}
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '10px'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  marginBottom: '10px',
                  color: msg.sender === 'user' ? 'blue' : 'green'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              display: 'flex',
              padding: '10px',
              borderTop: '1px solid #ddd'
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              style={{
                flexGrow: 1,
                marginRight: '10px',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 15px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
