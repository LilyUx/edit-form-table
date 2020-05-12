<template>
  <div id="app">
    <edit-form-table
      :columns="columns"
      :loading="loading"
      :data="data"
      @saveEditTable="saveEditTable"
      @deleteEditTable="deleteList"
    />
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'

export default {
	name: 'App',
	data () {
		return {
      formItem: {
        select: 'shanghai',
      },
			columns: [
				{
					title: "姓名",
					slot: "name",
					type: 'input',
					placeholder: '',
					// clearable: true,
					// disabled: true,
					validate: [
             { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
				},
				{
					title: "年龄",
					slot: "age",
					type: 'input',
					placeholder: '',
					// disabled: true,
					// clearable: true,
					validate: [
            { required: true, message: '年龄不能为空', trigger: 'blur' }
          ],
        },
        {
					title: "性别",
					slot: "sex",
					type: 'select',
					placeholder: '',
					// multiple: true,
					// disabled: true,
					// clearable: true,
					validate: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
					item: [
						{label: '男', value: "men"},
						{label: '女', value: "women"}
					]
				},
				{
					title: "是否活着",
					slot: "alive",
					type: 'switch'
				},
				{
					title: "出生日期",
					slot: "birthday",
					type: 'date',
					placeholder: ''
				},
				{
					title: "地址",
					slot: "address",
					type: 'cascader',
					item: [{
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
				},
				{
					title: "操作",
					slot: "action"
				}
			],
			data: [],
			loading: false
		}
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
		saveEditTable(row) {
			this.loading = true
			setTimeout(() => {
				// eslint-disable-next-line no-unused-vars
        const { _index, _rowKey, ...data} = row
        console.log(_index)
        if (_index > this.data.length - 1) {
          Vue.set(this.data, this.data.length, {...data})
          this.$Message.success("添加成功")
          this.loading = false
        } else {
          this.data = this.data.map((a,index) => {
            if(index === row._index) {
              return data
            }
            return {...a}
          })
          this.$Message.success("修改成功")
          this.loading = false
        }
			}, 2000);
		},
		deleteList(row) {
			this.loading = true
			setTimeout(() => {
				this.data = this.data.filter((a, index) => index !== row._index)
				this.$Message.success("数据保存成功")
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
