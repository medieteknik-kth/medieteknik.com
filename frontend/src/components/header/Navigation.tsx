import Link from 'next/link';

export const AllowedEventTypes = {
  click: 'click',
  hover: 'hover'
} as const;

export type AllowedEventTypes = typeof AllowedEventTypes[keyof typeof AllowedEventTypes];

/**
 * @interface BaseNavItem
 * @description The base navigation item
 * @param {string} title The title of the navigation item
 * @param {object} metadata The metadata of the navigation item
 * @param {string} metadata.link The link of the navigation item
 * @param {React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, 'ref'> & React.RefAttributes<SVGSVGElement>>} metadata.icon The icon of the navigation item
 * @param {object} event The event of the navigation item
 * @param {AllowedEventTypes} event.type The type of the event
 * @param {(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void} event.callback The callback of the event
 */
export interface BaseNavItem {
  title: string;
  metadata?: {
    link?: string;
    icon?: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, 'ref'> & React.RefAttributes<SVGSVGElement>>;
  }
  event?: {
    type: AllowedEventTypes;
    callback: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    
  };
}

const generalStyle = 'w-full h-full flex items-center justify-center';
const iconStyle = (hasIcon: boolean) => { return hasIcon ? 'justify-start' : ''};

export const NavItem = (item: BaseNavItem): JSX.Element => {
  let linkRepr = undefined
  let iconRepr = undefined

  if(item.metadata != undefined) {
    iconRepr = (item.metadata.icon != undefined) ? <item.metadata.icon className='w-6 h-6' /> : undefined
    linkRepr = (item.metadata.link != undefined) ? item.metadata.link : undefined
  }

  const handleEvent = (event: React.MouseEvent<HTMLDivElement>, eventType: AllowedEventTypes) => {
    if (item.event && item.event.type === eventType) {
      item.event.callback(event);
    }
  }

  // Conditional event handlers
  const eventHandlers = item.event ? {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => handleEvent(event, AllowedEventTypes.click),
    onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => handleEvent(event, AllowedEventTypes.hover)
  } : {};

  return (
    <div className={`${generalStyle} ${iconStyle(iconRepr != undefined)}`} {...eventHandlers}>
      {iconRepr && (
        <div className='mx-4'>{iconRepr}</div>
      )}
      {linkRepr ? (
        <Link href={linkRepr} className={generalStyle}>
          <p>{item.title}</p>
        </Link>
      ) : (
        <p className={generalStyle}> {item.title}</p>
      )}
    </div>
  )
}