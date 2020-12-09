type ValueType =
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'blob'
  | 'date'
  | 'undefined'
  | 'function'
  | 'boolean'
  | 'file'
  | 'formdata'
  | 'symbol'

type ApiReponse = {
  code: number
  data: any
}
export async function promiseApiList(proList: ApiReponse[]) {
  const promise = await Promise.all(proList)
  const approve = promise.every((v: any) => v.code === 200)
  const datas = promise.map((v: any) => v.data)
  return { approve, datas }
}

/**
 * 序列化一个对象至 'key=value&key1=value1' 的形式
 * @param obj 被序列化的对象
 */
export function serialize(obj: Record<string, any>): string {
  let ret = ''
  try {
    Object.keys(obj).forEach((key: string) => {
      // 如果值为undefined则在字符串中的表现形式就是空串
      if (obj[key] === undefined) {
        ret += `${key}=&`
        return
      }
      ret += `${key}=${encodeURIComponent(obj[key])}&`
    })
    return ret.slice(0, -1)
  } catch {
    console.warn(`期望传入一个object格式数据, 此处传入了一个${getType(obj)}格式的数据`)
    return ''
  }
}

/**
 * 反序列化一个 'key=value&key1=value1' 形式的字符串
 * 需要用 decodeURIComponent 解码
 * 需要过滤所有的非正常字段
 * @param str 被序列化的对象
 */
export function unserialize<T extends Record<string, any>>(str: string): T {
  try {
    const body = str
      .replace(/^\?/, '')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
    return body ? JSON.parse('{"' + decodeURIComponent(body) + '"}') : {}
  } catch {
    console.warn('数据格式应满足 "key=value&key1=value1" 格式')
    return {} as T
  }
}

/**
 * 解析对象的值到number或string数据类型
 * @param o 对象
 * @param typeMap 对象类型映射
 */
export function parseQueryObject(
  o: Record<string, any>,
  typeMap: Record<string, 'string' | 'number'>
) {
  let map = {
    string: (val: any) => String(val),
    number: (val: any) => {
      let n = Number(val)
      return isNaN(n) ? val : n
    }
  }
  let ret: Record<string, any> = {}
  Object.keys(typeMap).forEach((key) => {
    if (o[key] === undefined) return
    ret = map[typeMap[key]](o[key])
  })
  return ret
}

/**
 * 循环一个数次并执行一些操作
 * @param num 要循环的数字
 * @param callback 循环处理的回调
 * @param didMap 是否映射, 如果映射该函数会返回一个每次回调的返回值的数组
 */
export function loop(num: number, callback: (num: number) => any, didMap = false) {
  let i = 0
  if (!didMap) {
    while (++i <= num) {
      callback(i)
    }
  } else {
    let ret = []
    while (++i <= num) {
      ret.push(callback(i))
    }
    return ret
  }
}

/**
 * 获取值得类型
 * @param val 任意值
 */
export function getType(val: any) {
  return Object.prototype.toString
    .call(val)
    .slice(8, -1)
    .toLowerCase() as ValueType
}

/**
 * 返回任意值是否是某些情况中的一种
 * @param value 任意值
 * @param situations 类型的一些情形
 */
export function oneTypeOf(value: any, situations: ValueType[]): boolean {
  return situations.includes(getType(value))
}

/**
 * 返回数组中不是undefined类型的第一个值
 * @param args 任意数组值
 */
export function fallback<T>(...args: any[]) {
  return args.find((v) => v !== undefined) as T
}

/**
 * 拼接字符串
 * @param url 第一个串
 * @param restUrls 其他字符串
 */
export function joinUrl(url: string, ...restUrls: string[]) {
  const clearReg = /[\.\/]+/g
  if (restUrls.length === 0) {
    return url.replace(clearReg, '/')
  }

  const relativePrefixReg = /^\.{1,2}\//,
    lastUrlReg = /\/[\dA-z]+$/

  // 清除第一个url串中多余的.和/
  let result = url.replace(clearReg, '/')
  restUrls.forEach((url) => {
    while (relativePrefixReg.test(url)) {
      result = result.replace(lastUrlReg, '')
      url = url.replace(relativePrefixReg, '')
    }
    url = url.replace(clearReg, '/')
    result += url.startsWith('/') ? url : '/' + url
  })

  return result.replace(/\/+$/, '')
}

/**
 * 排除一个对象的某些键和值
 * @param target 目标对象
 * @param omitKeys 排除的对象的键的数组
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  target: T,
  omitKeys: K[]
): Omit<T, K> {
  let ret = { ...target }
  omitKeys.forEach((key) => {
    delete ret[key]
  })
  return ret
}

/**
 * 从目标对象获取某些属性的值
 * @param target 目标对象
 * @param pickKeys 选择的对象的键的数组
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  target: T,
  pickKeys: K[]
): Pick<T, K> {
  let ret = {} as T
  pickKeys.forEach((key) => (ret[key] = target[key]))
  return ret
}

/**
 * 返回一个值的空状态
 * @param val 任意值
 */
export function isEmpty(val: any) {
  const type = getType(val)

  switch (type) {
    case 'array':
      return val.length === 0
    case 'object':
      for (const key in val) {
        return false
      }
      return true
  }
  return false
}

/**
 * 获取链式值
 * @param o 目标对象
 * @param prop 属性
 * @param targetProp 目标属性
 */
export function getChainValue(o: any, prop: string, targetProp?: string) {
  let ret = o
  if (targetProp) {
    ret = o[targetProp]
  }

  prop &&
    prop.split('.').some((p) => {
      if (p === '$last' && Array.isArray(ret)) {
        ret = ret[ret.length - 1]
      } else {
        ret = ret[p]
      }

      if (!ret) {
        return true
      }
    })
  return ret
}

/**
 * 数组映射到对象
 * @param arr 数组
 * @param keyProp 对应对象键的属性
 * @param valueProp 对应对象值得属性
 */
export function atoo(
  arr: Record<string, any>[],
  keyProp = 'value',
  valueProp = 'text'
): Record<string | number, any> {
  let ret = Object.create(null)
  arr.forEach((item) => {
    ret[item[keyProp]] = item[valueProp]
  })
  return ret
}

/**
 * 获取数组最后一位
 * @param arr 数组
 */
export function last<T>(arr: T[]): T {
  return arr[arr.length - 1]
}
