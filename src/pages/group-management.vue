<template>
  <div class="group-management-container">
    <div class="action-bar">
      <div class="search-group">
        <label for="searchSelect" class="search-label">分组:</label>
        <select id="searchSelect" class="search-select" v-model="selectedGroup"  @change="debouncedHandleSearch">
          <option value="">全部分组</option>
          <option v-for="group in groupOptions" :key="group.id" :value="group.name">{{ group.name }}</option>
        </select>
      </div>

      <button id="searchBtn" class="action-btn search-btn" @click="handleSearch">
        搜索
      </button>

      <button class="add-member-btn" @click="openGroupModal('add')">
        添加分组
      </button>
    </div>

    <el-table v-loading="loading" element-loading-text="Loading..." element-loading-svg-view-box="-10, -10, 50, 50"
      element-loading-background="transparent" :data="filteredTableData" :row-key="getRowKey"
      style="width: 100%" max-height="650px" class="custom-table" :fit="true" highlight-current-row>
      <el-table-column prop="id" label="ID" width="180" align="center" />
      <el-table-column prop="name" label="分组名称" min-width="150" align="center" />
      <el-table-column prop="description" label="描述" min-width="200" align="center" />
      <el-table-column prop="memberCount" label="成员数量" min-width="120" align="center" />
      <el-table-column prop="createdTime" label="创建时间" min-width="180" align="center">
        <template #default="scope">
          {{ formatTableDate(scope.row.createdTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" class="edit-button" @click="openGroupModal('edit', scope.row)">
            编辑
          </el-button>
          <el-button type="danger" class="delete-button" @click.prevent="deleteRow(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分组管理对话框 -->
    <div v-show="dialogVisible" class="custom-dialog">
      <!-- 遮罩层 -->
      <div class="dialog-overlay" @click.self="dialogVisible = false"></div>

      <!-- 内容区 -->
      <div class="dialog-content">
        <!-- 标题栏 -->
        <div class="dialog-header">
          <div class="dialog-title"></div>
          <img src="../assets/images/ic_title_performance.png" alt="" class="title-icon" />
          <h3>{{ dialogTitle }}</h3>
          <button class="close-btn" @click="dialogVisible = false">&times;</button>
        </div>

        <div class="dialog-divider"></div>

        <!-- 表单 -->
        <form class="custom-form" @submit.prevent>
          <div class="form-row">
            <div class="form-group">
              <label for="groupName">分组名称:</label>
              <input id="groupName" v-model="currentGroup.name" type="text" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="groupDescription">分组描述:</label>
              <textarea id="groupDescription" v-model="currentGroup.description" class="form-textarea" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="createdTime">创建时间:</label>
              <input id="createdTime" v-model="currentGroup.createdTime" type="datetime-local" class="form-input"
                step="1" />
            </div>
          </div>
        </form>

        <!-- 底部按钮 -->
        <div class="dialog-footer">
          <button type="button" class="save-btn" @click="saveGroup">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '../styles/tbstyles.css'
import '../style.css'
import { ref, computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import { useDataStore } from '../stores/dataStore'
import { debounce } from 'lodash'
// 使用数据存储
const dataStore = useDataStore()

const loading = ref(true)

// 响应式数据定义
const dialogVisible = ref(false)
const dialogMode = ref('add')

// 搜索相关
const selectedGroup = ref('')
const searchGroup = ref('')
const debouncedHandleSearch = debounce(() => {
  handleSearch()
}, 300)
// 分组下拉选项
const groupOptions = computed(() => {
  return dataStore.groups.map(item => ({
    id: item.id,
    name: item.name
  }))
})

// 表格数据 - 从store获取
const tableData = computed(() => dataStore.groups)

// 类型定义
const currentGroup = ref({
  id: 0,
  name: '',
  description: '',
  memberCount: 0,
  createdTime: ''
})

// 计算属性
const dialogTitle = computed(() => {
  return dialogMode.value === 'add' ? '添加分组' : '编辑分组'
})

const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    const groupMatch = !searchGroup.value || item.name.includes(searchGroup.value)
    return groupMatch
  })
})

const getRowKey = (row) => {
  return row.id
}

onMounted(() => {
  console.log('GroupManagement mounted, 开始加载数据')
  // 获取分组数据和用户数据
  Promise.all([
    dataStore.fetchGroups(),
    dataStore.fetchUsers()
  ]).then(() => {
    console.log('GroupManagement 数据加载完成:', {
      groups: dataStore.groups,
      users: dataStore.users
    })
    // 直接关闭loading，不设置延迟
    loading.value = false
    console.log('GroupManagement loading状态已关闭')
  }).catch(error => {
    console.error('GroupManagement 数据加载失败:', error)
    loading.value = false
  })
})

// 监听分组数据变化
watch(() => dataStore.groups, (newGroups) => {
  console.log('GroupManagement 分组数据更新:', newGroups)
})

// 监听用户数据变化
watch(() => dataStore.users, (newUsers) => {
  console.log('GroupManagement 用户数据更新:', newUsers)
})

