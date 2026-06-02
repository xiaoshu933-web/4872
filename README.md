# 四八七十二·北魏夜游生活节活动平台

> 日落后出发：北魏夜游生活节 - 落日夜游，大有不同

## 项目简介

这是一个为大同古城"四八七十二·北魏夜游生活节"活动打造的数字化平台，集成了游客抽奖、商家申报、后台管理、实时客服等核心功能。

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建工具
- React Router v6 路由管理
- Zustand 状态管理
- Tailwind CSS 样式框架
- Lucide React 图标库

### 后端
- Node.js + Express.js
- TypeScript
- Prisma ORM
- PostgreSQL 数据库
- JWT 认证

## 功能模块

### 1. 游客端
- 🎁 抽奖系统：消费凭证上传、扫码获取抽奖机会
- 📱 身份绑定：手机号+验证码登录
- 🎫 奖品核销：查看中奖记录、核销码展示
- 💬 实时客服：在线聊天支持

### 2. 商家端
- 📝 商家申报：提交入驻申请
- 📋 审核进度：实时查看审核状态
- 📄 电子凭证：审核通过后下载

### 3. 工作人员后台
- 🔐 动态二维码登录：安全扫码认证
- ✅ 商家审核：资料审核、通过/驳回
- 🎁 奖品管理：库存、概率配置
- 📊 数据统计：实时活动数据

### 4. 主办方后台
- 🎨 内容管理：首页背景、文案配置
- 🏆 奖品池：奖品列表、概率设置
- 📈 数据统计：综合数据分析

## 抽奖规则

### 抽奖次数获取
- 基础次数：古城内任意消费 +1次
- 市集加成：主题文化市集内消费额外 +1次
- 合作商户加成：合作商户消费额外 +1次
- 线上互动：完成社媒发布并扫码获取 +1次

### 奖项设置
- 🎉 参与奖（100%）：优惠券、文创产品
- 🥈 二等奖（5-10%）：代金券、门票
- 🥇 一等奖（约1%）：免费住宿、汉服体验
- 💎 隐藏大奖（0.1-0.5%）：云阙景观大床房住宿券

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- PostgreSQL >= 15.0
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
cd night-festival
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

4. **初始化数据库**
```bash
npm run db:push
npm run db:generate
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

## 项目结构

```
night-festival/
├── src/                    # 前端源代码
│   ├── components/        # 可复用组件
│   ├── pages/            # 页面组件
│   ├── stores/           # 状态管理
│   ├── services/         # API服务
│   ├── types/            # TypeScript类型定义
│   └── App.tsx           # 应用入口
├── api/                   # 后端源代码
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── routes/       # 路由定义
│   │   ├── middlewares/   # 中间件
│   │   └── types/        # 类型定义
│   └── prisma/
│       └── schema.prisma # 数据库模型
├── index.html            # HTML入口
├── package.json          # 项目配置
└── vite.config.ts       # Vite配置
```

## API接口

### 认证相关
- `POST /api/auth/send-code` - 发送验证码
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息

### 游客相关
- `POST /api/visitor/upload-receipt` - 上传消费凭证
- `GET /api/visitor/draw-count` - 获取抽奖次数
- `POST /api/visitor/draw` - 执行抽奖
- `POST /api/visitor/scan-qr` - 扫码核销

### 商家相关
- `POST /api/merchant/apply` - 提交申报
- `GET /api/merchant/status` - 获取审核状态

### 工作人员相关
- `GET /api/staff/qr-code` - 获取登录二维码
- `GET /api/staff/merchants` - 获取商家列表
- `POST /api/staff/merchants/:id/approve` - 通过审核

## 开发说明

### 前端开发
- 使用 `npm run dev:client` 单独启动前端开发服务器
- 支持热模块替换（HMR）
- 使用Tailwind CSS编写样式

### 后端开发
- 使用 `npm run dev:server` 单独启动后端服务器
- TypeScript实时编译
- 自动重启服务

### 数据库
- 使用Prisma作为ORM
- 运行 `npm run db:studio` 打开数据库管理界面

## 部署说明

### 生产环境构建

```bash
# 构建前端和后端
npm run build

# 启动生产服务器
npm start
```

### 环境变量配置

确保生产环境配置以下变量：
- `DATABASE_URL` - PostgreSQL连接字符串
- `JWT_SECRET` - JWT签名密钥
- `PORT` - 服务器端口（默认4000）

## 功能演示

项目内置演示数据，无需真实支付接口即可体验完整流程：

### 游客抽奖
1. 进入"游客抽奖"页面
2. 输入手机号，点击获取验证码（任意6位数字）
3. 登录后上传任意交易单号即可获得抽奖机会
4. 点击"立即抽奖"即可体验抽奖流程

### 商家申报
1. 进入"商家申报"页面
2. 登录后填写商户信息
3. 上传任意图片URL作为证照
4. 提交后可在工作人员后台查看

### 工作人员后台
1. 访问 /staff/login
2. 扫描页面上的二维码（演示模式直接点击"确认登录"）
3. 进入后台查看数据看板

## 技术亮点

- 🎨 北魏文化主题设计，古韵新潮
- 📱 移动优先响应式布局
- 🔐 动态二维码登录，安全可靠
- 🎰 完善的抽奖算法，支持隐藏大奖冷却
- 💬 实时客服系统，即时沟通
- 📊 数据可视化统计，实时监控

## 许可证

MIT License

## 联系方式

如有问题，请联系活动主办方。
