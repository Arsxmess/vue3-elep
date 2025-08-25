<template>
  <div class="home-container">
    <div class="action-bar">
      <div class="search-group">
        <label for="searchSelect" class="search-label">成员:</label>
        <select id="searchSelect" class="search-select" v-model="selectedName">
          <option value="">全部成员</option>
          <option v-for="user in users" :key="user.id" :value="user.name">{{ user.name }}</option>
        </select>
      </div>

      <div class="search-group">
        <label for="typeSelect" class="search-label1">类型:</label>
        <select id="typeSelect" class="search-select" v-model="selectedType">
          <option value="">全部类型</option>
          <option v-for="type in memberTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <button id="searchBtn" class="action-btn search-btn" @click="handleSearch">
        搜索
      </button>

      <button class="add-member-btn" @click="openUserModal('add')">
        添加成员
      </button>
    </div>
<div class="table-wrapper">
    <el-table v-loading="loading" element-loading-text="Loading..." element-loading-svg-view-box="-10, -10, 50, 50"
      element-loading-background="rgba(122, 122, 122, 0.8)" :data="paginatedTableData" :row-key="getRowKey"
      style="width: 100%" max-height="650px" class="custom-table" :fit="true" highlight-current-row>

      <el-table-column prop="id" label="ID" width="180" align="center" />
      <el-table-column prop="name" label="姓名" min-width="100" align="center" />
      <el-table-column prop="displayName" label="显示名称" min-width="120" align="center" />
      <!-- 修改人脸照片列 -->
      <el-table-column prop="facePicture" label="人脸照片" min-width="120" align="center">
        <!-- 在 el-table-column 中修改图片显示部分 -->
        <template #default="scope">
          <div class="avatar-container">
            <template v-if="scope.row.facePictures && scope.row.facePictures.length > 0">
              <!-- 将 el-popover 的 reference 插槽应用到这个 el-image 上 -->
              <el-popover placement="top" :width="320" trigger="click" ref="popoverRef"
                popper-class="image-preview-popover centered-popover" :hide-after="0" :show-arrow="false"
                popper-style="background-color: #2C3B49; border: 1px solid #15929D; border-radius: 8px;">
                <div class="preview-container">
                  <div class="preview-header">
                    <span class="total-text">共 <span class="number">{{ scope.row.facePictures.length }}</span>
                      张图片</span>

                  </div>
                  <div class="image-thumbnails">
                    <el-image v-for="(img, index) in scope.row.facePictures" :key="index" :src="img" fit="cover"
                      class="thumbnail-image" :preview-src-list="scope.row.facePictures" :initial-index="index"
                      placement="top" preview-teleported />
                  </div>
                </div>

                <template #reference>
                  <el-image :src="scope.row.facePictures[0]" fit="cover" style="width: 40px; height: 40px;"
                    :preview-src-list="[]" preview-teleported :zoom-rate="1.2" :max-scale="4" :min-scale="0.5"
                    hide-on-click-modal>
                    <template #error>
                      <div class="image-slot">
                        <el-icon>
                          <Picture />
                        </el-icon>
                      </div>
                    </template>
                  </el-image>
                </template>
              </el-popover>

              <span v-if="scope.row.facePictures.length > 1" class="avatar-count">
                +{{ scope.row.facePictures.length - 1 }}
              </span>
            </template>
            <span v-else>暂无照片</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="group" label="所属分组" min-width="150" align="center" />
      <el-table-column prop="memberType" label="成员类型" min-width="120" align="center" />
      <el-table-column prop="date" label="截止时间" min-width="150" align="center">
        <template #default="scope">
          {{ formatTableDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" class="edit-button" @click="openUserModal('edit', scope.row)">
            编辑
          </el-button>
          <el-button type="danger" class="delete-button" @click.prevent="deleteRow(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
        @current-change="handlePageChange" class="custom-pagination" popper-class="custom-pagination-dropdown" />
    </div>

    <!-- 1. 文件选择框:永远存在,不会被销毁 -->
    <input ref="fileInput" type="file" multiple accept="image/*" style="display:none" @change="handleFileSelect" />

    <!-- 2. 对话框主体:用 v-show 保证 DOM 常驻 -->
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
              <label for="userName">成员姓名:</label>
              <input id="userName" v-model="currentUser.name" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label for="displayName">显示名称:</label>
              <input id="displayName" v-model="currentUser.displayName" type="text" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="userId">成员ID:</label>
              <input id="userId" v-model="currentUser.id" type="text" class="form-input" />
            </div>

            <div class="form-group">
              <label for="userGroup">所属分组:</label>
              <select id="userGroup" v-model="currentUser.group" class="form-select">
                <option v-for="group in groups" :key="group" :value="group">{{ group }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="memberType">成员类型:</label>
              <select id="memberType" v-model="currentUser.memberType" class="form-select">
                <option v-for="type in memberTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="expireDate">截止时间:</label>
              <input id="expireDate" v-model="currentUser.date" type="datetime-local" class="form-input" step="1" />
            </div>
          </div>

          <!-- 人脸照片上传 -->
          <div class="form-group full-width">
            <label>人脸照片:</label>
            <div class="upload-container">
              <!-- 上传按钮:仅触发隐藏 input 的 click -->
              <div class="upload-box" @click="triggerFileInput">
                <div class="plus-icon">+</div>
              </div>

              <!-- 已选图片预览 -->
              <div class="file-list" :class="{ 'scrollable': fileList.length > 3 }">
                <div v-for="(file, index) in fileList" :key="index" class="file-item">
                  <el-image :ref="(el) => setImageRef(el, index)" :src="file.url" fit="cover" class="file-preview"
                    :preview-src-list="imageViewerVisible ? fileList.map(f => f.url).filter(Boolean) as string[] : []"
                    :initial-index="currentPreviewIndex" :hide-on-click-modal="true" preview-teleported
                    @click="showImageViewer(index)">
                    <template #placeholder>
                      <div class="image-slot-loading">
                        <el-icon>
                          <Loading />
                        </el-icon>
                      </div>
                    </template>
                    <template #error>
                      <div class="image-slot-error">
                        <el-icon>
                          <Picture />
                        </el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="file-preview-container">
                    <!-- 添加查看大图按钮 -->
                    <button type="button" class="hover-btn" @click="file.url && handlePreviewFromUpload(file.url)">
                      <el-icon>
                        <ZoomIn />
                      </el-icon>查看大图
                    </button>
                    <button type="button" class="hover-btn" @click="triggerReplaceFileInput(index)">
                      <el-icon>
                        <RefreshRight />
                      </el-icon>重新上传
                    </button>
                  </div>
                  <button type="button" class="remove-btn" @click="removeFile(index)">&times;</button>
                  <input :ref="(el) => setReplaceFileInputRef(el as Element, index)" type="file" accept="image/*"
                    class="replace-file-input" @change="(event) => handleReplaceFileSelect(event, index)" />
                </div>
              </div>
            </div>
          </div>

          <div class="form-hint">
            请选择正脸照片,面部无遮挡,光线充足。<br>
            建议上传 jpg/jpeg/png 格式图片,分辨率大于 200×200,文件大小小于 2 MB。
          </div>
        </form>

        <!-- 底部按钮 -->
        <div class="dialog-footer">
          <button type="button" class="save-btn" @click="saveUser">保存</button>
        </div>
      </div>
    </div>

  </div>

</template>

<script setup lang="ts">
import '../style.css'
import '../styles/tbstyles.css';
import '../styles/el-dialog.css';
import '../styles/pagination.css';

import { ref, computed, onMounted, watch, onActivated,} from 'vue'

import { Picture, ZoomIn, RefreshRight, Loading } from '@element-plus/icons-vue'
import { UploadUserFile } from 'element-plus'
import { useDataStore } from '../stores/dataStore'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 中文
import relativeTime from 'dayjs/plugin/relativeTime'


import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

// 加载必要插件
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const dataStore = useDataStore()
const loading = ref(true)
const imageRefs = ref<any[]>([])
const imageViewerVisible = ref(false)
const currentPreviewIndex = ref(0)
// 设置图片引用
const setImageRef = (el: any, index: number) => {
  if (el) {
    imageRefs.value[index] = el
  }
}
// 显示图片查看器
const showImageViewer = (index: number) => {
  currentPreviewIndex.value = index
  imageViewerVisible.value = true
}

onMounted(() => {
  console.log('Home.vue mounted, 开始加载数据')
  // 获取用户和分组数据
  Promise.all([
    dataStore.fetchUsers(),
    dataStore.fetchGroups()
  ]).then(() => {
    console.log('Home.vue 数据加载完成:', {
      users: dataStore.users,
      groups: dataStore.groups
    })
    // 确保数据加载完成后再隐藏loading
    setTimeout(() => {
      loading.value = false
      console.log('Home.vue loading状态已关闭')
    }, 100)
  }).catch(error => {
    console.error('Home.vue 数据加载失败:', error)
    loading.value = false
  })
})

// 添加activated钩子，确保每次激活组件时都检查数据
onActivated(() => {
  console.log('Home.vue activated, 检查数据状态')
  // 如果数据为空且未在加载中，则重新加载数据
  if ((!dataStore.users || dataStore.users.length === 0 || 
       !dataStore.groups || dataStore.groups.length === 0) && !loading.value) {
    console.log('Home.vue activated时发现数据为空，重新加载')
    loading.value = true
    Promise.all([
      dataStore.fetchUsers(),
      dataStore.fetchGroups()
    ]).then(() => {
      console.log('Home.vue activated时数据加载完成:', {
        users: dataStore.users,
        groups: dataStore.groups
      })
      setTimeout(() => {
        loading.value = false
        console.log('Home.vue activated时loading状态已关闭')
      }, 500)
    }).catch(error => {
      console.error('Home.vue activated时数据加载失败:', error)
      loading.value = false
    })
  }
})

// 添加watch来监听数据变化
watch(
  () => dataStore.users,
  (newUsers) => {
    console.log('用户数据发生变化:', newUsers)
    if (newUsers.length > 0 && loading.value) {
      loading.value = false
    }
  },
  { immediate: true }
)

watch(
  () => dataStore.groups,
  (newGroups) => {
    console.log('分组数据发生变化:', newGroups)
    if (newGroups.length > 0 && loading.value) {
      loading.value = false
    }
  },
  { immediate: true }
)

const fileList = ref<UploadUserFile[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const fileInput = ref<HTMLInputElement | null>(null)

// 搜索相关
const selectedName = ref('')
const selectedType = ref('')
const searchName = ref('')
const searchType = ref('')

// 用户数据下拉框查询
const users = computed(() => {
  // 从 store.users 中提取唯一的用户信息
  const uniqueUsers = dataStore.users.map(item => ({
    id: item.id,
    name: item.name
  }))

  // 去重,根据 name 字段
  const uniqueUserMap = new Map()
  uniqueUsers.forEach(user => {
    if (!uniqueUserMap.has(user.name)) {
      uniqueUserMap.set(user.name, user)
    }
  })

  return Array.from(uniqueUserMap.values())
})

// 成员类型下拉框查询
const memberTypes = computed(() => {
  return dataStore.memberTypes
})

// 分组下拉框查询 - 从store获取
const groups = computed(() => {
  return dataStore.groupNames
})

// 表格数据 - 从store获取
const tableData = computed(() => dataStore.users)

// 类型定义
interface UserItem {
  id: number
  originalId?: number
  name: string
  displayName: string
  facePictures: string[]
  group: string
  memberType: string
  date: string
}

const currentUser = ref<UserItem>({
  id: 0,
  name: '',
  displayName: '',
  facePictures: [],
  group: '',
  memberType: '',
  date: ''
})

// 计算属性
const dialogTitle = computed(() => {
  return dialogMode.value === 'add' ? '添加成员' : '成员信息'
})

const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    const nameMatch = !searchName.value || item.name.includes(searchName.value)
    const typeMatch = !searchType.value || item.memberType === searchType.value
    return nameMatch && typeMatch
  })
})

