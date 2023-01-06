import ReactTooltip, {TooltipProps} from 'react-tooltip';
import styles from './styles.module.css';

export function Tooltip(props: Partial<TooltipProps>) {
  return (
    <ReactTooltip
      {...props}
      type='dark'
      effect='solid'
      className={styles['custom-tooltip']}
    />
  );
}
