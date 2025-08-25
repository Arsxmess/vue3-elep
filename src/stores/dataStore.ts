// src/stores/dataStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

// 定义分组类型
interface GroupItem {
  id: number
  name: string
  description: string
  memberCount: number
  createdTime: string
}

// 定义用户类型
interface UserItem {
  id: number
  name: string
  displayName: string
  facePictures: string[]
  group: string
  memberType: string
  date: string
}

export const useDataStore = defineStore('data', () => {
  // 分组数据
  const groups = ref<GroupItem[]>([])
  
  // 用户数据
  const users = ref<UserItem[]>([])

  // 添加一个强制刷新标记
  const refreshFlag = ref(0)

  // 成员类型 - 从用户数据中提取
  const memberTypes = computed(() => {
    const types = users.value.map(user => user.memberType)
    return Array.from(new Set(types)).filter(type => type !== '')
  })

  // 分组名称 - 从分组数据中提取
  const groupNames = computed(() => {
    return groups.value.map(group => group.name)
  })
  
  // 添加一个计算属性来动态计算每个分组的成员数量
  const groupMemberCounts = computed(() => {
    const counts: Record<string, number> = {};
    users.value.forEach(user => {
      if (user.group) {
        counts[user.group] = (counts[user.group] || 0) + 1;
      }
    });
    console.log('计算分组成员数量:', counts);
    return counts;
  });
  
  // 计算属性：带实际成员数量的分组数据
  const groupsWithMemberCounts = computed(() => {
    // 依赖refreshFlag确保更新
    refreshFlag.value;
    const result = groups.value.map(group => ({
      ...group,
      memberCount: groupMemberCounts.value[group.name] || 0
    }));
    console.log('计算带成员数量的分组数据:', result);
    return result;
  });

  // 监听用户数据变化，强制更新分组数据
  watch(users, () => {
    console.log('用户数据变化，触发分组更新');
    refreshFlag.value++;
  }, { deep: true });

  // 监听分组数据变化，强制更新分组数据
  watch(groups, () => {
    console.log('分组数据变化，触发分组更新');
    refreshFlag.value++;
  }, { deep: true });

  // 获取所有分组
  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups')
      if (response.data.success) {
        // 格式化分组数据中的日期
        const formattedGroups = response.data.data.map((group: any) => {
          let formattedTime = group.createdTime;
          // 如果是标准格式日期，转换为中文格式
          if (group.createdTime && group.createdTime.includes('T') && !group.createdTime.includes('年')) {
            const date = dayjs(group.createdTime);
            if (date.isValid()) {
              formattedTime = date.format('YYYY年MM月DD日 HH:mm:ss');
            }
          }
          return {
            ...group,
            createdTime: formattedTime
          };
        });
      
      groups.value = formattedGroups;
      console.log('分组数据加载完成:', groups.value)
      // 触发计算属性更新
      refreshFlag.value++;
    }
  } catch (error) {
    console.error('获取分组数据失败:', error)
  }
}

// 添加分组
const addGroup = async (group: Omit<GroupItem, 'id' | 'memberCount'>) => {
  try {
    // 确保日期格式正确（保持中文格式）
    let formattedTime = group.createdTime;
    if (group.createdTime && group.createdTime.includes('T') && !group.createdTime.includes('年')) {
      // 如果是标准格式，转换为中文格式
      const date = dayjs(group.createdTime);
      if (date.isValid()) {
        formattedTime = date.format('YYYY年MM月DD日 HH:mm:ss');
      }
    }
    
    const response = await axios.post('/api/groups', {
      name: group.name,
      description: group.description,
      createdTime: formattedTime  // 保持中文格式存储
    })
    
    if (response.data.success) {
      // 格式化返回数据中的日期（保持中文格式）
      let returnedTime = response.data.data.createdTime;
      if (returnedTime && returnedTime.includes('T') && !returnedTime.includes('年')) {
        const date = dayjs(returnedTime);
        if (date.isValid()) {
          returnedTime = date.format('YYYY年MM月DD日 HH:mm:ss');
        }
      }
      
      groups.value.push({
        ...response.data.data,
        createdTime: returnedTime,
        memberCount: 0
      })
      // 触发计算属性更新
      refreshFlag.value++;
    }
    return response.data
  } catch (error) {
    console.error('添加分组失败:', error)
    throw error
  }
}