const getRowKey = (row: UserItem) => {
  return row.id
}

// 统一日期格式化函数
const formatTableDate = (dateString: string | null | undefined): string => {
  if (!dateString) return ''
  
  try {
    let date
    // 处理多种日期格式
    if (dateString.includes('年')) {
      date = dayjs(dateString, 'YYYY年MM月DD日 HH:mm:ss')
    } else if (dateString.includes('T')) {
      date = dayjs(dateString)
    } else {
      
      date = dayjs(dateString)
      if (!date.isValid()) {
        // 如果无效，尝试常见格式
        date = dayjs(dateString, ['YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss'])
      }
    }
    
    return date.isValid() 
      ? date.format('YYYY年MM月DD日 HH:mm:ss') 
      : dayjs().format('YYYY年MM月DD日 HH:mm:ss')
  } catch (error) {
    console.error('日期格式化错误:', error)
    return dayjs().format('YYYY年MM月DD日 HH:mm:ss')
  }
}

const openUserModal = (mode: 'add' | 'edit', row: UserItem | null = null) => {
  dialogMode.value = mode
  
  // 统一处理日期逻辑，确保输出ISO格式适配datetime-local
  const getValidDateForInput = (rawDate?: string | null) => {
    if (!rawDate) return dayjs().format('YYYY-MM-DDTHH:mm')
    
    try {
      let date
      // 检查是否为中文格式
      if (rawDate.includes('年') && 
          rawDate.includes('月') && 
          rawDate.includes('日')) {
        date = dayjs(rawDate, 'YYYY年MM月DD日 HH:mm:ss')
      } else {
        // ISO格式或其他标准格式
        date = dayjs(rawDate)
      }
      
      // 验证日期是否有效
      if (!date.isValid()) {
        // 尝试其他格式解析
        date = dayjs(rawDate, ['YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss'])
      }
      
      // 确保返回ISO格式适配datetime-local
      return date.isValid() 
        ? date.format('YYYY-MM-DDTHH:mm') 
        : dayjs().format('YYYY-MM-DDTHH:mm')
    } catch (error) {
      console.error('日期输入处理错误:', error)
      return dayjs().format('YYYY-MM-DDTHH:mm')
    }
  }
  
  if (mode === 'edit' && row) {
    currentUser.value = {
      id: Number(row.id) || 0,
      originalId: Number(row.id) || 0,
      name: row.name || '',
      displayName: row.displayName || '',
      facePictures: Array.isArray(row.facePictures) ? [...row.facePictures] : [],
      group: row.group || '',
      memberType: row.memberType || '',
      date: getValidDateForInput(row.date)  // 仅在编辑时临时转换为ISO格式
    };

    fileList.value = currentUser.value.facePictures.map((url, index) => ({
      uid: Date.now() + index,
      name: `avatar${index + 1}.jpg`,
      url,
      status: 'success'
    }));
  } else {
    currentUser.value = {
      id: Date.now(),
      name: '',
      displayName: '',
      facePictures: [],
      group: '',
      memberType: '',
      date: dayjs().format('YYYY年MM月DD日 HH:mm:ss')  // 添加时使用ISO格式
    };
    fileList.value = [];
  }

  dialogVisible.value = true;
  setTimeout(() => fileInput.value && (fileInput.value.value = ''), 100);
};

