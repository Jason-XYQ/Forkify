import View from './View.js';

// import icons from '../img/icons.svg'; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2
var fracty = require('fracty');
// 以下这个API用不了
// import { Fraction } from 'fractional';
class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  //发布者: Code that knows when to react:PUBLISHER
  addHandlerRender(handler) {
    // 监听地址栏变化和加载事件
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerServings(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      // button上有个data属性 data-update-to  由css转化为js会去掉data 驼峰写法updateTo 存放在dataset
      // NICEconst updateTo = +btn.dataset.updateTo;
      const { updateTo } = btn.dataset;
      // 字符串转数字
      if (+updateTo > 0) handler(+updateTo);
    });
  }
  addHandlerAddBookmark(handler) {
    this._parentEl.addEventListener('click', function (e) {
      // 向上查找按钮btn  以防点击到了svg等元素没有反应
      const btn = e.target.closest('.btn-bookmark');
      if (!btn) return;
      handler();
    });
  }
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>
  
    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>
  
        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to =${
            this._data.servings - 1
          } >
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to =${
            this._data.servings + 1
          } >
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
  
      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
       <svg>
        <use href="${icons}#icon-user"></use>
       </svg>
      </div>
      <button class="btn--round btn-bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>
  
    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this._data.ingredients
        // 将每一项成分都装入数组，之后再转换为一个长字符串
        .map(ing => {
          return `
        <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          // ing.quantity
          ing.quantity ? fracty(ing.quantity).toString() : ''
          // new Fraction(ing.quantity).toString()
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
        `;
        })
        .join('')}
    </div>
  
    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    `;
  }
}
export default new RecipeView();
// 与页面的呈现相关  操作DOM
// 直接导出一个实例对象，方便其他地方（会变得更简洁）引入该类，并使用类中的属性和方法（不然在其他地方引入了之后也要创建该类对象）
