import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectFeed, selectFeedOrders } from '@selectors';
import {
  MAX_SHOWN_ORDERS,
  ORDER_STATUS_DONE,
  ORDER_STATUS_PENDING
} from '../../utils/constants';

const getOrdersByStatus = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((order) => order.status === status)
    .map((order) => order.number)
    .slice(0, MAX_SHOWN_ORDERS);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const feed = useSelector(selectFeed);

  const readyOrders = getOrdersByStatus(orders, ORDER_STATUS_DONE);
  const pendingOrders = getOrdersByStatus(orders, ORDER_STATUS_PENDING);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
