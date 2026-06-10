# STTO - Study Tool

一个在 VS Code 状态栏中阅读书籍的扩展，支持 EPUB 和 TXT 格式。

## 功能

- **导入书籍** - 支持 EPUB 和 TXT 格式
- **状态栏阅读** - 在状态栏显示当前阅读内容，低调且方便
- **翻页导航** - 使用快捷键前后翻页
- **章节跳转** - 快速选择并跳转到任意章节
- **全文搜索** - 支持跨章节关键词搜索
- **显隐切换** - 一键隐藏/显示阅读内容
- **自动保存进度** - 关闭后重新打开自动恢复阅读位置

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Alt+J` | 下一页 |
| `Alt+K` | 上一页 |
| `Alt+H` | 切换显隐 |
| `Alt+C` | 跳转章节 |
| `Alt+S` | 搜索 |
| `Alt+N` | 下一个匹配 |
| `Alt+P` | 上一个匹配 |

## 命令

打开命令面板 (`Ctrl+Shift+P` / `Cmd+Shift+P`) 搜索：

- `STTO: Import Book` - 导入书籍
- `STTO: Open Book` - 打开已导入的书籍
- `STTO: Remove Book` - 移除书籍
- `STTO: Close` - 关闭当前阅读

## 配置

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| `readExtend.displayLength` | `50` | 状态栏显示的字符数 |

## 开发

```bash
npm install
npm run compile
```

打包：

```bash
npm run package
```

## 支持的格式

- **EPUB** - 自动解析章节结构和 HTML 内容
- **TXT** - 自动识别中文章节标题（第X章/回/节等）进行分章
