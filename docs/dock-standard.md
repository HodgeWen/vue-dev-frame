# 前后端对接规范以及常用字段约定

## 规范

- url应遵循  /api/{模块名}/{?:动态参数|修饰|其他路由名}
	- GET 表示获取资源
	- PUT 表示更新资源
	- DELETE 表示删除资源
	- POST 表示新增资源
	- PATCH 表示局部更新资源

- url不使用大写，用中划线 - , 不用下划线 _
```typescript
Get(`/user/list`) // 获取user模块的列表
Get(`/user/page`) // 获取user模块的分页
Get(`/user/${id}`) // 获取某个user
Post(`/user`, User) // 新增user
Post(`/user/`, { list: Array<User> }) // 批量新增user
Put(`/user/${id}`) // 修改某个user
Delete(`/user/${id}`) // 删除某个user
Delete(`/user/batch`, { list: Array<string> })
```

- 升序降序, 采用 sort 字段, -前缀表示降序, +前缀或无前缀表示升序
```typescript
const desc = '/api/user/page?sort=-height' // 表示按身高降序
const asc = '/api/user/page?sort=height'  // 表示按身高升序
```

- 空数组应返回一个[] 而不应该是个null

- 待补充的其他规范


## 常用字段约定

- 时间
	- 更新时间 updated
	- 创建时间 created
	- 特殊时间日期等等单独命名 比如 visitDate
	- 满足YYYY-MM-DD hh:mm:ss 的时间应当视为date

- 名称
    - 用于描述一条记录的主要名词, 应当且只应当以name来命名
    - 名称作为关联字段时, 分为同级和子级, 同级应和name区别开命名, 子级应命名为name
    - 其他的名称则具体命名

``` ts
interface User {
	name: string;
	age: number;
	height: number;
	created: string;
	updated: string;
	operater: string;
}

// 同级命名
interface ArticlePageItem {
 	id: string;
 	title: string;
	content: string;
	created: string;
	updated: string;
	author: User['name'];
}
// 子级命名
interface ArticlePageItemVO {
	id: string;
 	title: string;
	content: string;
	created: string;
	updated: string;
	author: User;
}
```
- 主键
  - 和名称类似, 应且只应命名为id
  - 名称作为关联字段时, 分为同级和子级, 同级应和id区别开命名, 子级应命名为id
  - 其他的名称则具体命名

```ts
interface User {
	name: string;
	age: number;
	height: number;
	created: string;
	updated: string;
	operater: string;
}

// 同级命名
interface ArticlePageItem {
 	id: string;
 	title: string;
	content: string;
	created: string;
	updated: string;
	authorId: User['id'];
}
// 子级命名
interface ArticlePageItemVO {
	id: string;
 	title: string;
	content: string;
	created: string;
	updated: string;
	author: User;
}
```
