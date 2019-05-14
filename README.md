# select-components
使用`typescript`实现的`select`选择框

### 使用
```typescript
  const node = document.getElementById(id);
  let select = new Select(node);
```

### 对外接口
@method setOption 设置下拉选项

@method getValue 获取选中的下拉项

@method setPlaceholder 设置placeholder

@method onchange 选中的值更新时，可触发onchange事件

### 示例
```typescript
  import Select from '@/common/scripts/select';
  let provinceBox : Select;
  const node = document.getElementById('select-1');
  const province = [
    {
      txt: '上海',
      value: '上海'
    },
    {
      txt: '北京',
      value: '北京'
    },
    {
      txt: '广东',
      value: '广东'
    },
  ]
  provinceBox = new Select(node);
  $('.input').on('click', function() {
    provinceBox.setOption(province);
  })
  provinceBox.onchange(() => {
    console.log('change success');
  });
```
