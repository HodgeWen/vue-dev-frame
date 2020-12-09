# 代码提交规范

代码提交格式满足以下格式
[]内的占位符表示可选
<>内的占位符表示必填

```
<type>[scope]: <subject> // 标题
// 空一行
[body]
// 空一行
[footer]
```

## 占位符解释

### type

提交的类型, 必填

 - feat：新增功能
 - fix：bug 修复
 - docs：文档更新
 - style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
 - refactor：重构代码(既没有新增功能，也没有修复 bug)
 - perf：性能, 体验优化
 - build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
 - ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
 - chore：不属于以上类型的其他类型，比如构建流程, 依赖管理
 - revert：回滚某个更早之前的提交

### scope

表示提交的代码所影响的范围

### subject

提交的标题

### body

提交的主体, 对提交的详细描述, 可以有多行

### footer

1. 不兼容被动
如果当前代码与上一个版本不兼容，则 footer 部分以BREAKING CHANGE开头，后面是对变动的描述、以及变动理由和迁移方法。

2. 关闭 Issue
如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue 。

```
Closes #666
```