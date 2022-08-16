// 所有操作数据的 方法和属性都放在model

import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';
// 用个对象来存储数据 类似于vuex
export const state = {
  recipe: {},
  search: {
    query: '',
    // 存储查询返回的结果 用来展示左侧边栏
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  // 存储标记过的食谱
  bookmarks: [],
};
// 生成格式化的食谱数据
const createRecipeObject = function (data) {
  // let recipe = data.data.recipe;
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    // COOL  如果recipe.key不存在 什么都不会发生
    // 如果recipe.key为TRUE  直接执行{key:recipe.key} 并进一步进行解构  key:recipe.key
    ...(recipe.key && { key: recipe.key }),
  };
};

// 加载对应id的食谱  并存储在一个state.recipe对象中
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);
    console.log(state.bookmarks);

    //加载食谱时 只要之前标记过 的菜单就会在bookmarks中出现 当再次回到这个菜单时候只要从bookmarks里面寻找 只要有一个就可以将bookmarked设置为TRUECOOL
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    // 给每个加载的食谱都加上bookmarked属性
    else state.recipe.bookmarked = false;
  } catch (error) {
    // console.error(`${error} 💥💥💥`);
    //就算id错误 getJSON也会返回一个坏的(400)promise 但是状态还是fullfilled 所以需要在catch这里rethrow一个错误
    // 这样子返回的promise状态为rejected
    throw error;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // 每次重新搜索加载后都要重置当前页
    state.search.page = 1;
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt = oldQt * (newServings / oldServings)
    // 先求每人 的份量，再乘以新的总人数就可得到新的总份量
  });
  state.recipe.servings = newServings;
};

// 本地存储COOL

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// 订购食物  添加标签的时候是整个食物传进来  需要一些具体信息设置
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
// 取消订购  取消订购某项食物 只需要id   NICE
export const deleteBookmark = function (id) {
  //Delete bookmark from bookmarks
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipe as   NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  // console.log(state.bookmarks);
  persistBookmarks();
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear();
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // 将对象转为数组
    // 整理表单数据
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format:)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
// 0: (2) ['ingredient-1', '0.5,kg,Rice']
// 1: (2) ['ingredient-2', '1,,Avocado']
// 2: (2) ['ingredient-3', ',,salt']
