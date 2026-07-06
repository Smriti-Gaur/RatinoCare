import {
  useDispatch,
  useSelector,
} from "react-redux";

export const useAppDispatch = () => useDispatch();

export const useAppSelector = useSelector;

const dispatch = useAppDispatch();

const user = useAppSelector(
  state => state.auth.user
);