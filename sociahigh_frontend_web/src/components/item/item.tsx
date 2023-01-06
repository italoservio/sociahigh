import React from 'react';
import CoinSVG from '../../assets/svgs/coin.svg';
import PersonSVG from '../../assets/svgs/person.svg';
import {User} from '../../hooks/use-users-api/types';

export function ItemNameAndPrice(props: {
  name: string;
  value: number;
  user?: User;
}) {
  return (
    <div className='flex flex-col'>
      <b>{props.name}</b>
      <div className='-mt-1 flex gap-1'>
        <img src={CoinSVG} />
        <span>{props.value}</span>
      </div>
      {!!props.user && (
        <div className='-mt-1 flex gap-1'>
          <img src={PersonSVG} />
          <span>{`${props.user.first_name} ${props.user.last_name}`}</span>
        </div>
      )}
    </div>
  );
}