// 同样修改 saveUser 函数中的日期处理逻辑
const saveUser = () => {
  currentUser.value.facePictures = fileList.value
    .map(file => file.url)
    .filter((url): url is string => !!url);

  try {
    // 保存时转换为中文格式
    if (currentUser.value.date) {
      let date
      // 检查日期格式
      if (currentUser.value.date.includes('年')) {
        // 中文格式
        date = dayjs(currentUser.value.date, 'YYYY年MM月DD日 HH:mm:ss')
      } else if (currentUser.value.date.includes('T')) {
        // ISO格式
        date = dayjs(currentUser.value.date)
      } else {
        // 其他标准格式
        date = dayjs(currentUser.value.date)
        if (!date.isValid()) {
          // 尝试常见格式解析
          date = dayjs(currentUser.value.date, ['YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss'])
        }
      }
      
      // 验证日期有效性
      if (!date.isValid()) {
        throw new Error('Invalid date format')
      }
      
      currentUser.value.date = date.format('YYYY年MM月DD日 HH:mm:ss')
    } else {
      // 如果没有日期，使用当前时间
      currentUser.value.date = dayjs().format('YYYY年MM月DD日 HH:mm:ss')
    }
  } catch (error) {
    console.error('日期保存错误:', error)
    currentUser.value.date = dayjs().format('YYYY年MM月DD日 HH:mm:ss')
  }

  dialogMode.value === 'add' 
    ? dataStore.addUser({ ...currentUser.value })
    : dataStore.updateUser({ ...currentUser.value });

  dialogVisible.value = false;
};
const deleteRow = (index: number) => {
  const actualIndex = tableData.value.findIndex(item => item.id === filteredTableData.value[index].id)
  if (actualIndex !== -1) {
    dataStore.deleteUser(tableData.value[actualIndex].id)
  }
}

