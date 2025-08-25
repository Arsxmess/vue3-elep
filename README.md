# Vue 3 + Vite人脸管理页面

## 项目介绍

本项目是基于 Vue 3 Vite 和ElementPlus构建的前端项目，采用 `<script setup>` 语法糖的单文件组件（SFC）结构。

## 技术栈

- Vue 3
- Vite
- JavaScript
- TypeScript

## 安装依赖

### 进入项目目录

```bash
cd elep
```

### 使用 npm

```bash
npm install
```

### 运行项目

```bash
npm run dev
```

### 打包项目

```bash
npm run build
```

## 项目结构

```bash
src/
├── assets/                   # 静态资源
│   └── images/
│       ├── ic_title_performance.png
│       └── ic_bg.png
├── components/               # 公共组件
│   └── Home.vue              # 成员管理页面
├── layout/                   # 布局组件
│   └── layout.vue
├── mock/                     # Mock 数据
│   └── index.js
├── pages/                    # 页面级组件
│   └── group-management.vue  # 分组管理页面
├── router/                   # 路由
│   └── index.js
├── stores/                   # 状态管理（Pinia）
│   └── dataStore.ts
├── styles/                   # elementplus样式
│   ├── el-dialog.css         # 对话框
│   ├── pagination.css        # 分页组件
│   └── tbstyles.css          # 表格组件
├── App.vue                   # 根组件
├── main.js                   # 入口文件
└── style.css                 # 全局样式
```

## 功能模块

### 1. 成员管理 (Home.vue)

- 成员列表展示  
- 成员搜索功能（按姓名和类型）  
- 添加/编辑成员  
- 删除成员  
- 人脸照片上传和管理  
- 分页功能  

### 2. 分组管理 (group-management.vue)

- 分组列表展示  
- 分组搜索功能  
- 添加/编辑分组  
- 删除分组  

### 3. 数据存储 (dataStore.ts)

使用 Pinia 进行状态管理，包含：

- 分组数据管理  
- 用户数据管理  
- 成员类型管理  
- 分组名称管理  

## 开发规范

### 代码风格

- 使用 Vue 3 Composition API 和 `<script setup>` 语法糖  
- TypeScript 用于类型检查  
- 遵循 Element Plus 组件库的使用规范  

### 样式规范

- 使用 scoped CSS 避免样式污染  
- 全局样式定义在 `style.css` 和 `styles/` 目录下  
- 使用 CSS 变量统一管理颜色和尺寸  

### 路由规范

- 路由配置在 `router/index.js`  
- 使用 Vue Router 进行页面跳转  

### Mock 数据

项目在开发环境中使用 Mock.js 模拟后端接口：

- 分组数据模拟  
- 用户数据模拟  
- 支持增删改查操作  

## 技术栈详情

- **Vue 3**：渐进式 JavaScript 框架  
- **Vite**：下一代前端构建工具  
- **Element Plus**：Vue 3 组件库  
- **Pinia**：Vue 3 状态管理  
- **Mock.js**：模拟数据生成  
- **Day.js**：日期处理库  
- **TypeScript**：JavaScript 超集，提供类型检查  

## 注意事项

- 项目使用了自定义的样式主题，修改样式时请注意保持整体风格一致  
- 人脸照片上传功能仅在前端模拟，实际项目中需要对接后端接口  
- 日期时间格式统一使用中文格式：`"YYYY年MM月DD日 HH:mm:ss"`  
- 所有数据操作都通过 Pinia 状态管理进行，确保数据一致性  

## 扩展建议

- 可集成真实后端 API 替换 Mock 数据  
- 可添加用户权限管理功能  
- 可优化图片上传功能，支持压缩和格式转换  
- 可添加数据导出功能（Excel、CSV等）  
- 可增加更多表单验证规则
