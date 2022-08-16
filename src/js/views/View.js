// 所有与视图相关的操作如更新页面 渲染页面  清除页面 报错等信息都放在View

import icons from 'url:../../img/icons.svg'; //Parcel 2

export default class View {
  // 保护属性
  _data;
  // 在control中会调用这个方法，并且传递参数  在recipeView中暴露了一个实例对象 control引入后 可以调用该类方法
  // 这个方法每个页面view都会用到 因此把他放在父类
  // JSDocs
  /**
   * Render the recived object to the DOM
   * @param {Object | Object[]} data  The data to be rendered(e.g. recipe)
   * @param {boolean} render  If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if reder=flase
   * @this {Object} View instacnce
   * @author {Jason}
   * @todo Finish implementation
   */

  render(data, render = true) {
    //data为null或undefined  或数组为空
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return false;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    // 生成新的html 但不马上插入页面去渲染
    const newMarkup = this._generateMarkup();
    // 将字符串转化为真正的DOM元素
    // 虚拟DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // 获取新（虚拟）DOM里面的所有元素
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // 当前（真实）DOM里面的所有元素
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    // 比较新旧DOM元素 在原始的旧DOM的基础上修补
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // isEqualNode比较两个节点的内容是否一样 这两个节点不必相同类型（节点和元素的区别：整个页面由节点树（html header body div等）构成 节点可分为元素节点 文本节点 注释节点等）
      // console.log(curEl, newEl.isEqualNode(curEl));
      //Update changed Text
      // 元素节点的nodeValue为null
      // 内容 发生变化的文本节点
      if (
        !newEl.isEqualNode(curEl) &&
        // 文本节点 比如数字5
        newEl.firstChild?.nodeValue.trim() != ''
      ) {
        // console.log('💥', newEl.firstChild, newEl.firstChild?.nodeValue.trim());
        // 替换文本 也就是份量
        curEl.textContent = newEl.textContent;
      }
      //Update changed Attibutes
      // 元素节点的属性值 如data-update-to的值
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          // 设置属性
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentEl.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
  <div class="spinner">
   <svg>
    <use href="${icons}#icon-loader"></use>
   </svg>
  </div> 
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  // errorMessage存放在resultView/recipeView  而render方法存放在View中  通过resultView/recipeView实例对象调用超类中的方法 并把自己身上的errorMessage传过去
  renderError(message = this._errorMessage) {
    const markup = `
  <div class="error">
   <div>
    <svg>
      <use href="${icons}.svg#icon-alert-triangle"></use>
    </svg>
   </div>
  <p>${message}</p>
 </div>
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
  <div class="error">
   <div>
    <svg>
      <use href="${icons}.svg#icon-smile"></use>
    </svg>
   </div>
  <p>${message}</p>
 </div>
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
