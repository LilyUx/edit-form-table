<template>
	<div class="can-edit-table">
		<div class="can-edit-table-header">
			<h3>{{title}}</h3>
			<Button class="add-btn" @click="addEditTable">{{addText}}</Button>
		</div>
		<Table
			:height="height"
			:loading="loading"
			:stripe="stripe" 
			:columns="columns" 
			:data="editData">
			<template v-for="(column,idx) in columns" slot-scope="{ row, index }" :slot="column.slot">
				<div :key="column.slot" v-if="column.slot === 'action'">
					<div v-if="editIndex === index">
						<span class="save-btn" @click="handleSave(row)">保存</span>
						<Divider type="vertical" />
						<span class="cancel-btn" @click="handleCancel()">取消</span>
					</div>
					<div v-else>
						<span class="modify-btn" @click="handleEdit(index)">修改</span>
						<Divider type="vertical" />
						<Poptip @on-ok="delRow(row)" confirm title="是否删除?" transfer>
							<span class="delete-btn">删除</span>
						</Poptip>
					</div>
				</div>
				<div :key="column.slot" v-else style="padding: 22px 0">
					<template v-if="editIndex === index">
						<!-- input 输入框-->
						<template v-if="column.type === 'input'">
							<Form :ref="'formDynamic'+idx" :model="row">
								<FormItem :prop="column.slot" :rules="column.validate">
									<Input 
									:value="row[column.slot]"
									:clearable="column.clearable || false"
									:disabled="column.disabled  || false"
									@on-change="event => onChangeInput(event, index, column.slot)"
									:placeholder="column.placeholder || '请输入'"/>
								</FormItem>
							</Form>
						</template>
						<!-- select 选择框-->
						<template v-else-if="column.type === 'select'">
							<Form :ref="'formDynamic'+idx" :model="row">
								<FormItem :prop="column.slot" :rules="column.validate">
									<Select 
										:value="row[column.slot]"
										:clearable="column.clearable  || false"
										:disabled="column.disabled  || false"
										:multiple="column.multiple  || false"
										@on-change="value => onChangeSelect(value, index, column.slot)"
										:placeholder="column.placeholder || '请选择'">
										<Option 
											v-for="i in column.item" 
											:key="i.value" 
											:value="i.value">{{i.label}}</Option>
									</Select>
								</FormItem>
							</Form>
						</template>
						<!-- switch 开关-->
						<template v-else-if="column.type === 'switch'">
							<i-switch
								@on-change="value => onChangeSwitch(value, index, column.slot)"
								:value="Boolean(row[column.slot])"></i-switch>
						</template>
						<!-- date 日期-->
						<template v-else-if="column.type === 'date'">
							<DatePicker 
								type="date"
								@on-change="date => onChangeDate(date, index, column.slot)"
								:value="row[column.slot]"
								:placeholder="column.placeholder || '请选择时间'">
							</DatePicker>
						</template>
						<!-- cascader 级联选择框-->
						<template v-else-if="column.type === 'cascader'">
							<Cascader
							@on-change="value => onChangeCascader(value, index, column.slot)"
							:data="column.item" 
							:value="[row[column.slot]]"></Cascader>
						</template>
					</template>
					<span v-else>{{ row[column.slot] }}</span>
				</div>
			</template>
		</Table>
	</div>
</template>

<script>
/**
 * 可编辑表格组件
 * ## Props
    1. columns的数据格式如下
        * `type: "select"` 支持 multiple (多选)
        * `type: "select" || type: "input"` 支持placeholder、clearable、disabled、validate
        * `type: "select" || type: "cascader"` 必须添加`item:[]`,下拉选择框的数据
        ```
        {
          title: "姓名", // 表头文字
          slot: "name", // 表格每行的key
          type: 'input', // 编辑时的编辑内容
          placeholder: '', // 输入框的提示信息、type为input、select支持placeholder
          clearable: true, // 是否可被删除，type为input、select支持clearable
          disabled: true, // 是否可被禁用，type为input、select支持disabled
          validate: [ // 校验信息，type为input、select支持validate
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
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
        ```

    2. `data: []` 填充表格的数据

        `key` 和 `columns` 中的 `slot` 保持一致
        ```
        {
          name: "王小明",
          age: '18',
          sex: 'men',
          alive: true,
          birthday: "919526400000",
          address: "北京市朝阳区芍药居"
        },
        ```
    3. `title` 可编辑表格的标题
    4. `addText` 添加按钮的文字信息
    5. `height` 表格的高度
    6. `stripe` 是否显示间隔斑马纹
    7. `loading` loading状态

    ## Options
    1. `saveEditTable(row)` 保存当前数据
    1. `deleteEditTable(row)` 删除当前数据
 */