// 更新分组
const updateGroup = async (group: GroupItem) => {
  try {
    // 确保日期格式正确
    let formattedTime = group.createdTime;
    if (group.createdTime && !group.createdTime.includes('年')) {
      // 如果是标准格式，转换为中文格式保存
      const date = dayjs(group.createdTime);
      if (date.isValid()) {
        formattedTime = date.format('YYYY年MM月DD日 HH:mm:ss');
      } else {
        // 如果日期无效，使用当前时间
        formattedTime = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
      }
    } else if (!group.createdTime) {
      // 如果没有日期，使用当前时间
      formattedTime = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
    }
    
    const response = await axios.put(`/api/groups/${group.id}`, {
      name: group.name,
      description: group.description,
      createdTime: formattedTime
    })
    
    if (response.data.success) {
      const index = groups.value.findIndex(item => item.id === group.id)
      if (index !== -1) {
        // 格式化返回数据中的日期
        let returnedTime = response.data.data.createdTime;
        if (returnedTime && returnedTime.includes('年') && returnedTime.includes('月') && returnedTime.includes('日')) {
          const date = dayjs(returnedTime, 'YYYY年MM月DD日 HH:mm:ss');
          if (date.isValid()) {
            returnedTime = date.format('YYYY-MM-DDTHH:mm');
          } else {
            returnedTime = dayjs().format('YYYY-MM-DDTHH:mm');
          }
        } else if (returnedTime) {
          // 确保任何日期都被正确格式化为标准格式
          const date = dayjs(returnedTime);
          if (date.isValid()) {
            returnedTime = date.format('YYYY-MM-DDTHH:mm');
          } else {
            returnedTime = dayjs().format('YYYY-MM-DDTHH:mm');
          }
        } else {
          // 如果没有日期，使用当前时间
          returnedTime = dayjs().format('YYYY-MM-DDTHH:mm');
        }
        
        groups.value[index] = {
          ...groups.value[index],
          name: response.data.data.name,
          description: response.data.data.description,
          createdTime: returnedTime
        }
        // 触发计算属性更新
        refreshFlag.value++;
      }
    }
    return response.data
  } catch (error) {
    console.error('更新分组失败:', error)
    throw error
  }
}

// 删除分组
const deleteGroup = async (id: number) => {
  try {
    const response = await axios.delete(`/api/groups/${id}`)
    if (response.data.success) {
      groups.value = groups.value.filter(item => item.id !== id)
      // 触发计算属性更新
      refreshFlag.value++;
    }
    return response.data
  } catch (error) {
    console.error('删除分组失败:', error)
    throw error
  }
}

// 获取所有用户
const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users')
    if (response.data.success) {
      // 格式化用户数据中的日期
      const formattedUsers = response.data.data.map((user: any) => {
        let formattedDate = user.date;
        // 如果是标准格式日期，转换为中文格式
        if (user.date && user.date.includes('T') && !user.date.includes('年')) {
          const date = dayjs(user.date);
          if (date.isValid()) {
            formattedDate = date.format('YYYY年MM月DD日 HH:mm:ss');
          }
        }
        return {
          ...user,
          date: formattedDate
        };
      });
      
      users.value = formattedUsers;
      console.log('用户数据加载完成:', users.value)
      // 触发计算属性更新
      refreshFlag.value++;
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
  }
}

// 添加用户
const addUser = async (user: Omit<UserItem, 'id'>) => {
  try {
    // 确保日期格式正确（保持中文格式）
    let formattedDate = user.date;
    if (user.date && user.date.includes('T') && !user.date.includes('年')) {
      // 如果是标准格式，转换为中文格式
      const date = dayjs(user.date);
      if (date.isValid()) {
        formattedDate = date.format('YYYY年MM月DD日 HH:mm:ss');
      }
    }
    
    const response = await axios.post('/api/users', {
      name: user.name,
      displayName: user.displayName,
      facePictures: user.facePictures,
      group: user.group,
      memberType: user.memberType,
      date: formattedDate  // 保持中文格式存储
    })
    
    if (response.data.success) {
      // 格式化返回数据中的日期（保持中文格式）
      let returnedDate = response.data.data.date;
      if (returnedDate && returnedDate.includes('T') && !returnedDate.includes('年')) {
        const date = dayjs(returnedDate);
        if (date.isValid()) {
          returnedDate = date.format('YYYY年MM月DD日 HH:mm:ss');
        }
      }
      
      users.value.push({
        ...response.data.data,
        date: returnedDate
      })
      // 更新对应分组的成员数量
      const groupIndex = groups.value.findIndex(g => g.name === user.group)
      if (groupIndex !== -1) {
        groups.value[groupIndex].memberCount += 1
      }
      // 触发计算属性更新
      refreshFlag.value++;
    }
    return response.data
  } catch (error) {
    console.error('添加用户失败:', error)
    throw error
  }
}

