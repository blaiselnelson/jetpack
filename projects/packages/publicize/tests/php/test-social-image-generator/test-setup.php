<?php // phpcs:ignore WordPress.Files.FileName.InvalidClassFileName
/**
 * Testing the Social Image Generator setup class.
 *
 * @package automattic/jetpack-publicize
 */

namespace Automattic\Jetpack\Publicize;

use Automattic\Jetpack\Connection\Tokens;
use Automattic\Jetpack\Constants;
use Jetpack_Options;
use WorDBless\BaseTestCase;
use WorDBless\Options as WorDBless_Options;
use WorDBless\Users as WorDBless_Users;

/**
 * Testing the SIG setup.
 */
class Setup_Test extends BaseTestCase {
	/**
	 * Social Image Generator setup instance.
	 *
	 * @var Social_Image_Generator\Setup Instance of the setup class.
	 */
	public $sig;

	/**
	 * Setting up the test.
	 */
	public function set_up() {
		$this->sig = new Social_Image_Generator\Setup();
		$this->sig->init();
		// Mock site connection.
		( new Tokens() )->update_blog_token( 'test.test' );
		Jetpack_Options::update_option( 'id', 123 );
		Constants::set_constant( 'JETPACK__WPCOM_JSON_API_BASE', 'https://public-api.wordpress.com' );
	}

	/**
	 * Returning the environment into its initial state.
	 */
	public function tear_down() {
		WorDBless_Options::init()->clear_options();
		WorDBless_Users::init()->clear_all_users();
		unset( $_SERVER['REQUEST_METHOD'] );
		$_GET = array();
	}

	/**
	 * Mocks a successful response from WPCOM
	 */
	public function mock_success_response() {
		return array(
			'body'     => wp_json_encode( 'testtoken' ),
			'response' => array(
				'code'    => 200,
				'message' => '',
			),
		);
	}

	/**
	 * Mocks a failed response from WPCOM
	 */
	public function mock_error_response() {
		return array(
			'body'     => '',
			'response' => array(
				'code'    => 500,
				'message' => '',
			),
		);
	}

	/**
	 * Create a test post with settings for the image generator.
	 *
	 * @param array $image_generator_settings Settings for the image generator.
	 * @return int Post ID.
	 */
	public function create_post( $image_generator_settings = array() ) {
		return wp_insert_post(
			array(
				'post_title'   => uniqid( 'hello' ),
				'post_content' => 'world',
				'post_status'  => 'publish',
				'meta_input'   => array(
					Publicize::POST_JETPACK_SOCIAL_OPTIONS => array(
						'image_generator_settings' => $image_generator_settings,
					),
				),
			)
		);
	}

	/**
	 * Test that SIG gets enabled by default.
	 */
	public function test_sig_gets_enabled_by_default_when_a_post_gets_saved() {
		add_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );
		$post_id = $this->create_post();
		remove_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );

		$settings = new Social_Image_Generator\Post_Settings( $post_id );
		$this->assertTrue( $settings->is_enabled() );
	}

	/**
	 * Test that SIG stays disabled when it is toggled off by user.
	 */
	public function test_sig_stays_disabled_when_toggled_off_by_user() {
		add_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );
		$post_id = $this->create_post( array( 'enabled' => false ) );
		remove_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );

		$settings = new Social_Image_Generator\Post_Settings( $post_id );
		$this->assertFalse( $settings->is_enabled() );
	}

	/**
	 * Test that the token gets saved when a post is saved.
	 */
	public function test_token_gets_stored_when_post_is_saved() {
		add_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );
		$post_id = $this->create_post( array( 'enabled' => true ) );
		remove_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );

		$settings = new Social_Image_Generator\Post_Settings( $post_id );
		$this->assertEquals( 'testtoken', $settings->get_token() );
	}

	/**
	 * Test that no token gets created when SIG is disabled.
	 */
	public function test_token_does_not_get_created_when_sig_is_disabled() {
		add_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );
		$post_id = $this->create_post( array( 'enabled' => false ) );
		remove_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );

		$settings = new Social_Image_Generator\Post_Settings( $post_id );
		$this->assertSame( '', $settings->get_token() );
	}

	/**
	 * Test that no token gets created when request fails.
	 */
	public function test_token_does_not_get_created_when_request_fails() {
		add_filter( 'pre_http_request', array( $this, 'mock_failure_response' ) );
		$post_id = $this->create_post( array( 'enabled' => false ) );
		remove_filter( 'pre_http_request', array( $this, 'mock_failure_response' ) );

		$settings = new Social_Image_Generator\Post_Settings( $post_id );
		$this->assertSame( '', $settings->get_token() );
	}

	/**
	 * Test that only a single token gets stored.
	 */
	public function test_token_only_gets_stored_a_single_time() {
		add_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );
		$post_id = $this->create_post( array( 'enabled' => true ) );
		// Update the post to trigger another token generation.
		wp_update_post(
			array(
				'ID'         => $post_id,
				'post_title' => 'New title',
			)
		);
		remove_filter( 'pre_http_request', array( $this, 'mock_success_response' ) );

		$settings = new Social_Image_Generator\Post_Settings( $post_id );
		$this->assertEquals( 'testtoken', $settings->get_token() );
	}
}
