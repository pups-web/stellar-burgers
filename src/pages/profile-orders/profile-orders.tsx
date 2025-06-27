import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders, getUserOrdersLoading } from '../../services/chooseOnes';
import { getOrdersThunk } from '../../services/slices/usersSlice';
import { Preloader } from '../../components/ui/preloader';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);
  const orders: TOrder[] = useSelector(getUserOrders);
  const isOrdersLoading = useSelector(getUserOrdersLoading);
  return (
    <>{isOrdersLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />}</>
  );
};
