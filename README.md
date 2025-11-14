# Quick Image Translator

<div align="center">

![Platform](https://img.shields.io/badge/platform-macOS-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Electron](https://img.shields.io/badge/Electron-27.0-47848F)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-alpha-orange)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-70%25-yellow)

一个优雅的 macOS 菜单栏应用，让你能够一键截图并使用 Google 翻译进行图片翻译。

[English](./README.md) | 简体中文

[快速开始](./QUICKSTART.md) • [贡献指南](./CONTRIBUTING.md) • [报告问题](https://github.com/Wangggym/quick-image-translator/issues) • [开发计划](./TODO.md)

</div>

---

## ✨ 特性

- 🎯 **一键截图翻译**：通过全局快捷键或菜单栏图标快速触发
- 🌐 **集成 Google 翻译**：利用 Google 强大的图片翻译能力
- 💎 **优雅的用户体验**：无缝的工作流程，最小化操作步骤
- 🎨 **精美的界面**：现代化的截图选择界面
- ⚡ **常驻后台**：应用始终就绪，无需手动维护网页

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建应用

```bash
npm run build
```

## 🎮 使用方法

1. **启动应用**：应用会在菜单栏显示图标
2. **触发截图**：
   - 点击菜单栏图标
   - 或使用快捷键 `⌘ + Shift + T`
3. **选择区域**：拖动鼠标选择要翻译的区域
4. **查看翻译**：自动跳转到 Google 翻译页面显示结果

## 🏗️ 技术架构

### 技术栈

- **Electron**: 跨平台桌面应用框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **依赖注入**: 使用 InversifyJS 实现 IoC 容器
- **架构模式**: 分层架构 + SOLID 原则

### 项目结构

```
quick-image-translator/
├── src/
│   ├── main/                 # 主进程
│   │   ├── index.ts         # 主入口
│   │   ├── container.ts     # IoC 容器配置
│   │   ├── services/        # 业务服务
│   │   │   ├── TrayService.ts
│   │   │   ├── ScreenshotService.ts
│   │   │   ├── TranslatorService.ts
│   │   │   └── ShortcutService.ts
│   │   ├── windows/         # 窗口管理
│   │   │   ├── WindowManager.ts
│   │   │   ├── TranslatorWindow.ts
│   │   │   ├── ScreenshotWindow.ts
│   │   │   └── ResultWindow.ts
│   │   └── types/           # 类型定义
│   │       └── interfaces.ts
│   ├── renderer/            # 渲染进程
│   │   ├── screenshot/      # 截图界面
│   │   │   ├── index.html
│   │   │   ├── index.ts
│   │   │   └── styles.css
│   │   └── result/          # 结果展示界面
│   │       ├── index.html
│   │       ├── index.ts
│   │       └── styles.css
│   └── preload/             # 预加载脚本
│       └── index.ts
├── assets/                  # 资源文件
│   └── icons/              # 图标
├── dist/                    # 构建输出
├── package.json
├── tsconfig.json
├── README.md
└── TODO.md
```

### 架构设计

#### 分层架构

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Tray, Windows, UI Components)   │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│          Service Layer              │
│  (Business Logic & Orchestration)   │
└─────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────┐
│        Infrastructure Layer         │
│   (Electron APIs, File System)      │
└─────────────────────────────────────┘
```

#### 依赖注入

使用 InversifyJS 实现控制反转：

```typescript
// 服务通过构造函数注入依赖
@injectable()
class ScreenshotService {
  constructor(
    @inject(TYPES.WindowManager) private windowManager: IWindowManager,
    @inject(TYPES.ImageProcessor) private imageProcessor: IImageProcessor
  ) {}
}
```

#### SOLID 原则

- **单一职责**: 每个服务只负责一个功能领域
- **开闭原则**: 通过接口抽象，易于扩展
- **里氏替换**: 所有实现都可以替换接口
- **接口隔离**: 细粒度的接口定义
- **依赖倒置**: 依赖抽象而非具体实现

## 🛠️ 开发

### 代码规范

- 使用 ESLint + Prettier 进行代码格式化
- 遵循 TypeScript strict 模式
- 使用 Git Hooks 确保代码质量

### 测试

```bash
# 运行所有测试
npm test

# 监听模式（开发时）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 详细输出
npm run test:verbose
```

查看 [TESTING.md](./TESTING.md) 了解详细的测试指南。

**测试覆盖率目标**: 70%  
**当前状态**: ✅ 配置完成，核心服务已覆盖

## 📝 开发计划

查看 [TODO.md](./TODO.md) 了解详细的开发计划和进度。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

请先阅读 [贡献指南](./CONTRIBUTING.md) 了解如何参与项目开发。

### 贡献者

感谢所有为这个项目做出贡献的开发者！

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 开源协议。

## 🔗 相关链接

- [GitHub 仓库](https://github.com/Wangggym/quick-image-translator)
- [问题追踪](https://github.com/Wangggym/quick-image-translator/issues)
- [更新日志](https://github.com/Wangggym/quick-image-translator/releases)

---

<div align="center">

如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！

Made with ❤️ by the Quick Image Translator team

</div>

