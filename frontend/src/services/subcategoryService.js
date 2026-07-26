import api from './api';

export const getSubcategoriesByCollection = async (collectionSlug) => {
  try {
    const response = await api.get(`/subcategories/collection/${collectionSlug}`);
    return response;
  } catch (error) {
    throw error;
  }
};