import {InvitationsListingParcel} from '../../components/invitations-listing-parcel';
import {Template} from '../../components/template';
import {useCoordinator} from '../../hooks/use-coordinator';

export function InvitationListing() {
  const {goToHome} = useCoordinator();
  return (
    <Template title={'Convites'} back={goToHome}>
      <InvitationsListingParcel page_size={10} page={'listing'} />
    </Template>
  );
}
