type Fn = (...args: any) => any

/**
 * 对一个高频率处理的函数节流, 规定在预期的延迟时间内只能执行一次
 * @param fn 节流处理的函数
 * @param delay 节流延迟时间
 */
export function throttle<F extends Fn>(fn: F, delay = 100) {
    if (delay === 0) {
        return fn
    }
    let start = 0
    return function(this: any, ...args: Parameters<F>) {
        let now = Date.now()
        if (now - start >= delay) {
            fn.apply(this, args)
            start = now
        }
    }
}

/**
 * 对一个高频率处理的函数防抖处理, 如重复操作时间短于规定的时间则始终等待到大于规定的时间之后在触发
 * @param fn 需要被防抖的函数
 * @param delay 防抖延迟时间
 */
export function debounce<F extends Fn>(fn: F, delay = 100) {
    let loading = false
    let timer: NodeJS.Timer
    return function(this: any, ...args: Parameters<F>) {
        loading = true
        if (loading) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
            loading = false
        }, delay)
    }
}
