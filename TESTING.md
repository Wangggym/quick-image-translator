# Testing Guide

本文档介绍如何运行和编写项目测试。

## 测试框架

- **Jest**: 测试运行器和断言库
- **ts-jest**: TypeScript 支持
- **@types/jest**: TypeScript 类型定义

## 运行测试

### 运行所有测试

```bash
npm test
```

### 监听模式（开发时使用）

```bash
npm run test:watch
```

### 查看详细输出

```bash
npm run test:verbose
```

### 生成覆盖率报告

```bash
npm run test:coverage
```

覆盖率报告将生成在 `coverage/` 目录：
- `coverage/lcov-report/index.html` - HTML 格式报告
- `coverage/lcov.info` - LCOV 格式（用于 CI/CD）
- `coverage/clover.xml` - Clover 格式

## 测试结构

```
src/
├── main/
│   ├── services/
│   │   ├── __tests__/           # 服务层测试
│   │   │   ├── ConfigService.test.ts
│   │   │   ├── ImageService.test.ts
│   │   │   └── ShortcutService.test.ts
│   │   └── ...
│   └── windows/
│       ├── __tests__/           # 窗口层测试
│       │   ├── BaseWindow.test.ts
│       │   └── WindowManager.test.ts
│       └── ...
└── __mocks__/                   # Mock 文件
    └── electron.ts              # Electron API mocks
```

## 测试覆盖率目标

当前设置的覆盖率阈值：

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

如果覆盖率低于这些阈值，测试将失败。

## 编写测试

### 基本测试结构

```typescript
import 'reflect-metadata'; // 必须，用于依赖注入
import { ServiceName } from '../ServiceName';

describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(() => {
    // 每个测试前的设置
    jest.clearAllMocks();
    service = new ServiceName();
  });

  describe('methodName()', () => {
    it('should do something', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = service.methodName(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Mock 依赖

```typescript
import { IDependency } from '../types/interfaces';

describe('ServiceWithDependency', () => {
  let service: ServiceWithDependency;
  let mockDependency: jest.Mocked<IDependency>;

  beforeEach(() => {
    // 创建 mock 对象
    mockDependency = {
      method1: jest.fn(),
      method2: jest.fn(),
    } as any;

    // 注入 mock
    service = new ServiceWithDependency(mockDependency);
  });

  it('should call dependency', () => {
    service.doSomething();

    expect(mockDependency.method1).toHaveBeenCalled();
  });
});
```

### 测试异步代码

```typescript
it('should handle async operation', async () => {
  const result = await service.asyncMethod();

  expect(result).toBeDefined();
});
```

### 测试错误处理

```typescript
it('should throw error for invalid input', () => {
  expect(() => service.methodThatThrows()).toThrow('Expected error');
});

it('should handle async errors', async () => {
  await expect(service.asyncMethodThatFails()).rejects.toThrow();
});
```

## Electron Mocks

项目使用自定义的 Electron mocks（在 `__mocks__/electron.ts`）。

可用的 mock 模块：
- `app`
- `BrowserWindow`
- `Tray`
- `Menu`
- `nativeImage`
- `globalShortcut`
- `clipboard`
- `screen`
- `desktopCapturer`
- `ipcMain`
- `ipcRenderer`
- `contextBridge`

### 使用示例

```typescript
import { globalShortcut } from 'electron';

it('should register shortcut', () => {
  service.registerShortcut('Ctrl+S', callback);

  expect(globalShortcut.register).toHaveBeenCalledWith('Ctrl+S', callback);
});
```

## 调试测试

### 使用 VSCode 调试

在 `.vscode/launch.json` 添加配置：

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### 运行单个测试文件

```bash
npm test -- ConfigService.test.ts
```

### 运行特定测试

```bash
npm test -- -t "should do something"
```

## CI/CD 集成

项目使用 GitHub Actions 自动运行测试：

- **触发条件**: Push 到 main/develop 分支，或创建 PR
- **测试环境**: macOS (Node.js 18.x, 20.x)
- **步骤**:
  1. 代码检查（linting）
  2. 运行测试
  3. 生成覆盖率报告
  4. 上传到 Codecov

查看 `.github/workflows/test.yml` 了解详情。

## 测试最佳实践

### ✅ DO

- 为每个公共方法编写测试
- 测试边界情况和错误处理
- 使用描述性的测试名称
- 保持测试独立和隔离
- Mock 外部依赖
- 测试接口而非实现细节

### ❌ DON'T

- 不要测试私有方法（测试公共接口即可）
- 不要在测试中使用真实的 Electron API
- 不要编写依赖测试执行顺序的测试
- 不要过度 mock（测试会变得脆弱）

## 覆盖率报告

### 查看 HTML 报告

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### 当前覆盖率

运行 `npm run test:coverage` 查看最新覆盖率。

目标：
- 核心服务：>80%
- 窗口类：>70%
- 工具函数：>90%

## 持续改进

### 待添加的测试

- [ ] ScreenshotService 完整测试
- [ ] TranslatorService 完整测试
- [ ] TrayService 测试
- [ ] TranslatorWindow 测试
- [ ] ScreenshotWindow 测试
- [ ] Application 集成测试
- [ ] E2E 测试

查看 [TODO.md](./TODO.md) 了解测试计划。

## 问题排查

### 测试失败

1. 确保运行 `npm install` 安装所有依赖
2. 清除 Jest 缓存：`npx jest --clearCache`
3. 检查是否有 TypeScript 错误：`npm run build`

### 覆盖率不足

1. 查看 HTML 报告找到未覆盖的代码
2. 为未测试的分支添加测试用例
3. 移除不必要的代码

### Mock 不工作

1. 确保 `jest.setup.js` 被正确加载
2. 检查 mock 路径是否正确
3. 在测试前调用 `jest.clearAllMocks()`

## 资源

- [Jest 文档](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Electron Testing Guide](https://www.electronjs.org/docs/latest/tutorial/automated-testing)

---

**更新时间**: 2025-11-14  
**维护者**: Quick Image Translator Team

