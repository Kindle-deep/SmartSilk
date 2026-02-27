# SmartSilk

SmartSilk 是一个基于 Next.js App Router 的移动优先项目，包含首页导航、文旅功能页、工具页、商品页、全景漫游页以及用户订单相关页面。

## 1. 项目架构

### 1.1 技术栈

- 框架：Next.js 16（App Router）
- 语言：TypeScript + React 19
- 样式：Tailwind CSS v4
- UI 组件：shadcn/ui + Radix UI
- 图标：lucide-react
- 代码质量：ESLint

### 1.2 目录结构（核心）

```text
app/
	layout.tsx              # 全局布局
	page.tsx                # 首页
	shop/page.tsx           # 商品页
	tools/page.tsx          # 工具页
	route/page.tsx          # 路线页
	route/result/page.tsx   # 路线结果页
	heritage/page.tsx       # 非遗页
	virtual/page.tsx        # 全景漫游页
	user/page.tsx           # 用户中心
	user/orders/page.tsx    # 订单列表
	user/orders/[order_no]/page.tsx  # 订单详情
	api/
		weather/route.ts      # 天气接口代理
		exchange/route.ts     # 汇率接口代理
		exchange/currencies/route.ts # 币种列表接口

components/
	layout/BottomNav.tsx    # 底部导航
	search/GlobalSearch.tsx # 全局搜索
	ui/*                    # 通用 UI 组件

lib/
	utils.ts                # 工具函数

public/
	images/ flags/ heritage/
```

### 1.3 分层说明

- 页面层（app）：负责路由与页面编排。
- 组件层（components）：复用 UI 与业务组件。
- 接口层（app/api）：对第三方服务进行统一封装，前端通过本项目 API 路由访问外部数据。
- 静态资源层（public）：图片与素材。

### 1.4 当前数据策略（商品页）

- 商品展示与分类使用本地数据（在 `app/shop/page.tsx` 内维护）。
- 下单与支付流程仍可对接后端 API（如需完全离线，可继续替换为本地 mock）。

## 2. 本地开发与调试

### 2.1 环境要求

- Node.js 20+
- pnpm（推荐）

### 2.2 安装依赖

```bash
pnpm install
```

### 2.3 环境变量

在项目根目录创建 `.env.local`：

```env
QWEATHER_API_KEY=你的和风天气Key
GETGEOAPI_KEY=你的currency.getgeoapi.com Key
```

### 2.4 启动开发环境

```bash
pnpm dev
```

默认访问：<http://localhost:3000>

### 2.5 常用命令

```bash
pnpm dev     # 本地开发
pnpm lint    # ESLint 检查
pnpm build   # 生产构建
pnpm start   # 启动生产构建产物
```

### 2.6 调试建议

- 页面调试：在浏览器 DevTools 查看 Network / Console。
- API 调试：直接访问本地路由，例如 `/api/weather`、`/api/exchange`。
- 代码调试：在 VS Code 中使用 JavaScript Debug Terminal 或 Next.js 启动任务进行断点调试。
- 问题定位顺序建议：`pnpm lint` → `pnpm build` → 页面交互回归。

## 3. 推送到远程仓库

### 3.1 初始化与绑定远程（首次）

```bash
git init
git add .
git commit -m "chore: initialize SmartSilk"
git branch -M main
git remote add origin <你的远程仓库地址>
git push -u origin main
```

### 3.2 日常提交流程

```bash
git checkout -b feat/<功能名>
git add .
git commit -m "feat: <变更说明>"
git push -u origin feat/<功能名>
```

然后在代码托管平台发起 Pull Request，合并到 `main`。

### 3.3 推送前检查清单

- `pnpm lint` 无报错
- `pnpm build` 通过
- 关键页面可访问（首页、商品页、用户订单页）
- `.env.local`、密钥、临时调试文件未提交

## 4. 版本协作建议

- 提交信息建议遵循 Conventional Commits（如 `feat:`、`fix:`、`chore:`）。
- 一个 PR 聚焦一个主题，降低评审成本。
- 优先在功能分支开发，避免直接向 `main` 提交。