const lodash = require('lodash');
import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import {Divider} from 'view-design';
export default {
  name: 'edit-form-table',
	data() {
		return {
			isAddEditTable: false,
			editData: [],
			editIndex: -1, // 当前聚焦的输入框的行数
		};
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
	watch: {
		data (val) {
			this.editData = lodash.cloneDeep(val)
		}
	},
	created () {
		this.editData = lodash.cloneDeep(this.data)
	},
	methods: {
		onChangeInput(event, index, key) {
			const newInputValue = {
				[key]: event.target.value
			}
			Vue.set(this.editData, index, Object.assign({}, {...this.editData[index]}, newInputValue))
			
		},
		onChangeSelect(value, index, key) {
			const newSelectValue = {
				[key]: value
			}
			Vue.set(this.editData, index, Object.assign({}, {...this.editData[index]}, newSelectValue))
			
		},
		onChangeSwitch(value, index, key) {
			const newSwitchValue = {
				[key]: value
			}
			Vue.set(this.editData, index, Object.assign({}, {...this.editData[index]}, newSwitchValue))
		},
		onChangeDate(date, index, key) {
			const newDateValue = {
				[key]: date
			}
			Vue.set(this.editData, index, Object.assign({}, {...this.editData[index]}, newDateValue))
		},
		onChangeCascader(value, index, key) {
			const newCascader = {
				[key]: value.toString()
			}
			Vue.set(this.editData, index, Object.assign({}, {...this.editData[index]}, newCascader))
			
		},
		addEditTable() {
			if (this.isAddEditTable) {
				this.$Message.warning('请先新增空行数据或取消空行！')
				return
			}
			let newRow = {}
			this.columns.forEach(element => {
				if(element.type === 'switch') {
					newRow[element.slot] = false
				} else {
					newRow[element] = ''
				}
			});
			this.editData.push(newRow)
			this.isAddEditTable = true
			this.editIndex = this.editData.length - 1
		},
		handleEdit(index) {
			if (this.isAddEditTable) {
				this.$Message.warning('请先新增空行数据或取消空行！')
				return
			}
			this.editIndex = index;
		},
		handleSave(row) {
			let isValid = true
			for (let i = 0, len = this.columns.length; i < len; i++) {
				const needValidate = (this.columns[i].type === 'input' || this.columns[i].type === 'select') && this.columns[i].validate && this.columns[i].validate.length
				if (needValidate) {
					this.$refs['formDynamic' + i][0].validate(valid => {
						if (!valid) {
							isValid = false
							return
						}
					})
				}
			}

			if(isValid) {
				this.editIndex = -1;
				this.isAddEditTable = false
				this.$emit('saveEditTable', row)
			}
		},
		handleCancel() {
			if (this.isAddEditTable) {
				this.editData.splice(-1, 1)
			}
			this.isAddEditTable = false
			this.editIndex = -1
		},
		delRow(row) {
			this.$emit('deleteEditTable', row)
		}
	}
};
</script>

<style lang="stylus">
.can-edit-table {
	.can-edit-table-header {
		padding: 12px 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.ivu-table-wrapper {
		overflow: inherit;
	}
	.ivu-table, .ivu-table-cell {
		overflow: inherit
	}
	.ivu-form-item {
		margin-bottom: 0;
		vertical-align: auto
	}

	.add-btn {
		color: #fff;
		background: #1890ff;
		border-color: #1890ff;
		padding: 0 24px;
		&:hover {
			color: #fff;
			background: #1890ff;
			border-color: #1890ff;
		}
	}
	.modify-btn, .save-btn {
		color: #1890ff;
		cursor: pointer;
	}
	.delete-btn {
		color: #FF4C38;
		cursor: pointer;
	}
	.cancel-btn {
		cursor: pointer;
	}
}
</style>