// 文件处理相关
const triggerFileInput = () => {
  fileInput.value?.click()
}
// 添加 replaceFileInputs 引用
const replaceFileInputs = ref<HTMLInputElement[]>([])
const currentReplaceIndex = ref<number | null>(null)



// 触发替换文件输入框
const triggerReplaceFileInput = (index: number) => {
  currentReplaceIndex.value = index
  replaceFileInputs.value[index]?.click()
}
const setReplaceFileInputRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLInputElement) {
    replaceFileInputs.value[index] = el;
  }
};

const removeFile = (index: number) => {
  const removedFile = fileList.value.splice(index, 1)[0]

  if (removedFile.url && removedFile.url.startsWith('blob:') && removedFile.raw) {
    URL.revokeObjectURL(removedFile.url)
  }
}

// 上传人脸
const handleFileSelect = (event: Event) => {
  try {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return

    const files = Array.from(input.files)
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      fileList.value.push({
        uid: Date.now() + Math.random(),
        name: file.name,
        url: url,
        raw: file,
        status: 'ready'
      } as UploadUserFile)
    })

    setTimeout(() => {
      if (input.value) {
        input.value = ''
      }
    }, 100)
  } catch (error) {
    console.error('文件上传出错:', error)
  }
}

// 处理替换文件选择
const handleReplaceFileSelect = (event: Event, index: number) => {
  try {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return

    const file = input.files[0]
    const url = URL.createObjectURL(file)

    // 清理旧的 URL 对象
    if (fileList.value[index].url && fileList.value[index].url!.startsWith('blob:')) {
      URL.revokeObjectURL(fileList.value[index].url!)
    }

    // 替换文件列表中的文件
    fileList.value[index] = {
      uid: Date.now() + Math.random(),
      name: file.name,
      url: url,
      raw: file,
      status: 'ready'
    } as UploadUserFile

    // 重置输入框
    setTimeout(() => {
      if (input.value) {
        input.value = ''
      }
    }, 100)
  } catch (error) {
    console.error('文件替换出错:', error)
  }
}



