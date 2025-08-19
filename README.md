# 🤖 Mirage AI - Next-Gen Multi-Model AI Platform

<div align="center">
  <img src="./public/mirage-ai-logo.png" alt="Mirage AI Logo" width="120" height="120" />
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
</div>

A revolutionary AI platform that allows you to **compare responses from multiple AI models simultaneously**. Get diverse perspectives, make informed decisions, and experience the future of AI interaction with a sleek black and pink themed interface.

## ✨ Features

### 🎯 **Core Functionality**
- 🤖 **Multi-Model Comparison**: Side-by-side responses from GPT-5, Claude 4, and Gemini 2.5
- 🔄 **Real-Time Streaming**: Watch AI responses generate in real-time
- 🌐 **Web Search Integration**: Get up-to-date information with integrated web search
- 💬 **Unlimited Conversations**: Create and manage multiple chat sessions
- 🎨 **Single Model Focus**: Switch to focus mode for any AI model

### 🔒 **Authentication & Security**
- 🔐 **Secure Authentication**: Powered by Supabase Auth
- 👤 **User Profiles**: Personalized experience with chat history
- 🛡️ **Privacy First**: End-to-end encrypted conversations
- 📱 **Cross-Device Sync**: Access your chats from anywhere

### 🎨 **Design & Experience**
- 🌃 **Modern Dark Theme**: Sleek black and pink aesthetic
- 📱 **Fully Responsive**: Perfect on desktop, tablet, and mobile
- ⚡ **Lightning Fast**: Optimized for performance
- 🎭 **Smooth Animations**: Delightful user interactions
- 🎯 **Intuitive Interface**: Easy to use for everyone

### 🚀 **Advanced Features**
- 📊 **Response Modes**: Comprehensive, Concise, or Creative responses
- 🔍 **Smart Web Search**: Automatic web search for current information
- 💾 **Chat History**: All conversations saved and searchable
- 🎪 **Model Switching**: Compare all models or focus on one
- 📤 **Easy Sharing**: Export and share conversations

## 🚀 Quick Start

### Prerequisites

