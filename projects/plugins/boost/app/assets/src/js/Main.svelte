<script lang="ts">
	import BenefitsInterstitial from './pages/benefits/BenefitsInterstitial.svelte';
	import GettingStarted from './pages/getting-started/GettingStarted.svelte';
	import PurchaseSuccess from './pages/purchase-success/PurchaseSuccess.svelte';
	import Settings from './pages/settings/Settings.svelte';
	import { recordBoostEvent } from './utils/analytics';
	import debounce from './utils/debounce';
	import { Router, Route } from './utils/router';
	import routerHistory from './utils/router-history';

	routerHistory.listen(
		debounce( history => {
			// Event names must conform to the following regex: ^[a-z_][a-z0-9_]*$
			let path = history.location.pathname.replace( /[-/]/g, '_' );
			if ( path === '_' ) {
				path = '_settings';
			}

			recordBoostEvent( `page_view${ path }`, {
				path: history.location.pathname,
			} );
		}, 10 )
	);
</script>

<Router history={routerHistory}>
	<Route path="upgrade" component={BenefitsInterstitial} />
	<Route path="purchase-successful" component={PurchaseSuccess} />
	<Route path="getting-started" component={GettingStarted} />
	<Route component={Settings} />
</Router>
