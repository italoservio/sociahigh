import {HTMLAttributes} from 'react';
import {Link as ReactRouterDomLink, LinkProps} from 'react-router-dom';

export function MenuLink(props: LinkProps & HTMLAttributes<HTMLAnchorElement>) {
  return (
    <ReactRouterDomLink
      {...props}
      className='font-sans text-xl mb-1 border-b-2 border-black text-black font-bold transition hover:text-orange-600 hover:border-orange-600'
    >
      {props.children}
    </ReactRouterDomLink>
  );
}