const handlePreviewFromUpload = (url: string) => {
  if (url) {
    const img = new Image()
    img.src = url
    img.style.maxWidth = '100%'
    img.style.maxHeight = '100%'
    img.style.cursor = 'zoom-in'

    const viewer = document.createElement('div')
    viewer.style.position = 'fixed'
    viewer.style.top = '0'
    viewer.style.left = '0'
    viewer.style.width = '100vw'
    viewer.style.height = '100vh'
    viewer.style.backgroundColor = 'rgba(0,0,0,0.8)'
    viewer.style.display = 'flex'
    viewer.style.justifyContent = 'center'
    viewer.style.alignItems = 'center'
    viewer.style.zIndex = '9999'
    viewer.appendChild(img)
    viewer.addEventListener('click', () => {
      document.body.removeChild(viewer)
    })
    document.body.appendChild(viewer)
  }
}




// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => filteredTableData.value.length)

// 计算当前页数据
const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTableData.value.slice(start, end)
})

// 分页改变处理
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
}

// 搜索时重置到第一页
const handleSearch = () => {
  searchName.value = selectedName.value
  searchType.value = selectedType.value
  currentPage.value = 1 // 搜索时重置到第一页
  console.log('搜索条件:', { name: searchName.value, type: searchType.value })
}

