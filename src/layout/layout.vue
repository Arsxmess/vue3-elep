<template>
  <!-- 背景层 -->
  <div class="background-container"></div>

  <!-- 内容层 -->
  <div class="layout-layer">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="logo-container">
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Home from '../components/Home.vue'
import type { TabsPaneContext } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useDataStore } from '../stores/dataStore'

const route = useRoute()
const activeTab = ref(route.name === 'GroupManagement' ? 'group' : 'member')
const router = useRouter()
const dataStore = useDataStore()

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
<style scoped>
/* 螺母样式 */
.logo {
  padding-left: 0.5em;
}

/* 自定义分割线 */
.custom-divider {
  height: 1px;
  background: linear-gradient(to right, #00f2fe, #00f2fe);
  width: 100%;
  margin: 0;
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

/* 内容主容器,四周留白 */
.layout-layer {
  position: relative;
  margin: 24px;
  min-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #132332;
  box-shadow:
    inset 0 0 5px rgba(0, 242, 254, 0.5),
    inset 0 0 5px rgba(0, 242, 254, 0.3);
  overflow: visible;
  border: #558B97 1px solid;
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
</style>