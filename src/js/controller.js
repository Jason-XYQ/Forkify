// Control调用model的方法获取数据  然后再调用View的方法渲染页面

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
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
    // 左侧栏中选中的食物会出现高亮
    resultView.update(model.getSearchResultsPage());
    //1)Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2)Loading recipe  Control让model去发请求拿数据
    //Control调用model中的方法获取数据并存储在一个对象state.recipe中
    await model.loadRecipe(id);
    //aync function returns a promise BUG 此处不能少了await
    // const { recipe } = model.state;
    //3) Rendering recipe  Control让recipeView将食谱数据渲染在页面中（右侧边栏）
    //等数据返回后  Control取得数据后调用View中的方法渲染页面
    recipeView.render(model.state.recipe);
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
    // 2)Load search results   Control让model去发请求拿数据
    await model.loadSearchResults(query);

    //3)Render results    Control让recipeView将食谱数据渲染在页面中（左侧边栏）
    resultView.render(model.getSearchResultsPage());

    //4)Render pagination button

    // 传入的是一个对象  因为不仅要用到数组结果 还有页码那些
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults();

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
  // 点击订购按钮后高亮  只更新订购这个按钮 不需要重载整个页面  update非常好用COOL：

  recipeView.update(model.state.recipe);

  //3)Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const conrtrolBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//Upload new Recipe

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Change ID in URL
    // pushState(state，title，url) 可以改变url但不需要重载页面
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2500);
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    addRecipeView.renderError(error);
  }
};
const init = function () {
  //订阅者: Code that wants to react:SUBSCRIBER
  bookmarksView.addHandlerRender(conrtrolBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPage);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
// ['hashchange','load'].forEach(ev=>window.addEventListener(ev,controlRecipe))