</script>

<style scoped>
/* .home-container 容器样式 */
.home-container {
  padding: 0px;
}

.table-wrapper {
  margin: 0 16px;
  background-color: #0B1926;
}

/* 添加到现有样式中 */
.preview-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-dialog {
  background-color: #2C3B49;
  border: 1px solid #24ACB7;
  border-radius: 8px;
  width: 324px;
  height: 140px;
}



/* 添加头像容器样式 */
.avatar-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.avatar-count {
  background-color: #455d73;
  color: #16c1ca;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-left: 12px;
}

.avatar-uploader .avatar {
  width: 135px;
  height: 135px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c9399;
  width: 135px;
  height: 135px;
  text-align: center;
}

/* 图片占位符样式 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}

.image-slot .el-icon {
  font-size: 14px;
}

/* 表格中图片的默认样式 */
.el-image {
  border: none;
  cursor: pointer;
  height: 64px;
}

/* 预览容器样式 */
.preview-container {
  background-color: #2C3B49;
  width: auto;
  height: auto;
  box-sizing: border-box;
  overflow: hidden;
}

/* 预览头部样式 */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: auto;
  background-color: #2C3B49;
}

/* 缩略图容器 */
.image-thumbnails {
  position: relative;
  margin: 24px 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  height: calc(100% - 40px);
  /* 增加容器宽度，为每行4张图片提供更多空间 */
  width: calc(100% - 32px);
  overflow-y: auto;
  box-sizing: border-box;
}

.image-preview-popover {
  background: transparent !important;
}

.thumbnail-image {
  flex: 0 0 calc((100% - 36px) / 4);
  width: 64px;
  height: 64px;
  border: none;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
}

.total-text {
  color: white;
  font-size: 14px;
  padding-left: 16px;
}

.number {
  color: #00f2fe;
  font-weight: bold;
}

.close-button {
  color: white;
  background: transparent !important;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  color: white !important;
  background: transparent !important;
}

/* .home-container 容器样式 */
.home-container {
  padding: 0px;
}

/* .action-bar 操作栏样式 */
.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  padding: 0px 0px;
  border-radius: 6px;
  margin: 0px 16px 16px 0px;
}

/* .search-group 搜索组样式 */
.search-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* .search-label 搜索标签样式 */
.search-label {
  color: #DEDFDF;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  /* 不换行 */
  margin: 15px 3px 16px 16px;
  text-align: center;
}

/* .search-label1 搜索标签样式 */
.search-label1 {
  color: #DEDFDF;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  margin: 0px 3px 0px 0px;
  text-align: center;
}

/* .search-select 下拉选择框样式 */
.search-select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 0px solid rgba(0, 242, 254, 0.3);
  background: #2C3B49;
  color: #e0f7ff;
  font-size: 13px;
  min-width: 160px;
  outline: none;
  transition: all 0.3s ease;
  height: 32px;
}

/* .search-select 获得焦点时样式 */
.search-select:focus {
  border-color: #00f2fe;
  box-shadow: 0 0 8px rgba(0, 242, 254, 0.5);
}

/* .search-select 下拉选项样式 */
.search-select option {
  background: #0a1428;
  color: #e0f7ff;
}

/* .action-btn 和 .add-member-btn 按钮基础样式 */
.action-btn,
.add-member-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  /* 隐藏溢出内容 */
  height: 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .action-btn 搜索按钮样式 */
.action-btn {
  background: #24ACB7;
  color: white;
}

/* .add-member-btn 添加成员按钮样式 */
.add-member-btn {
  background: #24ACB7;
  color: #DFF0F2;
  margin-left: auto;
  /* 左边距自动（推到右边） */
}

/* .action-btn 和 .add-member-btn 悬停效果 */
.action-btn:hover,
.add-member-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.4);
}

/* .action-btn 和 .add-member-btn 按下效果 */
.action-btn:active,
.add-member-btn:active {
  transform: translateY(0);
  /* 恢复原位 */
}

/* .action-btn 和 .add-member-btn 光效动画 */
.action-btn::before,
.add-member-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

