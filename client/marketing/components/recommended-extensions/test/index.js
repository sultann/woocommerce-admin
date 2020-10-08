/**
 * External dependencies
 */
import { recordEvent } from '@woocommerce/tracks';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

/**
 * Internal dependencies
 */
import { RecommendedExtensions } from '../index.js';
import RecommendedExtensionsItem from '../item.js';

jest.mock( '@woocommerce/tracks' );

const mockExtensions = [
	{
		title: 'AutomateWoo',
		description: 'Does things.',
		url: 'https://woocommerce.com/products/automatewoo/',
		icon: 'icons/automatewoo.svg',
		product: 'automatewoo',
		plugin: 'automatewoo/automatewoo.php',
	},
	{
		title: 'Mailchimp for WooCommerce',
		description: 'Does things.',
		url: 'https://woocommerce.com/products/mailchimp-for-woocommerce/',
		icon: 'icons/mailchimp.svg',
		product: 'mailchimp-for-woocommerce',
		plugin: 'mailchimp-for-woocommerce/mailchimp-woocommerce.php',
	},
];

describe( 'Recommendations and not loading', () => {
	let recommendedExtensionsWrapper;

	beforeEach( () => {
		recommendedExtensionsWrapper = render(
			<RecommendedExtensions
				extensions={ mockExtensions }
				isLoading={ false }
				category={ 'marketing' }
			/>
		);
	} );

	it( 'should not display the spinner', () => {
		const { container } = recommendedExtensionsWrapper;
		expect(
			container.getElementsByClassName( 'components-spinner' )
		).toHaveLength( 0 );
	} );

	it( 'should display default title and description', () => {
		const { getByRole } = recommendedExtensionsWrapper;

		expect(
			getByRole( 'heading', { level: 2, name: 'Recommended extensions' } )
		).not.toBeEmptyDOMElement();

		expect(
			getByRole( 'heading', {
				level: 2,
				name:
					'Great marketing requires the right tools. Take your marketing to the next level with our recommended marketing extensions.',
			} )
		).not.toBeEmptyDOMElement();
	} );

	it( 'should display correct number of recommendations', () => {
		const { getByRole } = recommendedExtensionsWrapper;

		expect(
			getByRole( 'heading', { level: 4, name: 'AutomateWoo' } )
		).not.toBeEmptyDOMElement();

		expect(
			getByRole( 'heading', {
				level: 4,
				name: 'Mailchimp for WooCommerce',
			} )
		).not.toBeEmptyDOMElement();
	} );
} );

describe( 'Recommendations and loading', () => {
	let recommendedExtensionsWrapper;

	beforeEach( () => {
		recommendedExtensionsWrapper = render(
			<RecommendedExtensions
				extensions={ mockExtensions }
				isLoading={ true }
				category={ 'marketing' }
			/>
		);
	} );

	it( 'should display spinner', () => {
		const { container } = recommendedExtensionsWrapper;
		expect(
			container.getElementsByClassName( 'components-spinner' )
		).toHaveLength( 1 );
	} );

	it( 'should not display recommendations', () => {
		const { queryByRole } = recommendedExtensionsWrapper;

		expect(
			queryByRole( 'heading', { level: 4, name: 'AutomateWoo' } )
		).toBeNull();

		expect(
			queryByRole( 'heading', {
				level: 4,
				name: 'Mailchimp for WooCommerce',
			} )
		).toBeNull();
	} );
} );

describe( 'No Recommendations and not loading', () => {
	let recommendedExtensionsWrapper;

	beforeEach( () => {
		recommendedExtensionsWrapper = render(
			<RecommendedExtensions
				extensions={ [] }
				isLoading={ false }
				category={ 'marketing' }
			/>
		);
	} );

	it( 'should not display spinner', () => {
		const { container } = recommendedExtensionsWrapper;
		expect(
			container.getElementsByClassName( 'components-spinner' )
		).toHaveLength( 0 );
	} );

	it( 'should not display recommendations', () => {
		const { container } = recommendedExtensionsWrapper;
		expect(
			container.getElementsByClassName(
				'woocommerce-marketing-recommended-extensions-card__items'
			)
		).toHaveLength( 0 );
	} );
} );

describe( 'Click Recommendations', () => {
	it( 'should record an event when clicked', async () => {
		const { getByRole } = render(
			<RecommendedExtensionsItem
				title={ 'AutomateWoo' }
				description={ 'Does things.' }
				icon={ 'icons/automatewoo.svg' }
				url={ 'https://woocommerce.com/products/automatewoo/' }
				product={ 'automatewoo' }
				category={ 'marketing' }
			/>
		);

		userEvent.click( getByRole( 'link' ) );

		await waitFor( () => expect( recordEvent ).toHaveBeenCalledTimes( 1 ) );
		expect( recordEvent ).toHaveBeenCalledWith(
			'marketing_recommended_extension',
			{
				name: 'AutomateWoo',
			}
		);
	} );
} );

describe( 'Custom title and description ', () => {
	it( 'should override defaults', () => {
		const { getByRole } = render(
			<RecommendedExtensions
				extensions={ mockExtensions }
				isLoading={ false }
				title={ 'Custom Title' }
				description={ 'Custom Description' }
				category={ 'marketing' }
			/>
		);

		expect(
			getByRole( 'heading', { level: 2, name: 'Custom Title' } )
		).not.toBeEmptyDOMElement();

		expect(
			getByRole( 'heading', {
				level: 2,
				name: 'Custom Description',
			} )
		).not.toBeEmptyDOMElement();
	} );
} );
