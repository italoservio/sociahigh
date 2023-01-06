import currency from 'currency.js';
import {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {usePlacesWidget} from 'react-google-autocomplete';
import toast from 'react-hot-toast';
import {useParams} from 'react-router-dom';
import TrashSVG from '../../assets/svgs/trash.svg';
import {Button, IconButton} from '../../components/button';
import {Input} from '../../components/input';
import {ItemNameAndPrice} from '../../components/item';
import {Template} from '../../components/template';
import {TextArea} from '../../components/text-area';
import {SectionTitle} from '../../components/title';
import {useCoordinator} from '../../hooks/use-coordinator';
import {useEventsAPI} from '../../hooks/use-events-api';
import {Address, Item} from '../../hooks/use-events-api/types';
import useMask from '../../hooks/use-mask/use-mask';
import {ComponentTypeMapper, GoogleMapsPlaceResult, TempEvent} from './types';

export function EventDetail() {
  const {id} = useParams();
  const {goToHome} = useCoordinator();
  const {onDateInputKeyUp, onHourInputKeyUp, onCurrencyInputKeyUp} = useMask();
  const {
    createEvent,
    editEvent,
    addItemToEvent,
    retrieveEventById, //
  } = useEventsAPI();

  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState({} as TempEvent);
  const [address, setAddress] = useState({} as Address);
  const [address_input, setAddressInput] = useState('');
  const [item, setItem] = useState({} as {name: string; value: string});
  const [items, setItems] = useState(
    [] as (Pick<Item, 'name' | 'value' | 'user'> & {id?: string})[],
  );

  const {ref} = usePlacesWidget({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    onPlaceSelected,
    language: 'pt-BR',
    options: {
      // https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions
      types: [],
      componentRestrictions: {country: 'br'},
    },
  });

  useEffect(() => {
    if (id) {
      retrieveEventById(id).then(res => {
        const {address: temp_address, ...temp_event} = res.data;
        const starts_at = new Date(temp_event.starts_at);

        /* prettier-ignore */
        const time = `${
          starts_at.getHours().toString().padStart(2, '0')
        }:${starts_at.getMinutes().toString().padStart(2, '0')
        }`;

        /* prettier-ignore */
        const date = `${
          starts_at.getDate().toString().padStart(2, '0')
        }/${(starts_at.getMonth() + 1).toString().padStart(2, '0')
        }/${starts_at.getFullYear().toString()
        }`;

        setEvent({
          name: temp_event.name,
          description: temp_event.description,
          time,
          date,
        });
        setAddress(temp_address);
        setItems(
          temp_event.items.map(item => ({
            id: item.id,
            name: item.name,
            value: item.value,
            user: item.user,
          })),
        );
      });
    }
  }, []);

  function onInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    form: 'event' | 'item',
  ) {
    if (form === 'event') setEvent({...event, [e.target.name]: e.target.value});
    else setItem({...item, [e.target.name]: e.target.value});
  }

  function onPlaceSelected(place: GoogleMapsPlaceResult) {
    if (!place) return;

    const interesting_components = [
      'route',
      'street_number',
      'administrative_area_level_2',
      'administrative_area_level_1',
      'country',
      'postal_code',
    ];

    const temp_address = place.address_components.reduce((prev, curr) => {
      for (const type of curr.types) {
        if (!!~interesting_components.findIndex(el => el === type)) {
          return {
            ...prev,
            [ComponentTypeMapper.get(type) as keyof Address]: curr.short_name,
          };
        }
      }
      return prev;
    }, {} as Omit<Address, 'id'>);

    if (Object.keys(temp_address).length === 6) setAddress(temp_address);
    else toast.error('O endereço selecionado não é preciso o suficiente');
  }

  function onEventSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const {date, time, ...rest} = event;

    if (!date.replace(/\D/g, '').length || !time.replace(/\D/g, '').length) {
      toast.error('Data e Hora do evento precisam ser válidas');
      return;
    }

    if (Object.keys(address).length < 6) {
      toast.error('O endereço selecionado não é preciso o suficiente');
      return;
    }

    const date_arr = date.split('/');
    const date_str = `${date_arr[2]}-${date_arr[1]}-${date_arr[0]} ${time}`;
    const starts_at = new Date(date_str).toISOString();

    const payload = {...rest, starts_at, address};

    setLoading(true);
    const promise = !!id ? editEvent(id, payload) : createEvent(payload);

    promise
      .then(res => {
        const items_to_create = items.filter(item => !('id' in item));
        if (items_to_create.length) {
          addItemToEvent(res.data.id, items_to_create);
        }
      })
      .catch(() => {
        toast.error('Falha ao salvar evento. Tente novamente mais tarde.');
      })
      .finally(() => {
        toast.success(`Evento ${!!id ? 'editado' : 'criado'} com sucesso`);
        setLoading(false);

        setTimeout(() => {
          setLoading(false);
          goToHome();
        }, 500);
      });
  }

  function onItemSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let {name, value} = item;

    value = value.replace(/\D/g, '');

    if (!value.length) {
      toast.error('O valor do item não pode estar vazio');
      return;
    }

    setItem({} as {name: string; value: string});
    setItems(prev => [
      ...prev,
      {name, value: currency(value, {fromCents: true}).value},
    ]);
  }

  function onItemRemove(index: number) {
    const item = items[index];

    if (item.id) {
      // Remover no backend
    }

    const copy = [...items];
    copy.splice(index, 1);
    setItems(copy);
  }

  return (
    <Template title={!!id ? 'Sobre o evento' : 'Criar evento'} back={goToHome}>
      <form id={'event'} onSubmit={onEventSubmit}></form>
      <form id={'item'} onSubmit={onItemSubmit}></form>

      <div className='flex flex-col gap-2'>
        <Input
          form={'event'}
          label={'Nome do evento'}
          name={'name'}
          value={event.name || ''}
          onChange={e => onInputChange(e, 'event')}
          required={true}
        />

        <TextArea
          form={'event'}
          label={'Breve descrição'}
          rows={2}
          name={'description'}
          value={event.description || ''}
          onChange={e => onInputChange(e, 'event')}
          required={true}
        />

        <Input
          form={'event'}
          ref={ref}
          placeholder={''}
          label={'Endereço'}
          onChange={e => setAddressInput(e.target.value)}
          value={
            Object.keys(address).length
              ? `${address.place}, ${address.number}, ${address.city}, ${address.state}, ${address.country}`
              : address_input || ''
          }
          required={true}
        />

        <div className='grid grid-cols-2 gap-4'>
          <Input
            form={'event'}
            label={'Data do evento'}
            onKeyUp={onDateInputKeyUp}
            name={'date'}
            value={event.date || ''}
            onChange={e => onInputChange(e, 'event')}
            required={true}
          />

          <Input
            form={'event'}
            label={'Hora do evento'}
            onKeyUp={onHourInputKeyUp}
            name={'time'}
            value={event.time || ''}
            onChange={e => onInputChange(e, 'event')}
            required={true}
          />
        </div>
      </div>

      <div className='mt-6 mb-2'>
        <SectionTitle>Itens</SectionTitle>
        <div className='grid grid-cols-2 gap-4 mt-3'>
          <Input
            form={'item'}
            name={'name'}
            label={'Nome do item'}
            value={item.name ?? ''}
            onChange={e => onInputChange(e, 'item')}
            required={true}
          />
          <Input
            form={'item'}
            name={'value'}
            label={'Preço do item'}
            onKeyUp={onCurrencyInputKeyUp}
            value={item.value ?? ''}
            onChange={e => onInputChange(e, 'item')}
            required={true}
          />
        </div>
        <div className='flex justify-end mt-3'>
          <Button
            form={'item'}
            type={'submit'}
            outlined={false}
            variant={'orange'}
          >
            Adicionar Item
          </Button>
        </div>
      </div>

      {!!items?.length ? (
        <div className='flex flex-col items-start max-h-36 overflow-auto mb-4 gap-1'>
          {items.map((item, i) =>
            item.user ? (
              <div key={i}>
                <ItemNameAndPrice
                  name={item.name}
                  value={item.value}
                  user={item.user}
                />
              </div>
            ) : (
              <div key={i} className='flex gap-2'>
                <div className='flex flex-col justify-center'>
                  <IconButton
                    outlined={false}
                    variant='red'
                    className='py-2'
                    onClick={_ => onItemRemove(i)}
                  >
                    <img src={TrashSVG} />
                  </IconButton>
                </div>
                <ItemNameAndPrice name={item.name} value={item.value} />
              </div>
            ),
          )}
        </div>
      ) : (
        <div className='my-4 font-sans text-lg text-center w-full'>
          Você ainda não adicionou um item.
        </div>
      )}

      <div className='flex justify-between'>
        <Button
          type={'button'}
          variant={'orange'}
          outlined={true}
          onClick={() => goToHome()}
        >
          Voltar
        </Button>

        <Button
          form={'event'}
          type={'submit'}
          variant={'orange'}
          disabled={!!!id && !items.length}
          loading={loading}
          className={!!id ? 'w-32' : 'w-28'}
        >
          {!!id ? 'Editar evento' : 'Criar evento'}
        </Button>
      </div>
    </Template>
  );
}
