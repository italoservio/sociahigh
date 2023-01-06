import {HTMLAttributes} from 'react';
import {Link as ReactRouterDomLink, LinkProps} from 'react-router-dom';

export function Link(props: LinkProps & HTMLAttributes<HTMLAnchorElement>) {
  return (
    <ReactRouterDomLink
      {...props}
      className='font-sans border-b h-6 border-orange-600 text-orange-600 transition hover:text-orange-700 hover:border-orange-700'
    >
      {props.children}
    </ReactRouterDomLink>
  );
}
