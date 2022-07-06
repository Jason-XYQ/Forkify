import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

//为了使旧的浏览器也能运行这个程序
//polyfilling evrything else
import 'core-js/stable';
// polyfilling async await
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    //window.location指整个地址栏的url  hasn指#...
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());

    //1)Loading recipe
    //Control调用model中的方法获取数据
    await model.loadRecipe(id);
    //aync function returns a promise BUG 此处不能少了await
    // const { recipe } = model.state;
    //2) Rendering recipe
    //Control取得数据后调用View中的方法渲染页面
    recipeView.render(model.state.recipe);

    //3)Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // resultView.renderSpinner();

    //1)Get search query
    const query = searchView.getQuery();
    // searchView.clearInput();
    if (!query) return;
    // 2)Load search results
    await model.loadSearchResults(query);

    //3)Render results
    resultView.render(model.getSearchResultsPage());

    //4)Render pagination button

    // 传入的是一个对象  因为不仅要用到数组结果 还有页码那些
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
controlSearchResults();

const controlPage = function (gotoPage) {
  //3)Render New results
  resultView.render(model.getSearchResultsPage(gotoPage));

  //4)Render New pagination button

  // 传入的是一个对象  因为不仅要用到数组结果 还有页码那些
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  //Update the recipe servings (in case)
  model.updateServings(updateTo);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  //2)Update recipe view
  recipeView.update(model.state.recipe);
  //3)Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const conrtrolBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  //订阅者
  bookmarksView.addHandlerRender(conrtrolBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPage);
};
init();

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
