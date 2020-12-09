# 基于mono repo代码管理方式的前端开发框架

## 技术栈

- Vue 2.x 考虑vue3的过渡性质, 保守起见当前项目继续使用vue2.x版本
- typescript 考虑代码的阅读等事项
- Element-UI 考虑国内开发者的使用习惯, 使用element-ui作为开发框架

## 关于开发规范

- [前后端对接规范以及常用字段约定](./docs/dock-standard.md)
- [前端规范](./docs/fe-standard.md)
- [BEM规范](https://bemcss.com/)
- [vue2.x风格指南](https://cn.vuejs.org/v2/style-guide/)


## 目录结构说明

### packages/utils 文件夹

- [基于axios的请求包](##请求方法的用法以及示例)
- [常用的方法库](##常用的方法库)

### packages/components 文件夹

- 基于element和其他第三方库的组件包


## 目录组织规范

统一的目录组织和命名能够增加项目的可阅读性和可访问性

- 开发时所编辑的文件基于 /packages/@projects文件夹下的各个项目

## 代码提交规范
代码提交规范基于 angular代码提交规范, [点击此处](./docs/commit.md)理解一些名词

## 多环境部署

项目状态的运行基于多种环境, 通常来讲, 项目的开发基于2种环境, 一种为development即开发环境, 一种为production 即为部署环境(生产环境). 但是很多情况下部署环境又会分为 测试环境和上线环境, 因此本项目环境
至少包含以下三种

> TIP 不同的环境, 大部分用来决定后端资源的分配选择, 在开发和部署环境之间才会有编译的区别

- development 开发环境, 即我们日常开发时所使用的环境
- testing 测试环境, 即部署到测试服务器的环境
- production 生产环境, 即部署到正式或线上服务器的环境
