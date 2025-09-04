import { parseEther, formatEther } from 'viem'

/**
 * 质押测试辅助函数
 */
export class StakingTestHelper {
  
  /**
   * 检查质押前的各项条件
   * @param userBalance 用户YD余额
   * @param allowance 当前授权额度
   * @param stakeAmount 要质押的数量
   * @returns 检查结果
   */
  static checkStakingPreConditions(
    userBalance: bigint, 
    allowance: bigint, 
    stakeAmount: string
  ) {
    const stakeAmountBigInt = parseEther(stakeAmount)
    
    const checks = {
      hasBalance: userBalance >= stakeAmountBigInt,
      hasApproval: allowance >= stakeAmountBigInt,
      needsApproval: allowance < stakeAmountBigInt,
      requiredApproval: stakeAmountBigInt > allowance ? stakeAmountBigInt - allowance : 0n,
      isReady: userBalance >= stakeAmountBigInt && allowance >= stakeAmountBigInt
    }
    
    return {
      ...checks,
      summary: {
        userBalance: formatEther(userBalance),
        currentAllowance: formatEther(allowance),
        stakeAmount: stakeAmount,
        requiredApproval: formatEther(checks.requiredApproval),
        canProceed: checks.isReady
      }
    }
  }
  
  /**
   * 生成质押流程的步骤说明
   * @param needsApproval 是否需要授权
   * @returns 步骤数组
   */
  static getStakingSteps(needsApproval: boolean) {
    const steps = []
    
    if (needsApproval) {
      steps.push({
        step: 1,
        action: 'approve',
        description: '授权YD代币给质押合约',
        contractCall: 'YDToken.approve(stakingContract, amount)'
      })
      
      steps.push({
        step: 2,
        action: 'stake',
        description: '调用质押合约进行质押',
        contractCall: 'StakingSystem.stake(amount)',
        note: '合约内部会执行：YD->ETH->USDT->Aave的流程'
      })
    } else {
      steps.push({
        step: 1,
        action: 'stake',
        description: '直接调用质押合约进行质押',
        contractCall: 'StakingSystem.stake(amount)',
        note: '合约内部会执行：YD->ETH->USDT->Aave的流程'
      })
    }
    
    return steps
  }
  
  /**
   * 验证质押流程的完整性
   * @param userAddress 用户地址
   * @param stakeAmount 质押数量
   * @returns 验证结果
   */
  static validateStakingFlow(userAddress: string, stakeAmount: string) {
    const validations = []
    
    // 基础验证
    if (!userAddress) {
      validations.push({
        type: 'error',
        message: '用户钱包未连接'
      })
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      validations.push({
        type: 'error', 
        message: '质押数量必须大于0'
      })
    }
    
    // 流程验证
    validations.push({
      type: 'info',
      message: '质押流程：YD代币 → ETH → USDT → Aave协议'
    })
    
    validations.push({
      type: 'warning',
      message: '请确保网络稳定，整个流程可能需要几分钟时间'
    })
    
    return validations
  }
  
  /**
   * 计算预估的Gas费用（示例）
   * @param needsApproval 是否需要授权
   * @returns Gas费用估算
   */
  static estimateGasCosts(needsApproval: boolean) {
    const gasEstimates = {
      approve: needsApproval ? 50000n : 0n,
      stake: 300000n, // 包含多次swap和Aave交互
      total: needsApproval ? 350000n : 300000n
    }
    
    return gasEstimates
  }
}

/**
 * 控制台调试辅助函数
 */
export const debugStaking = {
  logApprovalStatus: (status: any) => {
    console.group('🔍 质押授权状态检查')
    console.log('需要授权:', status.needsApproval)
    console.log('余额充足:', status.hasBalance) 
    console.log('准备就绪:', status.isReady)
    console.log('当前授权:', formatEther(status.currentAllowance), 'YD')
    console.log('当前余额:', formatEther(status.currentBalance), 'YD')
    console.log('需要授权:', formatEther(status.requiredApproval), 'YD')
    console.groupEnd()
  },
  
  logTransaction: (type: 'approve' | 'stake', hash?: string, error?: any) => {
    if (error) {
      console.error(`❌ ${type} 交易失败:`, error)
    } else if (hash) {
      console.log(`✅ ${type} 交易已提交:`, hash)
    } else {
      console.log(`📤 正在提交 ${type} 交易...`)
    }
  },
  
  logStakingFlow: (step: string, details?: any) => {
    console.log(`🚀 质押流程 - ${step}`, details || '')
  }
}