/**
 * External dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { identity } from 'lodash';
import { getSetting } from '@woocommerce/wc-admin-settings';
import {
	ONBOARDING_STORE_NAME,
	withOnboardingHydration,
} from '@woocommerce/data';
import { getHistory, getNewPath } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import Layout from './layout';

const Homescreen = ( { profileItems, query } ) => {
	const { completed: profilerCompleted, skipped: profilerSkipped } =
		profileItems || {};
	if ( ! profilerCompleted && ! profilerSkipped ) {
		getHistory().push( getNewPath( {}, '/setup-wizard', {} ) );
	}

	return <Layout query={ query } />;
};

const onboardingData = getSetting( 'onboarding', {} );

export default compose(
	onboardingData.profile || onboardingData.tasksStatus
		? withOnboardingHydration( {
				profileItems: onboardingData.profile,
				tasksStatus: onboardingData.tasksStatus,
		  } )
		: identity,
	withSelect( ( select ) => {
		const { getProfileItems } = select( ONBOARDING_STORE_NAME );
		const profileItems = getProfileItems();

		return { profileItems };
	} )
)( Homescreen );
