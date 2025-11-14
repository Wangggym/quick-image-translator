# Contributing to Quick Image Translator

感谢你对 Quick Image Translator 的关注！我们欢迎各种形式的贡献。

## 开发环境设置

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- macOS (for development and testing)
- Git

### 克隆仓库

```bash
git clone https://github.com/Wangggym/quick-image-translator.git
cd quick-image-translator
```

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 打包应用

```bash
npm run package:mac
```

## 项目结构

```
src/
├── main/           # 主进程代码
│   ├── services/   # 业务服务层
│   ├── windows/    # 窗口管理
│   └── types/      # 类型定义
├── preload/        # 预加载脚本
└── renderer/       # 渲染进程
    ├── screenshot/ # 截图界面
    └── result/     # 结果展示
```

## 代码规范

### TypeScript

- 使用 TypeScript strict 模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

### 代码风格

```bash
# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

## 架构原则

### SOLID 原则

- **单一职责**: 每个类/服务只负责一个功能
- **开闭原则**: 对扩展开放，对修改关闭
- **里氏替换**: 子类可以替换父类
- **接口隔离**: 使用细粒度的接口
- **依赖倒置**: 依赖抽象而非具体实现

### 依赖注入

使用 InversifyJS 进行依赖注入：

```typescript
@injectable()
export class MyService {
  constructor(
    @inject(TYPES.Dependency) private dependency: IDependency
  ) {}
}
```

## 提交 Pull Request

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### PR 检查清单

- [ ] 代码遵循项目的代码规范
- [ ] 已运行 lint 和格式化
- [ ] 已测试所有更改
- [ ] 已更新相关文档
- [ ] 提交信息清晰明确

## 报告 Bug

使用 [GitHub Issues](https://github.com/Wangggym/quick-image-translator/issues) 报告 bug。

请包含：
- 操作系统版本
- 应用版本
- 复现步骤
- 期望行为
- 实际行为
- 截图（如果适用）

## 功能请求

我们欢迎新功能建议！请通过 GitHub Issues 提交，并包含：
- 功能描述
- 使用场景
- 可能的实现方案

## 开发路线图

查看 [TODO.md](./TODO.md) 了解当前开发计划和进度。

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

