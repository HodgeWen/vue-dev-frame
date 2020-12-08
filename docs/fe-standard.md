1. 保留个人的开发喜好，不约束缩进，单双引号， 句尾分号
2. 命名规范：
	1. 构造函数，类使用大驼峰
	2. 普通变量，方法， 函数使用小驼峰
	3. 公共的常量，使用全大写，字母之间使用下划线连接
	4. 尽可能地使用es6语法
3. 不要导入未使用的变量
4. 赋值语句两侧必须有且只有一个空格
5. css选择器嵌套不要超过3级
6. css 命名可以参考[BEM规范](https://bemcss.com/)，并不强制
7. vue框架的规范请参考[vue风格指南](https://cn.vuejs.org/v2/style-guide/)
8. 模块导出尽可能不要使用默认导出，因为默认导出编辑器无法做补全提示
9. 尽可能保持代码简洁和可读性，聚拢相似逻辑



示例：
```ts
// 定义一个状态变量
let didFinished = false

// 定义一个导出的全局常量
export const BASE_URL = "/v2/api"

// 定义一个类
interface ICustomTableItem {
	name: string;
	email: string;
	phone: string;
	status: 0 | 1 | 2;
}
class CustomTable extends Table<ICustomTableItem> {
	update() {}

	create() {}
}
```

``` css
/* good */
.selector3 {

}

/* bad */
.selector1 .selector2 .selector3 .select4 {

}
```

## 命名规范等

- 入口文件应当和文件夹一致, 区别在于文件命名使用中划线'-'链接, 文件夹则通常用大驼峰的方式命名;
![](http://118.190.140.38:4999/server/index.php?s=/api/attachment/visitFile/sign/feb8a7a6baa5d11b55a8d363ab0859ab&showdoc=.jpg)
- 非入口文件命名如与其他文件关联则应该使用关联文件作为前缀

- 常用的单词前缀
  - 动词, 如果是一个函数前缀放在开头, 比如 createUser, 否则放在结尾, 比如user-update.vue
    - 新增 / 创建 create,
    - 更新 / 修改 / 编辑 update
    - 删除 delete
    - 移除 remove [移除更多的指代移除一种关联关系]
    - 获取 / 查找 fetch [为什么不用get, 因为get太过宽泛, fetch 能够清晰的表达有从后端拉取之意]
	- 显示 show
  - 助动词, 通常用于表达状态
    - do, does, did [表示询问] didModalVisible
    - can ,could [常用: 表示许可] canClick canRemove canDelete
	- will, would [表示将要] willChange willExpand
	- should , shall [表示应当] 如: shouldComplete
	- be, is, been [常用, 表示正在] 如: isLeaf isArray isString
	- has, have, had [常用, 表示已经] 如 : hasFinished haveClosed
 -   名词
   - 表单 form
   - 信息 info
   - 详情 detail
   - 用户 user
   - 组织 organization
   - 权限资源 resource
   - 列表 list
   - 分页 page
   - 数据 data
   - 状态 status