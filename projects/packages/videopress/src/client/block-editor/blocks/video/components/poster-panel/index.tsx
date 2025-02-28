/**
 *External dependencies
 */
import { MediaUploadCheck, MediaUpload } from '@wordpress/block-editor';
import { MenuItem, PanelBody, NavigableMenu, Dropdown, Button } from '@wordpress/components';
import { useRef, useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { linkOff, image as imageIcon } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import { VIDEO_POSTER_ALLOWED_MEDIA_TYPES } from '../../constants';
import { VideoControlProps } from '../../types';
import { VideoPosterCard } from '../poster-image-block-control';
import './style.scss';
/**
 * Types
 */
import type { AdminAjaxQueryAttachmentsResponseItemProps } from '../../../../../types';
import type React from 'react';

/**
 * Sidebar Control component.
 *
 * @param {VideoControlProps} props - Component props.
 * @returns {React.ReactElement}    Component template
 */
export function PosterDropdown( {
	clientId,
	attributes,
	setAttributes,
}: VideoControlProps ): React.ReactElement {
	const videoPosterDescription = `video-block__poster-image-description-${ clientId }`;

	const { poster } = attributes;
	const onSelectPoster = ( image: AdminAjaxQueryAttachmentsResponseItemProps ) => {
		setAttributes( { poster: image.url } );
	};

	const selectPosterLabel = __( 'Select Poster Image', 'jetpack-videopress-pkg' );
	const replacePosterLabel = __( 'Replace Poster Image', 'jetpack-videopress-pkg' );

	const buttonRef = useRef< HTMLButtonElement >( null );
	const videoRatio = Number( attributes?.videoRatio ) / 100 || 9 / 16;

	const [ buttonImageHeight, setButtonImageHeight ] = useState( 140 );

	useEffect( () => {
		if ( ! poster || ! buttonRef?.current ) {
			return;
		}

		const { current: buttonElement } = buttonRef;
		const buttonWidth = buttonElement.offsetWidth;
		if ( ! buttonWidth ) {
			return;
		}

		setButtonImageHeight( buttonWidth * videoRatio );
	}, [ poster, buttonRef, videoRatio ] );

	return (
		<Dropdown
			contentClassName="poster-panel__dropdown"
			placement="top left"
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					ref={ buttonRef }
					style={ {
						backgroundImage: poster ? `url(${ poster })` : undefined,
						height: buttonImageHeight,
					} }
					className={ `poster-panel__button ${ poster ? 'has-poster' : '' }` }
					variant="secondary"
					onClick={ onToggle }
					aria-expanded={ isOpen }
				>
					<span>{ ! poster ? selectPosterLabel : replacePosterLabel }</span>
				</Button>
			) }
			renderContent={ ( { onClose } ) => {
				return (
					<NavigableMenu className="block-editor-media-replace-flow__media-upload-menu">
						<MediaUploadCheck>
							<MediaUpload
								title={ __( 'Select Poster Image', 'jetpack-videopress-pkg' ) }
								onSelect={ ( image: AdminAjaxQueryAttachmentsResponseItemProps ) => {
									onSelectPoster( image );
									onClose();
								} }
								allowedTypes={ VIDEO_POSTER_ALLOWED_MEDIA_TYPES }
								render={ ( { open } ) => (
									<MenuItem
										icon={ imageIcon }
										onClick={ open }
										aria-describedby={ videoPosterDescription }
									>
										{ __( 'Open Media Library', 'jetpack-videopress-pkg' ) }
										<p id={ videoPosterDescription } hidden>
											{ poster
												? sprintf(
														/* translators: Placeholder is an image URL. */
														__( 'The current poster image url is %s', 'jetpack-videopress-pkg' ),
														poster
												  )
												: __(
														'There is no poster image currently selected',
														'jetpack-videopress-pkg'
												  ) }
										</p>
									</MenuItem>
								) }
							/>
						</MediaUploadCheck>
					</NavigableMenu>
				);
			} }
		/>
	);
}

/**
 * Sidebar Control component.
 *
 * @param {VideoControlProps} props - Component props.
 * @returns {React.ReactElement}    Component template
 */
export default function PosterPanel( {
	attributes,
	setAttributes,
}: VideoControlProps ): React.ReactElement {
	const { poster } = attributes;

	const onRemovePoster = () => {
		setAttributes( { poster: '' } );
	};

	return (
		<PanelBody title={ __( 'Poster', 'jetpack-videopress-pkg' ) } className="poster-panel">
			<PosterDropdown attributes={ attributes } setAttributes={ setAttributes } />
			<VideoPosterCard poster={ poster } className="poster-panel-card" />

			{ poster && (
				<MenuItem onClick={ onRemovePoster } icon={ linkOff } isDestructive variant="tertiary">
					{ __( 'Remove and use default', 'jetpack-videopress-pkg' ) }
				</MenuItem>
			) }
		</PanelBody>
	);
}
