# Quick Start Guide

快速开始使用 Quick Image Translator

## 安装

### 方式 1: 从源码构建（当前推荐）

```bash
# 克隆仓库
git clone https://github.com/Wangggym/quick-image-translator.git
cd quick-image-translator

# 安装依赖
npm install

# 构建项目
npm run build

# 运行应用
npm start
```

### 方式 2: 下载发布版本（即将推出）

待项目稳定后，我们将在 [GitHub Releases](https://github.com/Wangggym/quick-image-translator/releases) 提供预编译的 DMG 安装包。

## 使用方法

### 1. 启动应用

应用启动后会在菜单栏显示图标（目前为空白图标，待添加实际图标）。

### 2. 触发截图翻译

有两种方式：

**方式 A: 快捷键**
```
⌘ + Shift + T
```

**方式 B: 点击菜单栏图标**

### 3. 选择区域

1. 鼠标按住并拖动，选择要翻译的区域
2. 松开鼠标完成选择
3. 按 `ESC` 键取消

### 4. 查看翻译

- 应用会自动打开 Google 翻译窗口
- 图片已复制到剪贴板
- 在 Google 翻译页面按 `⌘ + V` 粘贴图片
- 查看翻译结果

## 配置

### 自定义快捷键（未来版本）

目前快捷键固定为 `⌘ + Shift + T`。未来版本将支持自定义。

### 配置文件位置

```
~/Library/Application Support/quick-image-translator/config.json
```

## 故障排除

### 应用启动后看不到菜单栏图标

- 检查系统偏好设置 → 用户与群组 → 登录项
- 确保应用有屏幕录制权限

### 快捷键不起作用

1. 检查快捷键是否与其他应用冲突
2. 在"系统偏好设置 → 键盘 → 快捷键"中查看
3. 尝试重启应用

### Google 翻译页面打不开

- 检查网络连接
- 确认能否访问 translate.google.com
- 考虑使用 VPN（如果需要）

### 截图区域选择异常

- 确保应用有屏幕录制权限
- 系统偏好设置 → 安全性与隐私 → 隐私 → 屏幕录制
- 勾选 Quick Image Translator

## macOS 权限设置

应用需要以下权限：

### 屏幕录制权限

用于截取屏幕区域

**设置路径：**
```
系统偏好设置 → 安全性与隐私 → 隐私 → 屏幕录制
```

### 辅助功能权限（可能需要）

用于全局快捷键

**设置路径：**
```
系统偏好设置 → 安全性与隐私 → 隐私 → 辅助功能
```

## 已知限制

### 当前版本 (v0.1.0-alpha)

- ⚠️ 图片需要手动粘贴到 Google 翻译（未来将自动化）
- ⚠️ 暂无图标资源（显示空白）
- ⚠️ 翻译结果窗口功能未完全实现
- ⚠️ 配置界面尚未实现

这些问题将在未来版本中解决。查看 [TODO.md](./TODO.md) 了解开发计划。

## 下一步

- 阅读完整的 [README.md](./README.md)
- 查看 [贡献指南](./CONTRIBUTING.md)
- 报告问题或建议：[GitHub Issues](https://github.com/Wangggym/quick-image-translator/issues)

## 获取帮助

如果遇到问题：

1. 查看本指南的"故障排除"部分
2. 搜索 [GitHub Issues](https://github.com/Wangggym/quick-image-translator/issues)
3. 创建新的 Issue 描述你的问题

---

**提示：** 这是一个早期版本，功能还在积极开发中。欢迎反馈和贡献！

