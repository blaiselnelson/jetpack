import { AdminSectionHero, Container, Col, Text, H3, Button } from '@automattic/jetpack-components';
import { useProductCheckoutWorkflow } from '@automattic/jetpack-connection';
import { Spinner, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, help } from '@wordpress/icons';
import classnames from 'classnames';
import React, { useState, useCallback } from 'react';
import { JETPACK_SCAN_SLUG } from '../../constants';
import useAnalyticsTracks from '../../hooks/use-analytics-tracks';
import useProtectData from '../../hooks/use-protect-data';
import useWafData from '../../hooks/use-waf-data';
import styles from './styles.module.scss';

const UpgradePrompt = () => {
	const { adminUrl } = window.jetpackProtectInitialState || {};
	const firewallUrl = adminUrl + '#/firewall';

	const {
		config: { automaticRulesAvailable },
	} = useWafData();

	const { run } = useProductCheckoutWorkflow( {
		productSlug: JETPACK_SCAN_SLUG,
		redirectUrl: firewallUrl,
	} );

	const { recordEventHandler } = useAnalyticsTracks();
	const getScan = recordEventHandler( 'jetpack_protect_waf_header_get_scan_link_click', run );

	const [ showPopover, setShowPopover ] = useState( false );

	const handleEnter = useCallback( () => {
		setShowPopover( true );
	}, [] );

	const handleOut = useCallback( () => {
		setShowPopover( false );
	}, [] );

	return (
		<>
			<div className={ styles[ 'manual-rules-notice' ] }>
				<Text weight={ 600 }>
					{ ! automaticRulesAvailable
						? __( 'Only manual rules will be applied', 'jetpack-protect' )
						: __(
								'Your site is not receiving the latest updates to automatic rules.',
								'jetpack-protect',
								/* dummy arg to avoid bad minification */ 0
						  ) }
				</Text>
				<div
					className={ styles[ 'icon-popover' ] }
					onMouseLeave={ handleOut }
					onMouseEnter={ handleEnter }
					onClick={ handleEnter }
					onFocus={ handleEnter }
					onBlur={ handleOut }
					role="presentation"
				>
					<Icon icon={ help } />
					{ showPopover && (
						<Popover noArrow={ false } offset={ 5 }>
							<Text className={ styles[ 'popover-text' ] } variant={ 'body-small' }>
								{ ! automaticRulesAvailable
									? __(
											'The free version of the firewall only allows for use of manual rules.',
											'jetpack-protect'
									  )
									: __(
											'The free version of the firewall does not receive updates to automatic firewall rules.',
											'jetpack-protect',
											/* dummy arg to avoid bad minification */ 0
									  ) }
							</Text>
						</Popover>
					) }
				</div>
			</div>
			<Button onClick={ getScan }>
				{ ! automaticRulesAvailable
					? __( 'Upgrade to enable automatic rules', 'jetpack-protect' )
					: __(
							'Upgrade to update automatic rules',
							'jetpack-protect',
							/* dummy arg to avoid bad minification */ 0
					  ) }
			</Button>
		</>
	);
};

const FirewallHeader = ( {
	status,
	hasRequiredPlan,
	automaticRulesEnabled,
	automaticRulesAvailable,
} ) => {
	return (
		<AdminSectionHero>
			<Container
				className={ styles[ 'firewall-header' ] }
				horizontalSpacing={ 7 }
				horizontalGap={ 0 }
			>
				<Col>
					{ 'on' === status && (
						<>
							<Text className={ classnames( styles.status, styles.active ) } variant={ 'label' }>
								{ __( 'Active', 'jetpack-protect' ) }
							</Text>
							<H3 className={ styles[ 'firewall-heading' ] } mb={ 1 } mt={ 2 }>
								{ automaticRulesEnabled
									? __( 'Automatic firewall is on', 'jetpack-protect' )
									: __(
											'Firewall is on',
											'jetpack-protect',
											/* dummy arg to avoid bad minification */ 0
									  ) }
							</H3>
							{ ! hasRequiredPlan && <UpgradePrompt /> }
						</>
					) }
					{ 'off' === status && (
						<>
							<Text className={ styles.status } variant={ 'label' }>
								{ __( 'Inactive', 'jetpack-protect' ) }
							</Text>
							<H3 className={ styles[ 'firewall-heading' ] } mb={ 2 } mt={ 2 }>
								{ automaticRulesAvailable
									? __( 'Automatic firewall is off', 'jetpack-protect' )
									: __(
											'Firewall is off',
											'jetpack-protect',
											/* dummy arg to avoid bad minification */ 0
									  ) }
							</H3>
							{ ! hasRequiredPlan && <UpgradePrompt /> }
						</>
					) }
					{ 'loading' === status && (
						<>
							<Spinner className={ styles.spinner } />
							<H3 className={ styles[ 'firewall-heading' ] } mb={ 2 } mt={ 2 }>
								{ __( 'Automatic firewall is being set up', 'jetpack-protect' ) }
							</H3>
							<Text className={ styles[ 'loading-text' ] } weight={ 600 }>
								{ __( 'Please wait…', 'jetpack-protect' ) }
							</Text>
						</>
					) }
				</Col>
				<Col>
					<div className={ styles[ 'stat-card-wrapper' ] }></div>
				</Col>
			</Container>
		</AdminSectionHero>
	);
};

const ConnectedFirewallHeader = () => {
	const {
		config: { jetpackWafAutomaticRules, jetpackWafIpList, automaticRulesAvailable },
		isToggling,
	} = useWafData();
	const { hasRequiredPlan } = useProtectData();
	const currentStatus = jetpackWafAutomaticRules || jetpackWafIpList ? 'on' : 'off';

	return (
		<FirewallHeader
			status={ isToggling ? 'loading' : currentStatus }
			hasRequiredPlan={ hasRequiredPlan }
			automaticRulesEnabled={ jetpackWafAutomaticRules }
			automaticRulesAvailable={ automaticRulesAvailable }
		/>
	);
};

export { FirewallHeader };

export default ConnectedFirewallHeader;
