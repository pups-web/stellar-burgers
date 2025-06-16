import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          className={({ isActive }) =>
            clsx(styles.link, isActive && styles.link_active)
          }
          to='/'
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={clsx(
                  'text text_type_main-default ml-2 mr-10',
                  isActive ? styles.text_active : styles.text
                )}
              >
                Конструктор
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            clsx(styles.link, isActive && styles.link_active)
          }
          to='/feed'
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={clsx(
                  'text text_type_main-default ml-2',
                  isActive ? styles.text_active : styles.text
                )}
              >
                Лента заказов
              </p>
            </>
          )}
        </NavLink>
      </div>
      <NavLink className={styles.link} to='/'>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
      </NavLink>
      <div className={styles.link_position_last}>
        <NavLink
          className={({ isActive }) =>
            clsx(styles.link, isActive && styles.link_active)
          }
          to='/profile'
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={clsx(
                  'text text_type_main-default ml-2',
                  isActive ? styles.text_active : styles.text
                )}
              >
                {userName || 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
