## Why

需要一个在 VSCode 状态栏中阅读 epub/txt 电子书的插件，让用户可以在编码间隙方便地阅读小说或文章，无需切换窗口。

## What Changes

- 支持导入本地 epub 和 txt 文件，epub 自动转为纯文本
- 在 VSCode 底部状态栏显示书籍文本内容，可配置每次显示字符数（默认50）
- 支持多本书管理，可切换当前阅读的书籍
- 章节导航：解析 epub 章节结构，无章节时归为"未知章节"，可通过命令跳转章节
- 文本搜索：输入关键词后支持向前/向后逐个匹配跳转
- 阅读位置记忆：记录每本书的当前阅读位置，重启后恢复
- 隐藏/显示状态栏阅读内容的切换命令
- 所有导航命令对外暴露，可绑定快捷键

## Capabilities

### New Capabilities
- `file-import`: 导入 epub/txt 文件，epub 转纯文本，管理多本书籍列表
- `statusbar-display`: 状态栏文本显示，可配置字符数，隐藏/显示切换
- `chapter-navigation`: 章节解析与跳转导航
- `text-search`: 文本内容搜索，支持向前/向后匹配跳转
- `reading-progress`: 阅读位置记录与恢复

### Modified Capabilities

## Impact

- 新建 VSCode 扩展项目，使用 TypeScript 开发
- 依赖 epub 解析库（如 epub2）处理 epub 文件
- 使用 VSCode Extension API：StatusBarItem、commands、workspace storage
- package.json 中注册 commands、configuration、keybindings
