import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import CoinSVG from '../../assets/svgs/coin.svg';
import LocationMarkerSVG from '../../assets/svgs/location-marker.svg';
import PersonSVG from '../../assets/svgs/person.svg';
import TimeSVG from '../../assets/svgs/time.svg';
import {Button} from '../../components/button';
import {Card} from '../../components/card';
import EventsListingParcel from '../../components/events-listing-parcel/events-listing-parcel';
import {Link} from '../../components/link';
import {Modal} from '../../components/modal';
import {Template} from '../../components/template';
import {PageTitle} from '../../components/title';
import {Tooltip} from '../../components/tooltip';
import {useCoordinator} from '../../hooks/use-coordinator';
import {useEventsAPI} from '../../hooks/use-events-api';
import {
  EventPaginationResponse,
  PaginationRequest,
} from '../../hooks/use-events-api/types';
import {RoutesEnum} from '../../utils/enums';
import styles from './styles.module.css';

export function EventListing() {
  const {goToHome} = useCoordinator();

  return (
    <Template title={'Eventos'} back={goToHome}>
      <EventsListingParcel page_size={10} page={'listing'} />
    </Template>
  );
}
