import React, { FC, memo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

interface OrderInfoUIProps {
  orderNumber: number;
  burgerName: string;
  orderStatus: string;
  ingredientsInfo: Record<string, any>;
  total: number;
  date: Date;
}

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(
  ({ orderNumber, burgerName, orderStatus, ingredientsInfo, total, date }) => (
    <div className={styles.wrap}>
      {/* Убрали заголовок "Детали заказа" */}
      <h3
        className={`text text_type_digits-default pb-3 pt-10 ${styles.number}`}
      >
        #{orderNumber}
      </h3>
      <h4 className={`text text_type_main-medium pb-3 ${styles.burgerName}`}>
        {burgerName}
      </h4>
      <p className={`text text_type_main-default pb-3 ${styles.status}`}>
        {orderStatus === 'done'
          ? 'Выполнен'
          : orderStatus === 'pending'
            ? 'Готовится'
            : 'Создан'}
      </p>
      <p className={`text text_type_main-medium pt-15 pb-6`}>Состав:</p>
      <ul className={`${styles.list} mb-8`}>
        {Object.values(ingredientsInfo).map((item, index) => (
          <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
            <div className={styles.img_wrap}>
              <div className={styles.border}>
                <img
                  className={styles.img}
                  src={item.image_mobile}
                  alt={item.name}
                />
              </div>
            </div>
            <span className='text text_type_main-default pl-4'>
              {item.name}
            </span>
            <span
              className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
            >
              {item.count} x {item.price}
            </span>
            <CurrencyIcon type={'primary'} />
          </li>
        ))}
      </ul>
      <div className={styles.bottom}>
        <p className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={date} />
        </p>
        <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
          {total}
        </span>
        <CurrencyIcon type={'primary'} />
      </div>
    </div>
  )
);