/* .action-btn 和 .add-member-btn 悬停时光效动画 */
.action-btn:hover::before,
.add-member-btn:hover::before {
  left: 100%;
}

.edit-button {
  color: white !important;
  background-color: #24ACB7 !important;
  font-weight: bold;
  text-shadow: 0 0 4px rgba(0, 242, 254, 0.5);
  transition: all 0.3s ease;
  width: 56px;
  height: 32px;
  border-radius: 4px;
  border: none;
  padding: 0;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.edit-button:hover {
  color: white !important;
  background-color: #1e99a5 !important;
  transform: scale(1.05);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}

.delete-button {
  color: white !important;
  background-color: #B5335A !important;
  font-weight: bold;
  text-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
  transition: all 0.3s ease;
  margin-left: 12px;
  width: 56px;
  height: 32px;
  border-radius: 4px;
  border: none;
  padding: 0;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.delete-button:hover {
  color: white !important;
  background-color: #a1284f !important;
  transform: scale(1.05);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}

/* 媒体查询:小屏幕设备 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    /* 垂直排列 */
    align-items: stretch;
    /* 拉伸对齐 */
  }

  .search-group {
    justify-content: space-between;
    /* 两端对齐 */
  }

  .add-member-btn {
    margin-left: 0;
    align-self: flex-end;
    /* 右对齐 */
  }

  /* 移动端适配表格左右间距 */
  .custom-table {
    margin: 32px 16px 0 16px !important;
  }
}

/* 自定义表格样式 */
.custom-table {
  --el-table-bg-color: #0B1926;
  --el-table-tr-bg-color: #0B1926;
  --el-table-row-height: 70px;
  --el-table-header-bg-color: #222D38;
  --el-table-header-height: 50px;
  --el-table-header-text-color: #DEDFDF;
  --el-table-text-color: #DEDFDFCC;
  --el-table-text-font-size: 14px;
  --el-table-border-color: #2C3E50;
  --el-table-current-row-bg-color: #0C2A37;
  --el-table-row-hover-bg-color: #0C2A37;
}

/* 控制表头高度 */
::v-deep(.custom-table .el-table__header-wrapper .el-table__header th) {
  height: 50px;
  padding: 0;
}

/* 控制表格行高度 */
::v-deep(.custom-table .el-table__body-wrapper .el-table__body td) {
  height: 68px;
  padding: 0;
}

/* 确保内容垂直居中 */
::v-deep(.custom-table .el-table__header-wrapper .cell),
::v-deep(.custom-table .el-table__body-wrapper .cell) {
  line-height: normal;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 添加头像容器样式 */
.avatar-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.avatar-count {
  background-color: #455d73;
  color: #16c1ca;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-left: 12px;
}

.avatar-uploader .avatar {
  width: 135px;
  height: 135px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c9399;
  width: 135px;
  height: 135px;
  text-align: center;
}

/* 图片占位符样式 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}

.image-slot .el-icon {
  font-size: 14px;
}

/* 表格中图片的默认样式 */
.el-image {
  border: none;
  cursor: pointer;
  height: 64px;
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
  height: 730px;
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
  /* 从左侧开始排列 */
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
  /* 将关闭按钮推到最右侧 */
}

.form-row {
  display: flex;
  gap: 26px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
  margin-bottom: 15px;
}

.form-group label {
  color: #ffffff;
  padding-right: 12px;

  font-size: 14px;
  white-space: nowrap;
  /* 防止标签换行 */
  width: 70px;
  /* 给标签一个固定宽度,确保对齐 */
  text-align: right;
  /* 文字右对齐,与输入框对齐更好看 */
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
  /* 让输入框占据剩余空间 */
}

.form-input:focus,
.form-select:focus {
  border-color: #24acb7;
  outline: none;
  box-shadow: 0 0 0 1px #24acb7 inset;
}

.form-group {
  display: flex;
  align-items: flex-start; /* 改为flex-start，使标签对齐到顶部 */
  margin-bottom: 15px;
}

/* 为人脸照片标签添加特殊样式 */
.form-group.full-width label {
  margin-top: 10px; /* 微调标签的垂直位置 */
}

/* 调整上传容器样式 */
.upload-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-start; /* 顶部对齐 */
  flex: 1;
}