// 添加日期格式化函数
const formatTableDate = (dateString) => {
  if (!dateString) return '';
  
  // 检查是否为标准格式
  if (dateString.includes('T') && !dateString.includes('年')) {
    const date = dayjs(dateString);
    if (date.isValid()) {
      return date.format('YYYY年MM月DD日 HH:mm:ss');
    }
  }
  
  // 如果已经是中文格式或日期无效，直接返回
  return dateString;
}

const openGroupModal = (mode, row = null) => {
  dialogMode.value = mode;

  if (mode === 'edit' && row) {
    // 格式化日期以适配 datetime-local 输入框
    let formattedDate = '';
    if (row && row.createdTime) {
      if (row.createdTime.includes('年') && row.createdTime.includes('月') && row.createdTime.includes('日')) {
        // 如果是中文格式，转换为标准格式
        const date = dayjs(row.createdTime, 'YYYY年MM月DD日 HH:mm:ss');
        formattedDate = date.isValid() ? date.format('YYYY-MM-DDTHH:mm') : dayjs().format('YYYY-MM-DDTHH:mm');
      } else {
        // 如果已经是标准格式，确保格式正确
        const date = dayjs(row.createdTime);
        formattedDate = date.isValid() ? date.format('YYYY-MM-DDTHH:mm') : dayjs().format('YYYY-MM-DDTHH:mm');
      }
    } else {
      // 如果没有日期，使用当前时间
      formattedDate = dayjs().format('YYYY-MM-DDTHH:mm');
    }

    currentGroup.value = {
      id: row.id,
      name: row.name || '',
      description: row.description || '',
      memberCount: row.memberCount || 0,
      createdTime: formattedDate
    }
  } else {
    // 添加模式
    const newId = Date.now()
    currentGroup.value = {
      id: newId,
      name: '',
      description: '',
      memberCount: 0,
      createdTime: dayjs().format('YYYY-MM-DDTHH:mm') // 使用标准格式适配 datetime-local
    }
  }

  dialogVisible.value = true
}

const saveGroup = () => {
  // 格式化日期保存为中文格式
  if (currentGroup.value.createdTime) {
    const date = dayjs(currentGroup.value.createdTime);
    // 只有当日期有效时才转换格式
    if (date.isValid()) {
      currentGroup.value.createdTime = date.format('YYYY年MM月DD日 HH:mm:ss');
    } else {
      // 如果日期无效，使用当前时间
      currentGroup.value.createdTime = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
    }
  } else {
    // 如果没有日期，使用当前时间
    currentGroup.value.createdTime = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
  }

  if (dialogMode.value === 'add') {
    // 添加成员数量为0
    dataStore.addGroup({
      name: currentGroup.value.name,
      description: currentGroup.value.description,
      createdTime: currentGroup.value.createdTime
    });
  } else {
    dataStore.updateGroup({ ...currentGroup.value });
  }

  dialogVisible.value = false;
};

const deleteRow = (index) => {
  const actualIndex = tableData.value.findIndex(item => item.id === filteredTableData.value[index].id)
  if (actualIndex !== -1) {
    dataStore.deleteGroup(tableData.value[actualIndex].id)
  }
}

// 搜索相关
const handleSearch = () => {
  searchGroup.value = selectedGroup.value
  console.log('搜索条件:', { group: searchGroup.value })
}
</script>

<style scoped>
.group-management-container {
  padding: 0px;
}

::v-deep(.custom-table .el-table__header-wrapper .el-table__header th) {
  height: 50px;
  padding: 0;
}

::v-deep(.custom-table .el-table__body-wrapper .el-table__body td) {
  height: 68px;
  padding: 0;
}

::v-deep(.custom-table .el-table__header-wrapper .cell),
::v-deep(.custom-table .el-table__body-wrapper .cell) {
  line-height: normal;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.custom-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650px;
  height: 500px;
  background: #132332;
  border: 2px solid #15929D;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 48px;
  gap: 0.5em;
  justify-content: flex-start;
}

.dialog-title {
  display: flex;
  align-items: center;
  padding-left: 0;
}

.dialog-header h3 {
  color: #21D0D9;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.form-row {
  display: flex;
  gap: 26px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.form-group label {
  color: #ffffff;
  padding-right: 2px;
  font-size: 14px;
  white-space: nowrap;
  width: 70px;
  text-align: right;
}

.form-input,
.form-select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #455d73;
  background: #2C3B49;
  color: white;
  font-size: 14px;
  width: 200px;
  height: 32px;
  box-sizing: border-box;
  flex: 1;
}

.form-textarea {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #455d73;
  background: #2C3B49;
  color: white;
  font-size: 14px;
  width: 400px;
  height: 80px;
  box-sizing: border-box;
  resize: vertical;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #24acb7;
  outline: none;
  box-shadow: 0 0 0 1px #24acb7 inset;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.save-btn {
  background: #24ACB7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  width: 240px;
  height: 32px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover {
  background: #127a86;
}

.dialog-divider {
  border-top: 1px solid #147A85;
  margin: 0;
}
</style>