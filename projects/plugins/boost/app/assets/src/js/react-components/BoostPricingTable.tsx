import {
	Button,
	getRedirectUrl,
	PricingTable,
	PricingTableColumn,
	PricingTableHeader,
	PricingTableItem,
	ProductPrice,
} from '@automattic/jetpack-components';
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const cssOptimizationContext = __(
	'Move important styling information to the start of the page, which helps pages display your content sooner, so your users don’t have to wait for the entire page to load. Commonly referred to as Critical CSS.',
	'jetpack-boost'
);

const deferJSContextTemplate = __(
	'Run non-essential JavaScript after the page has loaded so that styles and images can load more quickly. Read more on <link>web.dev</link>.',
	'jetpack-boost'
);
const deferJSContext = createInterpolateElement( deferJSContextTemplate, {
	// eslint-disable-next-line jsx-a11y/anchor-has-content
	link: <a href={ getRedirectUrl( 'jetpack-boost-defer-js' ) } target="_blank" rel="noreferrer" />,
} );

const lazyLoadingContextTemplate = __(
	'Improve page loading speed by only loading images when they are required. Read more on <link>web.dev</link>.',
	'jetpack-boost'
);
const lazyLoadingContext = createInterpolateElement( lazyLoadingContextTemplate, {
	// eslint-disable-next-line jsx-a11y/anchor-has-content
	link: <a href={ getRedirectUrl( 'jetpack-boost-lazy-load' ) } target="_blank" rel="noreferrer" />,
} );

const supportContext = __(
	`Paid customers get dedicated email support from our world-class Happiness Engineers to help with any issue.<br><br>All other questions are handled by our team as quickly as we are able to go through the WordPress support forum.`,
	'jetpack-boost'
);

const automaticallyUpdatedContext = (
	<span>
		{ __(
			'It’s essential to regenerate Critical CSS to optimize your site speed whenever your HTML or CSS structure changes. Being on top of this can be tedious and time-consuming.',
			'jetpack-boost'
		) }
		<br />
		<br />
		{ __(
			'Boost’s cloud service can automatically detect when your site needs the Critical CSS regenerated, and perform this function behind the scenes without requiring you to monitor it manually.',
			'jetpack-boost'
		) }
	</span>
);

const manuallyUpdatedContext = (
	<span>
		{ __(
			'To enhance the speed of your site, with this plan you will need to optimize CSS by using the Manual Critical CSS generation feature whenever you:',
			'jetpack-boost'
		) }
		<br />
		<br />
		<ul>
			<li>{ __( 'Make theme changes.', 'jetpack-boost' ) }</li>
			<li>{ __( 'Write a new post/page.', 'jetpack-boost' ) }</li>
			<li>{ __( 'Edit a post/page.', 'jetpack-boost' ) }</li>
			<li>
				{ __(
					'Activate, deactivate, or update plugins that impact your site layout or HTML structure.',
					'jetpack-boost'
				) }
			</li>
			<li>
				{ __(
					'Change settings of plugins that impact your site layout or HTML structure.',
					'jetpack-boost'
				) }
			</li>
			<li>
				{ __(
					'Upgrade your WordPress version if the new release includes core CSS changes.',
					'jetpack-boost'
				) }
			</li>
		</ul>
	</span>
);

export const BoostPricingTable = ( {
	pricing,
	onPremiumCTA,
	onFreeCTA,
	chosenFreePlan,
	chosenPaidPlan,
} ) => {
	// If the first year discount ends, we want to remove the label without updating the plugin.
	const promoLabel = pricing.yearly.isIntroductoryOffer
		? __( 'First Year Discount', 'jetpack-boost' )
		: '';

	const isDiscounted = pricing.yearly.priceBefore > pricing.yearly.priceAfter;

	return (
		<PricingTable
			title={ __( 'The easiest speed optimization plugin for WordPress', 'jetpack-boost' ) }
			items={ [
				{
					name: __( 'Optimize CSS Loading', 'jetpack-boost' ),
					tooltipInfo: cssOptimizationContext,
				},
				{
					name: __( 'Defer non-essential JavaScript', 'jetpack-boost' ),
					tooltipInfo: deferJSContext,
				},
				{
					name: __( 'Lazy image loading', 'jetpack-boost' ),
					tooltipInfo: lazyLoadingContext,
				},
				{
					name: __( 'Dedicated email support', 'jetpack-boost' ),
					tooltipInfo: <span dangerouslySetInnerHTML={ { __html: supportContext } }></span>,
				},
			] }
		>
			<PricingTableColumn primary>
				<PricingTableHeader>
					<ProductPrice
						price={ pricing.yearly.priceBefore / 12 }
						offPrice={ isDiscounted ? pricing.yearly.priceAfter / 12 : null }
						currency={ pricing.yearly.currencyCode }
						hideDiscountLabel={ false }
						promoLabel={ promoLabel }
					/>
					<Button
						onClick={ onPremiumCTA }
						isLoading={ chosenPaidPlan }
						disabled={ chosenFreePlan || chosenPaidPlan }
						fullWidth
					>
						{ __( 'Get Boost', 'jetpack-boost' ) }
					</Button>
				</PricingTableHeader>
				<PricingTableItem
					isIncluded={ true }
					label={ <strong>{ __( 'Automatically updated', 'jetpack-boost' ) }</strong> }
					tooltipTitle={ __( 'Automatic Critical CSS regeneration', 'jetpack-boost' ) }
					tooltipInfo={ automaticallyUpdatedContext }
					tooltipClassName="wide-tooltip"
				/>
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
			</PricingTableColumn>
			<PricingTableColumn>
				<PricingTableHeader>
					<ProductPrice
						price={ 0 }
						legend=""
						currency={ pricing.yearly.currencyCode }
						hidePriceFraction
					/>
					<Button
						onClick={ onFreeCTA }
						isLoading={ chosenFreePlan }
						disabled={ chosenFreePlan || chosenPaidPlan }
						fullWidth
						variant="secondary"
					>
						{ __( 'Start for free', 'jetpack-boost' ) }
					</Button>
				</PricingTableHeader>
				<PricingTableItem
					isIncluded={ true }
					label={ __( 'Must be done manually', 'jetpack-boost' ) }
					tooltipTitle={ __( 'Manual Critical CSS regeneration', 'jetpack-boost' ) }
					tooltipInfo={ manuallyUpdatedContext }
					tooltipClassName="wide-tooltip"
				/>
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ true } />
				<PricingTableItem isIncluded={ false } label={ __( 'Not included', 'jetpack-boost' ) } />
			</PricingTableColumn>
		</PricingTable>
	);
};
