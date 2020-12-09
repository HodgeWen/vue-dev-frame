import { getType } from './shared'

class O {
  static _targets: Record<string, any>[]

  static instance: O

  static init() {
    O._targets = []

    if (O.instance) {
      return O.instance
    }

    O.instance = new O()
    return O.instance
  }

  static add(o: Record<string, any>) {
    O._targets.push(o)
  }

  /**
   * 继承其他对象的属性
   * @param origin 继承的对象
   * @param ignore 是否忽略空值
   */
  extend(origin: Record<string, any>, ignore = true) {
    if (!origin) return
    if (ignore) {
      O._targets.forEach((item) => {
        for (const key in item) {
          const v = origin[key]
          if (key in origin && (v === 0 || v)) {
            item[key] = v
          }
        }
      })
      return this
    }
    O._targets.forEach((item) => {
      for (const key in item) {
        if (key in origin) {
          item[key] = origin[key]
        }
      }
    })
    return this
  }

  /**
   * 将对象合并到所有的目标对象中
   * @param origin 合并的对象
   */
  merge(origin: Record<string, any>) {
    O._targets.forEach((item) => Object.assign(item, origin))
    return this
  }

  /**
   * 深度合并
   * @param origins 合并源
   * @param uniqueKey 唯一值得键
   */
  deepMerge(origins: Record<string, any>[], uniqueKey?: string) {
    let empVal = [null, undefined]
    let mergeOne = (target: Record<string, any>, origin: Record<string, any>) => {
      Object.keys(origin).forEach((key) => {
        let targetValue = target[key]
        let originValue = origin[key]

        // 如果目标对象上该属性值为空则直接覆盖
        if (empVal.includes(targetValue)) {
          target[key] = originValue
        } else {
          // 源值为空则直接返回
          if (empVal.includes(originValue)) return

          // 获取类型
          let targetType = getType(targetValue)
          let originType = getType(originValue)

          // 先判断两边的类型是否相同, 不同类型直接跳过
          if (targetType !== originType) return

          if (originType === 'object') {
            mergeOne(targetValue, originValue)
          } else if (originType === 'array') {
            // 根据数组的第一个元素判断是否进行深度合并, 不够严谨
            if (typeof targetValue[0] !== 'object') {
              target[key] = Array.from(new Set([ ...targetValue, ...originValue ]))
              return
            }
            // 如果没有唯一表示
            if (!uniqueKey) {
              target[key] = targetValue.concat(originValue)
            } else {
              let map: Record<string, any> = {}
              targetValue.forEach((tv: any) => {
                map[tv[uniqueKey]] = tv
              })
              originValue.forEach((ov: any) => {
                if (map[ov[uniqueKey]]) {
                  mergeOne(map[ov[uniqueKey]], ov)
                } else {
                  targetValue.push(ov)
                }
              })
            }
          } else {
            // 直接类型
            target[key] = originValue
          }
        }
      })
    }

    // 所有目标对象
    O._targets.forEach((target) => {

      origins.forEach((origin) => {
        mergeOne(target, origin)
      })
    })
  }

  /**
   * 根据指定的规则设置目标对象中的值
   * @param ruleHandler 处理函数, 参数为当前对象属性值
   */
  setValue(ruleHandler: (v: any) => any, keys?: string[]) {
    if (keys) {
      O._targets.forEach((item) => {
        keys.forEach((key) => {
          item[key] = ruleHandler(item[key])
        })
      })
      return this
    }

    O._targets.forEach((item) => {
      Object.keys(item).forEach((key) => {
        item[key] = ruleHandler(item[key])
      })
    })

    return this
  }

  /**
   * 将目标对象上的字段代理到其他对象中
   * @param rules 代理规则
   * @param didDeleteOriginKey 是否删除原有的key
   * @param deep 是否深度遍历
   */
  keyPropxy(rules: Record<string, string>, didDeleteOriginKey = false, deep: false) {
    if (didDeleteOriginKey) {
      return Object.keys(rules).forEach((key) => {
        O._targets.forEach((tar) => {
          if (tar[key]) {
            tar[rules[key]] = tar[key]
            delete tar[key]
          }
        })
      })
    }
    Object.keys(rules).forEach((key) => {
      O._targets.forEach((tar) => {
        if (tar[key]) {
          tar[rules[key]] = tar[key]
        }
      })
    })
  }

  reset() {
    O._targets.forEach((target) => {
      Object.keys(target).forEach((key) => {
        let v = target[key]
        switch (typeof v) {
          case 'number':
            target[key] = 0
            break
          case 'string':
            target[key] = ''
            break
          case 'object':
            if (v instanceof Array) {
              target[key] = []
            } else {
              target[key] = null
            }
            break
          default:
            target[key] = null
        }
      })
    })
  }
}

export function obj(...args: Record<string, any>[]) {
  const o = O.init()
  args.forEach((arg) => O.add(arg))
  return o
}
