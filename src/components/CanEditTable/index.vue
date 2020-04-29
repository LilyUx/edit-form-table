<template>
	<div class="can-edit-table">
		<div class="can-edit-table-header">
			<h3>{{title}}</h3>
			<Button @click="addEditTable">{{addText}}</Button>
		</div>
		<Table
			:height="height"
			:loading="loading"
			:stripe="stripe" 
			:columns="renderColumn" 
			:data="editData">
		</Table>
	</div>
</template>

<script>
const lodash = require('lodash');
import './index.styl'
// eslint-disable-next-line no-unused-vars
import { Button, Table, Input, Select, Option, Cascader } from 'view-design';
export default {
	data () {
		return {
			editData: [],
			isAddEditTable: false,
			editIndex: -1,  // 当前聚焦的输入框的行数
		}
	},
	props: {
		title: {
			type: String,
            default: '可编辑表格'
		},
		addText: {
			type: String,
            default: '添加'
		},
		data: {
            type: Array,
            required: true
        },
		columns: {
            type: Array,
            required: true
        },
		height: {
            type: [String, Number],
            default: ''
        },
        stripe: {
            type: Boolean,
            default: true
        },
        loading: {
            type: Boolean,
            default: false
        }
	},
	computed: {
		renderColumn() {
			const action = [
				{
					title: '操作',
					key: 'action',
					render: (h, params) => {
						if (this.editIndex === params.row._index) {
							return <div>
								<Button onClick={() => this.handleSave(params.row)}>保存</Button>
								<Button onClick={() => this.handleCancel()}>取消</Button>
							</div>
						}
						return <div>
								<Button onClick={() => {this.handleEdit(params.row)}}>编辑</Button>
								<Button onClick={() => {this.handleDelete(params.row)}}>删除</Button>
							</div>
					}
				}
			]
			if (this.editIndex !== -1) {
				const formateColumn = this.formateColumn()
				return [...formateColumn, ...action]
			}
			return [...this.columns, ...action]
		}
	},
	watch: {
		data (val) {
			this.editData = lodash.cloneDeep(val)
		}
	},
	created () {
		this.editData = lodash.cloneDeep(this.data)
	},
	methods: {
		handleEdit (row) {
			if (this.isAddEditTable) {
				this.$Message.warning('请先取消新增空行！')
				return
			}
			this.editIndex = row._index
		},
		handleSave (row) {
			// 添加数据
			if (this.isAddEditTable) {
				this.$emit('addEditTable', row)
				this.isAddEditTable = false
			} else {
				// 编辑数据
				this.$emit('updateEditTable', row)
			}
			this.editIndex = -1
		},
		handleDelete (row) {
			if (this.editIndex !== -1) {
				this.$Message.warning('请先取消当前操作！')
				return
			}
			this.$Modal.confirm({
                title: '删除提醒',
                content: '是否删除当前数据？',
                closable: true,
                onOk: () => {
					this.$emit('deleteEditTable', row)
				}
            });
		},
		handleCancel() {
			if (this.isAddEditTable) {
				this.editData.splice(-1, 1)
			}
			this.isAddEditTable = false
			this.editIndex = -1
		},
		formateColumn () {
			const editColumn = this.columns.map(column => {
				let render, width, placeholder, clearable;
				width = column.width ? `width: ${column.width-40}px` : ''
				placeholder = column.placeholder ? column.placeholder : ''
				clearable = column.clearable ? column.clearable : false
				if (column.type === 'input') {
					render = (h, params) => {
						if (this.editIndex === params.row._index) {
							return (
								<Input
									value={params.row[column.key]}
									style={width}
									placeholder={placeholder}
									clearable={clearable}
									on-on-change={(e) => {
										this.editData[this.editIndex][column.key] = e.target.value.trim();
									}}/>
							)
						}
						return <div style={width}>{params.row[column.key]}</div>
					}
					return {...column, render}
				} else if (column.type === 'select') {
					let selectItem = column.selectItem ? column.selectItem : []
					let filterable = column.filterable ? column.filterable : false
					render = (h, params) => {
						if (this.editIndex === params.row._index) {
							return (
								<Select
                                    value={params.row[column.key]}
                                    clearable={clearable}
                                    filterable={filterable}
									style={width}
									placeholder={placeholder}
                                    on-on-change={val => {
                                        this.editData[this.editIndex][column.key] = val;
                                    }}>
                                    {selectItem.map(item => {
										return (
											<i-option
												value={item.value} 
												key={item.value}>
												{ item.label }
											</i-option>
										)
									})}
                                </Select>
							)
						}
						return <div style={width}>{params.row[column.key]}</div>
					}
					return {...column, render}
				} else if (column.type === 'cascader') {
					let cascaderItem = column.cascaderItem ? column.cascaderItem : []
					render = (h, params) => {
						if (this.editIndex === params.row._index) {
							return (
								<Cascader 
									data={cascaderItem}
									on-on-change={val => {
										this.editData[this.editIndex][column.key] = val;
									}}>
									></Cascader>
							)
						}
						let cascaderData = ''
						const recursiveFunction = (str, arr) => {
							let recursiveValue = ''
							const getLabel = (arr) => {
								arr.forEach(item => {
									if (item.children) {
										getLabel(item.children)
									} else {
										recursiveValue = str === item.value ? item.label : ''
									}
								})
							}
							getLabel(arr)
							return recursiveValue
						}
						// console.log(params.row[column.key])
						params.row[column.key].forEach((params, i) => {
							if (i === 1) {
								cascaderData += recursiveFunction(params)
							} else if (i > 1) {
								cascaderData += recursiveFunction(params) + ','
							} else if(i === (params.row[column.key].length - 1)) {
								cascaderData += recursiveFunction(params)
							}
						})
						return <div style={width}>{cascaderData}</div>
					}
					return {...column, render}
				} else {
					return {...column}
				}
			})
			return editColumn
		},
		addEditTable() {
			if (this.isAddEditTable) {
				this.$Message.warning('请先取消新增空行！')
				return
			}
			let addItem = {}
			const itemKey = Object.keys(this.data[0])
			itemKey.forEach(item => {
				addItem[item] = ''
			})
			this.editData.push(addItem)
			this.isAddEditTable = true
			this.editIndex = this.editData.length - 1
		}
	}
}
</script>