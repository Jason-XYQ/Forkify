import View from './View';
import icons from 'url:../../img/icons.svg'; //Parcel 2
class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again :)';
  _message = '';
  _generateMarkup() {
    //COOL  直接将generateMarkupPreview作为回调函数 而且每次会自动将数组的每一项直接作为参数传入回调函数
    // 这个思路很好 先生成所有的html 放在数组 并最后转为字符串  返回字符串  一次性插入页面
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    // console.log(result);
    // 去掉#
    //如果url上的id和结果中（左侧栏）的某一项相等 那就让它高亮
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link  ${
        result.id === id ? 'preview__link--active' : ''
      }"   href="#${result.id}">
        <figure class="preview__fig">
          <img src="${result.image}" alt="${result.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${result.title}</h4>
          <p class="preview__publisher">${result.publisher}</p>
          <div class="preview__user-generated ${result.key ? '' : 'hidden'}">
          <svg>
           <use href="${icons}#icon-user"></use>
          </svg>
         </div>
        </div>

    
       </a>
    </li>
    `;
  }
}
export default new ResultsView();
