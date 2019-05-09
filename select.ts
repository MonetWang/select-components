import '@/assets/css/select.scss';

enum Constant {
  PLACE_HOLDER = '请选择',
  LOADING = 'loading...'
}

interface ISelectOption {
    [index: number] : {
      txt: string;
      value: string;
    };
    [propName: string]: any;
}

class Select {
  private currNode: HTMLElement; // 当前节点
  private options: ISelectOption; // 下拉选项
  private selectNode: HTMLElement; // 选择框
  private optionNode: HTMLElement; // 下拉框 
  private selectedValue: string; // 当前选中的值

  constructor(node: HTMLElement) {
    this.currNode = node;
    this._init();
  }

  /**
   * 组件初始化
   * @method _init
   */
  private _init() {
    this.render();

    const that = this;

    // 开关
    this.selectNode.isShow = false;

    // 绑定打开下拉框事件
    this.selectNode.addEventListener('click', function (e) {
      const optListNode: HTMLElement = <HTMLElement>this.nextElementSibling;

      // 给当前选中框增加选中样式
      that.addSelectionFocused(this);
      
      // 关闭其他已经打开的选择框
      that.closeOtherComboBox();

      // trigger 当前选中的选择框
      that.triggerComboBox(optListNode, that.selectNode.isShow);

      // 给下拉选项添加绑定事件
      that.bindOption();

      // 阻止冒泡事件
      that.stopBubble(e);
    })

    // 关闭下拉框
    this.clickAnyTOClose();
  }

  /**
   * 绘制选择框
   * @method render
   */
  private render() {
    let eleContent: string = [
      '<div class="select-selection">',
      '<input type="hidden" _value="">',
      '<span class="select-span">'+ Constant.PLACE_HOLDER +'</span>',
      '<i class="select-icon"></i>',
      '</div>',
      '<div class="select-dropdown">',
      '<ul class="option-list">',
      '<li class="select-disabled">' + Constant.LOADING + '</li>',
      '</ul>',
      '</div>',
    ].join(' ');

    this.currNode.innerHTML = eleContent;

    // 获取选择框
    this.selectNode = <HTMLElement>this.currNode.children[0];
    // 获取下拉框
    this.optionNode = <HTMLElement>this.currNode.children[1];
  }

  /**
   * 对外接口
   * - 设置下拉选项
   * @method setOption
   * @param options
   */
  public setOption(options: ISelectOption) {
    const ulNode: HTMLElement = <HTMLElement>this.optionNode.children[0];
    let liContent: Array<any> = [];

    this.options = options;

    this.options.forEach(element => {
      liContent.push(`<li value="${element.value}">${element.txt}</li>`)
    });

    ulNode.innerHTML = liContent.join(' ');
  }

  /**
   * 对外接口
   * - 获取选中的下拉项
   * @method getValue
   * @return string | null
   */
  public getValue() {
    return this.selectedValue ? this.selectedValue : null;
  }

  /**
   * 对外接口
   * - 设置 select 的 placeholder 值
   * @method setPlaceholder
   * @param placeholder 
   */
  public setPlaceholder(placeholder: string) {
    const spanNode: HTMLElement = <HTMLElement>this.selectNode.children[1];
    spanNode.innerHTML = placeholder;
  }

  /**
   * 对外接口
   * - 当 select 值改变时，触发的 onchange 事件
   * @method onchange
   * @param cb 
   */
  public onchange(cb : () => void) {
    const inputNode: HTMLElement = <HTMLElement>this.selectNode.children[0];

    inputNode.addEventListener('oninput', cb, false);

    Object.defineProperty(inputNode, '_value', {
      configurable: true,
      set: function(value) {
          this.value = value;
          cb();
      },
      get: function() {
          return this.value;
      }
    })
  }

  /**
   * 绑定选中的option
   * @method bindOption
   */
  private bindOption() {
    const that = this;
    const selectItem: HTMLCollection = this.optionNode.children[0].children;
    const inputNode: HTMLElement = <HTMLElement>this.selectNode.children[0];
    const spanNode: HTMLElement = <HTMLElement>this.selectNode.children[1];

    for (let i = 0, len = selectItem.length; i < len; i++) {
      selectItem[i].addEventListener('click', function () {
        const txt = this.getAttribute("value") ? this.getAttribute("value") : "";
        spanNode.innerHTML = txt;
        spanNode.classList.add("value");
        inputNode['_value'] = txt;
        that.selectedValue = txt;
      })
    }
  }

  /**
   * trigger 下拉框的显示与隐藏
   * @method triggerComboBox
   * @param node 
   * @param signature 
   */
  private triggerComboBox(node: HTMLElement, signature: boolean) {
    if (!signature) {
      this.selectNode.isShow = true;
      node.style.display = "block";
    }
    else {
      this.selectNode.isShow = false;
      node.style.display = "none";
    }
  }

  /**
   * 隐藏下拉框
   * @method closeComboBox
   * @param node 
   */
  private closeComboBox(node: HTMLElement) {
    node.style.display = 'none';
    this.selectNode.isShow = false;
  }

  /**
   * 点击当前下拉框时，隐藏其他下拉框
   * @method closeOtherComboBox
   */
  private closeOtherComboBox() {
    const allCombox: HTMLCollection = document.getElementsByClassName('select-dropdown');
    const that = this;
    for(let i = 0 , len = allCombox.length; i < len ; i++) {
      if(allCombox[i].parentElement.id != that.currNode.id) {
        const ele = <HTMLElement>allCombox[i];

        that.closeComboBox(ele);
        
        that.removeSelectionFocused(<HTMLElement>ele.previousElementSibling);
      }
    }
  }

  /**
   * 点击任意一处隐藏下拉框
   * @method clickAnyTOClose
   */
  private clickAnyTOClose() {
    const that = this;
    document.addEventListener('click', function (e) {
      
      that.closeComboBox(that.optionNode);
      
      that.removeSelectionFocused(that.selectNode);
    })
  }

  /**
   * add 下拉框的选中样式
   * @method addSelectionFocused
   * @param node 
   */
  private addSelectionFocused(node: HTMLElement) {
    node.classList.add("select-selection-focused");
  }

  /**
   * remove 下拉框的选中样式
   * @method removeSelectionFocused
   * @param node 
   */
  private removeSelectionFocused(node: HTMLElement) {
    node.classList.remove("select-selection-focused");
  }

  /**
   * 阻止事件冒泡
   * @method stopBubble
   * @param e 
   */
  public stopBubble(e: Event) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    else {
      window.event.cancelBubble = true;
    }
    return false;
  }
}

export default Select;
