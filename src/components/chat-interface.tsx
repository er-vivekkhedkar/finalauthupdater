"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, Copy, CheckCheck, Code2, Brain, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getGeminiService } from "@/lib/gemini-api";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const CodeBlock = ({ inline, className, children = "", ...props }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const language = (className?.match(/language-(\w+)/) || [])[1] || 'text';

  const copyCode = async () => {
    await navigator.clipboard.writeText(String(children));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (inline) {
    return <code className="px-1.5 py-0.5 bg-gray-800 text-gray-100 rounded text-sm font-mono" {...props}>{children}</code>;
  }

  return (
    <div className="relative group max-w-full rounded-lg my-2 bg-[#282C34] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="text-[10px] sm:text-xs font-medium text-gray-300">{language}</span>
        <button
          onClick={copyCode}
          className="text-[10px] sm:text-xs text-gray-400 hover:text-gray-200 transition-colors rounded px-2 py-1 hover:bg-gray-700/50"
        >
          {isCopied ? (
            <span className="flex items-center gap-1.5">
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Copied</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </span>
          )}
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus as any}
          customStyle={{
            margin: 0,
            padding: '12px 16px',
            background: 'transparent',
            fontSize: '13px',
            lineHeight: '1.5',
            width: '100%'
          }}
          showLineNumbers={true}
          wrapLongLines={true}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export function ChatInterface() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [geminiService] = useState(() => getGeminiService());
  const [isInitialView, setIsInitialView] = useState(true);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const placeholders = [
    "Ask me about coding problems...",
    "Need help with React?",
    "Want to learn about TypeScript?",
    "Debug your code with AI...",
    "Optimize your algorithms...",
  ];

  const suggestions = [
    { 
      title: "Debug Code", 
      icon: <Code2 className="w-6 h-6" />, 
      description: "Find and fix bugs in your code",
      gradient: "from-red-500 to-orange-500",
      examples: ["Fix React useEffect warning", "Debug async function", "Solve TypeError"]
    },
    { 
      title: "Learn Concepts", 
      icon: <Brain className="w-6 h-6" />, 
      description: "Master programming concepts",
      gradient: "from-blue-500 to-purple-500",
      examples: ["Explain closures", "How does React work?", "What is TypeScript?"]
    },
    { 
      title: "Optimize Code", 
      icon: <Zap className="w-6 h-6" />, 
      description: "Improve code performance",
      gradient: "from-green-500 to-emerald-500",
      examples: ["Optimize React renders", "Improve algorithm speed", "Reduce bundle size"]
    },
    { 
      title: "Best Practices", 
      icon: <BookOpen className="w-6 h-6" />, 
      description: "Learn coding standards",
      gradient: "from-purple-500 to-pink-500",
      examples: ["React best practices", "Clean code tips", "Code organization"]
    }
  ];

  useEffect(() => {
    if (window.innerWidth < 640) return;

    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (messages.length > 0 && isInitialView) {
      setIsInitialView(false);
    }
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    // Validate input
    if (!trimmedInput || isLoading) {
      return;
    }

    const messageId = Date.now().toString();
    
    setInput("");
    setIsLoading(true);
    setIsThinking(true);
    
    try {
      // Add user message first
      const newMessage: Message = { 
        id: messageId, 
        role: "user" as const,
        content: trimmedInput,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);

      // Send to Gemini only if we have content
      const response = await geminiService.sendMessage(trimmedInput);
      
      if (response) {
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now().toString(), 
            role: "assistant", 
            content: response,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      // More specific error handling
      let errorMessage = "Failed to get response. Please try again.";
      if (error instanceof Error && error.message.includes("SAFETY")) {
        errorMessage = "I cannot process that request due to safety constraints. Please try rephrasing your question.";
      }
      
      toast({
        description: errorMessage,
        variant: "destructive"
      });
      
      // Optionally remove the user's message if you want
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setIsInitialView(true);
    geminiService.resetChat();
  };

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex items-start w-full sm:max-w-[85%] md:max-w-[75%] group",
        message.role === "user" 
          ? "flex-row-reverse pl-4 sm:pl-6" 
          : "flex-row pr-4 sm:pr-6"
      )}>
        <div className={cn(
          "flex items-start gap-3 sm:gap-4 w-full",
          message.role === "user" ? "flex-row-reverse" : "flex-row"
        )}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="shrink-0"
          >
            <Avatar className={cn(
              "w-8 h-8 ring-2 shadow-md",
              message.role === "user" ? "ring-primary-300" : "ring-primary-200"
            )}>
              <AvatarFallback className={cn(
                message.role === "user" ? "bg-primary-300" : "bg-primary-200",
                "text-primary-800"
              )}>
                {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div className={cn(
            "flex flex-col space-y-1 w-full overflow-hidden",
            message.role === "user" ? "items-end" : "items-start"
          )}>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={cn(
                "p-3 sm:p-4 rounded-2xl relative w-full group",
                message.role === "user"
                  ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white"
                  : "bg-white border border-gray-100"
              )}
            >
              <div className={cn(
                "prose prose-sm max-w-none overflow-x-auto",
                message.role === "user" 
                  ? "text-white [&>*]:text-white [&>*]:my-1.5" 
                  : "prose-p:text-inherit prose-headings:text-inherit"
              )}>
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-semibold" {...props} />,
                    ul: ({node, ...props}) => <ul className="space-y-1 my-2" {...props} />,
                    li: ({node, ...props}) => (
                      <li className="flex items-start" {...props}>
                        <span className="mr-2">•</span>
                        <span>{props.children}</span>
                      </li>
                    ),
                    p: ({ children }) => {
                      if (typeof children === 'object' && children && 'type' in children && children.type === 'code') {
                        return <>{children}</>;
                      }
                      return <p>{children}</p>;
                    },
                    code: ({ inline, className, children, ...props }: {
                      inline?: boolean;
                      className?: string;
                      children?: React.ReactNode;
                      [key: string]: any;
                    } & React.HTMLAttributes<HTMLElement>) => {
                      if (inline) {
                        return <code className="px-1.5 py-0.5 bg-gray-800 text-gray-100 rounded text-sm font-mono" {...props}>{children}</code>;
                      }
                      const language = (className?.match(/language-(\w+)/) || [])[1] || 'text';
                      const [isCopied, setIsCopied] = useState(false);

                      const copyCode = async () => {
                        await navigator.clipboard.writeText(String(children));
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      };

                      return (
                        <div className="relative group max-w-full rounded-lg my-2 bg-[#282C34] overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
                            <span className="text-[10px] sm:text-xs font-medium text-gray-300">{language}</span>
                            <button
                              onClick={copyCode}
                              className="text-[10px] sm:text-xs text-gray-400 hover:text-gray-200 transition-colors rounded px-2 py-1 hover:bg-gray-700/50"
                            >
                              {isCopied ? (
                                <span className="flex items-center gap-1.5">
                                  <CheckCheck className="w-3.5 h-3.5" />
                                  <span>Copied</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5">
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </span>
                              )}
                            </button>
                          </div>
                          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600">
                            <SyntaxHighlighter
                              language={language}
                              style={vscDarkPlus as any}
                              customStyle={{
                                margin: 0,
                                padding: '12px 16px',
                                background: 'transparent',
                                fontSize: '13px',
                                lineHeight: '1.5',
                              }}
                              showLineNumbers={true}
                              wrapLongLines={false}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </motion.div>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-[calc(100vh-3rem)] sm:h-[calc(100vh-8rem)] w-full max-w-7xl mx-auto bg-gradient-to-b from-white to-primary-50/50 backdrop-blur-xl shadow-lg sm:shadow-2xl rounded-lg sm:rounded-2xl overflow-hidden border border-primary-100/50">
      <div className="flex-1 flex flex-col h-full relative w-full">
        <div className={cn(
          "flex-1 overflow-y-auto scroll-smooth",
          "scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent",
          "p-2 sm:p-4 md:p-6",
          isInitialView ? "flex flex-col items-center justify-center" : "space-y-3 sm:space-y-6"
        )}>
          {isInitialView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col justify-start max-w-3xl mx-auto px-2 sm:px-4 overflow-y-auto scrollbar-none"
            >
              {/* Mobile Welcome Message */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="block sm:hidden text-center mt-4 mb-3"
              >
                <h2 className="text-xl font-semibold text-primary-600 mb-1">Welcome to QuickChat</h2>
                <p className="text-sm text-gray-600">Your AI coding assistant</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative flex flex-col items-center justify-center space-y-4 min-h-0 sm:min-h-[30vh] mt-2 sm:mt-4"
              >
                <motion.div 
                  className="relative mt-4 hidden sm:block"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                >
                  <motion.h1 
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 tracking-tight leading-none px-4"
                    animate={{ 
                      backgroundPosition: ["0%", "100%"],
                      opacity: [0.8, 1] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >
                    QuickChat AI
                  </motion.h1>
                  <motion.div
                    className="absolute -z-10 inset-0 blur-[100px] bg-gradient-to-r from-primary-400/20 via-primary-600/20 to-primary-800/20"
                    animate={{ 
                      opacity: [0.5, 0.8],
                      scale: [0.95, 1.05] 
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-4 w-full max-w-2xl mx-auto px-2 sm:px-4"
                >
                  <div className="text-center p-2 sm:p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="text-base sm:text-xl md:text-2xl font-bold text-primary-600">Lightning Fast</div>
                    <div className="text-xs sm:text-sm text-gray-500">Instant Responses</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="text-base sm:text-xl md:text-2xl font-bold text-primary-600">AI Powered</div>
                    <div className="text-xs sm:text-sm text-gray-500">Smart Solutions</div>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="text-base sm:text-xl md:text-2xl font-bold text-primary-600">24/7 Ready</div>
                    <div className="text-xs sm:text-sm text-gray-500">Always Available</div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-2xl mx-auto px-2 sm:px-4"
              >
                <form onSubmit={handleSubmit} className="relative group">
                  <motion.div
                    animate={{ 
                      boxShadow: isLoading ? "0 0 0 2px rgba(99, 102, 241, 0.5)" : "none" 
                    }}
                    className="relative"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isMobile ? "Ask me anything..." : placeholders[currentPlaceholder]}
                      className="h-12 sm:h-14 px-4 sm:px-6 pr-[90px] sm:pr-[100px] rounded-xl text-base sm:text-lg bg-white/95 shadow-lg border-primary-200/50 transition-all group-hover:shadow-xl focus:ring-2 focus:ring-primary-500/50 relative z-10"
                      autoComplete="off"
                      type="text"
                      inputMode="text"
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 h-9 sm:h-12 px-3 sm:px-6 z-10"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-600/20 pointer-events-none"
                    animate={{ 
                      opacity: [0, 0.5, 0],
                      scale: [0.95, 1.05, 0.95] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity 
                    }}
                  />
                </form>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 w-full max-w-2xl mx-auto mt-2 sm:mt-3 px-2 sm:px-4 pb-2 sm:pb-4"
              >
                {suggestions.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative"
                  >
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // For mobile: toggle suggestion on click
                        if (window.innerWidth < 640) {
                          setHoveredSuggestion(hoveredSuggestion === item.title ? null : item.title);
                        }
                      }}
                      onHoverStart={() => window.innerWidth >= 640 && setHoveredSuggestion(item.title)}
                      onHoverEnd={() => window.innerWidth >= 640 && setHoveredSuggestion(null)}
                      className={cn(
                        "w-full flex items-start p-3 sm:p-4 rounded-xl shadow-sm sm:shadow-md transition-all border border-primary-100/50",
                        "bg-white/95 hover:shadow-lg hover:bg-white duration-200"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 sm:p-2 rounded-lg bg-gradient-to-br",
                        item.gradient
                      )}>
                        <div className="text-white">
                          {item.icon}
                        </div>
                      </div>
                      <div className="ml-2 sm:ml-3">
                        <div className="font-medium text-primary-700 text-sm sm:text-base">{item.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{item.description}</div>
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {hoveredSuggestion === item.title && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 right-0 mt-2 p-2 sm:p-3 bg-white/95 rounded-xl shadow-xl border border-primary-100/50 z-10 backdrop-blur-sm"
                        >
                          <div className="text-xs font-medium text-gray-500 mb-1.5">Try asking:</div>
                          <ul className="space-y-1">
                            {item.examples.map((example, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInput(example);
                                    setHoveredSuggestion(null);
                                  }}
                                  className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 hover:underline w-full text-left py-1"
                                >
                                  {example}
                                </button>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
          
          {messages.map((message) => (
            <motion.div key={message.id} className="w-full">
              {renderMessage(message)}
            </motion.div>
          ))}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full"
            >
              <div className="flex items-start space-x-3 max-w-[75%]">
                <Avatar className="w-8 h-8 ring-2 ring-primary-200 shadow-md">
                  <AvatarFallback className="bg-primary-200 text-primary-800">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-x-2 items-start bg-white rounded-2xl py-3 px-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-1">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.25 }}
                      className="inline-block w-1 h-1 bg-primary-500 rounded-full"
                    />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.25, delay: 0.2 }}
                      className="inline-block w-1 h-1 bg-primary-500 rounded-full"
                    />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.25, delay: 0.4 }}
                      className="inline-block w-1 h-1 bg-primary-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isInitialView && (
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-primary-100/50 shadow-lg">
            <form onSubmit={handleSubmit} className="p-2 sm:p-4">
              <div className="flex gap-2 max-w-5xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isMobile ? "Type a message..." : placeholders[currentPlaceholder]}
                    className="h-10 sm:h-12 px-3 sm:px-4 pr-[40px] sm:pr-[100px] rounded-xl 
                              text-sm sm:text-base bg-white/95 shadow-md border-primary-200/50 
                              transition-all focus:ring-2 focus:ring-primary-500/50"
                    disabled={isLoading}
                    type="text"
                    inputMode="text"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-8 sm:h-10 
                              w-8 sm:w-10 p-0 bg-primary-600 hover:bg-primary-700"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="h-10 sm:h-12 w-10 sm:w-12 p-0 flex items-center justify-center shrink-0"
                  title="Reset conversation"
                >
                  <motion.div
                    whileTap={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-full h-full"
                    >
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                  </motion.div>
                </Button>
              </div>
            </form>
            <div className="h-4 sm:h-0 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}