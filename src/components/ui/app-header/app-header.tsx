import React, { FC } from 'react';
import { Link, NavLink, useMatch } from 'react-router-dom';
import clsx from 'clsx';

import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

const getLinkClassName = (isActive: boolean) =>
  clsx(styles.link, 'text', 'text_type_main-default', {
    [styles.link_active]: isActive
  });

const getIconType = (isActive: boolean) => (isActive ? 'primary' : 'secondary');

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const constructorMatch = useMatch('/');
  const ingredientMatch = useMatch('/ingredients/:id');
  const isConstructorActive = Boolean(constructorMatch || ingredientMatch);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to='/' className={getLinkClassName(isConstructorActive)}>
            <BurgerIcon type={getIconType(isConstructorActive)} />
            <p className='ml-2 mr-10'>Конструктор</p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) => getLinkClassName(isActive)}
          >
            {({ isActive }) => (
              <>
                <ListIcon type={getIconType(isActive)} />
                <p className='ml-2'>Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) => getLinkClassName(isActive)}
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={getIconType(isActive)} />
                <p className='ml-2'>{userName || 'Личный кабинет'}</p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
