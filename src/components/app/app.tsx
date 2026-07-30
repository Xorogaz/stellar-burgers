import { FC, useEffect } from 'react';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { useDispatch } from '../../services/store';
import { checkUserAuth, fetchIngredients } from '@slices';

const INGREDIENT_TITLE = 'Детали ингредиента';

const IngredientPage: FC = () => (
  <div className={styles.detailPageWrap}>
    <p className={`text text_type_main-large ${styles.detailHeader}`}>
      {INGREDIENT_TITLE}
    </p>
    <IngredientDetails />
  </div>
);

const OrderPage: FC = () => {
  const { number } = useParams<{ number: string }>();

  return (
    <div className={styles.detailPageWrap}>
      <p className={`text text_type_main-large ${styles.detailHeader}`}>
        #{number}
      </p>
      <OrderInfo />
    </div>
  );
};

const IngredientModal: FC = () => {
  const navigate = useNavigate();

  return (
    <Modal title={INGREDIENT_TITLE} onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};

const OrderModal: FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  return (
    <Modal title={`#${number}`} onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};

const App: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const backgroundLocation = (location.state as { background?: Location })
    ?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderPage />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth component={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth component={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute component={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute component={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute component={<OrderPage />} />}
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path='/feed/:number' element={<OrderModal />} />
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route
            path='/profile/orders/:number'
            element={<ProtectedRoute component={<OrderModal />} />}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
