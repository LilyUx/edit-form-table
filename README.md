# can-edit-table

> 基于iview开发的可编辑表格组件

> version: 0.0.1

> Author: LilyXu

## Feature
1. 可编辑表格支持input、select、switch、date（时间选择器）、cascader（级联选择器）
  `type: 'input'`

2. input、select支持表单校验

## Use
1. `npm install edit-form-table --save` or  `yarn add edit-form-table`

2. 使用插件必须传入一个dom元素，例如：
  ```
    import edit-form-table from 'edit-form-table'

    <edit-form-table
      :columns="columns"
      :loading="loading"
      :data="data"
      @saveEditTable="saveEditTable"
      @deleteEditTable="deleteList"
    />
  ```

## Props
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