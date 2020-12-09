# 属性
  <CommonModalForm
[*]     visible={visible}  // 控制是否弹框 
[*]     saveUrl={['xxx','xxx']} // 分别对应新增/编辑url  若相同可只简写为['xxx']
[*]     formItems={formItems}   // 列表项
[*]     formData={formData} // 编辑回显数据  该对象为空则是新增，否则是编辑
        initialValues={initialValues} // 初始默认数据
        handleFieldsValue={handleFieldsValue} // 自定义数据处理方法
[*]     handleCallback={(v) => handleCallback} // 成功后的回调方法  v：create | update
[*]     handleCancel={handleCancel} // 关闭弹窗方法 setVisible(false) setFormData({})
        mapPropsToFields={（value）=> mapPropsToFields(value)} // 自定义回显方法,需要返回一个对象
        title=['xxx','xxx'] // modal标题，分别对应新增/编辑
        buttonName=['xxx','xxx']  // 按钮标题，分别对应保存/取消
        messageInfo=['xxx','xxx'] // 成功之后的提示语，分别对应新增/编辑
        {...rest} // 其他modal可以接受的属性
  />
  
 # formItem属性
   formItem:[{
[*]  type:"input"  // 类型
[*]  key:"xxx"
[*]  title:"xxx"
     rules:[],
     readOnly:['false','false'] // 分别对应新增/编辑是否禁用
     hide:false, // 是否隐藏
     maxLength: 20 // 当类型为input和textArea时与rules双重限制输入
     {...rest}  // 其他可以接受的属性
   }]
   