/* 确保上传框始终在第一行 */
.upload-box {
  position: relative;
  width: 135px;
  height: 135px;
  border: 1px dashed #455d73;
  border-radius: 4px;
  background: #2C3B49;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0; /* 防止上传框被压缩 */
}

/* 确保文件列表项不会影响布局 */
.file-item {
  position: relative;
  width: 135px;
  height: 135px;
  flex-shrink: 0; /* 防止文件项被压缩 */
}

.upload-box:hover {
  border-color: #24acb7;
  background-color: #3d4f61;
}

.plus-icon {
  font-size: 24px;
  color: #a0a0a0;
  font-weight: bold;
}

.upload-box:hover .plus-icon {
  color: #24acb7;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-content: flex-start;
}

/* 添加滚动样式 */
.file-list.scrollable {
  max-height: 135px;
  overflow-y: auto;
  flex-wrap: wrap;
  align-content: flex-start;
  padding-right: 10px;
}

/* 自定义滚动条样式 */
.file-list.scrollable::-webkit-scrollbar {
  width: 8px;
}

.file-list.scrollable::-webkit-scrollbar-track {
  background: #2C3B49;
  border-radius: 4px;
}

.file-list.scrollable::-webkit-scrollbar-thumb {
  background: #24ACB7;
  border-radius: 4px;
}

.file-list.scrollable::-webkit-scrollbar-thumb:hover {
  background: #1e99a5;
}

/* 确保滚动时子元素正常排列 */
.file-list.scrollable .file-item {
  flex: 0 0 auto;
}


.file-item {
  position: relative;
  width: 135px;
  height: 135px;

}

.file-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

/* 悬停时的整体效果 */
.file-preview:hover {
  box-shadow: 0 0 0 2px #646464 inset;
  filter: brightness(0.7);
}

/* 为file-item添加hover时的渐变效果 */
.file-item:hover .file-preview::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
  border-radius: 4px;
  pointer-events: none;
  z-index: 1;
}

/* 按钮容器 */
.file-preview-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 5px;
  display: none;
  flex-direction: column;
  gap: 5px;
  z-index: 5;
  align-items: center;
}

.file-item .file-preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.file-item:hover .file-preview-container {
  display: flex;
}

.file-item:hover .file-preview {
  box-shadow: 0 0 0 2px #646464 inset;
  filter: brightness(0.7);
}

.hover-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 12px;
  cursor: pointer;
  padding: 3px 10px;
  text-align: center;
  width: auto;
  transition: all 0.3s ease;
  border-radius: 2px;
  min-width: 60px;
  z-index: 6;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.hover-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.hover-btn .el-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #B5335A;
  color: white;
  border: 1px solid #132332;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.remove-btn:hover {
  background: #a1284f;
}

/* 隐藏的文件输入框,用于替换图片 */
.replace-file-input {
  display: none;
}

.form-hint {
  color: #DEDFDF;
  font-size: 12px;
  line-height: 1.5;
  position: absolute;
  bottom: 96px; /* 64px(距离按钮) + 32px(按钮高度) = 96px */
  left: 40px; /* 与表单左边距一致 */
  right: 40px; /* 与表单右边距一致 */
}

.dialog-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: center;
  padding: 32px 0;
  background-color: #132332;
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

.custom-form {
  padding: 32px 40px;
}

/* 针对.search-select下拉框的滚动条样式 */
.search-select {
  /* 基本样式 */
  background-color: #0B1926;
  color: #DEDFDF;
  border: 1px solid #2C3E50;
  border-radius: 4px;
  padding: 8px;
}

/* Webkit浏览器滚动条样式 */
.search-select::-webkit-scrollbar {
  width: 8px;
  background-color: #0B1926; /* 滚动条轨道颜色 */
}

.search-select::-webkit-scrollbar-thumb {
  background-color: #2C3E50; /* 滚动条滑块颜色 */
  border-radius: 4px;
}

.search-select::-webkit-scrollbar-thumb:hover {
  background-color: #24ACB7; /* 悬停时滑块颜色 */
}
</style>