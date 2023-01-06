import React, {FormEvent, useCallback} from 'react';
import currency from 'currency.js';

export default function useMask() {
  const onDateInputKeyUp = useCallback((e: FormEvent<HTMLInputElement>) => {
    e.currentTarget.maxLength = 10;
    let val = e.currentTarget.value;
    val = val.replace(/\D/g, '');

    if (val.length > 4) {
      /* prettier-ignore */
      e.currentTarget.value = `${val.slice(0, 2) 
        }/${val.slice(2, 4)
        }/${val.slice(4)
        }`;
      return;
    }

    if (val.length > 2) {
      e.currentTarget.value = `${val.slice(0, 2)}/${val.slice(2)}`;
      return;
    }

    e.currentTarget.value = val;
  }, []);

  const onHourInputKeyUp = useCallback((e: FormEvent<HTMLInputElement>) => {
    e.currentTarget.maxLength = 5;
    let val = e.currentTarget.value;
    val = val.replace(/\D/g, '');

    if (val.length > 2) {
      e.currentTarget.value = `${val.slice(0, 2)}:${val.slice(2)}`;
      return;
    }

    e.currentTarget.value = val;
  }, []);

  const onCurrencyInputKeyUp = useCallback((e: FormEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value;
    val = val.replace(/\D/g, '');
    val = currency(val, {fromCents: true}).format({
      symbol: 'R$',
      separator: '.',
      decimal: ',',
      precision: 2,
      pattern: '! #',
    });
    e.currentTarget.value = val;
  }, []);

  return {onDateInputKeyUp, onHourInputKeyUp, onCurrencyInputKeyUp};
}
