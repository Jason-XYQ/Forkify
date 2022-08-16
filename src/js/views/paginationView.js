import View from './View';
import icons from 'url:../../img/icons.svg'; //Parcel 2
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  // 用户点击上一页和下一页的回调事件
  addHandlerClick(handler) {
    // 事件委托
    this._parentEl.addEventListener('click', function (e) {
      // 如果是点击了span等子元素 可以向上找到button   querySelector是向下查找
      const btn = e.target.closest('.btn--inline');
      //如果不是在button内点击  立即返回
      if (!btn) return;
      // 给button手动添加了data属性 用来记录要跳转的页码
      //字符串转化为数字
      const gotoPage = +btn.dataset.goto;
      // 真正执行controlPage函数的地方
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    // 总共的页数
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    console.log(numPages);

    //Page 1 and there are other pages

    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>
      `;
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return `
      <button  data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
      </button>  
      `;
    }
    //Other page
    if (curPage < numPages) {
      return `
      <button   data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
      </button>  
      <button   data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>
      `;
    }
    //Page 1 and there are No other pages
    return '';
  }
}

export default new PaginationView();
