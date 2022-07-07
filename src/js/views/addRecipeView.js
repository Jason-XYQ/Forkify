import View from './View';
import icons from 'url:../../img/icons.svg'; //Parcel 2
class addRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-windo');

  _generateMarkup() {}
}
export default new addRecipeView();
