# 属性
 <CommonSearchForm
[*]      searchItems={searchItems}   // 查询项
[*]      fetchParams={{ type: "xxx/xxx",url: "xxx/xxx",extraArgs:{}}}
         initValue={initValue} // 表单初始化回显数据
[*]      saveFormValues={v => setFormValues({ ...formValues,...v})}
[*]      handleFormReset={() => setFormValues({}})}
         handleFieldsValue={this.handleFieldsValue}  // 自定义数据处理方法（最常见的时间格式化等）
    />
    
   searchItem:{
     title:"xxx"
     key:"xxx"
     type:"input"  // 类型
     rules: []  // 自定义校验规则
     {...rest}  // 其他可以接受的属性
   }
   
    
