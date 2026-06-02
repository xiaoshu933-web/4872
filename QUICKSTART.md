# 四八七十二·北魏夜游生活节

## 项目概述

本项目是为大同古城"四八七十二·北魏夜游生活节"活动打造的数字化平台，包含完整的游客抽奖系统、商家申报系统、工作人员后台和主办方管理后台。

## 快速开始

```bash
# 进入项目目录
cd night-festival

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 **http://localhost:3000** 查看应用

## 核心功能

### 🎁 游客抽奖
- 手机号验证码登录
- 消费凭证上传获取抽奖次数
- 扫码核销获取额外机会
- 多种奖项（中奖率可配置）

### 🏪 商家申报
- 在线提交入驻申请
- 实时查看审核进度
- 下载电子凭证

### 👔 工作人员后台
- 动态二维码安全登录
- 商家审核管理
- 奖品核销
- 实时数据统计

### ⚙️ 主办方后台
- 首页内容配置
- 奖品池管理
- 数据分析

## 技术亮点

- 🎨 北魏文化主题设计
- 📱 移动优先响应式布局
- 🔐 动态二维码认证
- 🎰 完善的抽奖算法
- 💬 实时客服系统

## 项目文档

- 📖 [README.md](README.md) - 完整项目说明
- 📋 [START_GUIDE.md](START_GUIDE.md) - 详细启动指南
- 📄 [.trae/documents/PRD.md](.trae/documents/PRD.md) - 产品需求文档
- 🔧 [.trae/documents/TechnicalArchitecture.md](.trae/documents/TechnicalArchitecture.md) - 技术架构文档

## 演示账号

### 游客抽奖
- 手机号：13800138000
- 验证码：任意6位数字

### 商家申报
- 使用相同登录方式
- 填写商户信息即可

### 工作人员
- 访问 /staff/login
- 直接点击"确认登录"

## 抽奖规则

| 奖项 | 概率 | 示例奖品 |
|------|------|----------|
| 参与奖 | 100% | 优惠券、文创产品 |
| 二等奖 | 5-10% | 代金券、门票 |
| 一等奖 | ~1% | 免费住宿、汉服体验 |
| 隐藏大奖 | 0.1-0.5% | 云阙景观大床房 |

## 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express.js + Prisma
- **数据库**: PostgreSQL (可选，默认使用内存数据库)
- **状态管理**: Zustand
- **路由**: React Router v6

## 项目结构

```
night-festival/
├── src/                 # 前端源代码
├── api/                 # 后端源代码
├── .trae/documents/     # 项目文档
├── package.json        # 项目配置
├── vite.config.ts     # Vite配置
└── README.md          # 项目说明
```

## 获取帮助

查看 [START_GUIDE.md](START_GUIDE.md) 了解详细的启动和配置说明。

---

**落日夜游，大有不同** 🌙✨
