import { useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// Type checking is looser in JS, but these provide consistency
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

