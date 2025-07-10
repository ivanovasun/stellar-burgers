import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { NotFound404 } from '@pages';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredientData = useSelector((state) => state.ingredients.items);
  const ingredientSelected = ingredientData.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  if (!ingredientSelected) {
    return <NotFound404 />;
  }

  return <IngredientDetailsUI ingredientData={ingredientSelected} />;
};
