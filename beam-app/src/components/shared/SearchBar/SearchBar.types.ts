import { InputProps } from '@onbeam/ui';
import { Dispatch, SetStateAction } from 'react';

export type SearchBarProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
} & InputProps;
