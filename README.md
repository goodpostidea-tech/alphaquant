# Alpha Quant

<div align="center">

**AI-Driven Quantitative Trading Terminal**

[English](#english) | [中文](#中文)

[![GitHub](https://img.shields.io/badge/GitHub-alphaquant-black?style=flat&logo=github)](https://github.com/goodpostidea-tech/alphaquant)
![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green.svg)

</div>

---

## English

### Overview

Alpha Quant is an autonomous AI-driven quantitative trading terminal that leverages multiple Large Language Models (LLMs) to make intelligent trading decisions. The platform provides a Bloomberg-style professional trading interface with real-time market data, strategy management, risk controls, and comprehensive performance analytics.

### ✨ Key Features

- **🤖 Multi-Model Consensus Trading**: Orchestrates multiple LLM providers (DeepSeek, GPT, Claude) to generate trading decisions through consensus mechanisms
- **📊 Professional Trading Terminal**: Bloomberg-inspired UI with real-time charts, market tickers, and performance dashboards
- **⚡ Real-Time Market Data**: Live price feeds and market sentiment analysis
- **🎯 Strategy Management**: Create, deploy, and monitor multiple trading strategies simultaneously
- **🛡️ Risk Management**: Comprehensive risk controls including position limits, leverage caps, and exposure monitoring
- **📈 Performance Analytics**: Track Sharpe ratio, maximum drawdown, alpha, and other key metrics
- **👥 Multi-User Support**: User authentication and role-based access control
- **🌐 Internationalization**: Full support for English and Chinese (中文)

### 🏗️ Architecture

```
alpha-quant/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes (auth, quant cycles)
│   │   └── page.tsx        # Main dashboard
│   ├── components/         # React components
│   │   ├── TopNavBar.tsx
│   │   ├── AccountValueChart.tsx
│   │   ├── QuantLog.tsx
│   │   ├── CompactStrategyPanel.tsx
│   │   └── ...
│   ├── lib/                # Core libraries
│   │   ├── llm/           # LLM adapters & orchestrator
│   │   ├── hyperliquid.ts # Exchange integration
│   │   ├── AuthContext.tsx
│   │   ├── StrategyContext.tsx
│   │   └── RiskContext.tsx
│   └── i18n/              # Internationalization
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

### 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4
- **Database**: Prisma ORM + SQLite
- **Charts**: Chart.js, react-chartjs-2
- **Authentication**: JWT (jose)
- **Icons**: Lucide React

### 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/goodpostidea-tech/alphaquant.git
   cd alphaquant
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-here"
   # Add API keys for LLM providers if needed
   DEEPSEEK_API_KEY=""
   OPENAI_API_KEY=""
   ANTHROPIC_API_KEY=""
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 📖 Usage

#### Creating Trading Models

1. Navigate to the model management section via the settings icon
2. Add a new model with its API endpoint or wallet address
3. Configure trading parameters and risk limits
4. Activate the model to start autonomous trading

#### Strategy Management

- Create multiple strategies with different risk profiles
- Monitor strategy performance in real-time
- Pause or resume strategies as needed
- View detailed statistics including Sharpe ratio, max drawdown, and alpha

#### Risk Controls

- Set maximum position size limits
- Configure leverage caps per strategy
- Monitor total exposure across all positions
- Set stop-loss and take-profit levels

### 🗄️ Database Schema

The application uses Prisma with SQLite and includes models for:

- **User**: Authentication and user management
- **Model**: AI trading models configuration
- **Trade**: Historical trade records
- **Position**: Current open positions
- **Conversation**: LLM interaction logs
- **AccountSnapshot**: Account value history
- **PriceHistory**: Market price data

### 🔌 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `GET /api/quant/cycle` - Run a trading decision cycle

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### ⚠️ Disclaimer

This software is for educational and research purposes only. Trading cryptocurrencies and other financial instruments involves substantial risk of loss. Past performance is not indicative of future results. Always trade responsibly and never invest more than you can afford to lose.

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI inspired by Bloomberg Terminal and [nof1](https://nof1.ai/)
- Database management with [Prisma](https://www.prisma.io/)

---

## 中文

### 项目概述

Alpha Quant 是一个自主驱动的 AI 量化交易终端，利用多个大语言模型（LLM）做出智能交易决策。该平台提供 Bloomberg 风格的专业交易界面，包含实时市场数据、策略管理、风险控制和全面的性能分析。

### ✨ 核心功能

- **🤖 多模型共识交易**：协调多个 LLM 提供商（DeepSeek、GPT、Claude）通过共识机制生成交易决策
- **📊 专业交易终端**：受 Bloomberg 启发的界面，包含实时图表、市场行情和性能仪表板
- **⚡ 实时市场数据**：实时价格推送和市场情绪分析
- **🎯 策略管理**：同时创建、部署和监控多个交易策略
- **🛡️ 风险管理**：全面的风险控制，包括持仓限制、杠杆上限和敞口监控
- **📈 性能分析**：跟踪夏普比率、最大回撤、阿尔法等关键指标
- **👥 多用户支持**：用户认证和基于角色的访问控制
- **🌐 国际化**：完整支持英文和中文

### 🏗️ 项目架构

```
alpha-quant/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由 (认证、量化周期)
│   │   └── page.tsx        # 主仪表板
│   ├── components/         # React 组件
│   │   ├── TopNavBar.tsx
│   │   ├── AccountValueChart.tsx
│   │   ├── QuantLog.tsx
│   │   ├── CompactStrategyPanel.tsx
│   │   └── ...
│   ├── lib/                # 核心库
│   │   ├── llm/           # LLM 适配器和编排器
│   │   ├── hyperliquid.ts # 交易所集成
│   │   ├── AuthContext.tsx
│   │   ├── StrategyContext.tsx
│   │   └── RiskContext.tsx
│   └── i18n/              # 国际化
├── prisma/
│   └── schema.prisma      # 数据库模式
└── public/                # 静态资源
```

### 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4
- **数据库**: Prisma ORM + SQLite
- **图表**: Chart.js, react-chartjs-2
- **认证**: JWT (jose)
- **图标**: Lucide React

### 📋 环境要求

- Node.js 18+
- npm、yarn、pnpm 或 bun

### 🚀 快速开始

1. **克隆仓库**
   ```bash
   git clone https://github.com/goodpostidea-tech/alphaquant.git
   cd alphaquant
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **设置数据库**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **配置环境变量**
   在根目录创建 `.env` 文件：
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-here"
   # 如需使用 LLM 提供商，添加 API 密钥
   DEEPSEEK_API_KEY=""
   OPENAI_API_KEY=""
   ANTHROPIC_API_KEY=""
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

6. **打开浏览器**
   访问 [http://localhost:3000](http://localhost:3000)

### 📖 使用指南

#### 创建交易模型

1. 通过设置图标进入模型管理部分
2. 添加新模型，配置其 API 端点或钱包地址
3. 配置交易参数和风险限制
4. 激活模型以开始自主交易

#### 策略管理

- 创建具有不同风险特征的多个策略
- 实时监控策略性能
- 根据需要暂停或恢复策略
- 查看详细统计信息，包括夏普比率、最大回撤和阿尔法

#### 风险控制

- 设置最大持仓规模限制
- 为每个策略配置杠杆上限
- 监控所有持仓的总敞口
- 设置止损和止盈水平

### 🗄️ 数据库模式

应用程序使用 Prisma 和 SQLite，包含以下模型：

- **User**: 认证和用户管理
- **Model**: AI 交易模型配置
- **Trade**: 历史交易记录
- **Position**: 当前开仓持仓
- **Conversation**: LLM 交互日志
- **AccountSnapshot**: 账户价值历史
- **PriceHistory**: 市场价格数据

### 🔌 API 端点

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户
- `POST /api/auth/logout` - 用户登出
- `GET /api/quant/cycle` - 运行交易决策周期

### 🤝 贡献

欢迎贡献！请随时提交 Pull Request。对于重大更改，请先打开 issue 讨论您想要更改的内容。

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m '添加一些 AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### ⚠️ 免责声明

本软件仅供教育和研究 purposes。交易加密货币和其他金融工具涉及重大损失风险。过往表现不代表未来结果。请负责任地交易，永远不要投入超过您能承受损失的资金。

### 📄 许可证

本项目采用 MIT 许可证 - 有关详细信息，请参阅 LICENSE 文件。

### 🙏 致谢

- 使用 [Next.js](https://nextjs.org/) 构建
- UI 灵感来自 Bloomberg Terminal 和 [nof1](https://nof1.ai/)
- 使用 [Prisma](https://www.prisma.io/) 进行数据库管理
