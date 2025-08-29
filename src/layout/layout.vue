<template>
  <!-- 背景层 -->
  <div class="background-container"></div>

  <!-- 内容层 -->
   <div class="scale-wrapper">
    <div class="scale-container" :style="{ transform: `scale(${scale})`, transformOrigin: 'center center' }">
   <div class="layout-layer" :class="{ 'mobile-layout': isMobile }">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
   <div class="logo-container" ref="logoRef">
  <img src="../assets/images/ic_title_performance.png" alt="logo" class="logo-img" />
  <span class="logo"> 人脸管理</span>
</div>
    <div class="custom-divider"></div>
    <!-- 头部区域 -->
    <el-header height="60px" class="header">
      <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleTabClick">
        <el-tab-pane label="成员管理" name="member"></el-tab-pane>
        <el-tab-pane label="分组管理" name="group"></el-tab-pane>
      </el-tabs>
    </el-header>
    <div class="custom-divider"></div>
    <!-- 主内容区 -->
    <el-main class="main-content">
      <!-- 根据当前选中的tab显示不同内容 -->
      <div v-if="activeTab === 'member'">
        <Home :active-tab="activeTab" />
      </div>
      <div v-else-if="activeTab === 'group'">
        <router-view />
      </div>
    </el-main>
    </div>
  </div>
  </div>
</template>

<style scoped>
/* 螺母样式 */
.logo {
  padding-left: 0.5em;
}

/* 自定义分割线 */
.custom-divider {
  height: 1px;
  background: #00f2fe;
  width: 100%;
  margin: 2px 0;
  opacity: 0.3;
}

/* 背景容器 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/images/ic_bg.png');
  background-size: cover;
  background-position: center;
  background-color: #03091A;
  background-repeat: no-repeat;
  z-index: -1;
}

/* 居中容器 */
.scale-wrapper {
  position: fixed;
  top: 24px;
  left: 24px;
  right: 24px;
  bottom: 24px;
  display: flex;
  
  justify-content: center;
  align-items: center;
  overflow: auto; 
}

.scale-container {
  transform: scale(v-bind(scale));
  transform-origin: center center;
  width: 1920px;
  height: 1080px;
  /* 移除居中对齐，让内容从左上角开始 */
  min-width: 1600px;
  min-height: 900px;
}

/* 内容主容器 */
.layout-layer {
  position: relative;
  width: 1920px;
  height: 1080px; /* 固定高度 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #132332;
  box-shadow:
    inset 0 0 5px rgba(0, 242, 254, 0.5),
    inset 0 0 5px rgba(0, 242, 254, 0.3);
  overflow: hidden;
  border: #558B97 1px solid;
}

/* 主内容区 - 关键修改 */
.main-content {
  flex: 1;
  padding: 16px 0 0 0;
  min-height: 0;
  overflow: auto; /* 只在内容区域显示滚动条 */
  scrollbar-width: thin;
  scrollbar-color: #00f2fe #132332;
}

/* 自定义滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #132332;
}

.main-content::-webkit-scrollbar-thumb {
  background: #00f2fe;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #00d9ff;
}
/* 移动端布局 */
.layout-layer.mobile-layout {
  margin: 12px;
  min-height: calc(100vh - 24px);
}

.layout-layer::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 475px;
  height: 6px;
  background: #158994;
  clip-path: polygon(7.5px 0,
      467.5px 0,
      475px 6px,
      0 6px);
}

/* 基础角样式 */
.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #00d9ff;
  z-index: 1;
}

/* 左上角:仅保留上、左边框 */
.corner-tl {
  top: -1px;
  left: -1px;
  border-bottom: none;
  border-right: none;
}

/* 右上角:仅保留上、右边框 */
.corner-tr {
  top: -1px;
  right: -1px;
  border-bottom: none;
  border-left: none;
}

/* 左下角:仅保留下、左边框 */
.corner-bl {
  bottom: -1px;
  left: -1px;
  border-top: none;
  border-right: none;
}

/* 右下角:仅保留下、右边框 */
.corner-br {
  bottom: -1px;
  right: -1px;
  border-top: none;
  border-left: none;
}

/* logo样式 */
.logo-container {
  padding-left: 14px;
  display: flex;
  align-items: center;
  justify-content: left;
  height: 60px;
  font-size: 20px;
  font-weight: bold;
  color: #00f2fe;
  letter-spacing: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px; /* 限制logo容器最大宽度 */
   transform-origin: left center;
  /* 添加过渡效果使变化更平滑 */
  transition: transform 0.1s ease-out;
}

.logo {
  padding-left: 0.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 限制logo文字最大宽度 */
}


.header {
  padding: 0;
  margin-left: 0px;
  /* 或者更大的值 */
}

/* Tabs样式定制 */
.demo-tabs {
  width: 100%;
  padding: 0;
}

:deep(.el-tabs) {
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.el-tabs__header) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}

:deep(.el-tabs__nav-scroll) {
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.el-tabs__nav) {
  padding: 0 !important;
  margin: 0 !important;
  position: relative;
}

:deep(.el-tabs__item) {
  color: #00f2fe;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
  padding: 0 20px !important;
  margin: 0 !important;
}

