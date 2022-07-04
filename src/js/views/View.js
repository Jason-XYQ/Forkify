import icons from 'url:../../img/icons.svg'; //Parcel 2

export default class View {
  _data;

  render(data) {
    //data为null或undefined  或数组为空
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    console.log(this._data);
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    // 将字符串转化为真正的DOM元素
    // 虚拟DOM

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    console.log(newDOM);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    console.log(newElements);
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //Update changed Text

      // 元素节点的nodeValue为null
      // 发生变化的文本节点
      if (
        !newEl.isEqualNode(curEl) &&
        // 文本节点
        newEl.firstChild?.nodeValue.trim() != ''
      ) {
        // console.log('💥', newEl.firstChild, newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      //Update changed Attibutes
      // 元素节点的属性值 如data-update-to的值
      if (!newEl.isEqualNode(curEl)) {
        console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
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
