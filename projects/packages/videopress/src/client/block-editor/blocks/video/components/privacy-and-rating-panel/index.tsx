/**
 *External dependencies
 */
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import {
	VIDEO_PRIVACY_LEVELS,
	VIDEO_PRIVACY_LEVEL_PRIVATE,
	VIDEO_PRIVACY_LEVEL_PUBLIC,
	VIDEO_PRIVACY_LEVEL_SITE_DEFAULT,
	VIDEO_RATING_G,
	VIDEO_RATING_PG_13,
	VIDEO_RATING_R_17,
} from '../../../../../state/constants';
/**
 * Types
 */
import type { VideoControlProps } from '../../types';
import type React from 'react';

/**
 * Sidebar Control component.
 *
 * @param {VideoControlProps} props - Component props.
 * @returns {React.ReactElement}    Component template
 */
export default function PrivacyAndRatingPanel( {
	attributes,
	setAttributes,
	privateEnabledForSite,
}: VideoControlProps ): React.ReactElement {
	const { privacySetting, rating, allowDownload, displayEmbed } = attributes;

	const privacyLabels = {
		private: _x( 'Site Default (Private)', 'VideoPress privacy setting', 'jetpack-videopress-pkg' ),
		public: _x( 'Site Default (Public)', 'VideoPress privacy setting', 'jetpack-videopress-pkg' ),
	};

	const defaultPrivacyLabel = privateEnabledForSite ? privacyLabels.private : privacyLabels.public;

	return (
		<PanelBody title={ __( 'Privacy and rating', 'jetpack-videopress-pkg' ) } initialOpen={ false }>
			<SelectControl
				label={ _x( 'Rating', 'The age rating for this video.', 'jetpack-videopress-pkg' ) }
				value={ rating ?? '' }
				options={ [
					{
						label: _x( 'G', 'Video rating for "General Audiences".', 'jetpack-videopress-pkg' ),
						value: VIDEO_RATING_G,
					},
					{
						label: _x(
							'PG-13',
							'Video rating for "Parental Guidance", unsuitable for children under 13.',
							'jetpack-videopress-pkg'
						),
						value: VIDEO_RATING_PG_13,
					},
					{
						label: _x(
							'R',
							'Video rating for "Restricted", not recommended for children under 17.',
							'jetpack-videopress-pkg'
						),
						value: VIDEO_RATING_R_17,
					},
				] }
				onChange={ value => {
					setAttributes( { rating: value } );
				} }
			/>

			<SelectControl
				label={ __( 'Privacy', 'jetpack-videopress-pkg' ) }
				onChange={ value => {
					const attrsToUpdate: { privacySetting?: number; isPrivate?: boolean } = {};

					// Anticipate the isPrivate attribute.
					if ( value !== '2' ) {
						attrsToUpdate.isPrivate = value === '1';
					} else {
						attrsToUpdate.isPrivate = privateEnabledForSite;
					}

					attrsToUpdate.privacySetting = Number( value );
					setAttributes( attrsToUpdate );
				} }
				value={ String( privacySetting ) }
				options={ [
					{
						value: String( VIDEO_PRIVACY_LEVELS.indexOf( VIDEO_PRIVACY_LEVEL_SITE_DEFAULT ) ),
						label: defaultPrivacyLabel,
					},
					{
						value: String( VIDEO_PRIVACY_LEVELS.indexOf( VIDEO_PRIVACY_LEVEL_PUBLIC ) ),
						label: _x( 'Public', 'VideoPress privacy setting', 'jetpack-videopress-pkg' ),
					},
					{
						value: String( VIDEO_PRIVACY_LEVELS.indexOf( VIDEO_PRIVACY_LEVEL_PRIVATE ) ),
						label: _x( 'Private', 'VideoPress privacy setting', 'jetpack-videopress-pkg' ),
					},
				] }
			/>

			<ToggleControl
				label={ __( 'Allow download', 'jetpack-videopress-pkg' ) }
				checked={ allowDownload }
				onChange={ value => {
					setAttributes( { allowDownload: value } );
				} }
			/>

			<ToggleControl
				label={ __( 'Show video sharing menu', 'jetpack-videopress-pkg' ) }
				checked={ displayEmbed }
				onChange={ value => {
					setAttributes( { displayEmbed: value } );
				} }
				help={ __(
					'Gives viewers the option to share the video link and HTML embed code',
					'jetpack-videopress-pkg'
				) }
			/>
		</PanelBody>
	);
}
