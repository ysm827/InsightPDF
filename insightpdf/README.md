# InsightPDF

上传 PDF，提出问题，让 Gemini 精确定位答案在文档中的位置，并在页面上以红框 + 箭头可视化标出。

## ✨ 功能

- **PDF 阅读**：连续滚动、页码导航、缩放、适应宽度/页面，仅渲染视口附近页面，大文档也流畅
- **智能问答**：基于 Gemini，回答支持 Markdown 与 LaTeX 数学公式（KaTeX）
- **答案定位**：返回页码 + 边界框（box2d），PDF 页面上直接标注答案位置
- **双上传模式**：Files API（推荐，适合大文件）或 inline base64
- **自定义 API**：支持自定义 API Key 与 Base URL（兼容各类代理）
- **深色模式**：跟随系统偏好，可手动切换，无闪白
- **会话持久化**：PDF 存 IndexedDB，聊天记录存 localStorage，刷新不丢失
- **响应式**：桌面端双栏可拖拽调宽，移动端 Tab 切换 + 拖拽上传

## 🚀 快速开始

**前置要求：** Node.js >= 20

```bash
# 1. 安装依赖
npm install

# 2. 配置 API Key
cp .env.example .env.local   # 然后在 .env.local 中填入你的 GEMINI_API_KEY

# 3. 启动开发服务器
npm run dev                  # http://localhost:3000
```

> 没有 API Key？也可以在应用内「设置 → 自定义 API」中直接填入。

## 🐳 Docker 部署

项目为纯前端 SPA（浏览器直连 Gemini API，无需后端），使用多阶段构建：Node 构建 → Nginx 托管，镜像约 80MB。

```bash
# 方式一：docker compose（自动读取 .env 中的 GEMINI_API_KEY）
cp .env.example .env      # 填入 GEMINI_API_KEY
docker compose up -d --build   # 访问 http://localhost:8080

# 方式二：docker build + run
docker build -t insightpdf --build-arg GEMINI_API_KEY=你的key .
docker run -d -p 8080:80 --name insightpdf insightpdf
```

> - 不传 Key 构建也能运行：用户可在应用内「设置 → 自定义 API」里填写 Key（保存在浏览器本地）
> - API Key 会被编译进静态 JS 包，对访问者可见——请使用受限额度的 Key，切勿用于共享服务

## 📦 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run typecheck` | 仅 TypeScript 类型检查 |
| `npm run preview` | 预览生产构建 |

## 🗂 项目结构

```
├── App.tsx                    # 应用布局（侧栏 + PDF 视图 + 移动端 Tab）
├── types.ts                   # 共享类型与工具（LocatorResult / ChatMessage / generateId）
├── components/
│   ├── ControlPanel.tsx       # 侧栏组合容器
│   ├── PanelHeader.tsx        # 侧栏头部（模型选择 / 设置 / 上传）
│   ├── ModelSelector.tsx      # 模型下拉选择
│   ├── ChatMessages.tsx       # 消息列表 + 加载/错误/重试状态
│   ├── ChatMessageItem.tsx    # 单条消息（Markdown / 定位卡片 / 复制）
│   ├── MarkdownRenderer.tsx   # memo 化的 Markdown + KaTeX 渲染
│   ├── SettingsModal.tsx      # 设置弹窗
│   ├── CustomApiConfigSection.tsx
│   ├── AboutGitHubSection.tsx
│   ├── PdfViewer.tsx          # PDF 视图容器
│   ├── PdfDocumentList.tsx    # 文档分页渲染 + 视口窗口化
│   ├── PdfToolbar.tsx         # 翻页/缩放/定位开关工具栏
│   ├── PdfOverlay.tsx         # 答案定位红框 + 箭头
│   ├── ResizableSidebar.tsx   # 可拖拽调宽的侧栏
│   ├── DragDropOverlay.tsx    # 拖拽上传遮罩
│   └── Toggle.tsx
├── hooks/                     # useChatController / usePdf* / useTheme / ...
└── services/
    ├── geminiService.ts       # Gemini API 封装（超时保护）
    ├── storageService.ts      # IndexedDB + localStorage 持久化
    └── networkInterceptor.ts  # 自定义 Base URL 的 fetch 拦截
```

## 📄 License

MIT
