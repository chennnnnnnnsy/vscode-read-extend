## Context

这是一个全新的 VSCode 扩展项目，目标是在状态栏中显示电子书内容供用户阅读。项目从零开始，无现有代码基础。用户希望在编码间隙阅读小说/文章，需要轻量、不干扰主编辑区的方案。

## Goals / Non-Goals

**Goals:**
- 支持 epub 和 txt 文件导入，epub 自动解析为纯文本
- 状态栏显示当前阅读内容片段，可配置字符数
- 章节导航、文本搜索、阅读进度持久化
- 所有交互命令可绑定快捷键
- 架构可扩展，未来可支持更多文件格式

**Non-Goals:**
- 不做富文本渲染（图片、CSS 样式等）
- 不做在线书源/网络下载功能
- 不做阅读统计或番茄钟等附加功能
- 不支持 DRM 保护的 epub 文件

## Decisions

### 1. epub 解析方案：使用 epub2 库
- **选择**: `epub2`（epub 的 maintained fork）
- **理由**: 纯 Node.js 实现，无 native 依赖，API 简洁，支持章节遍历和内容提取
- **备选**: `epubjs`（偏浏览器端）、手动解析 zip+xml（工作量大）

### 2. 文本存储：转为 txt 后以章节数组形式存储在内存
- **选择**: 导入时解析 epub 为 `Chapter[]` 结构（`{title, content}`），整体文本拼接为单一字符串用于搜索和定位
- **理由**: 状态栏只需纯文本，内存中操作最快；章节结构用于导航
- **备选**: 写入磁盘 txt 文件再读取（多一次 IO，不如直接内存）

### 3. 阅读位置持久化：使用 VSCode globalState
- **选择**: `context.globalState` 存储 `{filePath: {position, chapterIndex}}`
- **理由**: VSCode 原生 API，跨工作区持久化，无需额外文件
- **备选**: 写入 JSON 文件（需管理文件路径，跨设备不便）

### 4. 状态栏交互方式
- **选择**: 使用 `StatusBarItem` 显示文本，点击时弹出快捷操作菜单
- **理由**: 状态栏空间有限，适合显示文本片段；命令面板处理复杂交互

### 5. 多书管理
- **选择**: globalState 中维护书籍列表，QuickPick 选择切换
- **理由**: 轻量，无需额外 UI 视图

### 6. 项目结构
```
src/
  extension.ts          # 入口，注册命令
  reader/
    BookManager.ts      # 书籍列表管理、当前书切换
    TextParser.ts       # epub/txt 解析为 Chapter[]
    ReaderEngine.ts     # 阅读核心：位置管理、翻页、搜索
  ui/
    StatusBarView.ts    # 状态栏显示控制
    ChapterPicker.ts    # 章节选择 QuickPick
```

## Risks / Trade-offs

- [epub 解析失败] → 捕获异常，提示用户文件格式不支持；对大文件设置合理上限
- [状态栏字符限制] → VSCode 状态栏无硬性限制但过长会被截断，默认 50 字符合理
- [内存占用] → 大型 epub 全文加载可能占用较多内存 → 对于一般小说（几 MB）可接受，暂不做分片加载
- [epub2 库维护风险] → 该库相对稳定，epub 格式本身不再变化，风险低
