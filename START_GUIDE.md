# 项目启动指南

## 🚀 快速启动

### 方式一：使用 npm 安装并启动（推荐）

```bash
# 进入项目目录
cd night-festival

# 安装依赖
npm install

# 复制环境变量配置
copy .env.example .env

# 启动开发服务器（前端 + 后端）
npm run dev
```

访问 http://localhost:3000

### 方式二：分别启动前端和后端

**终端 1 - 启动后端：**
```bash
cd night-festival
npm run dev:server
```

**终端 2 - 启动前端：**
```bash
cd night-festival
npm run dev:client
```

## 📋 前置准备

### 1. 安装 Node.js

确保已安装 Node.js >= 18.0.0

验证安装：
```bash
node --version
npm --version
```

### 2. 安装 PostgreSQL（可选）

如果需要真实数据库支持：

1. 下载安装 PostgreSQL：https://www.postgresql.org/download/
2. 创建数据库：
```sql
CREATE DATABASE night_festival;
```
3. 配置 `.env` 文件中的 `DATABASE_URL`

**注意：** 项目内置内存数据库，可不安装 PostgreSQL 直接运行

### 3. 配置环境变量

```bash
copy .env.example .env
```

主要配置项：
- `DATABASE_URL` - 数据库连接（可选，使用内存数据库可不配置）
- `JWT_SECRET` - JWT签名密钥
- `PORT` - 服务器端口（默认4000）

## 🎯 功能演示

### 游客抽奖流程

1. **访问首页**
   - 打开 http://localhost:3000
   - 点击"游客抽奖"入口

2. **登录**
   - 输入手机号：13800138000
   - 点击"获取验证码"
   - 输入任意6位数字作为验证码
   - 点击"登录参与"

3. **获取抽奖次数**
   - 选择支付平台（微信/支付宝）
   - 输入任意交易单号（如：TEST123456）
   - 点击"验证并获取次数"
   - 系统会返回获得的抽奖次数

4. **抽奖**
   - 点击"点击抽奖"按钮
   - 查看中奖结果和核销码
   - 核销码可在"我的"页面查看

### 商家申报流程

1. **访问商家申报**
   - 点击"商家申报"入口

2. **登录**
   - 使用手机号登录（同上）

3. **填写商户信息**
   - 商户名称：测试商户
   - 联系人：张三
   - 联系电话：13800138000

4. **上传证照**
   - 点击上传区域
   - 输入任意图片URL（如：https://via.placeholder.com/200）

5. **提交申请**
   - 点击"提交申请"
   - 查看审核状态

### 工作人员后台

1. **访问登录页**
   - 访问 http://localhost:3000/staff/login

2. **扫码登录**
   - 扫描页面上的二维码
   - 或直接点击"确认登录"（演示模式）

3. **查看数据看板**
   - 查看参与人数、抽奖次数等统计数据

4. **审核商家**
   - 点击"商家审核"菜单
   - 查看待审核商家列表
   - 进行通过/驳回操作

### 管理员后台

1. **访问管理后台**
   - 先以admin身份登录（手动修改localStorage中的role）
   - 或直接在首页看到"管理后台"入口

2. **内容管理**
   - 修改首页大标题、副标题等
   - 上传背景图片

3. **奖品配置**
   - 查看奖品列表
   - 修改奖品概率和库存

## 🔧 常用命令

```bash
# 安装依赖
npm install

# 开发模式（前后端同时启动）
npm run dev

# 仅前端开发
npm run dev:client

# 仅后端开发
npm run dev:server

# 构建生产版本
npm run build

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 数据库操作（需要PostgreSQL）
npm run db:push      # 推送schema到数据库
npm run db:generate  # 生成Prisma客户端
npm run db:studio    # 打开数据库管理界面
npm run db:migrate   # 执行数据库迁移
```

## 📁 项目文件结构

```
night-festival/
├── src/                          # 前端源代码
│   ├── components/
│   │   └── Layout.tsx           # 页面布局组件
│   ├── pages/
│   │   ├── Home.tsx            # 首页
│   │   ├── Lottery.tsx          # 抽奖页
│   │   ├── MerchantApply.tsx    # 商家申报页
│   │   ├── MyPage.tsx          # 个人中心页
│   │   ├── StaffLogin.tsx       # 工作人员登录页
│   │   ├── StaffDashboard.tsx  # 工作人员后台
│   │   ├── AdminDashboard.tsx   # 管理员后台
│   │   └── Chat.tsx             # 客服聊天页
│   ├── stores/
│   │   ├── userStore.ts        # 用户状态管理
│   │   └── lotteryStore.ts     # 抽奖状态管理
│   ├── services/
│   │   ├── api.ts              # API基础配置
│   │   ├── auth.ts             # 认证服务
│   │   └── lottery.ts          # 抽奖服务
│   ├── types/
│   │   └── index.ts            # TypeScript类型定义
│   ├── App.tsx                 # React应用入口
│   └── main.tsx                # 项目入口文件
├── api/                         # 后端源代码
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   │   ├── authController.ts
│   │   │   ├── visitorController.ts
│   │   │   ├── merchantController.ts
│   │   │   ├── staffController.ts
│   │   │   ├── adminController.ts
│   │   │   └── publicController.ts
│   │   ├── routes/             # 路由定义
│   │   │   ├── auth.ts
│   │   │   ├── visitor.ts
│   │   │   ├── merchant.ts
│   │   │   ├── staff.ts
│   │   │   ├── admin.ts
│   │   │   └── public.ts
│   │   ├── middlewares/        # 中间件
│   │   │   ├── authenticate.ts
│   │   │   └── errorHandler.ts
│   │   ├── types/              # 类型定义
│   │   │   └── index.ts
│   │   └── index.ts            # Express应用入口
│   └── prisma/
│       └── schema.prisma       # Prisma数据库模型
├── index.html                   # HTML入口文件
├── package.json                # 项目配置文件
├── vite.config.ts             # Vite构建配置
├── tailwind.config.js         # Tailwind CSS配置
├── tsconfig.json              # TypeScript配置
├── .env.example               # 环境变量示例
└── README.md                  # 项目说明文档
```

## 🎨 技术亮点

1. **北魏文化主题设计**
   - 深蓝紫色为主色调（代表夜空）
   - 金色为辅助色（代表灯光）
   - 橙红色为强调色（代表落日）

2. **完善的抽奖系统**
   - 消费凭证自动验证
   - 多维度抽奖次数计算
   - 隐藏大奖冷却机制
   - 实时核销码生成

3. **移动优先响应式设计**
   - 支持手机、平板、桌面端
   - 触摸友好
   - 适配各种屏幕尺寸

4. **动态二维码安全认证**
   - 30秒自动刷新
   - 防止截图盗用
   - 实时状态同步

## 🐛 常见问题

### Q: npm install 报错？

**A:** 确保 Node.js 版本 >= 18.0.0，并使用管理员权限运行终端。

### Q: 后端启动失败？

**A:** 检查端口4000是否被占用，或修改 `.env` 中的 `PORT` 配置。

### Q: 数据库连接失败？

**A:** 项目内置内存数据库，可跳过数据库配置。如需使用PostgreSQL，确保数据库服务已启动且配置正确。

### Q: 验证码无法收到？

**A:** 项目使用演示模式，验证码会打印在控制台。输入任意6位数字即可。

## 📞 获取帮助

如有问题，请查看：
1. README.md - 项目说明文档
2. .trae/documents/ - 产品需求文档和技术架构文档
3. 控制台输出 - 查看运行日志

---

**祝您使用愉快！🎉**
