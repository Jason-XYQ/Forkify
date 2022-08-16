import View from './View';
import icons from 'url:../../img/icons.svg'; //Parcel 2
class addRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was successfully upload :)';

  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this.addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    // toggle 有则去掉 无则添加
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  addHandlerShowWindow() {
    // BUG监听函数里面需要重新绑定回调函数的this  否则默认指向绑定事件的元素也就是btnOpen
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    // 给form表单绑定监听事件  这里也用了事件委托 只有按钮才能触发submit事件  点击页面其他地方没用用
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      // COOL 一个新的 API 获取表单数据
      const dataArr = [...new FormData(this)];
      console.log(dataArr);
      // COOL 将数组内容转化为对象的形式
      // Object.fromEntries与Object.entries作用相反
      const data = Object.fromEntries(dataArr);
      // 表单数据需要上传 用到model 需要control协调
      handler(data);
    });
  }

  _generateMarkup() {}
}
export default new addRecipeView();
