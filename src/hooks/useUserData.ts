import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import type { UserData } from '../types'

const STORAGE_KEY = 'web3_university_users'

export const useUserData = () => {
  const { address } = useAccount()
  const { signMessage, signMessageAsync, data: signature, error, isPending } = useSignMessage()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  // 从localStorage加载用户数据，如果不存在则自动触发签名验证
  useEffect(() => {
    if (!address) {
      setUserData(null)
      setIsVerified(false)
      return
    }

    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
      try {
        const allUsers: Record<string, UserData> = JSON.parse(storedData)
        const user = allUsers[address.toLowerCase()]
        if (user) {
          setUserData(user)
          setIsVerified(true)
          return
        }
      } catch (error) {
        console.error('解析用户数据失败:', error)
      }
    }
    
    // 如果没有找到用户数据，自动触发登录验证
    autoLoginVerify()
  }, [address])

  // 自动登录验证
  const autoLoginVerify = async () => {
    if (!address) return

    const message = `登录验证 - Web3大学
钱包地址: ${address}
登录时间: ${new Date().toISOString()}

请签名以验证您的身份并登录Web3大学平台。`

    try {
      await signMessage({ message })
    } catch (error) {
      console.error('登录验证失败:', error)
    }
  }

  // 验证签名并创建用户数据 (保留给其他地方使用，如果需要)
  const verifyAndCreateUser = async (name: string) => {
    if (!address) return

    const message = `验证身份 - Web3大学
地址: ${address}
姓名: ${name}
时间: ${new Date().toISOString()}`

    try {
      await signMessage({ message })
    } catch (error) {
      console.error('签名失败:', error)
    }
  }

  // 当签名成功时，保存用户数据
  useEffect(() => {
    if (signature && address && !isVerified) {
      const newUserData: UserData = {
        address: address.toLowerCase(),
        name: '新用户', // 默认用户名
        purchasedCourses: []
      }

      // 保存到localStorage
      const storedData = localStorage.getItem(STORAGE_KEY)
      const allUsers: Record<string, UserData> = storedData ? JSON.parse(storedData) : {}
      allUsers[address.toLowerCase()] = newUserData

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers))
      setUserData(newUserData)
      setIsVerified(true)
    }
  }, [signature, address, isVerified])

  // 更新用户姓名
  const updateUserName = async (newName: string) => {
    if (!address || !isVerified) return false

    const message = `修改用户名 - Web3大学
钱包地址: ${address}
新用户名: ${newName}
修改时间: ${new Date().toISOString()}

请签名确认修改您的用户名。`

    try {
      // 使用signMessageAsync来更新用户名
      await signMessageAsync({ message })
      
      // 更新本地数据
      const storedData = localStorage.getItem(STORAGE_KEY)
      const allUsers: Record<string, UserData> = storedData ? JSON.parse(storedData) : {}
      
      if (allUsers[address.toLowerCase()]) {
        allUsers[address.toLowerCase()].name = newName
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers))
        setUserData(prev => prev ? { ...prev, name: newName } : null)
        return true
      }
    } catch (error) {
      console.error('更新姓名失败:', error)
    }
    
    return false
  }

  // 添加已购买课程
  const addPurchasedCourse = (courseId: string) => {
    if (!address || !userData) return

    const updatedData = {
      ...userData,
      purchasedCourses: [...new Set([...userData.purchasedCourses, courseId])]
    }

    const storedData = localStorage.getItem(STORAGE_KEY)
    const allUsers: Record<string, UserData> = storedData ? JSON.parse(storedData) : {}
    allUsers[address.toLowerCase()] = updatedData

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers))
    setUserData(updatedData)
  }

  return {
    userData,
    isVerified,
    verifyAndCreateUser,
    updateUserName,
    addPurchasedCourse,
    isSigningMessage: isPending,
    signError: error
  }
}