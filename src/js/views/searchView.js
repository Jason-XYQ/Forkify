class SearchView {
  // 搜索框
  _parentEl = document.querySelector('.search');

  getQuery() {
    // 获取搜索框里面的值
    const query = this._parentEl.querySelector('.search__field').value;
    // 清空搜索框的内容
    this._clearInput();
    return query;
  }
  //Private  Can not be used outside NICE
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      // 关闭提交按钮的默认行为 否则页面会刷新跳转
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