// 更新用户
const updateUser = async (user: UserItem) => {
  try {
    // 确保日期格式正确
    let formattedDate = user.date;
    if (user.date && !user.date.includes('年')) {
      // 如果是标准格式，转换为中文格式保存
      const date = dayjs(user.date);
      if (date.isValid()) {
        formattedDate = date.format('YYYY年MM月DD日 HH:mm:ss');
      } else {
        // 如果日期无效，使用当前时间
        formattedDate = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
      }
    } else if (!user.date) {
      // 如果没有日期，使用当前时间
      formattedDate = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
    }
    
    const response = await axios.put(`/api/users/${user.id}`, {
      name: user.name,
      displayName: user.displayName,
      facePictures: user.facePictures,
      group: user.group,
      memberType: user.memberType,
      date: formattedDate
    })
    
    if (response.data.success) {
      const index = users.value.findIndex(item => item.id === user.id)
      if (index !== -1) {
        // 如果分组发生变化，更新分组成员数量
        if (users.value[index].group !== user.group) {
          // 减少原分组成员数量
          const oldGroupIndex = groups.value.findIndex(g => g.name === users.value[index].group)
          if (oldGroupIndex !== -1) {
            groups.value[oldGroupIndex].memberCount -= 1
          }
          // 增加新分组成员数量
          const newGroupIndex = groups.value.findIndex(g => g.name === user.group)
          if (newGroupIndex !== -1) {
            groups.value[newGroupIndex].memberCount += 1
          }
        }
        
        // 格式化返回数据中的日期
        let returnedDate = response.data.data.date;
        if (returnedDate && returnedDate.includes('年') && returnedDate.includes('月') && returnedDate.includes('日')) {
          const date = dayjs(returnedDate, 'YYYY年MM月DD日 HH:mm:ss');
          if (date.isValid()) {
            returnedDate = date.format('YYYY-MM-DDTHH:mm');
          } else {
            returnedDate = dayjs().format('YYYY-MM-DDTHH:mm');
          }
        } else if (returnedDate) {
          const date = dayjs(returnedDate);
          if (date.isValid()) {
            returnedDate = date.format('YYYY-MM-DDTHH:mm');
          } else {
            returnedDate = dayjs().format('YYYY-MM-DDTHH:mm');
          }
        } else {
          // 如果没有日期，使用当前时间
          returnedDate = dayjs().format('YYYY-MM-DDTHH:mm');
        }
        
        users.value[index] = {
          ...response.data.data,
          date: returnedDate
        }
        // 触发计算属性更新
        refreshFlag.value++;
      }
    }
    return response.data
  } catch (error) {
    console.error('更新用户失败:', error)
    throw error
  }
}

// 删除用户
const deleteUser = async (id: number) => {
  try {
    const user = users.value.find(u => u.id === id)
    const response = await axios.delete(`/api/users/${id}`)
    
    if (response.data.success && user) {
      users.value = users.value.filter(item => item.id !== id)
      // 更新对应分组的成员数量
      const groupIndex = groups.value.findIndex(g => g.name === user.group)
      if (groupIndex !== -1) {
        groups.value[groupIndex].memberCount -= 1
      }
      // 触发计算属性更新
      refreshFlag.value++;
    }
    return response.data
  } catch (error) {
    console.error('删除用户失败:', error)
    throw error
  }
}

// 上传人脸图片
const uploadFacePicture = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axios.post('/api/upload/face-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success) {
      return response.data.data.url
    }
    throw new Error('上传失败')
  } catch (error) {
    console.error('上传人脸图片失败:', error)
    throw error
  }
}

return {
  // 修改返回值，使用计算属性而不是原始groups
  groups: groupsWithMemberCounts,
  users,
  memberTypes,
  groupNames,
  fetchGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  uploadFacePicture,
  // 添加refreshFlag到返回值中
  refreshFlag
}
})