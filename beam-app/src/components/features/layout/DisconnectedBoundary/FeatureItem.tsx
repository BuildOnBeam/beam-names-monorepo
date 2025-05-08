import { text, vstack } from '@onbeam/styled-system/patterns';
import { FeatureItemProps } from './FeatureItem.types';

export const FeatureItem = ({ title, children }: FeatureItemProps) => (
  <div className={vstack({ gap: '3', align: 'center', textAlign: 'center' })}>
    <h2 className={text({ style: 'lg', fontWeight: 'bold' })}>{title}</h2>
    <p className={text({ style: 'base', color: 'mono.300' })}>{children}</p>
  </div>
);