:deep(.el-tabs__item:hover) {
  color: #00f2fe !important;
  background: linear-gradient(to top, rgba(0, 242, 254, 0.2), transparent);
}

:deep(.el-tabs__item.is-active) {
  color: #00f2fe !important;
  font-weight: bold;
}

:deep(.el-tabs__active-bar) {
  background-color: #00f2fe !important;
  height: 3px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 16px 0 0 0;
  min-height: 0;
  overflow: auto; /* 确保内容可以滚动 */
}

/* 分组管理内容样式 */
.group-management {
  padding: 20px;
  color: #DEDFDF;
}

.group-management h2 {
  color: #00f2fe;
  margin-bottom: 20px;
}

/* 响应式媒体查询 */
@media (max-width: 768px) {
  .scale-wrapper {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .layout-layer {
    margin: 12px;
    min-height: calc(100vh - 24px);
  }
  
  .logo-container {
    font-size: 18px;
    padding-left: 10px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 14px;
    padding: 0 15px !important;
  }
  
  .main-content {
    padding: 12px 0 0 0;
  }
}

@media (max-width: 480px) {
 .scale-wrapper {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .layout-layer {
    margin: 8px;
    min-height: calc(100vh - 16px);
  }
  
  .logo-container {
    font-size: 16px;
    padding-left: 8px;
    height: 50px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 12px;
    padding: 0 10px !important;
    height: 50px;
    line-height: 50px;
  }
  
  .main-content {
    padding: 8px 0 0 0;
  }
}

@media (min-width: 2560px) {
  /* 2K/4K 显示器适配 */
  .scale-wrapper {
    top: 3vw;
    left: 3vw;
    right: 3vw;
    bottom: 3vw;
  }
  
  .layout-layer {
    margin: 3vw;
    min-height: calc(100vh - 6vw);
  }
  
  .logo-container {
    font-size: 2.5vw;
  }
  
  :deep(.el-tabs__item) {
    font-size: 1.8vw;
  }
}

@media (max-width: 1200px) and (min-width: 769px) {
  /* 中等屏幕适配 */
  .scale-wrapper {
    top: 1.5vw;
    left: 1.5vw;
    right: 1.5vw;
    bottom: 1.5vw;
  }
  
  .layout-layer {
    margin: 1.5vw;
    min-height: calc(100vh - 3vw);
  }
  
  .logo-container {
    font-size: 1.8vw;
  }
}

.el-button {
  max-width: 200px;  /* 限制最大宽度 */
  max-height: 50px;  /* 限制最大高度 */
}

.search-button {
  max-width: 120px;
  width: auto;
  font-size: 14px;
  padding: 8px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.demo-tabs {
  width: 100%;
  padding: 0;
  max-width: 600px; /* 限制标签页容器的最大宽度 */
}

:deep(.el-tabs__item) {
  color: #00f2fe;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
  padding: 0 20px !important;
  margin: 0 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 限制单个标签的最大宽度 */
}
</style>
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount , nextTick} from 'vue'
import Home from '../components/Home.vue'
import type { TabsPaneContext } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useDataStore } from '../stores/dataStore'

const route = useRoute()
const activeTab = ref(route.name === 'GroupManagement' ? 'group' : 'member')
const router = useRouter()
const dataStore = useDataStore()

// 响应式相关变量
const windowWidth = ref(window.innerWidth)
const isMobile = ref(window.innerWidth < 768)
const scale = ref(1)
const baseWidth = 1920
const baseHeight = 1080
const logoRef = ref<HTMLElement | null>(null)
// 计算缩放比例
const calculateScale = () => {
  const wrapper = document.querySelector('.scale-wrapper') as HTMLElement
  if (!wrapper) return
  
  const rect = wrapper.getBoundingClientRect()
  const widthScale = rect.width / baseWidth
  const heightScale = rect.height / baseHeight
  
  scale.value = Math.min(widthScale, heightScale)
  
  
  // 调整 logo 文字大小
  if (logoRef.value) {
    const baseFontSize = 20 // 原始字体大小
    const newFontSize = baseFontSize * scale.value
    logoRef.value.style.fontSize = `${Math.max(newFontSize, 12)}px` // 最小12px
  }

  if (scale.value > 1) {
    wrapper.style.overflow = 'auto'
  } else {
    wrapper.style.overflow = 'hidden'
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
  isMobile.value = window.innerWidth < 768
  calculateScale()
}

onMounted(async () => {
  // 加载数据
  try {
    await Promise.all([
      dataStore.fetchGroups(),
      dataStore.fetchUsers()
    ])
    console.log('Layout 数据加载完成')
  } catch (error) {
    console.error('Layout 数据加载失败:', error)
  }
  
  // 初始化缩放计算
  nextTick(() => {
    calculateScale()
  })
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
})

const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  console.log('切换tab:', tab.props.name)
  if (tab.props.name === 'member') {
    router.push('/')
  } else if (tab.props.name === 'group') {
    router.push('/group-management')
  }
}

watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'GroupManagement') {
      activeTab.value = 'group'
    } else {
      activeTab.value = 'member'
    }
  }
)
</script>