/**
 * 加密工具函数
 */
import crypto from 'crypto';

/**
 * 计算给定字符串的MD5哈希值
 * @param str 需要计算哈希值的字符串
 * @returns MD5哈希字符串
 */
export function md5(str: string): string {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
} 