- 📋 **Node.js 18+** - [Download here](https://nodejs.org/)
- 🗄️ **Supabase Account** - [Sign up free](https://supabase.com/)
- 🔑 **API Keys** - OpenRouter, Mistral AI (optional for full functionality)

### 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/mirage-ai.git
cd mirage-ai
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
# Required - Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for AI Models
OPENROUTER_API_KEY=your_openrouter_api_key
MISTRAL_API_KEY=your_mistral_api_key

# Optional - Web Search
SERPER_API_KEY=your_serper_api_key
BING_API_KEY=your_bing_api_key

# Auto-set by Vercel in production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Configure Supabase:**
   - Create a new Supabase project
   - Enable Email authentication
   - Copy your project URL and anon key
   - Update your site URL in Supabase settings

5. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) 🎉
## 🏗️ Project Structure

```
mirage-ai/
├── 📁 app/
│   ├── 🧩 components/
│   │   ├── AuthPage.js           # 🔐 Authentication interface
│   │   ├── FullChatMode.js       # 💬 Main chat application
│   │   ├── ChatModal.js          # 🪟 Chat modal component
│   │   └── MessageFormatter.js   # 📝 Message rendering
│   ├── 🎣 hooks/
│   │   └── useAuth.js            # 🔒 Authentication hook
│   ├── 🔌 providers/
│   │   └── AuthProvider.js       # 👤 Auth context provider
│   ├── 🌐 api/
│   │   ├── chat/route.js         # 🤖 AI model endpoints
│   │   └── websearch/route.js    # 🔍 Web search API
│   ├── 🎨 globals.css            # 🎭 Global styles & theme
│   ├── 📄 layout.js              # 🏠 Root layout & metadata
│   └── 📄 page.js                # 🚀 Landing page
├── 📚 lib/
│   └── supabase.js               # 🗄️ Database configuration
├── 🖼️ public/
│   └── image/                    # 🎨 AI model icons & assets
├── 📋 README.md                  # 📖 Project documentation
└── ⚙️ Configuration files
```

## 🎯 Usage Guide

### 🔑 **Getting Started**
1. **Sign Up**: Create your account using email/password
2. **Welcome**: Land on the beautiful homepage
3. **Start Chatting**: Click "Start Chatting" to enter the AI playground

### 💬 **Chat Interface**
1. **Multi-Model View**: See all AI models side by side
2. **Ask Questions**: Type your question in the input field
3. **Watch Magic**: See real-time responses from multiple AIs
4. **Focus Mode**: Click any model to focus on it exclusively
5. **Web Search**: Toggle web search for current information

### ⚙️ **Advanced Features**
- **Response Modes**: Choose Comprehensive, Direct, or Creative
- **Chat Management**: Create new chats, switch between conversations
- **Model Selection**: Compare all or focus on specific models
- **Search Integration**: Automatic web search for recent topics

## 🔧 API Keys Setup

### 🤖 **AI Model APIs**

#### OpenRouter (GPT-5 & Claude-4)
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up and get your API key
3. Add `OPENROUTER_API_KEY=sk-or-v1-...` to `.env.local`

#### Mistral AI (Gemini 2.5)
1. Visit [Mistral AI Console](https://console.mistral.ai/)
2. Create account and generate API key
3. Add `MISTRAL_API_KEY=your_key` to `.env.local`

### 🔍 **Web Search APIs** (Optional)

#### Serper (Recommended)
1. Visit [Serper.dev](https://serper.dev)
2. Get 2,500 free searches/month
3. Add `SERPER_API_KEY=your_key` to `.env.local`

#### Bing Search (Alternative)
1. Visit [Azure Cognitive Services](https://azure.microsoft.com/cognitive-services/)
2. Subscribe to Bing Web Search API
3. Add `BING_API_KEY=your_key` to `.env.local`

## 🚀 Deployment

### **Deploy to Vercel** (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy! 🎉

3. **Environment Variables in Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`
   - `MISTRAL_API_KEY`
   - `SERPER_API_KEY` (optional)

4. **Update Supabase:**
   - Add your Vercel domain to Supabase Site URL
   - Update redirect URLs

## 🛠️ Tech Stack

<div align="center">

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 14 | React framework |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Authentication** | Supabase Auth | User management |
| **Database** | Supabase | PostgreSQL database |
| **AI Models** | OpenRouter + Mistral | LLM APIs |
| **Search** | Serper/Bing | Web search |
| **Icons** | Lucide React | Beautiful icons |
| **Deployment** | Vercel | Hosting platform |

</div>

## 🎨 Customization

### **Theme Colors**
The app uses a black and pink theme defined in `globals.css`:
```css
:root {
  --bg-primary: #0a0a0b;      /* Deep black */
  --bg-secondary: #1a1a1b;    /* Dark gray */
  --accent-pink: #ec4899;     /* Primary pink */
  --accent-pink-light: #f472b6; /* Light pink */
}
```

### **Adding New Models**
1. Update `availableModels` in `FullChatMode.js`
2. Add model logic in `app/api/chat/route.js`
3. Add model icon to `public/image/`

### **Custom Prompts**
Modify prompts in `getPromptForModel` function to change AI personalities and response styles.

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### **Development Guidelines**
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for amazing backend services
- **OpenRouter** for AI model access
- **Mistral AI** for powerful language models
- **Vercel** for seamless deployment
- **Tailwind CSS** for beautiful styling

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/mirage-ai/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/mirage-ai/discussions)
- 📧 **Email**: support@mirage-ai.com

---

<div align="center">
  <p>Made with ❤️ by the Mirage AI Team</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>#   m i r a g e _ a i  
 #   m i r a g e _ a i  
 