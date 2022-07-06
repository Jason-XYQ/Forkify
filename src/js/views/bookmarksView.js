import View from './View';
import icons from 'url:../../img/icons.svg'; //Parcel 2
class bookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';
  _generateMarkup() {
    //COOL  直接将generateMarkupPreview作为回调函数 而且每次会自动将数组的每一项直接作为参数传入回调函数
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    // console.log(result);
    // 去掉#
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
     
        </div>
       </a>
    </li>
    `;
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new bookmarksView();
