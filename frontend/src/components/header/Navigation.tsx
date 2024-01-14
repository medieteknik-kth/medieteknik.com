import Link from 'next/link';

export enum AllowedEventTypes {
  'click',
  'hover'
}

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

const generalStyle = 'w-full h-full flex items-center';
const iconStyle = (hasIcon: boolean) => { return hasIcon ? 'justify-start' : 'justify-center'};

export const NavItem = (item: BaseNavItem): JSX.Element => {
  let linkRepr = undefined
  let iconRepr = <></>

  if(item.metadata != undefined) {
    iconRepr = (item.metadata.icon != undefined) ? <item.metadata.icon className='w-6 h-6' /> : <></>
    linkRepr = (item.metadata.link != undefined) ? item.metadata.link : undefined
  }

  if(item.event != undefined) {
    return (
      <div className={`${generalStyle} ${iconStyle(iconRepr != undefined)}`}
      onMouseDown={ (event) => {
        const customEvent = item.event != undefined ? item.event : undefined
        if(customEvent != undefined && customEvent.type === AllowedEventTypes.click) {
          customEvent.callback(event)
        }
      }} 
      onMouseEnter={(event) => {
        const customEvent = item.event != undefined ? item.event : undefined
        if(customEvent != undefined && customEvent.type === AllowedEventTypes.hover) {
          customEvent.callback(event)
        }
      }}>
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
  )}

  return (
    <div className={`${generalStyle} ${iconStyle(iconRepr != undefined)}`}>
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