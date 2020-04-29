<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <CanEditTable
		:columns="columns"
		:data="data"
		:loading="loading"
		@addEditTable="addList"
		@updateEditTable="updateList"
		@deleteEditTable="deleteList"
    />
  </div>
</template>

<script>
import CanEditTable from './components/CanEditTable'
import axios from 'axios'
import Vue from 'vue'

export default {
	name: 'App',
	data () {
		return {
			columns: [
				{
					title: '姓名',
					key: 'name',
					type: 'input',
					width: 200,
					placeholder: '',
					clearable: true,
				},
				{
					title: '性别',
					key: 'sex',
					type: 'select',
					width: 200,
					placeholder: '',
					clearable: '',
					selectItem: [
						{label: '男', value: '男'},
						{label: '女', value: '女'}
					],
					filterable: ''
				},
				{
					title: '年龄',
					key: 'age',
					type: 'input'
				},
				{
					title: '出生日期',
					key: 'birthday',
					type: 'input'
				},
				{
					title: '地址',
					key: 'address',
					type: 'cascader',
					cascaderItem: [{
						value: 'beijing',
						label: '北京',
						children: [
							{ value: 'gugong',label: '故宫' },
							{ value: 'tiantan',label: '天坛' },
							{ value: 'wangfujing',label: '王府井' }
						]
					}, {
						value: 'jiangsu',
						label: '江苏',
						children: [
							{
								value: 'nanjing',
								label: '南京',
								children: [
									{ value: 'fuzimiao',label: '夫子庙' }
								]
							},
							{
								value: 'suzhou',
								label: '苏州',
								children: [
									{ value: 'zhuozhengyuan',label: '拙政园' },
									{ value: 'shizilin',label: '狮子林' }
								]
							}
						],
					}],
					render: (h, params) => {
						const address = params.row.address
						const cascaderItem = this.columns[4].cascaderItem
						let cascaderData = ''
						// const recursiveFunction = (str, arr) => {
						// 	// console.log(str)
						// 	let recursiveStr = ''
						// 	for (let i = 0; i < arr.length - 1; i++) {
						// 		if (str == arr[i].value) {
						// 			recursiveStr = recursiveStr + arr[i].label
						// 			console.log(recursiveStr)
						// 			// return 
						// 		} else {
						// 			if (arr[i].children) {
						// 				recursiveFunction(str, arr[i].children)
						// 			}
						// 		}
						// 	}
						// 	// arr.forEach(item => {
						// 	// 	if (str === item.value) { 
						// 	// 		recursiveStr += item.label
						// 	// 	} else {
						// 	// 		if (item.children) {
						// 	// 			recursiveFunction(str, item.children)
						// 	// 		}
						// 	// 	}
						// 	// })
						// 	// console.log(recursiveStr)
						// 	return recursiveStr
						// }
						// address.forEach((params,index) => {
						// 	cascaderItem.forEach
						// })
						const recursiveFunction = (arrStr, arrItem) => {
							let str = ''
							for (let i = 0; i < arrStr.length; i++) {
								arrItem.forEach(item => {
									if (arrStr[i] === item.value) {
										str += item.label
										if (i < address.length && item.children) {
											item.children.forEach()
										}
									}
								})
							}
						}
						// console.log(cascaderData)
						return <div>{cascaderData}</div>
					}
				}
				
			],
			loading: false,
			data: [],
		}
	},
	components: {
		CanEditTable
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			axios.get('/api/test/getList').then(res => {
				this.data = res.data.data
			})
		},
		addList(row) {
			this.loading = true
			setTimeout(() => {
				// eslint-disable-next-line no-unused-vars
				const { _index, _rowKey, ...data} = row
				Vue.set(this.data, this.data.length, data)
				this.$Message.success("添加成功")
				this.loading = false
			}, 2000);
		},
		updateList(row) {
			this.loading = true
			setTimeout(() => {
				// eslint-disable-next-line no-unused-vars
				const { _index, _rowKey, ...data} = row
				this.data = this.data.map((a,index) => {
					if(index === row._index) {
						return data
					}
					return {...a}
				})
				this.$Message.success("修改成功")
				this.loading = false
			}, 2000);
		},
		deleteList(row) {
			this.loading = true
			setTimeout(() => {
				this.data = this.data.filter((a, index) => index !== row._index)
				this.$Message.success("删除成功")
				this.loading = false
			}, 2000);
		}
	}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
